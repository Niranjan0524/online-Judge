const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: `.env.${ENV}`,
});

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { runCode,submitCode } = require("./Controllers/codeController");
const morgan = require("morgan");
const requireCompilerSecret = require("./middleware/requireCompilerSecret");
const limitConcurrentJobs = require("./middleware/limitConcurrentJobs");

if (process.platform === "linux") {
  if (process.geteuid() !== 0) {
    throw new Error("Compiler service must run as root to isolate job UIDs");
  }
  try {
    process.setgroups([]);
  } catch (error) {
    console.warn("Could not clear supplementary groups; job UIDs remain isolated:", error.message);
  }
}


app.use(morgan("combined")); // Logging middleware for development


app.use(express.json({ limit: "128kb" }));

app.get("/", (req, res) => {
  res.send("Compiler service is running!");
});


app.post("/run", requireCompilerSecret, limitConcurrentJobs, runCode);
app.post("/submit", requireCompilerSecret, limitConcurrentJobs, submitCode);

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
