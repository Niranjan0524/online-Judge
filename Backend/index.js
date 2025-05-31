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

function deleteInputsFolder() {
  const inputsPath = path.join(__dirname, "inputs");
  if (fs.existsSync(inputsPath)) {
    fs.rm(inputsPath, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error("Error deleting inputs folder:", err);
      } else {
        console.log("Inputs folder deleted successfully.");
      }
    });
  }
  fs.mkdirSync(inputsPath, { recursive: true });
  const codesPath = path.join(__dirname, "codes");
  if (fs.existsSync(codesPath)) {
    fs.rm(codesPath, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error("Error deleting codes folder:", err);
      } else {
        console.log("Codes folder deleted successfully.");
      }
    });
  }
  fs.mkdirSync(codesPath, { recursive: true });
  const outputsPath = path.join(__dirname, "outputs");
  if (fs.existsSync(outputsPath)) {
    fs.rm(outputsPath, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error("Error deleting outputs folder:", err);
      } else {
        console.log("Outputs folder deleted successfully.");
      }
    });
  }
  fs.mkdirSync(outputsPath, { recursive: true });
}

// Run every 1 hour (3600000 ms)
setInterval(deleteInputsFolder, 3600000);

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
