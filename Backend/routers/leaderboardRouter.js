const leaderboardRouter = require('express').Router();

const {getLeaderboard} = require('../controllers/leaderboardController');


leaderboardRouter.get('/getleaderboard', getLeaderboard);

module.exports = leaderboardRouter;