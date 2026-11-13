const express=require("express");

const problemRouter=express.Router();
const {verifyUser}=require("../controllers/verifyUser");
const requireAdmin = require("../controllers/requireAdmin");

const {getProblems}=require("../controllers/problemController");
const {addTestCases}=require("../controllers/problemController");
const {getTestCases}=require("../controllers/problemController");
const { removeTestCase } = require("../controllers/problemController");
const { addProblems } = require("../controllers/problemController"); 
const {addSingleProblem} = require("../controllers/problemController");
const {deleteAllTestCases} = require("../controllers/problemController");
const {deleteAllProblems} = require("../controllers/problemController");
const {getProblemSubmissions} = require("../controllers/problemController");

problemRouter.get("/problems",getProblems);
problemRouter.post("/test-cases", verifyUser, requireAdmin, addTestCases);
problemRouter.post("/problems/bulk", verifyUser, requireAdmin, addProblems);
problemRouter.get("/test-cases",getTestCases);
problemRouter.get("/problems/:problemId/submissions", verifyUser, getProblemSubmissions);
problemRouter.delete("/test-cases/:id", verifyUser, requireAdmin, removeTestCase);
problemRouter.delete("/test-cases", verifyUser, requireAdmin, deleteAllTestCases);
problemRouter.delete("/problems", verifyUser, requireAdmin, deleteAllProblems);
problemRouter.post("/problems", verifyUser, requireAdmin, addSingleProblem);

module.exports=problemRouter;
