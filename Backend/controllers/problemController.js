const Problem=require('../models/problems');

exports.getProblems=async(req,res)=>{

    const problems=await Problem.find();
    if(!problems){
      res.status(422).json({
        message:"No problems found"
      })
    }

    res.status(200).json({
      message: "Problems fetched successfully",
      problems: problems
    });
}