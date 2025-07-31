import  { createContext, useContext, useEffect ,useState} from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const SocketContext =createContext();


const SocketContextProvider=({children})=>{
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  // const [activeContest, setActiveContest] = useState(new Set());
  const [leaderBoardData,setLeaderBoardData] = useState([]);



  useEffect(() => {

    const newSocket=io(import.meta.env.VITE_BACKEND_URL || "http://localhost:4000", {
      transports: ['websocket','polling'],
    });

    newSocket.on("connect",()=>{
      console.log("Socket connected with id: ", newSocket.id);
      setIsConnected(true);
    });

    

    newSocket.on("disconnect",()=>{
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("connect_error",(err)=>{
      console.error("Socket connection error: ", err);
      setIsConnected(false);
    });


    newSocket.on("leaderboardUpdate",(data)=>{
      console.log("testing");
      console.log("🔥 LIVE UPDATE:", new Date().toLocaleTimeString(), data);
      setLeaderBoardData(data.leaderboard);      
    });

    newSocket.on("leaderboardData",(data)=>{
      console.log("Initial data received:", data);
      setLeaderBoardData(data.leaderboard);
    })

    newSocket.on("participantJoined", (data) => {
      toast.success("New participant joined!");
    });

    newSocket.on("participantLeft", (data) => {
      toast.info("A participant left the contest");
    });

    setSocket(newSocket); 

    return()=>{
      newSocket.close();
    }
  },[]);

  const joinContestLeaderboard=(contestId,userId)=>{
    if(socket){
      socket.emit("joinContestLeaderboard", {
        contestId,
        userId,
      });
    }
  }

  const leaveContestLeaderboard=(contestId)=>{
    if(socket){
      socket.emit("leaveContestLeaderboard", contestId);
    }
  }

 const getContestStatus = (contestId) => {
   if (socket && isConnected) {
     socket.emit("getContestStatus", contestId);
   }
 };

  return (
    <SocketContext.Provider
      value={{  socket, isConnected, leaderBoardData, setLeaderBoardData, joinContestLeaderboard, leaveContestLeaderboard, getContestStatus }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocketContext = () => useContext(SocketContext);

export { SocketContextProvider };