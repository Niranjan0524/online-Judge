
const fs = require("fs");
const path = require("path");
const Problem= require("../models/problems");



exports.aiReviewCode = async (req, res) => {
  const { code, problemId } = req.body;
  console.log("code in ai review", code);
  console.log("problemId in ai review", problemId);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  if (!id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    res.status(404).json({ message: "Problem not found" });
    return;
  }

  try {
    const response = await withTimeout(
      AI_Service(code, problem),
      10000,
      "AI review timed out"
    );
    if (response.error) {
      res.status(500).json({
        message: "Error in AI Review",
        error: response.error,
      });
      return;
    }

    res.status(200).json({
      message: "AI Review generated successfully",
      output: response,
    });
  } catch (err) {
    console.error("Error in AI review:", err);
    if (err.message === "AI review timed out") {
      res.status(504).json({ message: "AI review timed out" });
    } else {
      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }
};