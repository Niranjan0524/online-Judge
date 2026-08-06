import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const SocketContext = createContext();

const isContestRoute = (pathname) =>
  pathname === "/contest" || pathname.startsWith("/contest/");

const SocketContextProvider = ({ children }) => {
  const location = useLocation();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [leaderBoardData, setLeaderBoardData] = useState([]);
  const needsSocket = isContestRoute(location.pathname);

  useEffect(() => {
    if (!needsSocket) {
      setSocket(null);
      setIsConnected(false);
      setLeaderBoardData([]);
      return;
    }

    const newSocket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:4000", {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected with id: ", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error: ", err);
      setIsConnected(false);
    });

    newSocket.on("leaderboardUpdate", (data) => {
      console.log("LIVE UPDATE:", new Date().toLocaleTimeString(), data);
      setLeaderBoardData(data.leaderboard);
    });

    newSocket.on("leaderboardData", (data) => {
      console.log("Initial data received:", data);
      setLeaderBoardData(data.leaderboard);
    });

    newSocket.on("participantJoined", () => {
      toast.success("New participant joined!");
    });

    newSocket.on("participantLeft", () => {
      toast.info("A participant left the contest");
    });

    setSocket(newSocket);

    return () => {
      newSocket.removeAllListeners();
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setLeaderBoardData([]);
    };
  }, [needsSocket]);

  const joinContestLeaderboard = (contestId, userId) => {
    if (socket && isConnected) {
      socket.emit("joinContestLeaderboard", {
        contestId,
        userId,
      });
    }
  };

  const leaveContestLeaderboard = (contestId) => {
    if (socket && isConnected) {
      socket.emit("leaveContestLeaderboard", contestId);
    }
  };

  const getContestStatus = (contestId) => {
    if (socket && isConnected) {
      socket.emit("getContestStatus", contestId);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        leaderBoardData,
        setLeaderBoardData,
        joinContestLeaderboard,
        leaveContestLeaderboard,
        getContestStatus,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);

export { SocketContextProvider };
