import { useNavigate } from "react-router-dom";
import { FiBarChart2, FiCheckCircle, FiMail, FiTarget, FiUser } from "react-icons/fi";
import { useAuth } from "../store/AuthContext";
import { useSolutions } from "../store/SolutionContext";
import { useProblems } from "../store/ProblemsContext";
import { useLeaderBoard } from "../store/LeaderBoardContext";

const Profile = () => {
  const { user } = useAuth() || {};
  const { solutions } = useSolutions();
  const { problems } = useProblems();
  const { leaderBoardData } = useLeaderBoard();
  const navigate = useNavigate();

  const submissions = solutions?.length || 0;
  const accepted =
    solutions?.filter((s) => s.status === "Accepted").length || 0;
  const attempted = [...new Set(solutions?.map((s) => s.problemId))].length || 0;
  const noOfProblemsSolved =
    leaderBoardData?.find((u) => u.userId === user?._id)?.noOfProblemsSolved ||
    0;

  let rank = "N/A";
  for (let i = 0; i < leaderBoardData?.length; i++) {
    if (leaderBoardData[i].userId === user?._id) {
      rank = i + 1;
      break;
    }
  }

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

  const stats = [
    { label: "Solved", value: noOfProblemsSolved, icon: FiCheckCircle },
    { label: "Submissions", value: submissions, icon: FiBarChart2 },
    { label: "Accepted", value: accepted, icon: FiTarget },
    { label: "Rank", value: rank, icon: FiUser },
  ];

  return (
    <div className="min-h-screen bg-vibe-background px-4 py-10 text-vibe-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-2xl border border-vibe-border bg-vibe-surface p-6 shadow-panel sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-vibe-border bg-vibe-primary/10 text-vibe-primary">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiUser size={34} />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-wide text-vibe-secondary">
                  Profile
                </p>
                <h1 className="mt-2 truncate font-heading text-3xl font-bold text-vibe-text">
                  {user?.name || "User Name"}
                </h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-vibe-subtext">
                  <FiMail size={15} />
                  {user?.email || "user@email.com"}
                </p>
              </div>
            </div>
            <span className="w-fit rounded-full border border-vibe-primary/30 bg-vibe-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-vibe-primary">
              {user?.type || "Coder"}
            </span>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article
                key={stat.label}
                className="rounded-2xl border border-vibe-border bg-vibe-surface p-5 shadow-panel"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-vibe-subtext">{stat.label}</p>
                    <p className="mt-2 font-heading text-3xl font-bold text-vibe-text">
                      {stat.value}
                    </p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-vibe-border bg-vibe-background text-vibe-primary">
                    <Icon size={18} />
                  </span>
                </div>
              </article>
            );
          })}
        </section>

        <section className="rounded-2xl border border-vibe-border bg-vibe-surface p-6 shadow-panel">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold text-vibe-text">
                Tags Mastered
              </h2>
              <p className="mt-1 text-sm text-vibe-subtext">
                Topics from accepted submissions.
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl bg-vibe-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-vibe-primary/90"
              type="button"
            >
              Go to Dashboard
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
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
              <div className="w-full rounded-2xl border border-dashed border-vibe-border bg-vibe-background p-8 text-center text-sm text-vibe-subtext">
                No tags solved yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
