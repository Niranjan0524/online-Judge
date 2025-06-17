const contestRouter = require('express').Router();


const {
  createContest,
  getAllContests,
} = require("../controllers/contestController");

contestRouter.post('/create',createContest);
contestRouter.get('/getAllContests', getAllContests);

module.exports = contestRouter;