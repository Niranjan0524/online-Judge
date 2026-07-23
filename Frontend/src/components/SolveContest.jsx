import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ContestNavigation from "./ContestNavigation";
import SolveProblem from "./SolveProblem";
import { useSocketContext } from "../store/SocketContext";
import { useAuth } from "../store/AuthContext";

const SolveContest = () => {
  const { contestId, problemId } = useParams();
  const { joinContestLeaderboard } = useSocketContext();
  const { user } = useAuth();
  const fullScreen = useRef(null);

  useEffect(() => {
    let element = fullScreen.current;

    const fullScreenHandler = () => {
      if (element && element.requestFullscreen) {
        element.requestFullscreen().catch((err) => {
          console.error("Error in fullscreen request:", err);
        });
      }
    };

    const handleFullscreenChange = () => {
      element = fullScreen.current;
      if (!document.fullscreenElement) {
        toast(
          (t) => (
            <span className="flex items-center gap-3">
              <span>You have exited fullscreen mode.</span>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  fullScreenHandler();
                }}
                className="rounded-lg bg-vibe-primary px-3 py-1 text-xs font-semibold text-white"
                type="button"
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
        toast.dismiss("fullscreen-warning");
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
    if (contestId && problemId) {
      joinContestLeaderboard(contestId, user?._id);
    }
  }, [contestId, problemId, user?._id, joinContestLeaderboard]);

  return (
    <div ref={fullScreen} className="bg-vibe-background">
      <ContestNavigation />
      <SolveProblem />
    </div>
  );
};

export default SolveContest;
