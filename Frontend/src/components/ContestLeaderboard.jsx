import  { useState, useEffect } from "react";
import { useSocketContext } from "../store/SocketContext";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { FaArrowLeft } from "react-icons/fa";
const ContestLeaderboard=()=>{

  const { socket ,isConnected, leaderBoardData, joinContestLeaderboard, leaveContestLeaderboard,getContestStatus } = useSocketContext();
  
  const [loading,setLoading] = useState(true);
  const {contestId}=useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(()=>{
    if(socket && isConnected){
      
      joinContestLeaderboard(contestId, user?._id);
      
      getContestStatus(contestId);
      setLoading(false);
    }
    return ()=>{
      if(contestId && user?._id){
        leaveContestLeaderboard(contestId);
        
      }
    }
  }, [socket, isConnected, contestId, user?._id]);

  return (
    <>
    
      <div className="text-center text-gray-400 bg-gradient-to-br from-[#23293a]/60 to-[#1a2233]/80 rounded-xl shadow-lg p-8 border border-[#2a3447] backdrop-blur-md glass-card md:w-1/2 sm:w-1/2 w-full mx-auto mb-8 ">
        {/* Back Button */}
        <div className="flex justify-start mb-4">
          <button
            onClick={() => navigate(`/contest/${contestId}`)}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-200 text-sm font-medium"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Contest
          </button>
        </div>
        
        <h2 className="text-2xl font-semibold mb-4 text-yellow-400 ">
          Contest Leaderboard
        </h2>
        {leaderBoardData?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#23293a]/60 rounded-xl shadow border border-[#2a3447] text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-yellow-400 font-bold">#</th>
                  <th className="px-4 py-2 text-white font-semibold">Name</th>
                  <th className="px-4 py-2 text-white font-semibold">Solved</th>
                  <th className="px-4 py-2 text-white font-semibold">Total Points</th>
                  <th className="px-4 py-2 text-white font-semibold">Submissions</th>
                  <th className="px-4 py-2 text-white font-semibold">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {leaderBoardData.map((user, idx) => (
                  <tr
                    key={user.userId}
                    className={`${
                      idx === 0
                        ? "bg-yellow-900/20"
                        : idx % 2 === 0
                        ? "bg-[#23293a]/30"
                        : "bg-[#1a2233]/30"
                    } hover:bg-blue-900/20 transition`}
                  >
                    <td className="px-4 py-2 font-bold text-yellow-400">
                      {idx === 0 ? '🏆' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                    </td>
                    <td className="px-4 py-2 font-medium text-white">
                      {user.userName}
                      {user.userId === user?._id && (
                        <span className="ml-2 text-xs bg-cyan-600/20 text-cyan-400 px-2 py-1 rounded">You</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-gray-200">
                      <span className="font-semibold text-green-400">
                        {user.noOfProblemsSolved}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">
                        / {user.totalContestProblems || 0}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 rounded bg-blue-800/30 text-blue-200 font-mono font-bold">
                        {user.totalPoints || 0}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-300">
                      {user.totalSubmissions || 0}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded font-mono text-sm ${
                        user.accuracy >= 80 ? 'bg-green-800/30 text-green-200' :
                        user.accuracy >= 60 ? 'bg-yellow-800/30 text-yellow-200' :
                        'bg-red-800/30 text-red-200'
                      }`}>
                        {user.accuracy ? user.accuracy.toFixed(1) : '0.0'}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 mt-4">No leaderboard data available.</p>
        )}
      </div>
    </>
  );
}


export default ContestLeaderboard;