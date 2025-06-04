const resumeRouter=require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir=path.join(__dirname, '../uploads'); 

if(!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); 
}
const upload = multer({ dest: uploadDir });


const { getResumeReview } = require("../controllers/resumeController");


resumeRouter.post('/getReview', upload.single('resume'), getResumeReview);

module.exports = resumeRouter;