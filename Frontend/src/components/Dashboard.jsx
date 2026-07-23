import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import {
  FiActivity,
  FiAward,
  FiCalendar,
  FiCheckCircle,
  FiTarget,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../store/AuthContext";
import { useSolutions } from "../store/SolutionContext";
import { useProblems } from "../store/ProblemsContext";
import { useLeaderBoard } from "../store/LeaderBoardContext";
import Leaderboard from "./LeaderBoard";

const statusStyles = {
  Accepted: "border-vibe-success/30 bg-vibe-success/10 text-vibe-success",
  "Wrong Answer": "border-vibe-danger/30 bg-vibe-danger/10 text-vibe-danger",
};

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
  const acceptedCount = Array.isArray(solutions)
    ? solutions.filter((item) => item.status === "Accepted").length
    : 0;
  const totalSubmissions = Array.isArray(solutions) ? solutions.length : 0;
  const accuracy =
    totalSubmissions > 0
      ? Math.round((acceptedCount / totalSubmissions) * 100)
      : 0;

  const stats = [
    {
      label: "Solved",
      value: noOfProblemsSolved,
      icon: FiCheckCircle,
      helper: "Accepted problems",
    },
    {
      label: "Rank",
      value: rank,
      icon: FiAward,
      helper: "Global position",
    },
    {
      label: "Accuracy",
      value: `${accuracy}%`,
      icon: FiTarget,
      helper: "Accepted submissions",
    },
    {
      label: "Submissions",
      value: totalSubmissions,
      icon: FiActivity,
      helper: "All attempts",
    },
  ];

  return (
    <div className="min-h-screen bg-vibe-background px-4 py-10 text-vibe-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-vibe-secondary">
              Dashboard
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold text-vibe-text sm:text-5xl">
              Your coding journey
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-vibe-subtext">
              Track progress, review recent submissions, and understand where
              your practice is compounding.
            </p>
          </div>

          <div className="rounded-2xl border border-vibe-border bg-vibe-surface p-4 shadow-panel">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-vibe-border bg-vibe-primary/10 font-heading text-lg font-bold text-vibe-primary">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold text-vibe-text">
                  {user?.name || "User Name"}
                </p>
                <p className="text-sm text-vibe-subtext">
                  {user?.email || "user@email.com"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-2xl border border-vibe-border bg-vibe-surface p-5 shadow-panel hover:border-vibe-primary/50 hover:bg-vibe-elevated"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-vibe-subtext">
                      {stat.label}
                    </p>
                    <p className="mt-2 font-heading text-3xl font-bold text-vibe-text">
                      {stat.value}
                    </p>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-vibe-border bg-vibe-background text-vibe-primary">
                    <Icon size={20} />
                  </span>
                </div>
                <p className="mt-4 text-sm text-vibe-muted">{stat.helper}</p>
              </article>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.4fr]">
          <article className="rounded-2xl border border-vibe-border bg-vibe-surface p-5 shadow-panel sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-vibe-text">
                  Profile
                </p>
                <p className="mt-1 text-sm text-vibe-subtext">
                  Current workspace identity
                </p>
              </div>
              <span className="rounded-full border border-vibe-primary/30 bg-vibe-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-vibe-primary">
                {user?.type || "Coder"}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-vibe-border bg-vibe-background p-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-vibe-primary/10 text-vibe-primary">
                <FiUser size={26} />
              </div>
              <div className="min-w-0">
                <p className="truncate font-heading text-xl font-semibold text-vibe-text">
                  {user?.name || "User Name"}
                </p>
                <p className="truncate text-sm text-vibe-subtext">
                  {user?.email || "user@email.com"}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-vibe-border bg-vibe-surface p-5 shadow-panel sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-vibe-text">
                  Recent submissions
                </p>
                <p className="mt-1 text-sm text-vibe-subtext">
                  Latest attempts across problems
                </p>
              </div>
              <FiTrendingUp className="text-vibe-primary" size={20} />
            </div>

            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
              {solutions?.length > 0 ? (
                solutions
                  .slice()
                  .reverse()
                  .slice(0, 10)
                  .map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col gap-3 rounded-xl border border-vibe-border bg-vibe-background p-4 hover:border-vibe-primary/50 hover:bg-vibe-elevated sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-vibe-text">
                          {item.titleName}
                        </p>
                        <p className="mt-1 font-mono text-xs text-vibe-muted">
                          {new Date(item.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`w-fit rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[item.status] ||
                          "border-vibe-border bg-vibe-surface text-vibe-subtext"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))
              ) : (
                <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-vibe-border bg-vibe-background p-6 text-center text-sm text-vibe-subtext">
                  No submissions yet.
                </div>
              )}
            </div>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-vibe-border bg-vibe-surface p-5 shadow-panel sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-vibe-text">
                  Problem tags solved
                </p>
                <p className="mt-1 text-sm text-vibe-subtext">
                  Accepted submissions grouped by topic
                </p>
              </div>
              <span className="rounded-full border border-vibe-border bg-vibe-background px-3 py-1 text-xs font-semibold text-vibe-subtext">
                {tagMap.length} tags
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {tagMap.length > 0 ? (
                tagMap.map((t) => (
                  <span
                    key={t.tag}
                    className="inline-flex items-center gap-2 rounded-xl border border-vibe-border bg-vibe-background px-3 py-2 text-sm font-medium text-vibe-subtext"
                  >
                    {t.tag}
                    <span className="rounded-lg bg-vibe-primary/10 px-2 py-0.5 font-mono text-xs text-vibe-primary">
                      {t.count}
                    </span>
                  </span>
                ))
              ) : (
                <div className="flex min-h-32 w-full items-center justify-center rounded-xl border border-dashed border-vibe-border bg-vibe-background p-6 text-center text-sm text-vibe-subtext">
                  No tags solved yet.
                </div>
              )}
            </div>
          </article>

          <article className="rounded-2xl border border-vibe-border bg-vibe-surface p-5 shadow-panel sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-vibe-text">
                  Daily activity
                </p>
                <p className="mt-1 text-sm text-vibe-subtext">
                  Submission cadence over time
                </p>
              </div>
              <FiCalendar className="text-vibe-primary" size={20} />
            </div>

            <div className="overflow-x-auto rounded-xl border border-vibe-border bg-vibe-background p-4">
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
          </article>
        </section>

        <Leaderboard />

        <p className="text-center text-sm text-vibe-muted">
          Built by{" "}
          <a
            href="https://github.com/niranjan0524"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-vibe-primary hover:text-vibe-primary/80"
          >
            Niranjan
          </a>
        </p>
      </div>

      <style>
        {`
        .react-calendar-heatmap {
          width: 100%;
          min-width: 560px;
        }
        .react-calendar-heatmap text {
          fill: #71717A;
          font-size: 9px;
        }
        .react-calendar-heatmap rect {
          rx: 2px;
          ry: 2px;
          stroke: #09090B;
        }
        .color-scale-0 { fill: #18181B; }
        .color-scale-1 { fill: rgba(34, 197, 94, 0.28); }
        .color-scale-2 { fill: rgba(34, 197, 94, 0.48); }
        .color-scale-3 { fill: rgba(34, 197, 94, 0.68); }
        .color-scale-4 { fill: #22C55E; }
      `}
      </style>
    </div>
  );
};

export default Dashboard;
