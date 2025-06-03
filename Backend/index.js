const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: `.env.${ENV}`,
});

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors()); // Enable CORS
const mongoose = require("mongoose");
const authRouter = require("./routers/authRouter");
const problemRouter=require("./routers/problemRouter");
const codeRouter=require("./routers/codeRouter");
const leaderboardRouter = require("./routers/leaderboardRouter");
const resumeRouter = require("./routers/resumeRouter");
const discussionRouter = require("./routers/discussionRouter");


// Add this before passport initialization
const session = require("express-session");
app.use(session({
  secret: process.env.JWT_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
}));
const passport = require("passport");
require("./passport-config");
app.use(passport.initialize());
app.use(passport.session());


const url = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@xdb.mjwzy.mongodb.net/${process.env.MONGO_DB_DATABASE}`;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log("req url", req.url);
  console.log("req body", req.body);
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/problem",problemRouter);
app.use("/api/code",codeRouter);
app.use("/api/alldata", leaderboardRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/discussion", discussionRouter);

function deleteInputsFolder() {
  const inputsPath = path.join(__dirname, "inputs");
  if (fs.existsSync(inputsPath)) {
    fs.rmSync(inputsPath, { recursive: true, force: true });
    console.log("Inputs folder deleted successfully.");
  }
  fs.mkdirSync(inputsPath, { recursive: true });

  const codesPath = path.join(__dirname, "codes");
  if (fs.existsSync(codesPath)) {
    fs.rmSync(codesPath, { recursive: true, force: true });
    console.log("Codes folder deleted successfully.");
  }
  fs.mkdirSync(codesPath, { recursive: true });

  const outputsPath = path.join(__dirname, "outputs");
  if (fs.existsSync(outputsPath)) {
    fs.rmSync(outputsPath, { recursive: true, force: true });
    console.log("Outputs folder deleted successfully.");
  }
  fs.mkdirSync(outputsPath, { recursive: true });
}

// Run every 10 minutes (600000 ms)
setInterval(deleteInputsFolder, 600000);

const port = process.env.PORT || 4000;
mongoose
  .connect(url)
  .then(() => {
    console.log("connected to database");
    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("error in connecting the database", err);
  });
