import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft} from "react-icons/fi";
import { GiTrophy } from "react-icons/gi";
import { useSocketContext } from "../store/SocketContext";
import { useAuth } from "../store/AuthContext";

const ContestLeaderboard = () => {
  const {
    socket,
    isConnected,
    leaderBoardData,
    joinContestLeaderboard,
    leaveContestLeaderboard,
    getContestStatus,
  } = useSocketContext();

  const [loading, setLoading] = useState(true);
  const { contestId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (socket && isConnected) {
      joinContestLeaderboard(contestId, user?._id);
      getContestStatus(contestId);
      setLoading(false);
    }
    return () => {
      if (contestId && user?._id) {
        leaveContestLeaderboard(contestId);
      }
    };
  }, [socket, isConnected, contestId, user?._id]);

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

        <section className="rounded-2xl border border-vibe-border bg-vibe-surface shadow-panel">
          <div className="flex items-center justify-between border-b border-vibe-border p-6">
            <div>
              <h1 className="font-heading text-3xl font-bold text-vibe-text">
                Contest Leaderboard
              </h1>
              <p className="mt-2 text-sm text-vibe-subtext">
                Live ranking by solved problems, points, submissions, and accuracy.
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-vibe-border bg-vibe-background text-vibe-primary">
              <GiTrophy size={20}/>
            </div>
          </div>

          {leaderBoardData?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-vibe-background text-xs uppercase tracking-wide text-vibe-muted">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Rank</th>
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Solved</th>
                    <th className="px-5 py-3 font-semibold">Points</th>
                    <th className="px-5 py-3 font-semibold">Submissions</th>
                    <th className="px-5 py-3 font-semibold">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vibe-border">
                  {leaderBoardData.map((row, idx) => (
                    <tr
                      key={row.userId}
                      className="bg-vibe-surface text-vibe-subtext hover:bg-vibe-elevated"
                    >
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 font-mono text-xs font-semibold ${
                            idx === 0
                              ? "border-vibe-warning/30 bg-vibe-warning/10 text-vibe-warning"
                              : "border-vibe-border bg-vibe-background text-vibe-subtext"
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium text-vibe-text">
                        {row.userName}
                        {row.userId === user?._id && (
                          <span className="ml-2 rounded-full border border-vibe-secondary/30 bg-vibe-secondary/10 px-2 py-0.5 text-xs text-vibe-secondary">
                            You
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-mono text-vibe-success">
                        {row.noOfProblemsSolved}
                        <span className="ml-1 text-vibe-muted">
                          / {row.totalContestProblems || 0}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-lg border border-vibe-border bg-vibe-background px-2.5 py-1 font-mono text-xs text-vibe-text">
                          {row.totalPoints || 0}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono">
                        {row.totalSubmissions || 0}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-lg border border-vibe-border bg-vibe-background px-2.5 py-1 font-mono text-xs text-vibe-text">
                          {row.accuracy ? row.accuracy.toFixed(1) : "0.0"}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center">
              <p className="font-heading text-xl font-semibold text-vibe-text">
                No leaderboard data available
              </p>
              <p className="mt-2 text-sm text-vibe-subtext">
                Rankings will appear as participants submit solutions.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ContestLeaderboard;
