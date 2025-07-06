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

contestRouter.post('/create',createContest);
contestRouter.get('/getAllContests', getAllContests);
contestRouter.get('/getContestById/:id',  getContestById);
contestRouter.post('/registerUser/:id', registerUser);
contestRouter.post('/unregisterUser/:id', unregisterUser);
contestRouter.post('/:contestId/submit', submitSolution)
contestRouter.get('/:contestId/run', runCode);
contestRouter.get("/:contestId/getSubmissions", getAllSubmissions);
contestRouter.get("/:contestId/getTotalSolvedProblems", getTotalSolvedProblems);


module.exports = contestRouter;