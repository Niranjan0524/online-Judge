const contestSocketHandler=require("./contestSocket");


const initializeSocket=(io)=>{

  io.on("connection", (socket) => {
    console.log("New socket connection: ", socket.id);

    // Handle contest-specific socket events
    contestSocketHandler(io, socket);

    // Handle other socket events here if needed

    socket.on("disconnect", () => {
      console.log("User disconnected: ", socket.id);
    });
  });
}

module.exports = initializeSocket;