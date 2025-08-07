const Contest = require("../models/contest");
const Submission = require("../models/submissions");
const Solution = require("../models/solution");
const Problem = require("../models/problems");
const Leaderboard = require("../models/leaderboard");
const User = require("../models/user");

const leaderboardSocket = (io, socket) => {
  console.log("Leaderboard socket connected: ", socket.id);

  socket.on("joinContestLeaderboard", async (data) => {
    try {
      const { contestId, userId } = data;
      console.log(
        "User joining leaderboard for contest:",
        contestId,
        "by user:",
        userId
      );

      const contest = await Contest.findById(contestId);
      if (!contest) {
        console.error("Contest not found for ID:", contestId);
        socket.emit("error", { message: "Contest not found" });
        return;
      }

      if (!contest.registeredUsers.includes(userId)) {
        console.error("User not registered for contest:", userId);
        socket.emit("error", {
          message: "User not registered for this contest",
        });
        return;
      }

      socket.join(`contest_${contestId}`);
      socket.contestId = contestId;
      console.log(`User ${userId} joined leaderboard for contest ${contestId}`);

      // Fetch and emit the current leaderboard data
      // const leaderboardData=await Leaderboard.findOne({ contestId: contestId });
      const leaderboardData = await getLeaderboardData(contestId);

      socket.emit("leaderboardUpdate", {
        contestId: contestId,
        leaderboard: leaderboardData || [],
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error in joinContestLeaderboard:", err);
      socket.emit("error", { message: "Internal server error" });
    }
  });
  socket.on("leaveContestLeaderboard", (contestId) => {
    socket.leave(`contest_${contestId}`);

    console.log(`User left leaderboard for contest ${contestId}`);
  });

  socket.on("getContestStatus", async (contestId) => {
    try {
      const contest = await Contest.findById(contestId);
      if (!contest) {
        socket.emit("error", { message: "Contest not found" });
        return;
      }

      const now = new Date();
      const startTime = new Date(contest.startTime);
      const endTime = new Date(contest.endTime);

      let status = "upcoming";
      if (now >= startTime && now <= endTime) {
        status = "ongoing";
      } else if (now > endTime) {
        status = "ended";
      }

      socket.emit("contestStatus", {
        contestId: contestId,
        status: status,
        startTime: contest.startTime,
        endTime: contest.endTime,
        timeLeft: status === "ongoing" ? endTime.getTime() - now.getTime() : 0,
      });
    } catch (error) {
      console.error("Error getting contest status:", error);
      socket.emit("error", { message: "Failed to get contest status" });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    if (socket.contestId) {
      socket.to(`contest-${socket.contestId}`).emit("participantLeft", {
        message: "A participant disconnected",
        timestamp: new Date(),
      });
    }
    console.log(`Leaderboard socket disconnected: ${socket.id}`);
  });
};

const getLeaderboardData = async (contestId) => {
  console.log("Contest ID", contestId);

  try {
    const contestSubmissions = await Submission.find({ contestId: contestId });
    console.log("Contest Submissions:", contestSubmissions.length);

    const contestDetails = await Contest.findById(contestId);

    if (!contestDetails) {
      console.error("Contest not found");
      return [];
    }

    const userIDs = contestDetails.registeredUsers;

    if (!userIDs || userIDs.length === 0) {
      console.log("No registered users");
      return [];
    }

    const contestStartTime = new Date(contestDetails.startTime).getTime();

    let leaderboardData = await Promise.all(
      userIDs.map(async (userId) => {
        const userSubmissions = await Submission.find({
          contestId: contestId,
          userId: userId,
        }).sort({ createdAt: 1 });

        const uniqueProblemSolved = new Set();
        const totalSubmissions = userSubmissions.length;

        if (totalSubmissions === 0) return null;

        let totalPoints = 0;
        const problemFirstAttempt = new Map(); // Track first attempt for each problem

        let totalCorrectSubmissions = 0;
        // ✅ Fix: Proper scoring logic
        for (const sub of userSubmissions) {
          try {
            const sol = await Solution.findById(sub.solutionId);
            if (!sol) continue;

            const problemId = sol.problemId.toString();
            const problem = await Problem.findById(problemId);
            if (!problem) continue;

            const problemDifficulty = problem.difficulty;
            const submissionTime = new Date(sub.createdAt).getTime();

            // ✅ Track first attempt time for each problem
            if (!problemFirstAttempt.has(problemId)) {
              problemFirstAttempt.set(problemId, submissionTime);
            }

            if (sol.status == "Accepted") totalCorrectSubmissions++;

            // ✅ Only process if problem not yet solved
            if (!uniqueProblemSolved.has(problemId)) {
              if (sol.status === "Accepted") {
                uniqueProblemSolved.add(problemId);

                // Calculate time taken from first attempt to solve
                const firstAttemptTime = problemFirstAttempt.get(problemId);
                const timeToSolveMinutes =
                  (submissionTime - firstAttemptTime) / (1000 * 60);

                // ✅ Base points
                let basePoints = 0;
                switch (problemDifficulty) {
                  case "easy":
                    basePoints = 100;
                    break;
                  case "medium":
                    basePoints = 200;
                    break;
                  case "hard":
                    basePoints = 300;
                    break;
                  default:
                    basePoints = 100;
                }

                // ✅ Calculate final points (ensure no NaN)
                const timePoints = Math.max(0, timeToSolveMinutes) || 0;
                const problemPoints = Math.max(0, basePoints - timePoints);
                totalPoints += problemPoints;
              } else if (sol.status === "Wrong Answer") {
                totalPoints -= 20;
              } else if (sol.status === "Time Limit Exceeded") {
                totalPoints -= 10;
              }
            }
          } catch (innerErr) {
            console.error("Error processing submission:", innerErr);
            continue;
          }
        }

        // ✅ Ensure totalPoints is never NaN
        totalPoints = isNaN(totalPoints) ? 0 : totalPoints;
        totalPoints = Math.max(0, totalPoints); // Ensure non-negative

        // ✅ Fix: Better user name fetching with error handling
        let userName = "Unknown User";
        try {
          const user = await User.findById(userId);
          userName = user ? user.name : "Unknown User";
        } catch (userErr) {
          console.error("Error fetching user:", userErr);
        }

        const accuracy =
          totalSubmissions > 0
            ? (totalCorrectSubmissions / totalSubmissions) * 100
            : 0;

        // ✅ Validate all values before returning
        const leaderboardEntry = {
          userId: userId,
          userName: userName,
          noOfProblemsSolved: uniqueProblemSolved.size || 0,
          totalPoints: Math.round(totalPoints) || 0, // Ensure it's a valid number
          totalSubmissions: totalSubmissions || 0,
          accuracy: Math.round((accuracy || 0) * 100) / 100, // Round to 2 decimal places
          totalContestProblems: contestDetails.problems.length || 0,
        };

        // ✅ Final validation - check for NaN values
        Object.keys(leaderboardEntry).forEach((key) => {
          if (
            typeof leaderboardEntry[key] === "number" &&
            isNaN(leaderboardEntry[key])
          ) {
            console.error(`NaN detected in ${key}, setting to 0`);
            leaderboardEntry[key] = 0;
          }
        });

        console.log(`User ${userName}: ${leaderboardEntry.totalPoints} points`);
        return leaderboardEntry;
      })
    );

    // ✅ Filter out nulls and validate data
    leaderboardData = leaderboardData
      .filter((data) => data !== null)
      .filter((data) => !isNaN(data.totalPoints)) // Extra safety
      .sort((a, b) => b.totalPoints - a.totalPoints);

    console.log("Final leaderboard data:", leaderboardData);

    // ✅ Fix: Add contestName and better error handling
    try {
      await Leaderboard.updateOne(
        { contestId: contestId },
        {
          $set: {
            contestName: contestDetails.title,
            leaderboard: leaderboardData,
            lastUpdated: new Date(),
          },
        },
        { upsert: true }
      );
    } catch (dbErr) {
      console.error("Error updating leaderboard in database:", dbErr);
    }

    return leaderboardData;
  } catch (err) {
    console.error("Error fetching leaderboard data:", err);
    return [];
  }
};

module.exports = leaderboardSocket;
