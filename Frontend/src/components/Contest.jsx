import React, { useState } from "react";
import {
  FaRegClock,
  FaCheckCircle,
  FaPlayCircle,
  FaHistory,
} from "react-icons/fa";

const contestData = [
  {
    _id: "1",
    title: "CodeVibe Starter Contest",
    description:
      "A beginner-friendly contest to kickstart your coding journey.",
    startTime: "2025-07-30T10:00:00Z",
    endTime: "2025-07-30T13:00:00Z",
    isActive: false,
    attempted: false,
    registered: false,
  },
  {
    _id: "2",
    title: "Summer Coding Challenge",
    description: "Test your skills in this summer's hottest coding contest!",
    startTime: "2025-07-10T15:00:00Z",
    endTime: "2025-07-10T18:00:00Z",
    isActive: true,
    attempted: true,
    registered: true,
  },
  {
    _id: "3",
    title: "Night Owl Coding Jam",
    description: "A late-night contest for those who love to code after dark.",
    startTime: "2025-07-25T22:00:00Z",
    endTime: "2025-07-26T01:00:00Z",
    isActive: false,
    attempted: true,
    registered: false,
  },
];

const NAV_OPTIONS = [
  { label: "Future Contests", icon: <FaRegClock /> },
  { label: "Ongoing Contests", icon: <FaPlayCircle /> },
  { label: "Past Contests", icon: <FaHistory /> },
  { label: "Attempted Contests", icon: <FaCheckCircle /> },
];

const getStatus = (contest) => {
  const now = new Date();
  const start = new Date(contest.startTime);
  const end = new Date(contest.endTime);
  if (now < start) return "future";
  if (now >= start && now <= end) return "ongoing";
  if (now > end) return "past";
  return "unknown";
};

const ContestCard = ({ contest, onRegister, onUnregister }) => {
  const status = getStatus(contest);
  let statusColor =
    status === "future"
      ? "bg-blue-800 text-blue-200 border-blue-400"
      : status === "ongoing"
      ? "bg-green-800 text-green-300 border-green-400"
      : "bg-gray-800 text-gray-300 border-gray-400";
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 flex flex-col gap-2 hover:scale-[1.02] hover:shadow-xl transition-all duration-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">{contest.title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}
        >
          {status === "future"
            ? "Upcoming"
            : status === "ongoing"
            ? "Ongoing"
            : "Past"}
        </span>
      </div>
      <p className="text-gray-200 text-sm mb-2">{contest.description}</p>
      <div className="flex gap-4 text-xs text-gray-300 font-mono">
        <span>
          <FaRegClock className="inline mr-1 text-yellow-300" />
          {new Date(contest.startTime).toLocaleString()} -{" "}
          {new Date(contest.endTime).toLocaleTimeString()}
        </span>
        {contest.attempted && (
          <span className="flex items-center gap-1 text-green-300">
            <FaCheckCircle /> Attempted
          </span>
        )}
      </div>
      {/* Register/Unregister for future contests */}
      {status === "future" && (
        <div className="mt-3">
          {contest.registered ? (
            <button
              className="px-5 py-2 bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold rounded-full shadow hover:scale-105 hover:bg-red-600 transition"
              onClick={() => onUnregister(contest._id)}
            >
              Unregister
            </button>
          ) : (
            <button
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-full shadow hover:scale-105 hover:bg-cyan-600 transition"
              onClick={() => onRegister(contest._id)}
            >
              Register
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const Contest = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [contests, setContests] = useState(contestData);

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

  // Register/Unregister handlers
  const handleRegister = (id) => {
    setContests((prev) =>
      prev.map((c) => (c._id === id ? { ...c, registered: true } : c))
    );
  };
  const handleUnregister = (id) => {
    setContests((prev) =>
      prev.map((c) => (c._id === id ? { ...c, registered: false } : c))
    );
  };

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
