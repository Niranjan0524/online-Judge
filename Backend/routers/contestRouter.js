const contestRouter = require('express').Router();
const {verifyUser}=require("../controllers/verifyUser");

const {
  createContest,
  getAllContests,
  getContestById,
  unregisterUser,
  registerUser,
  submitSolution,
  runCode,
  getAllSubmissions,
  getTotalSolvedProblems,
} = require("../controllers/contestController");

contestRouter.post('/contests',createContest);
contestRouter.get('/contests', getAllContests);
contestRouter.get('/contests/:id',  getContestById);
contestRouter.post('/contests/:id/registrations', registerUser);
contestRouter.post('/contests/:id/registration-cancellations', unregisterUser);
contestRouter.post('/contests/:contestId/submissions', submitSolution)
contestRouter.get('/contests/:contestId/code-runs', runCode);
contestRouter.get("/contests/:contestId/submissions", getAllSubmissions);
contestRouter.get("/contests/:contestId/solved-problems/count", getTotalSolvedProblems);


module.exports = contestRouter;
