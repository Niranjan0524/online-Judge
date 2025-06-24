const express=require("express");

const codeRouter=express.Router();
const { aiReviewCode} = require("../controllers/codeController");
const {verifyUser} =require("../controllers/verifyUser");

codeRouter.post("/run",verifyUser,async(req,res)=>{
  const { code, lang = "c++", problemId, input } = req.body;
  
  console.log("got it");
  try{
    const response = await fetch(`${process.env.COMPILER_URL}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        lang,
        problemId,
        input,
      }),
    });

    const data=await response.json();
    if(!response.ok){
      return res.status(500).json({
        message:"error"
      })
    }

    res.status(200).json({
      message:"Success",
      output:data.output
    })
  }
  catch(err){
    console.log("Compiler Server Error:",err.message);
    res.status(500).json({
      message:"Compiler Error"
    })
  }
});
codeRouter.post("/submit",verifyUser,async(req,res)=>{
  const { code, lang = "c++", problemId } = req.body;
  const id = req.userId;
  try{
    const response = await fetch(`${process.env.COMPILER_URL}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        lang,
        problemId,
        id,
      }),
    });

  if(!response.ok){
    return res.status(500).json({
      message:"error"
    })
  }

  const data=await response.json();
  res.status(200).json({
    message:"Success",
    output:data
  });
  }
  catch(err){
    console.log("Compiler Server Error:",err.message);
    res.status(500).json({
      message:"Compiler Error"
    });
  } 

});
codeRouter.post("/aiReview",aiReviewCode);

module.exports=codeRouter;