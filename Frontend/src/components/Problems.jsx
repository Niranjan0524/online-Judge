import { useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { FiEdit3, FiPlus, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useProblems } from "../store/ProblemsContext";

const difficultyStyles = {
  easy: "border-vibe-success/30 bg-vibe-success/10 text-vibe-success",
  medium: "border-vibe-warning/30 bg-vibe-warning/10 text-vibe-warning",
  hard: "border-vibe-danger/30 bg-vibe-danger/10 text-vibe-danger",
};

const Problems = () => {
  const { problems = [], problemLoading } = useProblems();
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState("title");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filteredProblems = problems.filter((problem) => {
    const searchText = `${problem.title} ${problem.difficulty} ${
      problem.tags?.join(" ") || ""
    }`.toLowerCase();

    return searchText.includes(query.trim().toLowerCase());
  });

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "difficulty") {
      const order = { easy: 1, medium: 2, hard: 3 };
      return (order[a.difficulty] || 4) - (order[b.difficulty] || 4);
    }

    return 0;
  });

  const handleProblemClick = (problemId) => {
    navigate(`/problem/solve/${problemId}`);
  };

  const handleAddProblem = () => {
    navigate("/problem/add");
  };

  const handleEditProblem = () => {};

  return (
    <div className="rounded-2xl border border-vibe-border bg-vibe-surface shadow-panel">
      <div className="border-b border-vibe-border p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-vibe-secondary">
              Problem Set
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-vibe-text sm:text-3xl">
              {user?.type === "admin" ? "Your Problems" : "Problems"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-vibe-subtext">
              Browse challenges by topic and difficulty, then open a problem to
              solve it in the editor workspace.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {user?.type === "admin" && (
              <button
                onClick={handleAddProblem}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-vibe-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-vibe-primary/90"
                type="button"
              >
                <FiPlus size={16} />
                Add Problem
              </button>
            )}
            <label className="relative min-w-0 sm:w-64">
              <span className="sr-only">Search problems</span>
              <FiSearch
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-vibe-muted"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-vibe-border bg-vibe-background py-2.5 pl-9 pr-3 text-sm text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/50 focus:border-vibe-primary"
                placeholder="Search title, tag, difficulty"
              />
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-vibe-border bg-vibe-background px-3 py-2.5 text-sm text-vibe-text hover:border-vibe-primary/50 focus:border-vibe-primary"
              aria-label="Sort problems"
            >
              <option value="title">Sort by title</option>
              <option value="difficulty">Sort by difficulty</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-h-[calc(100vh-220px)] overflow-y-auto p-3 sm:p-4">
        {problemLoading ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-vibe-border bg-vibe-background">
            <InfinitySpin
              visible={true}
              width="180"
              color="#6366F1"
              ariaLabel="loading problems"
            />
          </div>
        ) : sortedProblems.length > 0 ? (
          <div className="space-y-3">
            {sortedProblems.map((problem) => (
              <article
                key={problem._id}
                className="group rounded-2xl border border-vibe-border bg-vibe-background p-4 hover:border-vibe-primary/60 hover:bg-vibe-elevated"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-heading text-lg font-semibold text-vibe-text">
                        {problem.title}
                      </h3>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                          difficultyStyles[problem.difficulty] ||
                          "border-vibe-border bg-vibe-surface text-vibe-subtext"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {problem.tags?.length > 0 ? (
                        problem.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg border border-vibe-border bg-vibe-surface px-2.5 py-1 text-xs font-medium text-vibe-subtext"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-vibe-muted">
                          No tags available
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    {user?.type === "user" && (
                      <button
                        className="rounded-xl bg-vibe-primary px-4 py-2 text-sm font-semibold text-white hover:bg-vibe-primary/90"
                        onClick={() => handleProblemClick(problem._id)}
                        type="button"
                      >
                        Solve
                      </button>
                    )}
                    {user?.type === "admin" && (
                      <button
                        className="inline-flex items-center gap-2 rounded-xl border border-vibe-border bg-vibe-surface px-4 py-2 text-sm font-semibold text-vibe-text hover:border-vibe-primary/60 hover:bg-vibe-elevated"
                        onClick={handleEditProblem}
                        type="button"
                      >
                        <FiEdit3 size={15} />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-vibe-border bg-vibe-background p-8 text-center">
            <p className="font-heading text-xl font-semibold text-vibe-text">
              No problems found
            </p>
            <p className="mt-2 max-w-md text-sm leading-6 text-vibe-subtext">
              Try a different search term or check back when more problems are
              available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;
