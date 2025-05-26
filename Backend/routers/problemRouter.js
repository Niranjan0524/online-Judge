const express=require("express");

const problemRouter=express.Router();

const {getProblems}=require("../controllers/problemController");
const {addTestCases}=require("../controllers/problemController");
const {getTestCases}=require("../controllers/problemController");
const { removeTestCase } = require("../controllers/problemController");

problemRouter.get("/getAllProblems",getProblems);
problemRouter.post("/addTestCases",addTestCases);
problemRouter.get("/getAllTestCases",getTestCases);
problemRouter.delete("/removeTestCases/:id", removeTestCase);

module.exports=problemRouter;