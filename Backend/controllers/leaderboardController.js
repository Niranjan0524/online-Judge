const User = require("../models/user");
const Solution = require("../models/solution");
const Problem = require("../models/problems");

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ type: "user" });
    const random = Math.random() * (1.5 - 0.5) + 0.5;

    const data = await Promise.all(
      users.map(async (user) => {
        const userId = user._id;
        const userName = user.name;

        const problemsSolved = await Solution.find({ userId: userId });

        let correct = 0;
        let wrong = 0;
        let easy = 0;
        let medium = 0;
        let hard = 0;

        // Track unique accepted problems
        const uniqueAcceptedProblems = new Set();

        problemsSolved.forEach((sol) => {
          if (sol.status === "Accepted" && sol.problemId) {
            uniqueAcceptedProblems.add(sol.problemId.toString());
            correct++;
          } else {
            wrong++;
          }
        });

        // Fetch all unique accepted problems and count their difficulties
        const problemDocs = await Problem.find({
          _id: { $in: Array.from(uniqueAcceptedProblems) },
        });

        problemDocs.forEach((problem) => {
          if (problem.difficulty === "easy" || problem.level === "Easy") easy++;
          else if (
            problem.difficulty === "medium" ||
            problem.level === "Medium"
          )
            medium++;
          else if (problem.difficulty === "hard" || problem.level === "Hard")
            hard++;
        });

        const accuracy = (correct / (correct + wrong)) * 100 || 0;
        const rank =
          (easy * 10 + medium * 20 + hard * 30) *
          Math.pow(accuracy / 100, random);

        return {
          userId: userId,
          userName: userName,
          noOfProblemsSolved: uniqueAcceptedProblems.size,
          correct: correct,
          wrong: wrong,
          easy: easy,
          medium: medium,
          hard: hard,
          accuracy: accuracy.toFixed(2),
          rank: rank.toFixed(2),
        };
      })
    );

    data.sort((a, b) => b.rank - a.rank);
    res.status(200).json({
      message: "Leaderboard fetched successfully",
      leaderboard: data,
    });
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
