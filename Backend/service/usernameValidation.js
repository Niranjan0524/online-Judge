const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;
const USERNAME_PATTERN = /^[a-z0-9_.]+$/;

const RESERVED_USERNAMES = new Set([
  "about",
  "account",
  "admin",
  "api",
  "auth",
  "blog",
  "codevibe",
  "contact",
  "contest",
  "contests",
  "dashboard",
  "docs",
  "explore",
  "features",
  "help",
  "home",
  "leaderboard",
  "leaderboards",
  "login",
  "logout",
  "me",
  "pricing",
  "privacy",
  "problem",
  "problems",
  "profile",
  "register",
  "settings",
  "signup",
  "solve",
  "support",
  "terms",
  "user",
  "users",
]);

const normalizeUsername = (username) => {
  if (typeof username !== "string") {
    return undefined;
  }

  const normalizedUsername = username.trim().toLowerCase();
  return normalizedUsername || undefined;
};

const isReservedUsername = (username) => {
  const normalizedUsername = normalizeUsername(username);
  return normalizedUsername ? RESERVED_USERNAMES.has(normalizedUsername) : false;
};

const validateUsername = (username) => {
  const normalizedUsername = normalizeUsername(username);
  const errors = [];

  if (!normalizedUsername) {
    return errors;
  }

  if (normalizedUsername.length < USERNAME_MIN_LENGTH) {
    errors.push(`Username must be at least ${USERNAME_MIN_LENGTH} characters long`);
  }

  if (normalizedUsername.length > USERNAME_MAX_LENGTH) {
    errors.push(`Username must be at most ${USERNAME_MAX_LENGTH} characters long`);
  }

  if (!USERNAME_PATTERN.test(normalizedUsername)) {
    errors.push("Username can only contain letters, numbers, underscores, and periods");
  }

  if (isReservedUsername(normalizedUsername)) {
    errors.push("Username is reserved");
  }

  return errors;
};

const isValidUsername = (username) => validateUsername(username).length === 0;

module.exports = {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_PATTERN,
  RESERVED_USERNAMES,
  normalizeUsername,
  isReservedUsername,
  validateUsername,
  isValidUsername,
};
