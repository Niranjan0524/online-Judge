const leaderboardSocket = require("./leaderboardSocket");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


const initializeSocket=(io)=>{
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (typeof token !== "string" || !token) {
      return next(new Error("Authentication required"));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (!payload.id || !mongoose.Types.ObjectId.isValid(payload.id)) {
        return next(new Error("Authentication required"));
      }
      socket.data.userId = payload.id;
      return next();
    } catch {
      return next(new Error("Authentication required"));
    }
  });

  io.on("connection", (socket) => {
    console.log("New socket connection: ", socket.id);

    // Handle contest-specific socket events
    leaderboardSocket(socket);
    //io is nothing but the server instance
    // socket is nothing but the client instance

    // Handle other socket events here if needed

    socket.on("disconnect", () => {
      console.log("User disconnected: ", socket.id);
    });
  });
}

module.exports = initializeSocket;
