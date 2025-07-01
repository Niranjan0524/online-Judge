import { useState, useEffect } from "react";
import ContestCard from "./ContestCard";
import {
  FaRegClock,
  FaCheckCircle,
  FaPlayCircle,
  FaHistory,
} from "react-icons/fa";
import { useSocketContext } from "../store/SocketContext";
import { useAuth } from "../store/AuthContext";
import toast from "react-hot-toast";

const NAV_OPTIONS = [
  { label: "Future Contests", icon: <FaRegClock /> },
  { label: "Ongoing Contests", icon: <FaPlayCircle /> },
  { label: "Past Contests", icon: <FaHistory /> },
  { label: "Attempted Contests", icon: <FaCheckCircle /> },
];

const Contest = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [contests, setContests] = useState([]);
  const { user, token } = useAuth();

  // Filter contests for each tab
  const now = new Date();
  const futureContests = contests.filter((c) => new Date(c.startTime) > now);
  const ongoingContests = contests.filter(
    (c) => new Date(c.startTime) <= now && new Date(c.endTime) >= now
  );
  const pastContests = contests.filter((c) => new Date(c.endTime) < now);
  const attemptedContests = contests.filter((c) => c.attempted);

  const tabContent = [
    {
      data: futureContests,
      empty: "No future contests available.",
    },
    {
      data: ongoingContests,
      empty: "No ongoing contests right now.",
    },
    {
      data: pastContests,
      empty: "No past contests found.",
    },
    {
      data: attemptedContests,
      empty: "You haven't attempted any contests yet.",
    },
  ];

  const handleRegister = async (id) => {
    console.log("Registering for contest with ID:", id);
    if (!id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/contest/registerUser/${id}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Successfully joined contest:", data);
        toast.success("Successfully joined contest!");

        // ✅ Update the contests state to reflect registration
        setContests((prev) =>
          prev.map((contest) =>
            contest._id === id
              ? {
                  ...contest,
                  registeredUsers: [
                    ...(contest.registeredUsers || []),
                    user._id,
                  ],
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
    console.log("Unregistering from contest with ID:", id);
    if (!id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/contest/unregisterUser/${id}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Successfully left contest:", data);
        toast.success("Successfully left contest!");

        // ✅ Update the contests state to reflect unregistration
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
          `${import.meta.env.VITE_BACKEND_URL}/api/contest/getAllContests`
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
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4 py-10 flex flex-col items-center">
      {/* Centered Nav Bar */}
      <div className="w-full max-w-3xl mx-auto mb-10">
        <div className="flex justify-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 py-2 px-2">
          {NAV_OPTIONS.map((opt, idx) => (
            <button
              key={opt.label}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold text-base transition-all duration-200 ${
                activeTab === idx
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-105"
                  : "text-cyan-200 hover:bg-cyan-900/30 hover:text-white"
              }`}
              onClick={() => setActiveTab(idx)}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full max-w-3xl flex flex-col gap-6">
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
          <div className="text-center text-gray-400 text-lg py-12 bg-white/10 rounded-2xl shadow border border-white/20">
            {tabContent[activeTab].empty}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contest;
