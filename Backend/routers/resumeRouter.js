const resumeRouter=require("express").Router();

const { getResumeReview } = require("../controllers/resumeController");


resumeRouter.post('/resumeReview', getResumeReview);

module.exports = resumeRouter;