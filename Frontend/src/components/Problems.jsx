import { useState } from "react";
import { useProblems } from "../store/ProblemsContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

const Problems=()=>{
  const { problems } = useProblems();
  const { user } = useAuth();
  const difficultyColors = {
    easy: "text-green-400 border-green-400",
    medium: "text-yellow-400 border-yellow-400",
    hard: "text-red-400 border-red-400",
  };
  const [sortBy, setSortBy] = useState("name");

  const sortedProblems = [...problems].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "difficulty") return a.difficulty.localeCompare(b.difficulty);

    return 0;
  });

  const navigate=useNavigate();

  const handleProblemClick=(problemId)=>{
    console.log("Problem clicked", problemId);
    navigate(`/problem/solve/${problemId}`);
  }

  const handleAddProblem=()=>{
    console.log("Add Problem clicked");
    navigate("/problem/add");
  }
  const handleEditProblem=()=>{
    console.log("Edit Problem clicked");
  }
  return (
    <>
      <div className="flex md:flex-row md:items-center md:justify-between mb-6 gap-4 ">
        {user && user.type === "admin" && (
          <h2 className="text-2xl font-bold text-gray-100">Your Problems</h2>
        )}
        {user && user.type === "user" && (
          <h2 className="text-2xl font-bold text-gray-100"> Problems</h2>
        )}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          {user && user.type === "admin" && (
            <div>
              <button
                onClick={handleAddProblem}
                className="bg-red-400 text-black font-bold px-4 py-1 rounded hover:scale-105 transition"
              >
                Add Problem
              </button>
            </div>
          )}
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
      </div>
      <div className="grid grid-cols-1 gap-6 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-800">
        {sortedProblems.map((problem) => (
          <div
            key={problem._id}
            className="glass-card flex flex-col md:flex-row md:items-center justify-between p-3 border border-gray-700 hover:border-blue-400 transition max-w-4xl "
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
              {user?.type === "user" && (
                <button
                  className="bg-blue-200 text-black font-bold px-4 py-1 rounded hover:scale-105 transition"
                  onClick={() => handleProblemClick(problem._id)}
                >
                  Solve
                </button>
              )}
              {user?.type === "admin" && (
                <button
                  className="bg-blue-200 text-black font-bold px-4 py-1 rounded hover:scale-105 transition"
                  onClick={handleEditProblem}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Problems;