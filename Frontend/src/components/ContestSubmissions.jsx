import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiClock, FiCode, FiEye, FiXCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { InfinitySpin } from "react-loader-spinner";
import { useAuth } from "../store/AuthContext";

const ContestSubmissions = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [contest, setContest] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/contest/getContestById/${contestId}`,
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
          `${import.meta.env.VITE_BACKEND_URL}/api/contest/${contestId}/getSubmissions`,
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

  const handleSubmissionView = () => {
    toast.error("Submission view is not implemented yet");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-vibe-background">
        <InfinitySpin width="200" color="#6366F1" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vibe-background px-4 py-10 text-vibe-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <button
          onClick={() => navigate(`/contest/${contestId}`)}
          className="inline-flex items-center gap-2 rounded-xl border border-vibe-border bg-vibe-surface px-4 py-2 text-sm font-semibold text-vibe-text hover:border-vibe-primary/60 hover:bg-vibe-elevated"
          type="button"
        >
          <FiArrowLeft size={16} />
          Back to Contest
        </button>

        <section className="rounded-2xl border border-vibe-border bg-vibe-surface p-6 shadow-panel">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-vibe-text">
                {contest?.title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-vibe-subtext">
                {contest?.description}
              </p>
            </div>
            {timeLeft > 0 && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-vibe-danger/30 bg-vibe-danger/10 px-4 py-2 text-vibe-danger">
                <FiClock size={16} />
                <span className="font-mono text-sm font-bold">
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-vibe-border bg-vibe-surface shadow-panel">
          <div className="border-b border-vibe-border p-6">
            <h2 className="flex items-center gap-2 font-heading text-2xl font-semibold text-vibe-text">
              <FiCode className="text-vibe-primary" />
              Your Submissions
            </h2>
          </div>

          {submissions.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-vibe-subtext">No submissions yet</p>
              <button
                onClick={() => navigate(`/contest/${contestId}`)}
                className="mt-4 rounded-xl bg-vibe-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-vibe-primary/90"
                type="button"
              >
                Start Solving
              </button>
            </div>
          ) : (
            <div className="divide-y divide-vibe-border">
              {submissions.map((submission, index) => (
                <article
                  key={index}
                  className="flex flex-col gap-4 p-5 hover:bg-vibe-elevated sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 ${
                        submission?.status === "Accepted"
                          ? "text-vibe-success"
                          : "text-vibe-danger"
                      }`}
                    >
                      {submission?.status === "Accepted" ? (
                        <FiCheckCircle size={22} />
                      ) : (
                        <FiXCircle size={22} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-vibe-text">
                        {submission?.title || "Unknown Problem"}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span
                          className={`rounded-full border px-2.5 py-1 font-semibold ${
                            submission?.status === "Accepted"
                              ? "border-vibe-success/30 bg-vibe-success/10 text-vibe-success"
                              : "border-vibe-danger/30 bg-vibe-danger/10 text-vibe-danger"
                          }`}
                        >
                          {submission?.status || "Unknown"}
                        </span>
                        <span className="rounded-full border border-vibe-border bg-vibe-background px-2.5 py-1 font-mono text-vibe-subtext">
                          {submission?.lang || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-vibe-subtext">
                    <button
                      onClick={handleSubmissionView}
                      className="inline-flex items-center gap-2 rounded-xl border border-vibe-border bg-vibe-background px-3 py-2 text-sm font-semibold text-vibe-text hover:border-vibe-primary/60 hover:bg-vibe-elevated"
                      type="button"
                    >
                      <FiEye size={15} />
                      View
                    </button>
                    <div className="font-mono text-xs">
                      <div>
                        {submission?.submittedAt
                          ? new Date(submission.submittedAt).toLocaleDateString()
                          : "Unknown date"}
                      </div>
                      <div>
                        {submission?.submittedAt
                          ? new Date(submission.submittedAt).toLocaleTimeString()
                          : "Unknown time"}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ContestSubmissions;
