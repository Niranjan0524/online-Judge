import SolveProblem from "./SolveProblem";
import ContestNavigation from "./ContestNavigation";
import { useParams } from "react-router-dom";
import { useSocketContext } from "../store/SocketContext";
import { useAuth } from "../store/AuthContext";
import { useEffect } from "react";

const SolveContest = () => {
  const {contestId, problemId} = useParams();
  const { joinContestLeaderboard } = useSocketContext();
  const { user } = useAuth();
  useEffect(()=>{

    if(contestId && problemId){
      joinContestLeaderboard(contestId, user?._id);
    }
  }, [contestId, problemId, user?._id]);
  return (
    <div>
      <ContestNavigation />
 
      <SolveProblem />
      
    </div>
  );
};

export default SolveContest;
  