const express=require("express");

const codeRouter=express.Router();
const { runCode } = require("../controllers/codeController");

codeRouter.post("/run",runCode);

module.exports=codeRouter;