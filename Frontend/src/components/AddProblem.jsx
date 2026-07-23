import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiTrash2, FiX } from "react-icons/fi";

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

    const problemData = {
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
      body: JSON.stringify({ ...problemData, testCases: testCasesData }),
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

  const difficultyClass = {
    easy: "border-vibe-success bg-vibe-success/10 text-vibe-success",
    medium: "border-vibe-warning bg-vibe-warning/10 text-vibe-warning",
    hard: "border-vibe-danger bg-vibe-danger/10 text-vibe-danger",
  };

  return (
    <div className="min-h-screen bg-vibe-background px-4 py-10 text-vibe-text sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-5xl space-y-6 rounded-2xl border border-vibe-border bg-vibe-surface p-5 shadow-panel sm:p-8"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-vibe-secondary">
            Admin
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-vibe-text">
            Add New Problem
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-vibe-subtext">
            Create the problem statement, classify it with tags, and attach test cases.
          </p>
        </div>

        <section className="grid gap-5 lg:grid-cols-[1fr_0.45fr]">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-vibe-subtext">
                Title
              </label>
              <input
                type="text"
                className="mt-2 w-full rounded-xl border border-vibe-border bg-vibe-background px-4 py-3 text-sm text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/60 focus:border-vibe-primary"
                placeholder="Enter problem title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-vibe-subtext">
                Description
              </label>
              <textarea
                className="mt-2 min-h-40 w-full rounded-xl border border-vibe-border bg-vibe-background px-4 py-3 text-sm leading-6 text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/60 focus:border-vibe-primary"
                placeholder="Enter problem description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <aside className="space-y-5 rounded-2xl border border-vibe-border bg-vibe-background p-4">
            <div>
              <p className="text-sm font-medium text-vibe-subtext">Difficulty</p>
              <div className="mt-3 grid gap-2">
                {["easy", "medium", "hard"].map((level) => (
                  <label
                    key={level}
                    className={`cursor-pointer rounded-xl border px-4 py-3 text-sm font-semibold capitalize ${
                      difficulty === level
                        ? difficultyClass[level]
                        : "border-vibe-border bg-vibe-surface text-vibe-subtext hover:border-vibe-primary/60 hover:text-vibe-text"
                    }`}
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      value={level}
                      checked={difficulty === level}
                      onChange={() => setDifficulty(level)}
                      className="sr-only"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="rounded-2xl border border-vibe-border bg-vibe-background p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-semibold text-vibe-text">
                Tags
              </h2>
              <p className="mt-1 text-sm text-vibe-subtext">
                Pick topics that describe this problem.
              </p>
            </div>
            <span className="rounded-full border border-vibe-border bg-vibe-surface px-3 py-1 text-xs font-semibold text-vibe-subtext">
              {selectedTags.length} selected
            </span>
          </div>

          {selectedTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 rounded-xl border border-vibe-primary/30 bg-vibe-primary/10 px-3 py-2 text-xs font-semibold text-vibe-primary"
                >
                  {tag}
                  <button
                    type="button"
                    className="text-vibe-primary hover:text-vibe-text"
                    onClick={() => handleTagRemove(tag)}
                    title="Remove tag"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex max-h-48 flex-wrap gap-2 overflow-y-auto">
            {tags
              .filter((tag) => !selectedTags.includes(tag))
              .map((tag) => (
                <button
                  type="button"
                  key={tag}
                  className="rounded-xl border border-vibe-border bg-vibe-surface px-3 py-2 text-xs font-semibold text-vibe-subtext hover:border-vibe-primary/60 hover:text-vibe-text"
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </button>
              ))}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-vibe-border bg-vibe-background p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold text-vibe-text">
                Test Cases
              </h2>
              <p className="mt-1 text-sm text-vibe-subtext">
                Define named inputs and expected output.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-vibe-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-vibe-primary/90"
              onClick={addTestCase}
            >
              <FiPlus size={16} />
              Add Test Case
            </button>
          </div>

          {testCases.map((tc, tcIdx) => (
            <article
              key={tcIdx}
              className="rounded-2xl border border-vibe-border bg-vibe-surface p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="font-semibold text-vibe-text">
                  Test Case {tcIdx + 1}
                </h3>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-vibe-danger/30 bg-vibe-danger/10 px-3 py-2 text-sm font-semibold text-vibe-danger hover:bg-vibe-danger/15 disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() => removeTestCase(tcIdx)}
                  disabled={testCases.length === 1}
                >
                  <FiTrash2 size={15} />
                  Remove
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-vibe-subtext">Inputs</p>
                {tc.inputs.map((inp, inputIdx) => (
                  <div
                    key={inputIdx}
                    className="grid gap-2 sm:grid-cols-[0.5fr_1fr_auto]"
                  >
                    <input
                      type="text"
                      className="rounded-xl border border-vibe-border bg-vibe-background px-3 py-2.5 text-sm text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/60 focus:border-vibe-primary"
                      placeholder="Name"
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
                      className="rounded-xl border border-vibe-border bg-vibe-background px-3 py-2.5 text-sm text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/60 focus:border-vibe-primary"
                      placeholder="Value, e.g. 2 or [1,2,3]"
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
                      className="inline-flex items-center justify-center rounded-xl border border-vibe-border bg-vibe-background px-3 py-2.5 text-vibe-subtext hover:border-vibe-danger/60 hover:text-vibe-danger disabled:cursor-not-allowed disabled:opacity-40"
                      onClick={() => removeTestCaseInput(tcIdx, inputIdx)}
                      disabled={tc.inputs.length === 1}
                      title="Remove input"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-vibe-border bg-vibe-background px-3 py-2 text-sm font-semibold text-vibe-text hover:border-vibe-primary/60 hover:bg-vibe-elevated"
                  onClick={() => addTestCaseInput(tcIdx)}
                >
                  <FiPlus size={15} />
                  Add Input
                </button>
              </div>

              <div className="mt-5">
                <label className="block text-sm font-medium text-vibe-subtext">
                  Output
                </label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-xl border border-vibe-border bg-vibe-background px-3 py-2.5 text-sm text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/60 focus:border-vibe-primary"
                  placeholder="Expected Output"
                  value={tc.output}
                  onChange={(e) =>
                    handleTestCaseChange(tcIdx, "output", e.target.value)
                  }
                  required
                />
              </div>
            </article>
          ))}
        </section>

        <button
          type="submit"
          className="w-full rounded-xl bg-vibe-primary px-5 py-3 text-sm font-semibold text-white shadow-panel hover:bg-vibe-primary/90"
        >
          Add Problem
        </button>
      </form>
    </div>
  );
};

export default AddProblem;
