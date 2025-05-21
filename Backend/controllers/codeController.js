const jwt = require("jsonwebtoken");
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executecpp");
const { executePython } = require("./executePython");
const { executeJavaScript } = require("./executeJavaScript");
const { executeJava } = require("./executeJava");
const fs = require("fs");
const path = require("path");



exports.runCode=async(req,res)=>{

  const { code, lang="c++" } = req.body;
  if(!code ){
    res.status(400).json({message:"Code is required"});
    return;
  }
  const authHeader=req.headers.authorization;

  if(!authHeader){
    res.status(401).json({message:"Unauthorized"});
    return;
  }

  const token=authHeader.split(" ")[1];
  if(!token){
    res.status(401).json({message:"Unauthorized"});
    return;
  }

  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  if(!id){
    res.status(401).json({message:"Unauthorized"});
    return;
  }
  let output;
  try{
    let filePath;
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
  
    if(lang==="cpp"){
       output=await executeCpp(filePath);
    }
    else if(lang=="py"){
      output=await executePython(filePath); 
    }
    else if(lang=="java"){
      output=await executeJava(filePath);
    }
    else if(lang=="js"){
      output=await executeJavaScript(filePath);
    }
    if(output && output.error){
      res.status(200).json({output:output.error||output.stderr});
      return;
    }
    res.json({
      message:"Code ran successfully",
      output:output
    });
  }
  catch(err){
    console.log(err);
    res.status(500).json({ message:"Internal server error"});
    return;
  }

}