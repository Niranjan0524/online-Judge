import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaUsers,
  FaCode,
  FaPlay,
  FaStop,
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaArrowLeft,
  FaShare,
  FaBookmark,
  FaGamepad,
  FaLock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useAuth } from "../store/AuthContext";
import toast from "react-hot-toast";


const ViewContest = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [contestStatus, setContestStatus] = useState("upcoming");
  const [isRegistered, setIsRegistered] = useState(false);

  // Fetch contest details
  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/contest/getContestById/${contestId}`,
          {
            headers: token ? { authorization: `Bearer ${token}` } : {},
          }
        );
        const data = await response.json();

        if (response.ok) {
          setContest(data.contest);
          setIsRegistered(
            data.contest.registeredUsers?.includes(user?._id) || false
          );
          updateContestStatus(data.contest);
        } else {
          toast.error("Failed to load contest details");
        }
      } catch (error) {
        console.error("Error fetching contest:", error);
        toast.error("Network error while loading contest");
      } finally {
        setLoading(false);
      }
    };

    if (contestId) {
      fetchContestDetails();
    }



    
  }, [contestId, token, user?._id]);

  // Update contest status and countdown
  const updateContestStatus = (contestData) => {
    const now = new Date();
    const start = new Date(contestData.startTime);
    const end = new Date(contestData.endTime);

    if (now < start) {
      setContestStatus("upcoming");
      setTimeLeft(start.getTime() - now.getTime());
    } else if (now >= start && now <= end) {
      setContestStatus("ongoing");
      setTimeLeft(end.getTime() - now.getTime());
    } else {
      setContestStatus("ended");
      setTimeLeft(0);
    }
  };

  // Live countdown timer
  useEffect(() => {
    if (!contest) return;

    const timer = setInterval(() => {
      updateContestStatus(contest);
    }, 1000);

    return () => clearInterval(timer);
  }, [contest]);

  const formatTimeLeft = (milliseconds) => {
    if (milliseconds <= 0) return "00:00:00";

    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getStatusBadge = () => {
    const baseClasses =
      "px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2";

    switch (contestStatus) {
      case "upcoming":
        return (
          <span
            className={`${baseClasses} bg-blue-600/20 text-blue-400 border border-blue-600/30`}
          >
            <FaClock className="w-4 h-4" />
            Starting Soon
          </span>
        );
      case "ongoing":
        return (
          <span
            className={`${baseClasses} bg-green-600/20 text-green-400 border border-green-600/30 animate-pulse`}
          >
            <FaPlay className="w-4 h-4" />
            Live Now
          </span>
        );
      case "ended":
        return (
          <span
            className={`${baseClasses} bg-gray-600/20 text-gray-400 border border-gray-600/30`}
          >
            <FaStop className="w-4 h-4" />
            Ended
          </span>
        );
      default:
        return null;
    }
  };

  const handleAttemptContest = () => {
    if (!isRegistered) {
      toast.error("You need to be registered for this contest");
      return;
    }

    if (contestStatus !== "ongoing") {
      toast.error("Contest is not currently active");
      return;
    }

    if (!contest.problems || contest.problems.length === 0) {
      toast.error("No problems available in this contest");
      return;
    }

    // Navigate to the contest solving interface with the first problem
    navigate(`/contest/${contestId}/solve/${contest.problems[0]}`);
    toast.success("Good luck with the contest!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center pt-24">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-white mt-4 text-center">
            Loading contest details...
          </p>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center pt-24">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <FaTimesCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Contest Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            The requested contest could not be found.
          </p>
          <button
            onClick={handleBackToContests}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Contests
          </button>
        </div>
      </div>
    );
  }

  const handleBackToContests = () => {
    navigate("/contest");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-8 ">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/contest")}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Contests
          </button>
        </div>

        {/* Main Contest Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Contest Header */}
          <div className="bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20 p-8 border-b border-white/10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-4xl font-bold text-white">
                    {contest.title}
                  </h1>
                  {getStatusBadge()}
                  {isRegistered && (
                    <span className="px-3 py-1 bg-green-600/20 text-green-400 border border-green-600/30 rounded-full text-sm font-semibold">
                      <FaCheckCircle className="w-3 h-3 inline mr-1" />
                      Registered
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-lg leading-relaxed max-w-4xl">
                  {contest.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 ml-6">
                <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 text-gray-300 hover:text-white">
                  <FaShare className="w-5 h-5" />
                </button>
                <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 text-gray-300 hover:text-white">
                  <FaBookmark className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Contest Stats Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Duration */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <FaClock className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-gray-300 font-semibold">Duration</h3>
                </div>
                <p className="text-2xl font-bold text-white">
                  {Math.ceil(
                    (new Date(contest.endTime) - new Date(contest.startTime)) /
                      (1000 * 60 * 60)
                  )}{" "}
                  hours
                </p>
                {timeLeft > 0 && (
                  <p className="text-sm text-cyan-400 mt-1">
                    {contestStatus === "upcoming" ? "Starts in: " : "Ends in: "}
                    <span className="font-mono font-bold">
                      {formatTimeLeft(timeLeft)}
                    </span>
                  </p>
                )}
              </div>

              {/* Problems Count */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    <FaCode className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-gray-300 font-semibold">Problems</h3>
                </div>
                <p className="text-2xl font-bold text-white">
                  {contest.problems?.length || 0}
                </p>
                <p className="text-sm text-gray-400 mt-1">to solve</p>
              </div>

              {/* Participants */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-600/20 rounded-lg">
                    <FaUsers className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-gray-300 font-semibold">Participants</h3>
                </div>
                <p className="text-2xl font-bold text-white">
                  {contest.registeredUsers?.length || 0}
                </p>
                <p className="text-sm text-gray-400 mt-1">registered</p>
              </div>

              {/* Your Status */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-yellow-600/20 rounded-lg">
                    <FaTrophy className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-gray-300 font-semibold">Your Status</h3>
                </div>
                <p className="text-lg font-bold text-white">
                  {isRegistered ? "Ready to compete" : "Not registered"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {isRegistered ? "Good luck!" : "Registration required"}
                </p>
              </div>
            </div>

            {/* Contest Timeline */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <FaCalendarAlt className="w-5 h-5 text-cyan-400" />
                Contest Timeline
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 font-semibold">
                      Start Time
                    </span>
                  </div>
                  <p className="text-white text-lg ml-5">
                    {new Date(contest.startTime).toLocaleString()}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-red-400 font-semibold">End Time</span>
                  </div>
                  <p className="text-white text-lg ml-5">
                    {new Date(contest.endTime).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

          

            {/* Attempt Contest Section */}
            <div className="text-center">
              {!isRegistered ? (
                <div className="bg-red-600/10 border border-red-600/30 rounded-2xl p-8">
                  <FaLock className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Registration Required
                  </h3>
                  <p className="text-gray-400 mb-6">
                    You need to register for this contest to participate.
                  </p>
                  <button
                    onClick={() => navigate("/contests")}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-colors"
                  >
                    Go to Contest Registration
                  </button>
                </div>
              ) : contestStatus === "upcoming" ? (
                <div className="bg-blue-600/10 border border-blue-600/30 rounded-2xl p-8">
                  <FaClock className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Contest Starting Soon
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Get ready! The contest will begin in:
                  </p>
                  <div className="text-4xl font-bold text-cyan-400 font-mono mb-6">
                    {formatTimeLeft(timeLeft)}
                  </div>
                  <p className="text-sm text-gray-400">
                    You'll be able to attempt the contest once it starts
                  </p>
                </div>
              ) : contestStatus === "ongoing" ? (
                <div className="bg-green-600/10 border border-green-600/30 rounded-2xl p-8">
                  <FaGamepad className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Contest is Live!
                  </h3>
                  <p className="text-gray-400 mb-6">
                    The contest is currently running. Time remaining:
                    <span className="text-green-400 font-mono font-bold ml-2">
                      {formatTimeLeft(timeLeft)}
                    </span>
                  </p>
                  <button
                    onClick={handleAttemptContest}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xl font-bold px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-4 mx-auto"
                  >
                    <FaPlay className="w-6 h-6" />
                    Attempt Contest
                  </button>
                  <p className="text-sm text-gray-400 mt-4">
                    Click to start solving problems
                  </p>
                </div>
              ) : (
                <div className="bg-gray-600/10 border border-gray-600/30 rounded-2xl p-8">
                  <FaCheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Contest Ended
                  </h3>
                  <p className="text-gray-400 mb-6">
                    This contest has finished. Check the leaderboard to see
                    results!
                  </p>
                  <button
                    onClick={() =>
                      navigate(`/contest/${contestId}/leaderboard`)
                    }
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-colors"
                  >
                    View Results
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewContest;
