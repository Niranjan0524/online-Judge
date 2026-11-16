const CACHE_TTL_MS = 10_000;
const MAX_CACHE_ENTRIES = 500;
const cache = new Map();
const pendingLoads = new Map();
const revisions = new Map();

const setLeaderboardCache = (contestId, leaderboard) => {
  const key = String(contestId);
  revisions.set(key, (revisions.get(key) || 0) + 1);
  cache.delete(key);
  cache.set(key, {
    leaderboard,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });

  while (cache.size > MAX_CACHE_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
    if (!pendingLoads.has(oldestKey)) revisions.delete(oldestKey);
  }
};

const getCachedLeaderboard = async (contestId, loadLeaderboard) => {
  const key = String(contestId);
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.leaderboard;

  const pending = pendingLoads.get(key);
  if (pending) return pending;

  const revisionAtStart = revisions.get(key) || 0;
  const load = Promise.resolve()
    .then(loadLeaderboard)
    .then((leaderboard) => {
      if ((revisions.get(key) || 0) === revisionAtStart) {
        setLeaderboardCache(key, leaderboard);
        return leaderboard;
      }
      return cache.get(key)?.leaderboard || leaderboard;
    })
    .finally(() => {
      pendingLoads.delete(key);
      if (!cache.has(key)) revisions.delete(key);
    });

  pendingLoads.set(key, load);
  return load;
};

module.exports = { getCachedLeaderboard, setLeaderboardCache };
