const contestSocketHandler=(io,socket)=>{
  console.log("Contest socket connected: ", socket.id);

  socket.on("join-contest",(contestId)=>{
    
  });


  socket.on("leave-contest", (contestId) => {
    
  });

}

module.exports = contestSocketHandler;