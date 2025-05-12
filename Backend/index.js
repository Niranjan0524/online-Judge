const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS

app.get("/", (req, res) => {
  console.log("req from the client");
  res.send("Hello World");
});

app.get("/api/getdata", (req, res) => {
  console.log("Data fetched");
  res.json({ message: "Data fetched successfully" });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
