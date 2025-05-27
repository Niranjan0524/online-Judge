const express=require("express");

const codeRouter=express.Router();
const { runCode,submitCode ,aiReviewCode} = require("../controllers/codeController");

codeRouter.post("/run",runCode);
codeRouter.post("/submit",submitCode);
codeRouter.post("/ai-review",aiReviewCode);

module.exports=codeRouter;