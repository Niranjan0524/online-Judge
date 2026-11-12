import { useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { FiArrowUpRight, FiEdit3, FiPlus, FiSearch } from "react-icons/fi";
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
  const [sortBy, setSortBy] = useState("difficulty");
  const [query, setQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const navigate = useNavigate();

  const filteredProblems = problems.filter((problem) => {
    if (!problem?.title) return false;
    if (difficultyFilter !== "all" && problem.difficulty !== difficultyFilter) return false;

    const searchText = `${problem.title} ${problem.description || ""} ${problem.difficulty} ${problem.tags?.join(" ") || ""}`.toLowerCase();
    return searchText.includes(query.trim().toLowerCase());
  });

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    const order = { easy: 1, medium: 2, hard: 3 };
    return (order[a.difficulty] || 4) - (order[b.difficulty] || 4);
  });

  const handleProblemClick = (problemId) => navigate(`/problem/solve/${problemId}`);
  const handleAddProblem = () => navigate("/problem/add");
  const handleEditProblem = () => navigate("/problem/add");

  return (
    <div className="rounded-2xl border border-vibe-border bg-vibe-surface shadow-panel">
      <div className="border-b border-vibe-border p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-vibe-secondary">Problem Set</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-vibe-text sm:text-3xl">
              {user?.type === "admin" ? "Your Problems" : "Problems"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-vibe-subtext">
              Browse challenges by topic and difficulty, then open a problem to solve it in the editor workspace.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {user?.type === "admin" && (
              <button onClick={handleAddProblem} className="inline-flex items-center justify-center gap-2 rounded-xl bg-vibe-primary px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-vibe-primary/90" type="button">
                <FiPlus size={16} />Add Problem
              </button>
            )}
            <label className="relative min-w-0 sm:w-64">
              <span className="sr-only">Search problems</span>
              <FiSearch size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-vibe-muted" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-xl border border-vibe-border bg-vibe-background py-2.5 pl-9 pr-3 text-sm text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/50 focus:border-vibe-primary" placeholder="Search title, tag, difficulty" />
            </label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-xl border border-vibe-border bg-vibe-background px-3 py-2.5 text-sm text-vibe-text hover:border-vibe-primary/50 focus:border-vibe-primary" aria-label="Sort problems">
              <option value="title">Sort by title</option>
              <option value="difficulty">Sort by difficulty</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-h-[calc(100vh-220px)] overflow-y-auto p-4 sm:p-6">
        {!problemLoading && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2" aria-label="Filter by difficulty">
              {["all", "easy", "medium", "hard"].map((difficulty) => (
                <button key={difficulty} type="button" onClick={() => setDifficultyFilter(difficulty)} aria-pressed={difficultyFilter === difficulty}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition ${difficultyFilter === difficulty ? "border-vibe-primary bg-vibe-primary/15 text-vibe-primary" : "border-vibe-border bg-vibe-background text-vibe-subtext hover:border-vibe-primary/50"}`}>
                  {difficulty === "all" ? "All levels" : difficulty}
                </button>
              ))}
            </div>
            <p className="text-xs text-vibe-muted">{sortedProblems.length} {sortedProblems.length === 1 ? "problem" : "problems"}</p>
          </div>
        )}

        {problemLoading ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-vibe-border bg-vibe-background">
            <InfinitySpin visible={true} width="180" color="#F15B14" ariaLabel="loading problems" />
          </div>
        ) : sortedProblems.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {sortedProblems.map((problem, index) => (
              <article key={problem._id} onClick={() => user?.type === "user" && handleProblemClick(problem._id)}
                onKeyDown={(event) => {
                  if (user?.type === "user" && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    handleProblemClick(problem._id);
                  }
                }}
                role={user?.type === "user" ? "link" : undefined} tabIndex={user?.type === "user" ? 0 : undefined}
                className={`group flex min-h-44 flex-col rounded-2xl border border-vibe-border bg-vibe-background p-4 transition hover:-translate-y-0.5 hover:border-vibe-primary/60 hover:bg-vibe-elevated hover:shadow-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vibe-primary ${user?.type === "user" ? "cursor-pointer" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-[11px] font-semibold tabular-nums text-vibe-muted">#{String(index + 1).padStart(2, "0")}</span>
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${difficultyStyles[problem.difficulty] || "border-vibe-border bg-vibe-surface text-vibe-subtext"}`}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-semibold leading-snug text-vibe-text group-hover:text-vibe-primary">{problem.title}</h3>
                  </div>
                  {user?.type === "admin" && (
                    <button className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-vibe-border bg-vibe-surface px-3 py-2 text-sm font-semibold text-vibe-text hover:border-vibe-primary/60 hover:bg-vibe-elevated" onClick={(event) => { event.stopPropagation(); handleEditProblem(); }} type="button">
                      <FiEdit3 size={15} />Edit
                    </button>
                  )}
                </div>
                {problem.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-vibe-subtext">{problem.description.replace(/[#*`>_~]/g, " ").replace(/\s+/g, " ").trim()}</p>
                )}
                <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                  <div className="flex min-w-0 flex-wrap gap-1.5">
                    {problem.tags?.length ? (
                      <>
                        {problem.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-lg border border-vibe-border bg-vibe-surface px-2 py-1 text-xs font-medium text-vibe-subtext">{tag}</span>)}
                        {problem.tags.length > 3 && <span className="px-1 py-1 text-xs text-vibe-muted">+{problem.tags.length - 3}</span>}
                      </>
                    ) : <span className="text-xs text-vibe-muted">No topics</span>}
                  </div>
                  {user?.type === "user" && (
                    <button className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-vibe-primary px-3.5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-vibe-primary/90" onClick={(event) => { event.stopPropagation(); handleProblemClick(problem._id); }} type="button">
                      Solve <FiArrowUpRight size={15} />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-vibe-border bg-vibe-background p-8 text-center">
            <p className="font-heading text-xl font-semibold text-vibe-text">No problems found</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-vibe-subtext">Try a different search term or difficulty filter, or check back when more problems are available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;
