import SolveProblem from "./SolveProblem";
import ContestNavigation from "./ContestNavigation";
import { useParams } from "react-router-dom";
const SolveContest = () => {
  const {contestId, problemId} = useParams();
  return (
    <div>
      <ContestNavigation />
 
      <SolveProblem />
      
    </div>
  );
};

export default SolveContest;
  