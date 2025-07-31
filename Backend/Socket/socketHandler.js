const leaderboardSocket = require("./leaderboardSocket");


const initializeSocket=(io)=>{

  io.on("connection", (socket) => {
    console.log("New socket connection: ", socket.id);

    // Handle contest-specific socket events
    leaderboardSocket(io, socket);
    //io is nothing but the server instance
    // socket is nothing but the client instance

    // Handle other socket events here if needed

    socket.on("disconnect", () => {
      console.log("User disconnected: ", socket.id);
    });
  });
}

module.exports = initializeSocket;