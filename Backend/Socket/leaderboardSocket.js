const Contest=require("../models/contest");


const leaderboardSocket=(io,socket)=>{
  console.log("Leaderboard socket connected: ", socket.id);

  socket.on("joinContestLeaderboard",async (data)=>{
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

     const sampleLeaderboardData = [
      {
        userId: "6880c9433d1da4cf900e925f",
        userName: "Alice Johnson",
        noOfProblemsSolved: 12,
        accuracy: 85,
        easy: 8,
        medium: 3,
        hard: 1
      },
      {
        userId: "682328e365abaf49ad8641a5", 
        userName: "Bob Smith",
        noOfProblemsSolved: 8,
        accuracy: 75,
        easy: 5,
        medium: 2,
        hard: 1
      }
    ];

      socket.emit("leaderboardUpdate", {
        contestId: contestId,
        leaderboard: sampleLeaderboardData,
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
          timeLeft:
            status === "ongoing" ? endTime.getTime() - now.getTime() : 0,
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
 
  
}

module.exports = leaderboardSocket;