const Problem=require('../models/problems');
const TestCase=require('../models/testCases');
const fs=require('fs');
const path=require('path');

exports.getProblems=async(req,res)=>{
    console.log("Fetching all problems");
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


exports.getTestCases=async(req,res)=>{



  const testCases=await TestCase.find();
 
  if(!testCases){
    res.status(402).json({
      messages:"No test cases found"
    })
  }

  res.status(200).json({
    message:"Test cases fetched successfully",
    testCases:testCases
  })
}


exports.removeTestCase=async(req,res)=>{

  await TestCase.deleteMany({ problemId: req.params.id });

  res.status(200).json({
    message:"Test case deleted successfully"
  })
}

exports.addProblems=async(req,res)=>{

  const data=req.body;

  data.map(async (problem)=>{
    const problemData= await new Problem({
      _id: problem._id,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      inputFormat: problem.inputFormat,
      outputFormat: problem.outputFormat,
      timeLimit: problem.timeLimit,
      tags: problem.tags
    }).save();
  });

  res.status(200).json({
    message: "Problems added successfully"
  });
}

exports.addSingleProblem=async(req,res)=>{
  console.log("Adding single problem",req.body);
  const { title, description, difficulty, tags,testCases } = req.body;

  
  try {
    const newProblem =  new Problem({
      title,
      description,
      difficulty,
      tags
    });

    await newProblem.save();

    if (testCases && testCases.length > 0) {
      const testCasesData = testCases.map(tc => ({
        input: tc.input,
        output: tc.output,
        problemId: newProblem._id
      }));

      await TestCase.insertMany(testCasesData);

    }

    res.status(201).json({
      message: "Problem added successfully",
      problem: newProblem
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add problem",
      error: error.message
    });
  }
}



exports.deleteAllTestCases=async(req,res)=>{
  try {
    await TestCase.deleteMany({});
    res.status(200).json({
      message: "All test cases deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete test cases",
      error: error.message
    });
  }
}

exports.deleteAllProblems=async(req,res)=>{ 
  try {
    await Problem.deleteMany({});
    res.status(200).json({
      message: "All problems deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete problems",
      error: error.message
    });
  }
}
