const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");
const { resumeService } = require("../service/AI_Service");

const extractText = async (filePath, fileType) => {
  if (fileType === "pdf") {
    const dataBuffer = await fs.promises.readFile(filePath);
    if (!dataBuffer.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
      throw new Error("FILE_CONTENT_MISMATCH");
    }

    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  if (fileType === "docx") {
    const fileHandle = await fs.promises.open(filePath, "r");
    const signature = Buffer.alloc(4);
    try {
      await fileHandle.read(signature, 0, signature.length, 0);
    } finally {
      await fileHandle.close();
    }

    // DOCX files are ZIP archives. Mammoth then validates and parses the archive contents.
    if (!signature.equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))) {
      throw new Error("FILE_CONTENT_MISMATCH");
    }

    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new Error("UNSUPPORTED_FILE_TYPE");
};

exports.getResumeReview = async (req, res) => {
  const file = req.file;

  try {
    if (!file) {
      return res.status(400).json({
        message: "No valid file uploaded. Please upload a PDF or DOCX file.",
      });
    }

    const fileType = path.extname(file.originalname).toLowerCase().slice(1);
    if (fileType !== "pdf" && fileType !== "docx") {
      return res.status(400).json({
        message: "Unsupported file type. Please upload a PDF or DOCX file.",
      });
    }

    let text;
    try {
      text = await extractText(file.path, fileType);
    } catch {
      return res.status(400).json({
        message: "The uploaded file is not a valid PDF or DOCX document.",
      });
    }

    const cleanText = text.replace(/\s{2,}/g, " ").trim();
    if (!cleanText) {
      return res.status(400).json({
        message: "The uploaded file is empty or could not be processed.",
      });
    }

    const trimmedText = cleanText.slice(0, 6000);
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
    if (typeof review !== "string") {
      return res.status(502).json({
        message: "Unable to generate a resume review right now. Please try again later.",
      });
    }

    let reviewObj;
    try {
      const jsonMatch = review.match(/\{[\s\S]*\}/);
      reviewObj = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (error) {
      console.error("Unable to parse resume review response.");
      return res.status(500).json({
        message: "Unable to process the review response. Please try again later.",
      });
    }

    return res.status(200).json({
      message: "Resume review generated successfully.",
      review: reviewObj || "No review generated. Please try again later.",
    });
  } catch (error) {
    console.error("Resume review processing failed.");
    return res.status(500).json({
      message: "Error processing the resume file. Please try again later.",
    });
  } finally {
    if (file?.path) {
      try {
        await fs.promises.unlink(file.path);
      } catch (error) {
        if (error.code !== "ENOENT") {
          console.error("Unable to remove temporary resume upload.");
        }
      }
    }
  }
};
