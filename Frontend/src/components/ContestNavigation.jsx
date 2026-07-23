import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiClock,
  FiList,
  FiAward,
} from "react-icons/fi";
import { FallingLines } from "react-loader-spinner";
import toast from "react-hot-toast";
import { useAuth } from "../store/AuthContext";

const ContestNavigation = () => {
  const navigate = useNavigate();
  const { contestId, problemId } = useParams();
  const { token } = useAuth();

  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(true);
  const [contestEndTime, setContestEndTime] = useState(null);
  const [contestProblems, setContestProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [solvedProblems, setSolvedProblems] = useState(0);
  const [solvedProblemsLoading, setSolvedProblemsLoading] = useState(false);
  const [contestData, setContestData] = useState(null);

  useEffect(() => {
    const fetchContestData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/contest/getContestById/${contestId}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setContestData(data.contest);
          setContestProblems(data.contest.problems || []);
          setContestEndTime(new Date(data.contest.endTime));

          const index = data.contest.problems.indexOf(problemId);
          setCurrentProblemIndex(index >= 0 ? index : 0);
        }
      } catch (error) {
        console.error("Error fetching contest data:", error);
        toast.error("Failed to load contest data");
      }
    };

    if (contestId && token) {
      fetchContestData();
    }
  }, [contestId, token, problemId]);

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      try {
        setSolvedProblemsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/contest/${contestId}/getTotalSolvedProblems`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          setSolvedProblems(data.totalSolved || 0);
        }
      } catch (error) {
        console.error("Error fetching total solved problems:", error);
        toast.error("Failed to load total solved problems");
      } finally {
        setSolvedProblemsLoading(false);
      }
    };

    if (contestId && token) {
      fetchSolvedProblems();
    }
  }, [contestId, token]);

  useEffect(() => {
    let interval = null;

    if (isRunning && contestEndTime) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = contestEndTime.getTime() - now;

        if (distance > 0) {
          const hours = Math.floor(distance / (1000 * 60 * 60));
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setTime({ hours, minutes, seconds });
        } else {
          setTime({ hours: 0, minutes: 0, seconds: 0 });
          setIsRunning(false);
          toast.error("Contest has ended!");
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, contestEndTime]);

  const handlePrevProblem = () => {
    if (currentProblemIndex > 0) {
      const prevProblem = contestProblems[currentProblemIndex - 1];
      navigate(`/contest/${contestId}/solve/${prevProblem}`);
    }
  };

  const handleNextProblem = () => {
    if (currentProblemIndex < contestProblems.length - 1) {
      const nextProblem = contestProblems[currentProblemIndex + 1];
      navigate(`/contest/${contestId}/solve/${nextProblem}`);
    }
  };

  const formatTime = (time) => {
    return `${String(time.hours).padStart(2, "0")}:${String(
      time.minutes
    ).padStart(2, "0")}:${String(time.seconds).padStart(2, "0")}`;
  };

  if (!contestData) {
    return (
      <div className="border-b border-vibe-border bg-vibe-surface px-4 py-4 text-vibe-subtext">
        <div className="mx-auto max-w-7xl text-center text-sm">
          Loading contest...
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-vibe-border bg-vibe-surface text-vibe-text shadow-panel">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevProblem}
                disabled={currentProblemIndex === 0}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-vibe-border bg-vibe-background text-vibe-text hover:border-vibe-primary/60 disabled:cursor-not-allowed disabled:opacity-40"
                type="button"
              >
                <FiChevronLeft size={18} />
              </button>

              <div className="rounded-xl border border-vibe-border bg-vibe-background px-4 py-2 text-sm font-medium text-vibe-subtext">
                Problem {currentProblemIndex + 1} of {contestProblems.length}
              </div>

              <button
                onClick={handleNextProblem}
                disabled={currentProblemIndex === contestProblems.length - 1}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-vibe-border bg-vibe-background text-vibe-text hover:border-vibe-primary/60 disabled:cursor-not-allowed disabled:opacity-40"
                type="button"
              >
                <FiChevronRight size={18} />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate(`/contest/${contestId}/leaderboard`)}
                className="inline-flex items-center gap-2 rounded-xl border border-vibe-border bg-vibe-background px-4 py-2 text-sm font-semibold text-vibe-text hover:border-vibe-primary/60 hover:bg-vibe-elevated"
                type="button"
              >
                <FiAward size={16} />
                Leaderboard
              </button>
              <button
                onClick={() => navigate(`/contest/${contestId}/submissions`)}
                className="inline-flex items-center gap-2 rounded-xl border border-vibe-border bg-vibe-background px-4 py-2 text-sm font-semibold text-vibe-text hover:border-vibe-primary/60 hover:bg-vibe-elevated"
                type="button"
              >
                <FiList size={16} />
                Submissions
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-vibe-success/30 bg-vibe-success/10 px-3 py-2 text-sm text-vibe-success">
              <FiCheck size={16} />
              {solvedProblemsLoading ? (
                <FallingLines color="#22C55E" width="20" visible={true} />
              ) : (
                solvedProblems
              )}
              <span className="text-vibe-subtext">solved</span>
            </div>
            <div className="rounded-xl border border-vibe-border bg-vibe-background px-3 py-2 text-sm text-vibe-subtext">
              {contestProblems.length} total
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-vibe-danger/30 bg-vibe-danger/10 px-4 py-2 text-vibe-danger">
              <FiClock size={16} />
              <span className="font-mono text-lg font-bold">{formatTime(time)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-vibe-border pt-4">
          <h1 className="font-heading text-xl font-semibold text-vibe-text">
            {contestData.title}
          </h1>
          <p className="mt-1 text-sm text-vibe-subtext">
            {contestData.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContestNavigation;
