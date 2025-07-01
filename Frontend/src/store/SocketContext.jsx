import  { createContext, useContext, useEffect ,useState} from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const SocketContext =createContext();


const SocketContextProvider=({children})=>{
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  // const [activeContest, setActiveContest] = useState(new Set());


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


    setSocket(newSocket); 

    return()=>{
      newSocket.close();
    }
  },[]);

  return (
    <SocketContext.Provider
      value={{  socket, isConnected }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocketContext = () => useContext(SocketContext);

export { SocketContextProvider };