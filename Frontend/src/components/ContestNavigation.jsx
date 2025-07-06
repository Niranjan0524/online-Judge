import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTrophy,
  FaList,
  FaClock,
  FaPlay,
  FaPause,
  FaStop,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../store/AuthContext";
import { useProblems } from "../store/ProblemsContext";
import toast from "react-hot-toast";
import { FallingLines } from "react-loader-spinner";


const ContestNavigation = () => {
  const navigate = useNavigate();
  const { contestId, problemId } = useParams();
  const { token } = useAuth();
 

  // Timer states
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(true);
  const [contestEndTime, setContestEndTime] = useState(null);

  // Contest states
  const [contestProblems, setContestProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [solvedProblems, setSolvedProblems] = useState(0);
  const [solvedProblemsLoading, setSolvedProblemsLoading] = useState(false);
  const [attemptedProblems, setAttemptedProblems] = useState(new Set());
  const [contestData, setContestData] = useState(null);

  // Fetch contest data
  useEffect(() => {
    const fetchContestData = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/contest/getContestById/${contestId}`,
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

          // Find current problem index
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


//getting no of solved problems:
  useEffect(()=>{
    const fetchSolvedProblems=async()=>{
    try{
      setSolvedProblemsLoading(true);
      const response=await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contest/${contestId}/getTotalSolvedProblems`,{
        headers:{
          authorization:`Bearer ${token}`
        }
      });
      const data=await response.json();
      

      if(response.ok){
        setSolvedProblems(data.totalSolved || 0);
        console.log("Total Solved Problems:",data.totalSolved);
      }
    }catch(error){
      console.error("Error fetching total solved problems:",error);
      toast.error("Failed to load total solved problems");
    }
    finally{
      setSolvedProblemsLoading(false);
    }
  };

  if (contestId && token) {
    fetchSolvedProblems();
  }

  },[contestId, token]);



  // Timer logic
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
      }, 1000); // Update every second
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, contestEndTime]);

  // Navigation functions
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

  const handleLeaderboard = () => {
    navigate(`/contest/${contestId}/leaderboard`);
  };

  const handleSubmissions = () => {
    navigate(`/contest/${contestId}/submissions`);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (time) => {
    return `${String(time.hours).padStart(2, "0")}:${String(
      time.minutes
    ).padStart(2, "0")}:${String(time.seconds).padStart(2, "0")}`;
  };

  if (!contestData) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-center">
          <div className="text-gray-400">Loading contest...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-md border-b border-gray-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Navigation & Contest Info */}
          <div className="flex items-center gap-6">
            {/* Problem Navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevProblem}
                disabled={currentProblemIndex === 0}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  currentProblemIndex === 0
                    ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300"
                }`}
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>

              <div className="bg-gray-800/60 rounded-lg px-4 py-2 border border-gray-600/50">
                <span className="text-gray-300 text-sm font-medium">
                  Problem {currentProblemIndex + 1} of {contestProblems.length}
                </span>
              </div>

              <button
                onClick={handleNextProblem}
                disabled={currentProblemIndex === contestProblems.length - 1}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  currentProblemIndex === contestProblems.length - 1
                    ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300"
                }`}
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Contest Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLeaderboard}
                className="flex items-center gap-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 hover:text-yellow-300 px-4 py-2 rounded-lg transition-all duration-200 border border-yellow-600/30"
              >
                <FaTrophy className="w-4 h-4" />
                <span className="text-sm font-medium">Leaderboard</span>
              </button>

              <button
                onClick={handleSubmissions}
                className="flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 px-4 py-2 rounded-lg transition-all duration-200 border border-purple-600/30"
              >
                <FaList className="w-4 h-4" />
                <span className="text-sm font-medium">Submissions</span>
              </button>
            </div>
          </div>

          {/* Right Section - Timer & Stats */}
          <div className="flex items-center gap-6">
            {/* Problem Stats */}
            <div className="flex items-center gap-4">
              <div className="bg-green-600/20 rounded-lg px-3 py-2 border border-green-600/30">
                <div className="flex items-center gap-2">
                  <FaCheck className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">
                    {solvedProblemsLoading ? (
                      <FallingLines color="#4fa94d"
                      width="20"
                      visible={true}
                      ariaLabel="falling-circles-loading"/>
                    ) : (
                      solvedProblems
                    )}
                  </span>
                  <span className="text-gray-400 text-sm">solved</span>
                </div>
              </div>

              <div className="bg-gray-600/20 rounded-lg px-3 py-2 border border-gray-600/30">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm font-medium">
                    {contestProblems.length}
                  </span>
                  <span className="text-gray-400 text-sm">total</span>
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-3">
              <div className="bg-red-600/20 rounded-lg px-4 py-2 border border-red-600/30">
                <div className="flex items-center gap-2">
                  <FaClock className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-lg font-mono font-bold">
                    {formatTime(time)}
                  </span>
                </div>
              </div>

              <div className="flex gap-1">
                {/* <button
                  onClick={toggleTimer}
                  className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white transition-all duration-200"
                >
                  {isRunning ? (
                    <FaPause className="w-3 h-3" />
                  ) : (
                    <FaPlay className="w-3 h-3" />
                  )}
                </button> */}

                {/* <button
                  onClick={() => {
                    setIsRunning(false);
                    setTime({ hours: 0, minutes: 0, seconds: 0 });
                  }}
                  className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white transition-all duration-200"
                >
                  <FaStop className="w-3 h-3" />
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Contest Title Bar */}
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">
                {contestData.title}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {contestData.description}
              </p>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestNavigation;
