import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useAuth } from "../store/AuthContext";
import { useSolutions } from "../store/SolutionContext";
import { useProblems } from "../store/ProblemsContext";
import { useLeaderBoard } from "../store/LeaderBoardContext";
import Leaderboard from "./LeaderBoard";

const Dashboard = () => {
  const { user } = useAuth() || {};
  const { solutions } = useSolutions();
  const { problems } = useProblems();
  const { leaderBoardData } = useLeaderBoard();

  const dateCountMap = {};
  Array.isArray(solutions) &&
    solutions.forEach((item) => {
      const date = new Date(item.submittedAt);
      dateCountMap[date.toISOString().split("T")[0]] =
        (dateCountMap[date.toISOString().split("T")[0]] || 0) + 1;
    });

  const dateObj = Object.entries(dateCountMap).map(([date, count]) => ({
    date,
    count,
  }));

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

  const noOfProblemsSolved =
    leaderBoardData?.find((u) => u.userId === user?._id)?.noOfProblemsSolved ||
    0;

  let count = 0;
  for (let i = 0; i < leaderBoardData?.length; i++) {
    if (leaderBoardData[i].userId === user?._id) {
      count = i + 1;
      break;
    }
  }
  const rank = count > 0 ? count : "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4 sm:px-10 py-10 text-white font-sans">
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-12 tracking-tight bg-gradient-to-r from-teal-400 via-blue-500 to-gray-700 bg-clip-text text-transparent drop-shadow-md">
        Your Coding Journey
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="flex flex-col items-center bg-[#12172f] rounded-3xl shadow-xl p-8 border border-[#1f2542] hover:border-cyan-400 transition duration-300">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-blue-500 text-5xl flex items-center justify-center mb-6 ring-4 ring-blue-500/30 text-white font-semibold shadow-lg">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <h2 className="text-2xl font-semibold text-white mb-1">
            {user?.name || "User Name"}
          </h2>
          <p className="text-sm text-gray-300">
            {user?.email || "user@email.com"}
          </p>
          <span className="mt-4 px-4 py-1 rounded-full bg-blue-600/20 text-blue-300 text-xs font-medium border border-blue-500/30 uppercase tracking-wider">
            {user?.type || "Coder"}
          </span>
          <div className="w-full mt-4 flex flex-col items-center gap-2">
            <p className="text-lg text-cyan-300 font-medium">
              Solved:{" "}
              <span className="font-bold text-white">{noOfProblemsSolved}</span>
            </p>
            <p className="text-lg text-purple-300 font-medium">
              Rank: <span className="font-bold text-white">{rank}</span>
            </p>
          </div>
        </div>

        {/* Recent Submissions Card */}
        <div className="xl:col-span-2 bg-[#12172f] rounded-3xl shadow-xl p-8 border border-[#1f2542] hover:border-purple-400 transition duration-300">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Recent Submissions
          </h2>
          <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
            {solutions?.length > 0 ? (
              solutions
                .slice()
                .reverse()
                .slice(0, 10)
                .map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center bg-[#1a1e35] rounded-xl px-4 py-3 border border-[#2d345a] hover:border-green-400 transition"
                  >
                    <div>
                      <p className="text-base font-semibold text-white">
                        {item.titleName}
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          item.status === "Accepted"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {item.status}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 font-mono">
                      {new Date(item.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
            ) : (
              <div className="text-gray-400 italic">No submissions yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Tags + Heatmap */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        {/* Tags Solved */}
        <div className="bg-[#12172f] rounded-3xl shadow-xl p-8 border border-[#1f2542] hover:border-pink-400 transition">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center justify-between">
            Problem Tags Solved
            <span className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full font-semibold">
              {tagMap.length} tags
            </span>
          </h2>
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

        {/* Heatmap */}
        <div className="bg-[#12172f] rounded-3xl shadow-xl p-8 border border-[#1f2542] hover:border-cyan-400 transition">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Daily Activity Heatmap
          </h2>
          <div className="overflow-x-auto custom-scrollbar">
            <CalendarHeatmap
              startDate={new Date("2025-01-01")}
              endDate={new Date()}
              values={dateObj}
              showMonthLabels={true}
              horizontal={true}
              classForValue={(value) => {
                if (!value) return "color-scale-0";
                return value.count >= 5
                  ? "color-scale-4"
                  : value.count >= 3
                  ? "color-scale-3"
                  : value.count >= 2
                  ? "color-scale-2"
                  : "color-scale-1";
              }}
            />
          </div>
        </div>
      </div>

      <style>
        {`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b4a66;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1e35;
        }
        .color-scale-0 { fill: #1a1e35; }
        .color-scale-1 { fill:rgb(122, 252, 167); }
        .color-scale-2 { fill:rgb(69, 253, 124); }
        .color-scale-3 { fill:rgb(23, 247, 102); }
        .color-scale-4 { fill:rgb(0, 110, 28); }
        .react-calendar-heatmap {
          width: 100%;
          max-width: 600px;
          padding: 10px;
          background: #0f172a;
          border-radius: 8px;
        }
        .react-calendar-heatmap text {
          fill: #94a3b8;
          font-size: 9px;
        }
        .react-calendar-heatmap rect {
          rx: 2px;
          ry: 2px;
          stroke: #0f172a;
        }
      `}
      </style>

      <Leaderboard />

      <div className="mt-10 text-center text-sm text-gray-500">
        Made with ❤️ by{" "}
        <a
          href="https://github.com/niranjan0524"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:underline"
        >
          Niranjan
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
