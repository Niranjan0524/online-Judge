import { useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp, FiAward } from "react-icons/fi";
import { useLeaderBoard } from "../store/LeaderBoardContext";

const Leaderboard = () => {
  const { leaderBoardData = [] } = useLeaderBoard();
  const [splitLeaderBoardData, setSplitLeaderBoardData] = useState(
    leaderBoardData?.length > 6 ? leaderBoardData.slice(0, 6) : leaderBoardData
  );
  const [viewMore, setViewMore] = useState(false);

  const showView = leaderBoardData.length > 6;

  useEffect(() => {
    if (leaderBoardData.length > 6) {
      if (viewMore) {
        setSplitLeaderBoardData(leaderBoardData);
      } else {
        setSplitLeaderBoardData(leaderBoardData.slice(0, 6));
      }
    } else {
      setSplitLeaderBoardData(leaderBoardData);
    }
  }, [viewMore, leaderBoardData]);

  const handleViewMore = () => {
    setViewMore(!viewMore);
  };

  return (
    <section className="rounded-2xl border border-vibe-border bg-vibe-surface shadow-panel">
      <div className="flex flex-col gap-4 border-b border-vibe-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm font-semibold text-vibe-text">Leaderboard</p>
          <p className="mt-1 text-sm text-vibe-subtext">
            Compare solved count, accuracy, and difficulty spread.
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-vibe-border bg-vibe-background text-vibe-primary">
          <FiAward size={20} />
        </div>
      </div>

      {leaderBoardData?.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-vibe-background text-xs uppercase tracking-wide text-vibe-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Rank</th>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Solved</th>
                  <th className="px-5 py-3 font-semibold">Accuracy</th>
                  <th className="px-5 py-3 font-semibold">Easy</th>
                  <th className="px-5 py-3 font-semibold">Medium</th>
                  <th className="px-5 py-3 font-semibold">Hard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vibe-border">
                {splitLeaderBoardData.map((user, idx) => (
                  <tr
                    key={user.userId}
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
                      {user.userName}
                    </td>
                    <td className="px-5 py-4 font-mono">
                      {user.noOfProblemsSolved}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-lg border border-vibe-border bg-vibe-background px-2.5 py-1 font-mono text-xs text-vibe-text">
                        {user.accuracy}%
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-vibe-success">
                      {user.easy}
                    </td>
                    <td className="px-5 py-4 font-mono text-vibe-warning">
                      {user.medium}
                    </td>
                    <td className="px-5 py-4 font-mono text-vibe-danger">
                      {user.hard}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showView && (
            <div className="border-t border-vibe-border p-4 text-center">
              <button
                type="button"
                onClick={handleViewMore}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-vibe-border bg-vibe-background px-4 py-2 text-sm font-semibold text-vibe-text hover:border-vibe-primary/60 hover:bg-vibe-elevated"
              >
                {viewMore ? (
                  <>
                    View less <FiChevronUp size={16} />
                  </>
                ) : (
                  <>
                    View more <FiChevronDown size={16} />
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex min-h-48 items-center justify-center p-6">
          <div className="max-w-sm text-center">
            <p className="font-heading text-xl font-semibold text-vibe-text">
              No leaderboard data available
            </p>
            <p className="mt-2 text-sm leading-6 text-vibe-subtext">
              Rankings will appear after users start solving problems.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Leaderboard;
