const express=require("express");

const codeRouter=express.Router();
const { runCode,submitCode } = require("../controllers/codeController");

codeRouter.post("/run",runCode);
codeRouter.post("/submit",submitCode);

module.exports=codeRouter;