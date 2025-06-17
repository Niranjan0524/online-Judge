import { useAuth } from "../store/AuthContext";
import { useSolutions } from "../store/SolutionContext";
import { useProblems } from "../store/ProblemsContext";
import { useLeaderBoard } from "../store/LeaderBoardContext";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaMedal, FaEnvelope, FaUserCircle } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";

const Profile = () => {
  const { user } = useAuth() || {};
  const { solutions } = useSolutions();
  const { problems } = useProblems();
  const { leaderBoardData } = useLeaderBoard();
  const navigate = useNavigate();

  // Calculate stats
  const submissions = solutions?.length || 0;
  const accepted =
    solutions?.filter((s) => s.status === "Accepted").length || 0;
  const attempted =
    [...new Set(solutions?.map((s) => s.problemId))].length || 0;
  const noOfProblemsSolved =
    leaderBoardData?.find((u) => u.userId === user?._id)?.noOfProblemsSolved ||
    0;

  let rank = "N/A";
  for (let i = 0; i < leaderBoardData?.length; i++) {
    if (leaderBoardData[i].userId === user?._id) {
      rank = i + 1;
      break;
    }
  }

  // Tag stats
  const tagCountMap = {};
  if (Array.isArray(solutions)) {
    solutions?.forEach((item) => {
      if (item.status === "Accepted") {
        const problem = problems?.find((p) => p._id === item.problemId);
        if (!problem || !problem.tags) return;
        problem.tags.forEach((tag) => {
          tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
        });
      }
    });
  }
  const tagMap = Object.entries(tagCountMap).map(([tag, count]) => ({
    tag,
    count,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4 sm:px-10 py-10 text-white font-sans flex flex-col items-center">
      <div className="w-full max-w-3xl bg-[#12172f] rounded-3xl shadow-2xl p-8 border border-[#1f2542] hover:border-cyan-400 transition duration-300 flex flex-col items-center">
        {/* Avatar & Edit */}
        <div className="relative flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-blue-500 text-6xl flex items-center justify-center mb-4 ring-4 ring-blue-500/30 text-white font-semibold shadow-lg">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <FaUserCircle className="w-28 h-28" />
            )}
          </div>
          {/* <button className="absolute top-2 right-2 bg-blue-700/80 hover:bg-blue-800 text-white rounded-full p-2 shadow">
            <FaUserEdit size={20} />
          </button> */}
        </div>
        {/* User Info */}
        <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">
          {user?.name || "User Name"}
        </h2>
        <div className="flex items-center gap-2 text-gray-300 mb-2">
          <FaEnvelope className="text-blue-400" />
          <span className="text-base">{user?.email || "user@email.com"}</span>
        </div>
        <span className="mt-2 px-4 py-1 rounded-full bg-blue-600/20 text-blue-300 text-xs font-medium border border-blue-500/30 uppercase tracking-wider">
          {user?.type || "Coder"}
        </span>

        {/* Stats */}
        <div className="w-full mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-[#1a1e35] rounded-xl p-4 border border-[#2d345a]">
            <div className="text-lg font-bold text-cyan-300">
              {noOfProblemsSolved}
            </div>
            <div className="text-xs text-gray-400 mt-1">Problems Solved</div>
          </div>
          <div className="bg-[#1a1e35] rounded-xl p-4 border border-[#2d345a]">
            <div className="text-lg font-bold text-yellow-300">
              {submissions}
            </div>
            <div className="text-xs text-gray-400 mt-1">Total Submissions</div>
          </div>
          <div className="bg-[#1a1e35] rounded-xl p-4 border border-[#2d345a]">
            <div className="text-lg font-bold text-green-400">{accepted}</div>
            <div className="text-xs text-gray-400 mt-1">Accepted</div>
          </div>
          <div className="bg-[#1a1e35] rounded-xl p-4 border border-[#2d345a]">
            <div className="text-lg font-bold text-purple-300">{rank}</div>
            <div className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
              <MdLeaderboard className="inline-block" /> Rank
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="w-full mt-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FaMedal className="text-yellow-400" /> Tags Mastered
          </h3>
          <div className="flex flex-wrap gap-3">
            {tagMap.length > 0 ? (
              tagMap.map((t) => (
                <span
                  key={t.tag}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow hover:scale-105 transition-transform border border-transparent hover:border-white"
                >
                  {t.tag}{" "}
                  <span className="bg-white/80 text-blue-900 rounded px-2 py-0.5 ml-1 font-bold">
                    {t.count}
                  </span>
                </span>
              ))
            ) : (
              <span className="text-gray-400 italic">No tags solved yet.</span>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="w-full mt-10 flex flex-col items-center">
          <div className="text-lg font-medium text-gray-200 mb-2">
            Want the <span className="text-cyan-400 font-bold">analysis</span>{" "}
            of your journey?
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition mt-2 text-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
