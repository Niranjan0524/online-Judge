import { useContext,createContext ,useState,useEffect, Children} from "react";
import { useAuth } from "./AuthContext";

const LeaderBoardContext=createContext();

export const LeaderBoardProvider=({children})=>{

  const {token} = useAuth() || {};
  const [leaderBoardData, setLeaderBoardData] = useState([]);

  useEffect(()=>{
    if(!token){
      console.error("Token is not available");
      setLeaderBoardData([]);
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/alldata/getleaderboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then( (response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        return response.json();
      })
      .then((data) => {
        setLeaderBoardData(data.leaderboard);
        console.log("Leaderboard data fetched successfully:", data.leaderboard);
      })
      .catch((error) => {
        console.error("Error fetching leaderboard data:", error);
        setLeaderBoardData([]);
      });
  }, [token]);

  return (
    <LeaderBoardContext.Provider value={{ leaderBoardData }}>
      {children}
    </LeaderBoardContext.Provider>
  );
};

export const useLeaderBoard = () =>  useContext(LeaderBoardContext) ;
