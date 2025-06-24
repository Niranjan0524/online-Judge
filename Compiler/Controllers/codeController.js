
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executecpp");
const { executePython } = require("./executePython");
const { executeJavaScript } = require("./executeJavaScript");
const { executeJava } = require("./executeJava");
const fs = require("fs");
const path = require("path");
const TestCase = require("../Models/testCases");
const { generateInputFile } = require("./generateInputFiles");
const {generateInput}= require("./generateInput");
const Problem= require("../Models/problems");
const Solution = require("../Models/solution");


function withTimeout(promise, ms, errorMessage = "Timeout") {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), ms)
    ),
  ]);
}

const deleteFiles=async(fp)=>{

  if(fs.existsSync(fp)){
    fs.unlinkSync(fp);

  }
  return;
}

exports.runCode = async (req, res) => {
  const { code, lang = "c++", problemId, input } = req.body;
  console.log("input in backend", input);
  const testCases = await TestCase.find({ problemId: problemId });
  if (!testCases) {
    testCases = [];
  }
  if (!code) {
    res.status(400).json({message:"Code is required"});
    return;
  }
  
  let output; let filePath;
  let inputFilePath;
  try{
   
    if(lang==="java"){
      const {className}=req.body;
      if(!className){
        res.json({message:"Class name is required"});
        return;
      }
       filePath=generateFile(code,lang,className);
    }
    else{
      filePath=generateFile(code,lang);
    }
    
     inputFilePath=generateInputFile(input);

    if(lang==="cpp"){
       output = await withTimeout(
         executeCpp(filePath, inputFilePath),
         5000,
         "Execution timed out"
       );

    }
    else if(lang=="py"){
      output=await withTimeout(
        executePython(filePath,  inputFilePath),
        5000,
        "Execution timed out"
      );
    }
    else if(lang=="java"){
      output=await withTimeout(executeJava(filePath,  inputFilePath),5000,"Execution timed out");
    }
    else if(lang=="js"){
      output=await withTimeout(executeJavaScript(filePath,  inputFilePath),5000,"Execution timed out");
    }
    if(output && output.error){
      res.status(200).json({output:output.error||output.stderr});
      return;
    }

    await deleteFiles(filePath);
    await deleteFiles(inputFilePath);

    if(output && (output.stderr || output.error)){
      console.log("Error during code execution:", output.error || output.stderr);
      return res.status(201).json({
        message: "Error during code execution",
        error: output.error || output.stderr,
      });
    }

    res.json({
      message:"Code ran successfully",
      output:output
    });
  }
  catch(err){
    await deleteFiles(filePath);
    await deleteFiles(inputFilePath);

    console.log("99",err.message);
      if (err && (err.stderr || err.error)) {
        console.log("XYZ", err.stderr || err.error);
        res.status(201).json({
          message: "Error during code execution",
          error: err.stderr || err.error
        });
        return;
       
      }
      // If it's a timeout
      if (err.message === "Execution timed out") {
        console.log("100", err.message);
        res.status(504).json({ message: "Execution timed out" });
        return;

      }
      // Otherwise, generic error
      console.log("error in code:", err.error || err.stderr || err.message);
      res.status(500).json({ message:"Internal server error"});
      return;
    }
  

}


exports.submitCode=async(req,res)=>{
  const { code, lang="c++" ,problemId,id} = req.body;
  const testCases=await TestCase.find({problemId:problemId});
  
  if(!testCases){
    testCases=[];
  }
  if(!code ){
    res.status(400).json({message:"Code is required"});
    return;
  }
  
  let output;
  let filePath;
  try{
    
    if(lang==="java"){
      const {className}=req.body;
      if(!className){
        res.json({message:"Class name is required"});
        return;
      }
       filePath=generateFile(code,lang,className);
    }
    else{
      filePath=generateFile(code,lang);
    }

    let result = [];
    for (const tc of testCases) {
      const inputFilePath = generateInput(tc.input);

      if (lang === "cpp") {

        output = await withTimeout(
          executeCpp(filePath, inputFilePath),
          5000,
          "Execution timed out"
        );
      } else if (lang == "py") {
        output = await withTimeout(
          executePython(filePath, inputFilePath),
          5000,
          "Execution timed out"
        );
      } else if (lang == "java") {
        output = await withTimeout(
          executeJava(filePath, inputFilePath),
          5000,
          "Execution timed out"
        );
      } else if (lang == "js") {
        output = await withTimeout(
          executeJavaScript(filePath, inputFilePath),
          5000,
          "Execution timed out"
        );
      }
      
      await deleteFiles(inputFilePath);

        result.push({
          id: tc._id,
          output: output,
          correct: String(output).trim() === String(tc.output).trim()
        });

    }
      await deleteFiles(filePath);
     

    try{
      let c=0;
      let t=0;
      for(const res of result){
        if(!res.correct){
          c++;
        }
        t++;
      }
      const problem=await Problem.findById(problemId);
      if(!problem){
        res.status(404).json({message:"Problem not found"});
        return;
      }
      
        const solution = new Solution({
          problemId: problemId,
          userId: id,
          code: code,
          titleName: problem.title,
          testCasesPassed: t - c,
          status: c ? "Wrong Answer" : "Accepted",
          submittedAt: new Date(),
        });
        await solution.save();
        console.log("Solution saved successfully");
        res.status(200).json({
          message: "Code submitted Successfully",
          output: result,
          solution: solution,
        });
      }
      catch(err){
        console.log("Error saving solution:", err);
        res.status(500).json({message: "Internal server error , unable to save solution"});
        return;
      }
  }
  catch(err){
    await deleteFiles(filePath);
    await deleteFiles(inputFilePath);
    
    if (err && (err.stderr || err.error)) {
      res.status(201).json({
        message: "Error during code execution",
        error: err.stderr || err.error,
      });
      return;
    }
    if (err.message === "Execution timed out") {
      res.status(504).json({ message: "Execution timed out" });
      return;
    }
    console.log(err);
    res.status(500).json({message: "Internal server error"});
  }

}
