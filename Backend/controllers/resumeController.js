const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs= require("fs");
const path = require("path");
const {resumeService} = require("../service/AI_Service");
const extractText=async(filePath,fileType)=>{

  if(fileType==="pdf"){
    const dataBuffer=fs.readFileSync(filePath);
    const data=await pdfParse(dataBuffer);
    return data.text;
  }
  else if(fileType==="docx" ){
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  else{
    throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
  }

}

exports.getResumeReview=async(req,res)=>{


  const file=req.file;
  const fileType=path.extname(file.originalname).toLowerCase().replace(".","");
  


  if(!file){
    res.status(400).json({
      message: "No file uploaded. Please upload a PDF or DOCX file."
    });
  }
  if(fileType!=="pdf" && fileType!=="docx"){
    return res.status(400).json({
      message: "Unsupported file type. Please upload a PDF or DOCX file."
    });
  }

  try{
    const text = await extractText(file.path, fileType);
    const cleanText = text.replace(/\s{2,}/g, " ").trim();
    if (!cleanText) {
      return res.status(400).json({
        message: "The uploaded file is empty or could not be processed.",
      });
    }
    const trimmedText = cleanText.slice(0, 6000); // ~1,200 tokens

    console.log("Extracted text:", trimmedText);
    const prompt = `You are an experienced HR professional with expertise in resume screening and career guidance.
Please review the following resume thoroughly and provide a professional, concise, and constructive evaluation.
Avoid using phrases like "Here's your response" or "Okay."
Just begin directly with the structured review in a formal and encouraging tone.
Your response must be in strict JSON format as shown below (do not include any markdown, explanations, or extra text):

{
  "strengths": ["..."],
  "weaknesses": ["..."],
  "recommendations": ["..."]
}

Resume:${trimmedText}`;

    const review = await resumeService(prompt);
    // const review="this is a mock response for testing purposes. Please replace this with the actual AI service call.";

    let reviewObj ;
    try{
      const jsonMatch=review.match(/\{[\s\S]*\}/);
      reviewObj=jsonMatch? JSON.parse(jsonMatch[0]):null;
      
    }
    catch(err){
      console.error("Error parsing JSON response:", err);
      return res.status(500).json({
        message: "Error parsing the AI response. Please try again later.",
        error: err.message
      });
    }

    res.status(200).json({
      message: "Resume review generated successfully.",
      review: reviewObj || "No review generated. Please try again later.",
    });
  }
  catch(err){
    return res.status(500).json({
      message: "Error processing the resume file.",
      error: err.message
    });
  }
  finally {
    // Clean up the uploaded file
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error("Error deleting the uploaded file:", err);
      }
    });
  }

  
}