import {
  FaRegClock,
  FaCheckCircle,
  FaPlayCircle,
  FaHistory,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import  {useAuth}  from "../store/AuthContext";

const getStatus = (contest) => {
  const now = new Date();
  const start = new Date(contest.startTime);
  const end = new Date(contest.endTime);
  if (now < start) return "future";
  if (now >= start && now <= end) return "ongoing";
  if (now > end) return "past";
  return "unknown";
};  

  

const ContestCard = ({ contest, onRegister, onUnregister, userId }) => {
  const [status, setStatus] = useState(getStatus(contest));

  // ✅ Safe initialization with fallback
  const [isRegistered, setIsRegistered] = useState(
    contest.registeredUsers?.includes(userId) || false
  );
  

  
const { token } = useAuth();
  let statusColor =
    status === "future"
      ? "bg-blue-800 text-blue-200 border-blue-400"
      : status === "ongoing"
      ? "bg-green-800 text-green-300 border-green-400"
      : "bg-gray-800 text-gray-300 border-gray-400";

  const navigate = useNavigate();

  const handleContestClick = () => {
    if (isRegistered && status === "ongoing") {
      console.log("Contest is ongoing, redirecting to contest page...");
      navigate(`/contest/${contest._id}`);
    }
  };

  const handleRegisterClick = (e) => {
    e.stopPropagation();
    onRegister(contest._id);
    setIsRegistered(true); // ✅ Update local state immediately for UI feedback
  };

  const handleUnregisterClick = (e) => {
    e.stopPropagation();
    onUnregister(contest._id);
    setIsRegistered(false); // ✅ Update local state immediately for UI feedback
  };

  const handleParticipateClick = (e) => {
    e.stopPropagation();
    handleContestClick();
  };

  // ✅ Fixed useEffect with proper dependencies
  useEffect(() => {
    const fetchContestData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/contest/getContestById/${
            contest._id
          }`,
          {
            headers:{
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            }
          }
        );
        const data = await response.json();
        if (response.ok) {
          setStatus(getStatus(data.contest));
          // ✅ Safe check for registeredUsers
          if (userId && data.contest.registeredUsers) {
            setIsRegistered(data.contest.registeredUsers.includes(userId));
          }
        }
      } catch (error) {
        console.error("Error fetching contest data:", error);
      }
    };

    fetchContestData();
    const interval = setInterval(fetchContestData, 30000);
    return () => clearInterval(interval);
  }, [contest._id, userId]); // ✅ Added proper dependencies

  // ✅ Update local state when props change
  useEffect(() => {
    if (contest.registeredUsers && userId) {
      setIsRegistered(contest.registeredUsers.includes(userId));
    }
  }, [contest.registeredUsers, userId]);

  return (
    <div
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 flex flex-col gap-2 hover:scale-[1.02] hover:shadow-xl transition-all duration-200 cursor-pointer"
      onClick={handleContestClick}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">{contest.title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}
        >
          {status === "future"
            ? "Upcoming"
            : status === "ongoing"
            ? "Ongoing"
            : "Past"}
        </span>
      </div>

      <p className="text-gray-200 text-sm mb-2">{contest.description}</p>

      <div className="flex gap-4 text-xs text-gray-300 font-mono">
        <span>
          <FaRegClock className="inline mr-1 text-yellow-300" />
          {new Date(contest.startTime).toLocaleString()} -{" "}
          {new Date(contest.endTime).toLocaleTimeString()}
        </span>
        {contest.attempted && (
          <span className="flex items-center gap-1 text-green-300">
            <FaCheckCircle /> Attempted
          </span>
        )}
      </div>

      {isRegistered && status === "ongoing" && (
        <div className="flex items-center gap-2 mt-3">
          <button
            className="px-5 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold rounded-full shadow hover:scale-105 hover:bg-red-600 transition"
            onClick={handleParticipateClick}
          >
            Participate in Contest
          </button>
        </div>
      )}

      {status === "future" && (
        <div className="mt-3">
          {isRegistered ? (
            <button
              className="px-5 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold rounded-full shadow hover:scale-105 hover:bg-red-600 transition"
              onClick={handleUnregisterClick} // ✅ Fixed - pass event, not ID
            >
              Unregister
            </button>
          ) : (
            <button
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-full shadow hover:scale-105 hover:bg-cyan-600 transition"
              onClick={handleRegisterClick} // ✅ Fixed - pass event, not ID
            >
              Register
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ContestCard;
