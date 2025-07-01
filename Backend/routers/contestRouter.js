const contestRouter = require('express').Router();
const {verifyUser}=require("../controllers/verifyUser");

const {
  createContest,
  getAllContests,
  getContestById,
  unregisterUser,
  registereUser

} = require("../controllers/contestController");

contestRouter.post('/create',createContest);
contestRouter.get('/getAllContests', getAllContests);
contestRouter.get('/getContestById/:id',  getContestById);
contestRouter.post('/registerUser/:id', verifyUser, registereUser);
contestRouter.post('/unregisterUser/:id', verifyUser, unregisterUser);

module.exports = contestRouter;