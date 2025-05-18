const express=require("express");

const problemRouter=express.Router();

const {getProblems}=require("../controllers/problemController");

problemRouter.get("/getAllProblems",getProblems);

module.exports=problemRouter;