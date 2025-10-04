import SolveProblem from "./SolveProblem";
import ContestNavigation from "./ContestNavigation";
import { useParams } from "react-router-dom";
import { useSocketContext } from "../store/SocketContext";
import { useAuth } from "../store/AuthContext";
import { useEffect ,useRef} from "react";
import toast from "react-hot-toast";

const SolveContest = () => {
  const {contestId, problemId} = useParams();
  const { joinContestLeaderboard } = useSocketContext();
  const { user } = useAuth();
  const fullScreen = useRef(null);


  useEffect(() => {
    let element = fullScreen.current;

    const fullScreenHandler=()=>{
      console.log("Requesting fullscreen for element:", element);
      if (element && element.requestFullscreen) {
        element.requestFullscreen().catch((err) => {
          console.error("Error in fullscreen request:", err);
        });
      }
    }

    const handleFullscreenChange = () => {
      element = fullScreen.current;
      console.log("fullscreen changed", element);
      if (!document.fullscreenElement) {
        toast(
          (t) => (
            <span>
              You have exited fullscreen mode.
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  fullScreenHandler(); // ✅ User click = valid gesture
                }}
                style={{ marginLeft: "10px", cursor: "pointer" }}
              >
                Re-enter Fullscreen
              </button>
            </span>
          ),
          {
            id: "fullscreen-warning",
            duration: Infinity,
          }
        );
      } else {
        toast.dismiss("fullscreen-warning"); // Dismiss when back in fullscreen
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    fullScreenHandler();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          console.error("Error in exiting fullscreen:", err);
        });
      }
    };
  }, []);

  useEffect(() => {

    if(contestId && problemId){
      joinContestLeaderboard(contestId, user?._id);
    }
  }, [contestId, problemId, user?._id]);
  return (
    <div ref={fullScreen}>
      <ContestNavigation />
 
      <SolveProblem />
      
    </div>
  );
};

export default SolveContest;
  