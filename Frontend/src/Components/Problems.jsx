import { useState } from "react";
import { useProblems } from "../store/ProblemsContext";

const Problems=()=>{
  const { problems } = useProblems();
  
  const difficultyColors = {
    easy: "text-green-400 border-green-400",
    medium: "text-yellow-400 border-yellow-400",
    hard: "text-red-400 border-red-400",
  };
  const [sortBy, setSortBy] = useState("name");

  const sortedProblems = [...problems].sort((a, b) => {
    console.log("Problems in sort fun", problems);
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "difficulty") return a.difficulty.localeCompare(b.difficulty);
  
    return 0;
  });

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-100">Problems</h2>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-gray-200 focus:outline-none"
          >
            <option value="name">Name</option>
            <option value="difficulty">Difficulty</option>
          
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 ">
        {sortedProblems.map((problem) => (
          <div
            key={problem._id}
            className="glass-card flex flex-col md:flex-row md:items-center justify-between p-6 border border-gray-700 hover:border-blue-400 transition hover:scale-105 transition"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-semibold text-gray-100">
                  {problem.title}
                </span>
                <span
                  className={`border px-2 py-0.5 rounded-full text-xs font-bold ${
                    difficultyColors[problem.difficulty] ||
                    "text-gray-400 border-gray-400"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-1">
                {problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-900 text-gray-300 px-2 py-0.6 rounded text-xs border border-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 md:mt-0">
              
              <button className="bg-blue-200 text-black font-bold px-4 py-1 rounded hover:scale-105 transition">
                Solve
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Problems;