import { useState } from "react";

const Problems=()=>{
  const sampleProblems = [
    {
      id: 1,
      name: "Two Sum",
      difficulty: "Easy",
      rating: 4.2,
      tags: ["Array", "Hash Table"],
    },
    {
      id: 2,
      name: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      rating: 4.8,
      tags: ["Array", "Binary Search", "Divide and Conquer"],
    },
    {
      id: 3,
      name: "Valid Parentheses",
      difficulty: "Easy",
      rating: 4.0,
      tags: ["Stack", "String"],
    },
    {
      id: 4,
      name: "Word Ladder",
      difficulty: "Medium",
      rating: 4.5,
      tags: ["BFS", "Graph"],
    },
  ];
  const difficultyColors = {
    Easy: "text-green-400 border-green-400",
    Medium: "text-yellow-400 border-yellow-400",
    Hard: "text-red-400 border-red-400",
  };

  const [sortBy, setSortBy] = useState("name");
    const [problems, setProblems] = useState(sampleProblems);
  
    const sortedProblems = [...problems].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "difficulty")
        return a.difficulty.localeCompare(b.difficulty);
      if (sortBy === "rating") return b.rating - a.rating;
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
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 ">
        {sortedProblems.map((problem) => (
          <div
            key={problem.id}
            className="glass-card flex flex-col md:flex-row md:items-center justify-between p-6 border border-gray-700 hover:border-blue-400 transition hover:scale-105 transition"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-semibold text-gray-100">
                  {problem.name}
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
                    className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs border border-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 md:mt-0">
              <span className="text-black font-bold">★ {problem.rating}</span>
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