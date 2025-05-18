const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: `.env.${ENV}`,
});

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const app = express();
app.use(cors()); // Enable CORS
const mongoose = require("mongoose");
const authRouter = require("./routers/authRouter");
const problemRouter=require("./routers/problemRouter");

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
