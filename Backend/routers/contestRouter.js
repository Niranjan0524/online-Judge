const contestRouter = require('express').Router();


const {
  createContest,
  getAllContests,
  getContestById
} = require("../controllers/contestController");

contestRouter.post('/create',createContest);
contestRouter.get('/getAllContests', getAllContests);
contestRouter.get('/getContestById/:id', getContestById);

module.exports = contestRouter;