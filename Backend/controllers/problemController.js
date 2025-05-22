const Problem=require('../models/problems');
const TestCase=require('../models/testCases');

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


exports.addTestCases=async(req,res)=>{


  const data=req.body;

  try{
    await Promise.all(
      data.map(tc=>
        new TestCase({
          input:tc.input,
          output:tc.output,
          problemId:tc.problemId
        }).save()
      )
    );

    res.status(200).json({
      message:"Test Case added successfully"
    })
  }
  catch(err){
    res.status(500).json({
      message:"Failed to add test case",
      error:err.message
    })
  }
  
}