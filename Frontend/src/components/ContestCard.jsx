import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiClock, FiPlayCircle, FiUsers } from "react-icons/fi";
import { useAuth } from "../store/AuthContext";

const getStatus = (contest) => {
  const now = new Date();
  const start = new Date(contest.startTime);
  const end = new Date(contest.endTime);
  if (now < start) return "future";
  if (now >= start && now <= end) return "ongoing";
  if (now > end) return "past";
  return "unknown";
};

const statusStyles = {
  future: "border-vibe-secondary/30 bg-vibe-secondary/10 text-vibe-secondary",
  ongoing: "border-vibe-success/30 bg-vibe-success/10 text-vibe-success",
  past: "border-vibe-border bg-vibe-background text-vibe-subtext",
};

const ContestCard = ({ contest, onRegister, onUnregister, userId }) => {
  const [status, setStatus] = useState(getStatus(contest));
  const [isRegistered, setIsRegistered] = useState(
    contest.registeredUsers?.includes(userId) || false
  );
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleContestClick = () => {
    if (isRegistered && status === "ongoing") {
      navigate(`/contest/${contest._id}`);
    }
  };

  const handleRegisterClick = (e) => {
    e.stopPropagation();
    onRegister(contest._id);
    setIsRegistered(true);
  };

  const handleUnregisterClick = (e) => {
    e.stopPropagation();
    onUnregister(contest._id);
    setIsRegistered(false);
  };

  const handleParticipateClick = (e) => {
    e.stopPropagation();
    handleContestClick();
  };

  useEffect(() => {
    const fetchContestData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/contest/getContestById/${
            contest._id
          }`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setStatus(getStatus(data.contest));
          if (userId && data.contest.registeredUsers) {
            setIsRegistered(data.contest.registeredUsers.includes(userId));
          }
        }
      } catch (error) {
        console.error("Error fetching contest data:", error);
      }
    };

    fetchContestData();
    const interval = setInterval(fetchContestData, 30000);
    return () => clearInterval(interval);
  }, [contest._id, userId, token]);

  useEffect(() => {
    if (contest.registeredUsers && userId) {
      setIsRegistered(contest.registeredUsers.includes(userId));
    }
  }, [contest.registeredUsers, userId]);

  return (
    <article
      className={`rounded-2xl border border-vibe-border bg-vibe-surface p-5 shadow-panel hover:border-vibe-primary/60 hover:bg-vibe-elevated ${
        isRegistered && status === "ongoing" ? "cursor-pointer" : ""
      }`}
      onClick={handleContestClick}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-heading text-xl font-semibold text-vibe-text">
              {contest.title}
            </h3>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                statusStyles[status] || statusStyles.past
              }`}
            >
              {status === "future"
                ? "Upcoming"
                : status === "ongoing"
                ? "Ongoing"
                : "Past"}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-vibe-subtext">
            {contest.description}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-vibe-subtext sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-xl border border-vibe-border bg-vibe-background px-3 py-2">
          <FiClock className="text-vibe-secondary" size={16} />
          <span>
            {new Date(contest.startTime).toLocaleString()} -{" "}
            {new Date(contest.endTime).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-vibe-border bg-vibe-background px-3 py-2">
          <FiUsers className="text-vibe-primary" size={16} />
          <span>{contest.registeredUsers?.length || 0} registered</span>
          {contest.attempted && (
            <span className="ml-auto inline-flex items-center gap-1 text-vibe-success">
              <FiCheckCircle size={15} />
              Attempted
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {isRegistered && status === "ongoing" && (
          <button
            className="inline-flex items-center gap-2 rounded-xl bg-vibe-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-vibe-primary/90"
            onClick={handleParticipateClick}
            type="button"
          >
            <FiPlayCircle size={16} />
            Participate
          </button>
        )}

        {status === "future" &&
          (isRegistered ? (
            <button
              className="rounded-xl border border-vibe-danger/30 bg-vibe-danger/10 px-4 py-2.5 text-sm font-semibold text-vibe-danger hover:bg-vibe-danger/15"
              onClick={handleUnregisterClick}
              type="button"
            >
              Unregister
            </button>
          ) : (
            <button
              className="rounded-xl bg-vibe-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-vibe-primary/90"
              onClick={handleRegisterClick}
              type="button"
            >
              Register
            </button>
          ))}
      </div>
    </article>
  );
};

export default ContestCard;
