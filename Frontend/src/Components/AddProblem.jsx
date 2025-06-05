import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddProblem = () => {
  const navigate = useNavigate();
  const tags = [
    "Array",
    "BFS",
    "Design",
    "DFS",
    "Dynamic Programming",
    "Graph",
    "Hash Table",
    "Heap",
    "Linked List",
    "Matrix",
    "Recursion",
    "Sliding Window",
    "Sorting",
    "Topological Sort",
    "Tree",
    "Two Pointers",
    "String",
    "Backtracking",
    "Bit Manipulation",
    "Greedy",
    "Math",
    "Binary Search",
    "Segment Tree",
    "Stack",
    "Queue",
    "Trie",
    "Bitmasking",
    "Union-Find",
    "Game Theory",
    "Combinatorics",
    "Geometry",
    "Probability",
  ];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [difficulty, setDifficulty] = useState("easy");
  // Each test case: { inputs: [{ name: "", value: "" }], output: "" }
  const [testCases, setTestCases] = useState([
    { inputs: [{ name: "", value: "" }], output: "" },
  ]);

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) setSelectedTags([...selectedTags, tag]);
  };

  const handleTagRemove = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleTestCaseInputChange = (tcIdx, inputIdx, field, value) => {
    const updated = [...testCases];
    updated[tcIdx].inputs[inputIdx][field] = value;
    setTestCases(updated);
  };

  const addTestCaseInput = (tcIdx) => {
    const updated = [...testCases];
    updated[tcIdx].inputs.push({ name: "", value: "" });
    setTestCases(updated);
  };

  const removeTestCaseInput = (tcIdx, inputIdx) => {
    const updated = [...testCases];
    if (updated[tcIdx].inputs.length > 1) {
      updated[tcIdx].inputs = updated[tcIdx].inputs.filter(
        (_, i) => i !== inputIdx
      );
      setTestCases(updated);
    }
  };

  const handleTestCaseChange = (tcIdx, field, value) => {
    const updated = [...testCases];
    updated[tcIdx][field] = value;
    setTestCases(updated);
  };

  const addTestCase = () => {
    setTestCases([
      ...testCases,
      { inputs: [{ name: "", value: "" }], output: "" },
    ]);
  };

  const removeTestCase = (idx) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const problemData={
      title,
      description,
      difficulty,
      tags: selectedTags,
    };
    const testCasesData = testCases.map((tc) => ({
      inputs: tc.inputs.map((inp) => ({
        name: inp.name,
        value: inp.value,
      })),
      output: tc.output,
    }));
    
   

    

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/problem/add`, {
      method: "POST",
      body: JSON.stringify({...problemData, testCases: testCasesData}),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Problem added successfully");
          navigate("/");
        } else {
          toast.error("Error adding problem");
        }
      })
      .catch((error) => {
        toast.error("Failed to add problem");
        console.error("Error:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex justify-center items-start py-10 px-2">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-[#181c2a]/90 rounded-3xl shadow-2xl p-8 border-2 border-[#232946] flex flex-col gap-8"
      >
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-red-400 via-gray-400 to-yellow-400 bg-clip-text text-transparent mb-4 tracking-tight">
          Add New Problem
        </h1>

        {/* Title */}
        <div>
          <label className="block text-lg font-semibold text-yellow-300 mb-2">
            Title
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-[#232946] text-white border border-[#334155] focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter problem title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-lg font-semibold text-yellow-300 mb-2">
            Description
          </label>
          <textarea
            className="w-full px-4 py-2 rounded-lg bg-[#232946] text-white border border-[#334155] focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[100px]"
            placeholder="Enter problem description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-lg font-semibold text-yellow-300 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center bg-gradient-to-r from-red-400 via-gray-400 to-yellow-400 text-black px-3 py-1 rounded-full font-semibold text-xs shadow cursor-pointer hover:scale-105 transition"
              >
                {tag}
                <button
                  type="button"
                  className="ml-2 text-black hover:text-red-600"
                  onClick={() => handleTagRemove(tag)}
                  title="Remove tag"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {tags
              .filter((tag) => !selectedTags.includes(tag))
              .map((tag) => (
                <button
                  type="button"
                  key={tag}
                  className="bg-[#232946] border border-yellow-400 text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold hover:bg-yellow-400 hover:text-[#232946] transition"
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </button>
              ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-lg font-semibold text-yellow-300 mb-2">
            Difficulty
          </label>
          <div className="flex gap-4">
            {["easy", "medium", "hard"].map((level) => (
              <label
                key={level}
                className={`px-4 py-2 rounded-lg cursor-pointer font-semibold capitalize transition border-2 ${
                  difficulty === level
                    ? level === "easy"
                      ? "bg-green-500/20 border-green-400 text-green-300"
                      : level === "medium"
                      ? "bg-yellow-500/20 border-yellow-400 text-yellow-300"
                      : "bg-red-500/20 border-red-400 text-red-300"
                    : "bg-[#232946] border-[#334155] text-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={level}
                  checked={difficulty === level}
                  onChange={() => setDifficulty(level)}
                  className="hidden"
                />
                {level}
              </label>
            ))}
          </div>
        </div>

        {/* Test Cases */}
        <div>
          <label className="block text-lg font-semibold text-yellow-300 mb-2">
            Test Cases
          </label>
          <div className="flex flex-col gap-4">
            {testCases.map((tc, tcIdx) => (
              <div
                key={tcIdx}
                className="bg-[#232946] rounded-xl p-4 flex flex-col gap-4 border border-yellow-900 relative"
              >
                <button
                  type="button"
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-lg"
                  onClick={() => removeTestCase(tcIdx)}
                  disabled={testCases.length === 1}
                  title="Remove test case"
                >
                  &times;
                </button>
                <div className="flex flex-col gap-2">
                  <label className="text-yellow-200 text-sm font-semibold mb-1">
                    Inputs
                  </label>
                  {tc.inputs.map((inp, inputIdx) => (
                    <div key={inputIdx} className="flex gap-2 mb-1">
                      <input
                        type="text"
                        className="w-1/3 px-3 py-2 rounded bg-[#181c2a] text-white border border-[#334155] focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Name (e.g. capacity)"
                        value={inp.name}
                        onChange={(e) =>
                          handleTestCaseInputChange(
                            tcIdx,
                            inputIdx,
                            "name",
                            e.target.value
                          )
                        }
                        required
                      />
                      <input
                        type="text"
                        className="w-2/3 px-3 py-2 rounded bg-[#181c2a] text-white border border-[#334155] focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Value (e.g. 2 or [1,2,3])"
                        value={inp.value}
                        onChange={(e) =>
                          handleTestCaseInputChange(
                            tcIdx,
                            inputIdx,
                            "value",
                            e.target.value
                          )
                        }
                        required
                      />
                      <button
                        type="button"
                        className="text-red-400 hover:text-red-600 text-xl px-2"
                        onClick={() => removeTestCaseInput(tcIdx, inputIdx)}
                        disabled={tc.inputs.length === 1}
                        title="Remove input"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-1 bg-gradient-to-r from-red-400 via-gray-400 to-yellow-400 text-black px-3 py-1 rounded font-semibold text-xs shadow hover:scale-105 transition"
                    onClick={() => addTestCaseInput(tcIdx)}
                  >
                    + Add Input
                  </button>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-yellow-200 text-sm font-semibold mb-1">
                    Output
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded bg-[#181c2a] text-white border border-[#334155] focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Expected Output"
                    value={tc.output}
                    onChange={(e) =>
                      handleTestCaseChange(tcIdx, "output", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              className="self-start mt-2 bg-gradient-to-r from-red-400 via-gray-400 to-yellow-400 text-black px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition"
              onClick={addTestCase}
            >
              + Add Test Case
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-red-400 via-gray-400 to-yellow-400 text-black font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition text-lg"
        >
          Add Problem
        </button>
      </form>
    </div>
  );
};

export default AddProblem;
