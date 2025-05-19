const jwt = require("jsonwebtoken");
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executecpp");

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

  try{
    const filePath=generateFile(code,lang);
    
    const output=await executeCpp(filePath);
   
    if(output.error){
      res.status(400).json({message:output.error});
      return;
    }
    res.json({
      message:"Code ran successfully",
      output:output
    });
  }
  catch(err){
    console.log(err);
    res.status(500).json({message:"Internal server error"});
    return;
  }

}