const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: `.env.${ENV}`,
});

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const mongoose = require("mongoose");
const authRouter = require("./routers/authRouter");
const problemRouter = require("./routers/problemRouter");
const codeRouter = require("./routers/codeRouter");
const leaderboardRouter = require("./routers/leaderboardRouter");
const resumeRouter = require("./routers/resumeRouter");
const discussionRouter = require("./routers/discussionRouter");
const contestRouter = require("./routers/contestRouter");

const morgan = require("morgan");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const initializeSocket = require("./Socket/socketHandler");


const app = express();


//socket connection:
const http=require("http");
const {Server}=require("socket.io");

const server=http.createServer(app);

//socket.io setup:

const io=new Server(server,{
  cors:{
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});


app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
); 

// app.use(morgan("combined")); 


const staticPath=path.join(__dirname, "dist");
app.use(express.static(staticPath));

app.use(helmet()); // Security middleware to set various HTTP headers

app.use(compression()); // Middleware to compress response bodies for better performance

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

//SOCKET:
app.set("io",io);

initializeSocket(io); // Initialize socket.io with the server


app.use("/api/auth", authRouter);
app.use("/api/problem",problemRouter);
app.use("/api/code",codeRouter);
app.use("/api/alldata", leaderboardRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/discussion", discussionRouter);
app.use("/api/contest",contestRouter);



const port = process.env.PORT || 4000;
mongoose
  .connect(url)
  .then(() => {
    console.log("connected to database");
    server.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("error in connecting the database", err);
  });
