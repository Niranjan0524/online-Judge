const leaderboardRouter = require('express').Router();

const {getLeaderboard} = require('../controllers/leaderboardController');


leaderboardRouter.get('/leaderboard', getLeaderboard);

module.exports = leaderboardRouter;
