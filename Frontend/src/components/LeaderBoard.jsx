import { useLeaderBoard } from "../store/LeaderBoardContext";
import { useState,useEffect } from "react";
import { FaAngleDoubleDown } from "react-icons/fa";
import { FaAngleDoubleUp } from "react-icons/fa";
const Leaderboard = () => {
  const { leaderBoardData } = useLeaderBoard();

  const [splitLeaderBoardData, setSplitLeaderBoardData] = useState(leaderBoardData?.length>6?leaderBoardData.slice(0,6):leaderBoardData);

  const showView=leaderBoardData.length>6;
  const [viewMore, setViewMore] = useState(false);

  
  useEffect(()=>{
    if(leaderBoardData.length>6){
      if(viewMore){
        setSplitLeaderBoardData(leaderBoardData);
      }
      else{
        setSplitLeaderBoardData(leaderBoardData.slice(0,6));
      }
    }
  }, [viewMore, leaderBoardData]);

  const handleViewMore=()=>{
    setViewMore(!viewMore);
  }
  
  return (
    <>
      <div className="text-center text-gray-400 mt-12 bg-gradient-to-br from-[#23293a]/60 to-[#1a2233]/80 rounded-xl shadow-lg p-8 border border-[#2a3447] backdrop-blur-md glass-card md:w-1/2 sm:w-1/2 w-full mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-400">
          Leaderboard
        </h2>
        {leaderBoardData?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#23293a]/60 rounded-xl shadow border border-[#2a3447] text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-yellow-400 font-bold">#</th>
                  <th className="px-4 py-2 text-white font-semibold">Name</th>
                  <th className="px-4 py-2 text-white font-semibold">Solved</th>
                  <th className="px-4 py-2 text-white font-semibold">
                    Accuracy
                  </th>

                  <th className="px-4 py-2 text-white font-semibold">Easy</th>
                  <th className="px-4 py-2 text-white font-semibold">Medium</th>
                  <th className="px-4 py-2 text-white font-semibold">Hard</th>
                </tr>
              </thead>
              <tbody>
                {splitLeaderBoardData.map((user, idx) => (
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
                      {idx + 1}
                    </td>
                    <td className="px-4 py-2 font-medium text-white">
                      {user.userName}
                    </td>
                    <td className="px-4 py-2 text-gray-200">
                      {user.noOfProblemsSolved}
                    </td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 rounded bg-gray-800 text-gray-100 font-mono">
                        {user.accuracy}%
                      </span>
                    </td>

                    <td className="px-4 py-2 text-gray-300">{user.easy}</td>
                    <td className="px-4 py-2 text-gray-300">{user.medium}</td>
                    <td className="px-4 py-2 text-gray-300">{user.hard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {showView && (
              <div className="viewMore" onClick={handleViewMore}>
                {viewMore ?  <span className="flex items-center justify-center mt-4 text-grey-200 cursor-pointer hover:text-grey-900">
                  View Less <FaAngleDoubleUp className="ml-2" />
                </span> :  <span className="flex items-center justify-center mt-4 text-grey-200 cursor-pointer hover:text-grey-900">
                  View More <FaAngleDoubleDown className="ml-2" />
                  </span>}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400 mt-4">No leaderboard data available.</p>
        )}
      </div>
    </>
  );
};

export default Leaderboard;
