const mongoose = require("mongoose");
const Contest = require("../models/contest");
const Leaderboard = require("../models/leaderboard");
const { getCachedLeaderboard } = require("../service/leaderboardCache");

const isValidContestId = (contestId) => mongoose.Types.ObjectId.isValid(contestId);

const findContestForMember = async (contestId, userId) => {
  if (typeof contestId !== "string" || !isValidContestId(contestId)) return null;

  const contest = await Contest.findById(contestId)
    .select("registeredUsers startTime endTime")
    .lean();
  if (!contest) return null;

  const isRegistered = contest.registeredUsers?.some(
    (registeredUserId) => String(registeredUserId) === String(userId)
  ) || false;
  return isRegistered ? contest : null;
};

const leaderboardSocket = (socket) => {
  socket.data.joinedContestIds = new Set();

  socket.on("joinContestLeaderboard", async (data = {}) => {
    const contestId = typeof data?.contestId === "string" ? data.contestId : "";
    const userId = socket.data.userId;

    try {
      const contest = await findContestForMember(contestId, userId);
      if (!contest) {
        socket.emit("error", { message: "Contest not found or access denied" });
        return;
      }

      const roomName = `contest_${contestId}`;
      await socket.join(roomName);
      socket.data.joinedContestIds.add(contestId);

      const leaderboardData = await getCachedLeaderboard(contestId, async () => {
        const savedLeaderboard = await Leaderboard.findOne({ contestId })
          .select("leaderboard")
          .lean();
        return savedLeaderboard?.leaderboard || [];
      });

      socket.emit("leaderboardUpdate", {
        contestId,
        leaderboard: leaderboardData,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Unable to join contest leaderboard.", error.message);
      socket.emit("error", { message: "Unable to load the contest leaderboard" });
    }
  });

  socket.on("leaveContestLeaderboard", (contestId) => {
    if (typeof contestId !== "string" || !socket.data.joinedContestIds.has(contestId)) {
      return;
    }

    socket.leave(`contest_${contestId}`);
    socket.data.joinedContestIds.delete(contestId);
  });

  socket.on("getContestStatus", async (contestId) => {
    try {
      const contest = await findContestForMember(contestId, socket.data.userId);
      if (!contest) {
        socket.emit("error", { message: "Contest not found or access denied" });
        return;
      }

      const now = new Date();
      const startTime = new Date(contest.startTime);
      const endTime = new Date(contest.endTime);

      let status = "upcoming";
      if (now >= startTime && now <= endTime) status = "ongoing";
      else if (now > endTime) status = "ended";

      socket.emit("contestStatus", {
        contestId,
        status,
        startTime: contest.startTime,
        endTime: contest.endTime,
        timeLeft: status === "ongoing" ? endTime.getTime() - now.getTime() : 0,
      });
    } catch (error) {
      console.error("Unable to get contest status.", error.message);
      socket.emit("error", { message: "Unable to get contest status" });
    }
  });

  socket.on("disconnect", () => {
    for (const contestId of socket.data.joinedContestIds) {
      socket.to(`contest_${contestId}`).emit("participantLeft", {
        message: "A participant disconnected",
        timestamp: new Date(),
      });
    }
    socket.data.joinedContestIds.clear();
  });
};

module.exports = leaderboardSocket;
