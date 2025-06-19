import {
  FaRegClock,
  FaCheckCircle,
  FaPlayCircle,
  FaHistory,
} from "react-icons/fa";
import { useEffect,useState } from "react";

const getStatus = (contest) => {
  const now = new Date();
  const start = new Date(contest.startTime);
  const end = new Date(contest.endTime);
  if (now < start) return "future";
  if (now >= start && now <= end) return "ongoing";
  if (now > end) return "past";
  return "unknown";
};

const ContestCard = ({ contest, onRegister, onUnregister }) => {
  const [status, setStatus] = useState(getStatus(contest));

  let statusColor =
    status === "future"
      ? "bg-blue-800 text-blue-200 border-blue-400"
      : status === "ongoing"
      ? "bg-green-800 text-green-300 border-green-400"
      : "bg-gray-800 text-gray-300 border-gray-400";


    useEffect(()=>{
      const fetchContestData=async()=>{
        try{
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/contest/getContestById/${
              contest._id
            }`
          );
          const data = await response.json();
          if (response.ok) {
            setStatus(getStatus(data.contest));
          }
        } catch (error) {
          console.error("Error fetching contest data:", error);
        }
      };

      fetchContestData();

      const interval = setInterval(fetchContestData, 30000);
      return () => clearInterval(interval);
    }, [contest._id]);
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 flex flex-col gap-2 hover:scale-[1.02] hover:shadow-xl transition-all duration-200">
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
      {/* Register/Unregister for future contests */}
      {status === "future" && (
        <div className="mt-3">
          {contest.registered ? (
            <button
              className="px-5 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold rounded-full shadow hover:scale-105 hover:bg-red-600 transition"
              onClick={() => onUnregister(contest._id)}
            >
              Unregister
            </button>
          ) : (
            <button
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-full shadow hover:scale-105 hover:bg-cyan-600 transition"
              onClick={() => onRegister(contest._id)}
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
