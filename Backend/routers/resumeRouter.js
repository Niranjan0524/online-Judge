const resumeRouter=require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir=path.join(__dirname, '../uploads'); 

if(!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); 
}
const allowedExtensions = new Set([".pdf", ".docx"]);
const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 0,
    parts: 1,
    fieldNameSize: 100,
  },
  fileFilter: (req, file, callback) => {
    if (!allowedExtensions.has(path.extname(file.originalname).toLowerCase())) {
      return callback(null, false);
    }
    callback(null, true);
  },
});


const { getResumeReview } = require("../controllers/resumeController");


const handleResumeUpload = (req, res, next) => {
  upload.single("resume")(req, res, (error) => {
    if (!error) return next();

    if (req.file?.path) {
      fs.promises.unlink(req.file.path).catch(() => {});
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ message: "Resume file must be 5 MB or smaller." });
    }

    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: "Invalid resume upload." });
    }

    next(error);
  });
};

resumeRouter.post("/resume-reviews", handleResumeUpload, getResumeReview);

module.exports = resumeRouter;
