import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCode,
  FaEye
} from "react-icons/fa";
import { useAuth } from "../store/AuthContext";
import toast from "react-hot-toast";
import { InfinitySpin } from "react-loader-spinner";

const ContestSubmissions = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [contest, setContest] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);

  // Fetch contest details
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/contest/getContestById/${contestId}`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setContest(data.contest);
          updateTimeLeft(data.contest);
        }
      } catch (error) {
        toast.error("Failed to load contest");
      }
    };

    const fetchSubmissions = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/contest/${contestId}/getSubmissions`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        
        if (response.ok) {
          setSubmissions(data.submissions || []);
        }
      } catch (error) {
        toast.error("Failed to load submissions");
      }
    };

    if (contestId && token) {
      Promise.all([fetchContest(), fetchSubmissions()]).then(() => {
        setLoading(false);
      });
    }
  }, [contestId, token]);

  const updateTimeLeft = (contestData) => {
    const now = new Date();
    const end = new Date(contestData.endTime);
    setTimeLeft(Math.max(0, end.getTime() - now.getTime()));
  };

  // Update timer every second
  useEffect(() => {
    if (!contest) return;
    const timer = setInterval(() => updateTimeLeft(contest), 1000);
    return () => clearInterval(timer);
  }, [contest]);

  const formatTime = (ms) => {
    if (ms <= 0) return "Contest Ended";
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getStatusIcon = (status) => {
    return status === "Accepted" ? (
      <FaCheckCircle className="text-green-500" />
    ) : (
      <FaTimesCircle className="text-red-500" />
    );
  };

  const handleSubmissionView = () => {
    toast.error("Submission view is not implemented yet");
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center">
        <div className="text-white">
          <InfinitySpin width="200" color="#4fa94d" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-8 ">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/contest/${contestId}`)}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6"
        >
          <FaArrowLeft />
          Back to Contest
        </button>

        {/* Contest Header */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {contest?.title}
              </h1>
              <p className="text-gray-300">{contest?.description}</p>
            </div>
            {timeLeft > 0 && (
              <div className="bg-red-600/20 border border-red-600/30 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2 text-red-400">
                  <FaClock />
                  <span className="font-mono text-lg">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submissions Section */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FaCode className="text-cyan-400" />
            Your Submissions
          </h2>

          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No submissions yet</p>
              <button
                onClick={() => navigate(`/contest/${contestId}`)}
                className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg"
              >
                Start Solving
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {getStatusIcon(submission?.status)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {submission?.title || "Unknown Problem"}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span
                            className={`px-2 py-1 rounded ${
                              submission?.status === "Accepted"
                                ? "bg-green-600/20 text-green-400"
                                : "bg-red-600/20 text-red-400"
                            }`}
                          >
                            {submission?.status || "Unknown"}
                          </span>
                          <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                            {submission?.lang || "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className=" flex text-right text-gray-400 text-sm">
                      <div className=" flex items-center gap-2 mb-2">
                        <button
                          onClick={handleSubmissionView}
                          className="mr-2 bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <FaEye className="w-3 h-3" />
                          View
                        </button>
                      </div>
                      <div>
                        <div>
                          {submission?.submittedAt
                            ? new Date(
                                submission.submittedAt
                              ).toLocaleDateString()
                            : "Unknown date"}
                        </div>
                        <div>
                          {submission?.submittedAt
                            ? new Date(
                                submission.submittedAt
                              ).toLocaleTimeString()
                            : "Unknown time"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestSubmissions;
