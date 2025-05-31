import { useAuth } from "../store/authContext";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useSolutions } from "../store/SolutionContext";
import { useEffect } from "react";
import { useProblems } from "../store/ProblemsContext";

const Dashboard = () => {
  const { user } = useAuth() || {};
  const { solutions } = useSolutions();
  const { problems } = useProblems();
  const dateCountMap = {};
  const dateMap = Array.isArray(solutions)
    ? solutions.map((item) => {
        const date = new Date(item.submittedAt);
        dateCountMap[date.toISOString().split("T")[0]] = (dateCountMap[date.toISOString().split("T")[0]] || 0) + 1;
      })

    : [];
    
    const dateObj = Object.entries(dateCountMap).map(([date, count]) => ({
      date,
      count,
    }));

    const tagCountMap = {};

    if (Array.isArray(solutions)) {
      solutions?.forEach((item) => {

        if(item.status==="Accepted" ){
          const problem=problems?.find((p)=> p._id===item.problemId);
          if(!problem || !problem.tags) return;
          problem.tags.forEach((tag)=>{
            tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
          });
        }
      });
    }

    const tagMap = Object.entries(tagCountMap).map(([tag, count]) => ({
      tag,
      count,
    }));

    console.log("Tag Map:", tagMap);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1020] to-[#1e293b] px-4 sm:px-8 py-12 text-white font-sans">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-800 mb-10 tracking-wide">
        Your Coding Journey
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-[#1a2233] rounded-xl shadow-lg p-6 border border-[#2a3447] hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-yellow-500 to-red-800 text-3xl sm:text-4xl text-white flex items-center justify-center mb-4 ring-2 ring-blue-400/30">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              {user?.name || "User Name"}
            </h2>
            <p className="text-sm text-gray-300 mt-1">
              {user?.email || "user@email.com"}
            </p>
            <span className="mt-4 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/30">
              {user?.type || "Coder"}
            </span>
            <div className="mt-4 text-sm text-gray-400">
              <p>
                Problems Solved: <span className="text-blue-300">42</span>
              </p>
              <p>
                Rank: <span className="text-blue-300">Top 10%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tags Solved Card */}
        <div className="lg:col-span-3 bg-[#1a2233] rounded-xl shadow-lg p-6 border border-[#2a3447] hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-white mb-4">
            Problem Tags Solved
          </h2>
          <div className="flex flex-wrap gap-3">
            {tagMap?.map((t) => (
              <span
                key={t.tag}
                className="bg-[#2a3447] text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm hover:bg-blue-500/20 transition-colors duration-200"
              >
                {t.tag} <span className="text-blue-300">({t.count})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Submission History Card */}
        <div className="lg:col-span-2 bg-[#1a2233] rounded-xl shadow-lg p-6 border border-[#2a3447] hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-white mb-4">
            Recent Submissions
          </h2>
          <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
            {solutions?.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b border-[#2a3447] pb-3 last:border-b-0"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {item.titleName}
                  </p>
                  <p
                    className={`text-xs font-semibold ${
                      item.status === "Accepted"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {item.status}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(item.submittedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap Card */}
        <div className="lg:col-span-2 bg-[#1a2233] rounded-xl shadow-lg p-6 border border-[#2a3447] hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-semibold text-white mb-4">
            Daily Activity Heatmap
          </h2>
          <div className="overflow-x-auto">
            <CalendarHeatmap
              startDate={new Date("2025-01-01")}
              endDate={new Date()}
              values={dateObj}
              showMonthLabels={true}
              horizontal={true}
              classForValue={(value) => {
                if (!value) return "color-empty";
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

      {/* Custom Styles */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #1a2233;
            border-radius: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #2a3447;
            border-radius: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #3b4a66;
          }
          .color-empty { fill: #1a2233; }
          .color-scale-1 { fill:rgb(77, 255, 148); } /* softer green */
          .color-scale-2 { fill:rgb(87, 203, 111); } /* softer cyan */
          .color-scale-3 { fill:rgb(38, 253, 38); } /* softer blue */
          .color-scale-4 { fill:rgb(0, 172, 20); } /* softer purple */
          .react-calendar-heatmap {
            width: 100%;
            max-width: 600px; /* Adjusted for balanced size */
            padding: 10px;
            background: #141b2d; /* Subtle background for contrast */
            border-radius: 8px;
          }
          .react-calendar-heatmap text {
            fill: #d1d5db;
            font-size: 11px; /* Balanced text size */
            font-weight: 500;
          }
          .react-calendar-heatmap .react-calendar-heatmap-weekday-labels {
            margin-top: 10px;
          }
          .react-calendar-heatmap rect {
            rx: 3px; /* Smaller radius for cleaner look */
            ry: 3px;
            width: 12px; /* Slightly smaller squares for better fit */
            height: 12px;
            margin: 1.5px; /* Tighter spacing */
          }
          .react-calendar-heatmap .react-calendar-heatmap-month-labels text {
            text-transform: uppercase;
            font-weight: 600;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
