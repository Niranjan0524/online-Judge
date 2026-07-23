import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiCode,
  FiLock,
  FiPlay,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import { useAuth } from "../store/AuthContext";

const ViewContest = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [contestStatus, setContestStatus] = useState("upcoming");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleBackToContests = () => {
    navigate("/contest");
  };

  const updateContestStatus = (contestData) => {
    const now = new Date();
    const start = new Date(contestData.startTime);
    const end = new Date(contestData.endTime);

    if (now < start) {
      setContestStatus("upcoming");
      setTimeLeft(start.getTime() - now.getTime());
    } else if (now >= start && now <= end) {
      setContestStatus("ongoing");
      setTimeLeft(end.getTime() - now.getTime());
    } else {
      setContestStatus("ended");
      setTimeLeft(0);
    }
  };

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/contest/getContestById/${contestId}`,
          {
            headers: token ? { authorization: `Bearer ${token}` } : {},
          }
        );
        const data = await response.json();

        if (response.ok) {
          setContest(data.contest);
          setIsRegistered(
            data.contest.registeredUsers?.includes(user?._id) || false
          );
          updateContestStatus(data.contest);
        } else {
          toast.error("Failed to load contest details");
        }
      } catch (error) {
        console.error("Error fetching contest:", error);
        toast.error("Network error while loading contest");
      } finally {
        setLoading(false);
      }
    };

    if (contestId) {
      fetchContestDetails();
    }
  }, [contestId, token, user?._id]);

  useEffect(() => {
    if (!contest) return;

    const timer = setInterval(() => {
      updateContestStatus(contest);
    }, 1000);

    return () => clearInterval(timer);
  }, [contest]);

  const formatTimeLeft = (milliseconds) => {
    if (milliseconds <= 0) return "00:00:00";

    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleAttemptContest = () => {
    if (!isRegistered) {
      toast.error("You need to be registered for this contest");
      return;
    }

    if (contestStatus !== "ongoing") {
      toast.error("Contest is not currently active");
      return;
    }

    if (!contest.problems || contest.problems.length === 0) {
      toast.error("No problems available in this contest");
      return;
    }

    navigate(`/contest/${contestId}/solve/${contest.problems[0]}`);
    toast.success("Good luck with the contest!");
  };

  const statusBadge = {
    upcoming: "border-vibe-secondary/30 bg-vibe-secondary/10 text-vibe-secondary",
    ongoing: "border-vibe-success/30 bg-vibe-success/10 text-vibe-success",
    ended: "border-vibe-border bg-vibe-background text-vibe-subtext",
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-vibe-background px-4 text-vibe-text">
        <div className="rounded-2xl border border-vibe-border bg-vibe-surface p-8 text-center shadow-panel">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-vibe-border border-t-vibe-primary" />
          <p className="mt-4 text-sm text-vibe-subtext">Loading contest details...</p>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-vibe-background px-4 text-vibe-text">
        <div className="max-w-md rounded-2xl border border-vibe-border bg-vibe-surface p-8 text-center shadow-panel">
          <FiXCircle className="mx-auto mb-4 text-vibe-danger" size={48} />
          <h2 className="font-heading text-2xl font-bold text-vibe-text">
            Contest Not Found
          </h2>
          <p className="mt-2 text-sm text-vibe-subtext">
            The requested contest could not be found.
          </p>
          <button
            onClick={handleBackToContests}
            className="mt-6 rounded-xl bg-vibe-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-vibe-primary/90"
            type="button"
          >
            Back to Contests
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Duration",
      value: `${Math.ceil(
        (new Date(contest.endTime) - new Date(contest.startTime)) /
          (1000 * 60 * 60)
      )} hours`,
      icon: FiClock,
      helper:
        timeLeft > 0
          ? `${contestStatus === "upcoming" ? "Starts in" : "Ends in"} ${formatTimeLeft(timeLeft)}`
          : "Contest ended",
    },
    {
      label: "Problems",
      value: contest.problems?.length || 0,
      icon: FiCode,
      helper: "to solve",
    },
    {
      label: "Participants",
      value: contest.registeredUsers?.length || 0,
      icon: FiUsers,
      helper: "registered",
    },
    {
      label: "Your Status",
      value: isRegistered ? "Ready" : "Locked",
      icon: isRegistered ? FiCheckCircle : FiLock,
      helper: isRegistered ? "Good luck" : "Registration required",
    },
  ];

  return (
    <div className="min-h-screen bg-vibe-background px-4 py-10 text-vibe-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <button
          onClick={handleBackToContests}
          className="inline-flex items-center gap-2 rounded-xl border border-vibe-border bg-vibe-surface px-4 py-2 text-sm font-semibold text-vibe-text hover:border-vibe-primary/60 hover:bg-vibe-elevated"
          type="button"
        >
          <FiArrowLeft size={16} />
          Back to Contests
        </button>

        <section className="rounded-2xl border border-vibe-border bg-vibe-surface p-6 shadow-panel sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-4xl font-bold text-vibe-text">
                  {contest.title}
                </h1>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                    statusBadge[contestStatus]
                  }`}
                >
                  {contestStatus === "ongoing" && <FiPlay size={14} />}
                  {contestStatus === "upcoming" && <FiClock size={14} />}
                  {contestStatus === "ended" && <FiCheckCircle size={14} />}
                  {contestStatus === "upcoming"
                    ? "Starting Soon"
                    : contestStatus === "ongoing"
                    ? "Live Now"
                    : "Ended"}
                </span>
                {isRegistered && (
                  <span className="rounded-full border border-vibe-success/30 bg-vibe-success/10 px-3 py-1 text-xs font-semibold text-vibe-success">
                    Registered
                  </span>
                )}
              </div>
              <p className="mt-4 max-w-4xl text-sm leading-7 text-vibe-subtext">
                {contest.description}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <article
                  key={stat.label}
                  className="rounded-2xl border border-vibe-border bg-vibe-background p-5"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-vibe-border bg-vibe-surface text-vibe-primary">
                    <Icon size={18} />
                  </div>
                  <p className="text-sm text-vibe-subtext">{stat.label}</p>
                  <p className="mt-2 font-heading text-2xl font-bold text-vibe-text">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-vibe-muted">{stat.helper}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-vibe-border bg-vibe-surface p-6 shadow-panel">
          <h2 className="font-heading text-xl font-semibold text-vibe-text">
            Contest Timeline
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-vibe-border bg-vibe-background p-4">
              <p className="text-sm font-semibold text-vibe-success">Start Time</p>
              <p className="mt-2 text-sm text-vibe-subtext">
                {new Date(contest.startTime).toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-vibe-border bg-vibe-background p-4">
              <p className="text-sm font-semibold text-vibe-danger">End Time</p>
              <p className="mt-2 text-sm text-vibe-subtext">
                {new Date(contest.endTime).toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-vibe-border bg-vibe-surface p-6 text-center shadow-panel">
          {!isRegistered ? (
            <>
              <FiLock className="mx-auto text-vibe-danger" size={42} />
              <h3 className="mt-4 font-heading text-2xl font-bold text-vibe-text">
                Registration Required
              </h3>
              <p className="mt-2 text-sm text-vibe-subtext">
                You need to register for this contest to participate.
              </p>
              <button
                onClick={() => navigate("/contest")}
                className="mt-6 rounded-xl bg-vibe-primary px-5 py-3 text-sm font-semibold text-white hover:bg-vibe-primary/90"
                type="button"
              >
                Go to Contest Registration
              </button>
            </>
          ) : contestStatus === "upcoming" ? (
            <>
              <FiClock className="mx-auto text-vibe-secondary" size={42} />
              <h3 className="mt-4 font-heading text-2xl font-bold text-vibe-text">
                Contest Starting Soon
              </h3>
              <p className="mt-2 text-sm text-vibe-subtext">
                Get ready. The contest will begin in:
              </p>
              <div className="mt-4 font-mono text-4xl font-bold text-vibe-secondary">
                {formatTimeLeft(timeLeft)}
              </div>
            </>
          ) : contestStatus === "ongoing" ? (
            <>
              <FiPlay className="mx-auto text-vibe-success" size={42} />
              <h3 className="mt-4 font-heading text-2xl font-bold text-vibe-text">
                Contest is Live
              </h3>
              <p className="mt-2 text-sm text-vibe-subtext">
                Time remaining:{" "}
                <span className="font-mono font-bold text-vibe-success">
                  {formatTimeLeft(timeLeft)}
                </span>
              </p>
              <button
                onClick={handleAttemptContest}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-vibe-success px-6 py-3 text-sm font-semibold text-vibe-background hover:bg-vibe-success/90"
                type="button"
              >
                <FiPlay size={16} />
                Attempt Contest
              </button>
            </>
          ) : (
            <>
              <FiCheckCircle className="mx-auto text-vibe-muted" size={42} />
              <h3 className="mt-4 font-heading text-2xl font-bold text-vibe-text">
                Contest Ended
              </h3>
              <p className="mt-2 text-sm text-vibe-subtext">
                This contest has finished. Check the leaderboard for results.
              </p>
              <button
                onClick={() => navigate(`/contest/${contestId}/leaderboard`)}
                className="mt-6 rounded-xl border border-vibe-border bg-vibe-background px-5 py-3 text-sm font-semibold text-vibe-text hover:border-vibe-primary/60 hover:bg-vibe-elevated"
                type="button"
              >
                View Results
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default ViewContest;
