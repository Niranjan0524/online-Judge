import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheckCircle, FiClock, FiPlayCircle, FiRotateCcw } from "react-icons/fi";
import { useAuth } from "../store/AuthContext";
import ContestCard from "./ContestCard";

const NAV_OPTIONS = [
  { label: "Future", icon: FiClock },
  { label: "Ongoing", icon: FiPlayCircle },
  { label: "Past", icon: FiRotateCcw },
  { label: "Attempted", icon: FiCheckCircle },
];

const Contest = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [contests, setContests] = useState([]);
  const { user, token } = useAuth();

  const now = new Date();
  const futureContests = contests.filter((c) => new Date(c.startTime) > now);
  const ongoingContests = contests.filter((c) => {
    const startTime = new Date(c.startTime);
    const endTime = new Date(c.endTime);
    return startTime <= now && endTime >= now;
  });
  const pastContests = contests.filter((c) => new Date(c.endTime) < now);
  const attemptedContests = contests.filter((c) => c.attempted);

  const tabContent = [
    { data: futureContests, empty: "No future contests available." },
    { data: ongoingContests, empty: "No ongoing contests right now." },
    { data: pastContests, empty: "No past contests found." },
    { data: attemptedContests, empty: "You have not attempted any contests yet." },
  ];

  const handleRegister = async (id) => {
    if (!id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/contest/registerUser/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Successfully joined contest!");
        setContests((prev) =>
          prev.map((contest) =>
            contest._id === id
              ? {
                  ...contest,
                  registeredUsers: [...(contest.registeredUsers || []), user._id],
                }
              : contest
          )
        );
      } else {
        console.error("Failed to join contest:", data.message);
        toast.error(data.message || "Failed to join contest.");
      }
    } catch (error) {
      console.error("Error registering for contest:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const handleUnregister = async (id) => {
    if (!id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/contest/unregisterUser/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Successfully left contest!");
        setContests((prev) =>
          prev.map((contest) =>
            contest._id === id
              ? {
                  ...contest,
                  registeredUsers: (contest.registeredUsers || []).filter(
                    (userId) => userId !== user._id
                  ),
                }
              : contest
          )
        );
      } else {
        console.error("Failed to leave contest:", data.message);
        toast.error(data.message || "Failed to leave contest.");
      }
    } catch (error) {
      console.error("Error unregistering from contest:", error);
      toast.error("Network error. Please try again.");
    }
  };

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/contest/getAllContests`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setContests(data.contests);
        } else {
          console.error("Failed to fetch contests:", data.message);
        }
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
    };

    fetchContests();
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      setContests((prev) => [...prev]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-vibe-background px-4 py-10 text-vibe-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-vibe-secondary">
            Contests
          </p>
          <h1 className="mt-3 font-heading text-4xl font-bold text-vibe-text">
            Competitive rounds
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-vibe-subtext">
            Register for upcoming contests, jump into live rounds, and revisit your competitive history.
          </p>
        </section>

        <div className="rounded-2xl border border-vibe-border bg-vibe-surface p-2 shadow-panel">
          <div className="grid gap-2 sm:grid-cols-4">
            {NAV_OPTIONS.map((opt, idx) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.label}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
                    activeTab === idx
                      ? "bg-vibe-primary text-white"
                      : "text-vibe-subtext hover:bg-vibe-elevated hover:text-vibe-text"
                  }`}
                  onClick={() => setActiveTab(idx)}
                  type="button"
                >
                  <Icon size={16} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {tabContent[activeTab].data.length > 0 ? (
            tabContent[activeTab].data.map((contest) => (
              <ContestCard
                contest={contest}
                key={contest._id}
                onRegister={handleRegister}
                onUnregister={handleUnregister}
                userId={user?._id}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-vibe-border bg-vibe-surface p-10 text-center text-sm text-vibe-subtext shadow-panel">
              {tabContent[activeTab].empty}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contest;
