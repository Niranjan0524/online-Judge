import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiAlertCircle,
  FiAtSign,
  FiBarChart2,
  FiCheckCircle,
  FiFlag,
  FiShield,
  FiTarget,
  FiUser,
} from "react-icons/fi";
import LoadingState from "./LoadingState";

const PublicProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchProfile = async () => {
      setIsLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/profile/${encodeURIComponent(username)}`,
          { headers, signal: controller.signal }
        );
        const data = await response.json();

        if (!response.ok) {
          setProfile(null);
          setError(data.message || "Unable to load this public profile.");
          return;
        }

        setProfile(
          data.user
            ? { ...data.user, stats: data.stats, visibility: data.visibility }
            : null
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setProfile(null);
          setError("Unable to load this public profile right now.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    return () => controller.abort();
  }, [username]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-vibe-background px-4 py-10 text-vibe-text sm:px-6 lg:px-8">
        <section className="mx-auto max-w-xl rounded-2xl border border-vibe-border bg-vibe-surface p-8 text-center shadow-panel">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-vibe-danger/30 bg-vibe-danger/10 text-vibe-danger">
            <FiAlertCircle size={26} />
          </div>
          <h1 className="mt-5 font-heading text-2xl font-bold text-vibe-text">
            Profile not found
          </h1>
          <p className="mt-3 text-sm leading-6 text-vibe-subtext">{error}</p>
          <Link
            to="/"
            className="mt-7 inline-flex rounded-xl bg-vibe-primary px-5 py-3 text-sm font-semibold text-white hover:bg-vibe-primary/90"
          >
            Go Home
          </Link>
        </section>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-vibe-background px-4 py-10 text-vibe-text sm:px-6 lg:px-8">
        <section className="mx-auto max-w-xl rounded-2xl border border-dashed border-vibe-border bg-vibe-surface p-8 text-center shadow-panel">
          <h1 className="font-heading text-2xl font-bold text-vibe-text">
            No profile details available
          </h1>
          <p className="mt-3 text-sm leading-6 text-vibe-subtext">
            This public profile does not have any supported details to show.
          </p>
        </section>
      </div>
    );
  }

  const visibility = {
    publicProfile: true,
    solvedProblems: true,
    submissionHistory: true,
    contestHistory: true,
    ...(profile.visibility || {}),
  };
  const displayName = profile.name || profile.username;
  const initial = displayName?.[0]?.toUpperCase() || "U";
  const stats = profile.stats || {};
  const difficultyStats = [
    { label: "Easy", value: stats.easySolved || 0, color: "text-vibe-success" },
    {
      label: "Medium",
      value: stats.mediumSolved || 0,
      color: "text-vibe-warning",
    },
    { label: "Hard", value: stats.hardSolved || 0, color: "text-vibe-danger" },
  ];
  const hasSolvedProblems = (stats.problemsSolved || 0) > 0;
  const PrivateSection = () => (
    <div className="rounded-xl border border-dashed border-vibe-border bg-vibe-background p-6 text-center text-sm text-vibe-subtext">
      This section is private.
    </div>
  );

  return (
    <div className="min-h-screen bg-vibe-background px-4 py-10 text-vibe-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-2xl border border-vibe-border bg-vibe-surface p-6 shadow-panel sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-vibe-border bg-vibe-primary/10 font-heading text-3xl font-bold text-vibe-primary">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-wide text-vibe-secondary">
                  Public Profile
                </p>
                <h1 className="mt-2 truncate font-heading text-3xl font-bold text-vibe-text">
                  {displayName}
                </h1>
                {visibility.publicProfile ? (
                  <p className="mt-2 flex items-center gap-2 text-sm text-vibe-subtext">
                    <FiAtSign size={15} />
                    {profile.username}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-vibe-subtext">
                    This section is private.
                  </p>
                )}
              </div>
            </div>
            {visibility.publicProfile && (
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-vibe-primary/30 bg-vibe-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-vibe-primary">
                <FiShield size={14} />
                {profile.type || "user"}
              </span>
            )}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl border border-vibe-border bg-vibe-surface p-5 shadow-panel">
            {visibility.solvedProblems ? (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-vibe-subtext">Problems Solved</p>
                  <p className="mt-2 font-heading text-3xl font-bold text-vibe-text">
                    {stats.problemsSolved || 0}
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-vibe-border bg-vibe-background text-vibe-primary">
                  <FiCheckCircle size={18} />
                </span>
              </div>
            ) : (
              <PrivateSection />
            )}
          </article>
          <article className="rounded-2xl border border-vibe-border bg-vibe-surface p-5 shadow-panel">
            {visibility.submissionHistory ? (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-vibe-subtext">Submissions</p>
                  <p className="mt-2 font-heading text-3xl font-bold text-vibe-text">
                    {stats.totalSubmissions || 0}
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-vibe-border bg-vibe-background text-vibe-primary">
                  <FiBarChart2 size={18} />
                </span>
              </div>
            ) : (
              <PrivateSection />
            )}
          </article>
          <article className="rounded-2xl border border-vibe-border bg-vibe-surface p-5 shadow-panel">
            {visibility.submissionHistory ? (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-vibe-subtext">Acceptance Rate</p>
                  <p className="mt-2 font-heading text-3xl font-bold text-vibe-text">
                    {stats.acceptanceRate || 0}%
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-vibe-border bg-vibe-background text-vibe-primary">
                  <FiTarget size={18} />
                </span>
              </div>
            ) : (
              <PrivateSection />
            )}
          </article>
          <article className="rounded-2xl border border-vibe-border bg-vibe-surface p-5 shadow-panel">
            {visibility.contestHistory ? (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-vibe-subtext">Contests</p>
                  <p className="mt-2 font-heading text-3xl font-bold text-vibe-text">
                    {stats.totalContestsParticipated || 0}
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-vibe-border bg-vibe-background text-vibe-primary">
                  <FiFlag size={18} />
                </span>
              </div>
            ) : (
              <PrivateSection />
            )}
          </article>
        </section>

        <section className="rounded-2xl border border-vibe-border bg-vibe-surface p-6 shadow-panel">
          <h2 className="font-heading text-xl font-semibold text-vibe-text">
            Solved by Difficulty
          </h2>
          {!visibility.solvedProblems ? (
            <div className="mt-5">
              <PrivateSection />
            </div>
          ) : hasSolvedProblems ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {difficultyStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-vibe-border bg-vibe-background p-4"
                >
                  <p className="text-sm text-vibe-subtext">{item.label}</p>
                  <p
                    className={`mt-2 font-heading text-3xl font-bold ${item.color}`}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-vibe-border bg-vibe-background p-6 text-center text-sm text-vibe-subtext">
              No solved problems yet.
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-vibe-border bg-vibe-surface p-6 shadow-panel">
          <h2 className="font-heading text-xl font-semibold text-vibe-text">
            Basic Information
          </h2>
          {visibility.publicProfile ? (
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-vibe-border bg-vibe-background p-4">
                <dt className="flex items-center gap-2 text-sm text-vibe-subtext">
                  <FiUser size={15} />
                  Full name
                </dt>
                <dd className="mt-2 font-medium text-vibe-text">
                  {profile.name}
                </dd>
              </div>
              <div className="rounded-xl border border-vibe-border bg-vibe-background p-4">
                <dt className="flex items-center gap-2 text-sm text-vibe-subtext">
                  <FiAtSign size={15} />
                  Username
                </dt>
                <dd className="mt-2 font-medium text-vibe-text">
                  {profile.username}
                </dd>
              </div>
            </dl>
          ) : (
            <div className="mt-5">
              <PrivateSection />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PublicProfile;
