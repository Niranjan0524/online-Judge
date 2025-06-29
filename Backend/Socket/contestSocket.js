const contestSocketHandler=(io,socket)=>{
  console.log("Contest socket connected: ", socket.id);

  socket.on("join-contest",(contestId)=>{
    socket.join(`contest-${contestId}`);
    console.log(`User ${socket.id} joined contest ${contestId}`);

    socket.to(`contest-${contestId}`).emit("user-joined-contest", {
      userId: socket.id,
      contestId: contestId
    });
  });


  socket.on("leave-contest", (contestId) => {
    socket.leave(`contest-${contestId}`);
    console.log(`User ${socket.id} left contest ${contestId}`);

    socket.to(`contest-${contestId}`).emit("user-left-contest", {
      userId: socket.id,
      contestId: contestId
    });
  });

}

module.exports = contestSocketHandler;