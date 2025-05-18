import { useState } from "react";

const TABS = ["Description", "Reviews", "Discussions", "Hints"];

const SolveProblem = () => {
  const [activeTab, setActiveTab] = useState("Description");
  const [code, setCode] = useState("// Write your code here...");
  const [output, setOutput] = useState("");
  const [testcase, setTestcase] = useState("");
  // Placeholder problem data
  const problem = {
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  };

  const handleRun = () => {
    setOutput("Output will be shown here (mock).");
  };

  const handleSubmit = () => {
    setOutput("Submission result will be shown here (mock).");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white flex flex-col md:flex-row gap-6 px-4 py-8 md:px-12">
      {/* Left: Problem Details */}
      <div className="md:w-2/5 w-full bg-gray-900/80 rounded-2xl shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-yellow-400 mb-2">
          {problem.title}
        </h2>
        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-gray-700">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`px-3 py-1 text-sm font-semibold rounded-t ${
                activeTab === tab
                  ? "bg-gray-800 text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "Description" && (
            <div>
              <p className="text-gray-200">{problem.description}</p>
            </div>
          )}
          {activeTab === "Reviews" && (
            <div className="text-gray-400 italic">No reviews yet.</div>
          )}
          {activeTab === "Discussions" && (
            <div className="text-gray-400 italic">No discussions yet.</div>
          )}
          {activeTab === "Hints" && (
            <div className="text-gray-400 italic">No hints available.</div>
          )}
        </div>
      </div>

      {/* Right: Code Editor & Actions */}
      <div className="md:w-3/5 w-full flex flex-col gap-4">
        {/* Code Editor Card */}
        <div className="bg-gray-900/80 rounded-2xl shadow-lg p-4 flex flex-col">
          <label className="text-lg font-semibold text-blue-300 mb-2">
            Code Editor
          </label>
          <textarea
            className="w-full h-56 md:h-72 bg-gray-800 text-gray-100 rounded-lg p-3 font-mono text-sm resize-y border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="flex gap-4 mt-4">
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold px-6 py-2 rounded-lg shadow hover:scale-105 transition"
              onClick={handleRun}
            >
              Run
            </button>
            <button
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-6 py-2 rounded-lg shadow hover:scale-105 transition"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
        {/* Output Area */}
        <div className="bg-gray-900/80 rounded-2xl shadow-lg p-4">
          <label className="text-lg font-semibold text-green-300 mb-2">
            Output
          </label>
          <div className="bg-gray-800 text-gray-100 rounded-lg p-3 min-h-[48px] font-mono text-sm">
            {output || "Output will appear here."}
          </div>
        </div>
        {/* Testcase Area */}
        <div className="bg-gray-900/80 rounded-2xl shadow-lg p-4">
          <label className="text-lg font-semibold text-pink-300 mb-2">
            Custom Testcase
          </label>
          <textarea
            className="w-full h-16 bg-gray-800 text-gray-100 rounded-lg p-3 font-mono text-sm resize-y border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={testcase}
            onChange={(e) => setTestcase(e.target.value)}
            placeholder="Enter custom input here..."
          />
        </div>
      </div>
    </div>
  );
};

export default SolveProblem;
