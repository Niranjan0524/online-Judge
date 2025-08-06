const mongoose = require('mongoose');


const leaderboardSchema = new mongoose.Schema({
  contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest', required: true },
  leaderboard: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    noOfProblemsSolved: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    totalSubmissions: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    totalContestProblems: { type: Number, default: 0 }
  }],
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
module.exports = Leaderboard;

