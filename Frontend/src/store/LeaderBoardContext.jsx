import { useContext,createContext ,useState,useEffect, Children} from "react";
import { useAuth } from "./AuthContext";

const LeaderBoardContext=createContext();

export const LeaderBoardProvider=({children})=>{

  const {token} = useAuth() || {};
  const [leaderBoardData, setLeaderBoardData] = useState([]);

  const fetchLeaderBoardData = async () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/alldata/getleaderboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        return response.json();
      })
      .then((data) => {
        setLeaderBoardData(data.leaderboard);
        
      })
      .catch((error) => {
        console.error("Error fetching leaderboard data:", error);
        setLeaderBoardData([]);
      });
  }
  useEffect(() => {
    if (!token) {
      setLeaderBoardData([]);
      return;
    }

    fetchLeaderBoardData();

  }, [token]);

  return (
    <LeaderBoardContext.Provider value={{ leaderBoardData, fetchLeaderBoardData }}>
      {children}
    </LeaderBoardContext.Provider>
  );
};

export const useLeaderBoard = () => useContext(LeaderBoardContext);
