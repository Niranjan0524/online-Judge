const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: `.env.${ENV}`,
});

const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { runCode,submitCode } = require("./Controllers/codeController");
const morgan = require("morgan");


app.use(morgan("combined")); // Logging middleware for development


app.use(
  cors({
    origin: process.env.SERVER_URL || "http://localhost:4000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
); 

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Compiler service is running!");
});


app.post("/run", runCode);
app.post("/submit", submitCode);

const url = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@xdb.mjwzy.mongodb.net/${process.env.MONGO_DB_DATABASE}`;

const port = process.env.PORT || 5000;

mongoose.connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, ()=>{console.log("Server is running on port 5000")});
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Optional: generic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});