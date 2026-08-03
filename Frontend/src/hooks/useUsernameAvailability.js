import { useEffect, useMemo, useState } from "react";

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

const normalizeUsername = (username) => username.trim().toLowerCase();

const getUsernameValidationMessage = (username) => {
  const normalizedUsername = normalizeUsername(username);

  if (!normalizedUsername) {
    return "Username is required";
  }
  if (normalizedUsername.length < USERNAME_MIN_LENGTH) {
    return `Username must be at least ${USERNAME_MIN_LENGTH} characters long`;
  }
  if (normalizedUsername.length > USERNAME_MAX_LENGTH) {
    return `Username must be at most ${USERNAME_MAX_LENGTH} characters long`;
  }
  if (!USERNAME_PATTERN.test(normalizedUsername)) {
    return "Use only letters, numbers, underscores, and periods";
  }
  if (RESERVED_USERNAMES.has(normalizedUsername)) {
    return "This username is reserved";
  }

  return "";
};

export const useUsernameAvailability = (username) => {
  const normalizedUsername = useMemo(() => normalizeUsername(username), [username]);
  const validationMessage = useMemo(
    () => getUsernameValidationMessage(username),
    [username]
  );
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!username) {
      setStatus("idle");
      setMessage("");
      return;
    }

    if (validationMessage) {
      setStatus("invalid");
      setMessage(validationMessage);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setStatus("checking");
      setMessage("Checking username...");

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/check-username?username=${encodeURIComponent(normalizedUsername)}`,
          { signal: controller.signal }
        );
        const data = await response.json();

        if (!response.ok) {
          setStatus("invalid");
          setMessage(data.errors?.[0] || data.message || "Username is not valid");
          return;
        }

        setStatus(data.available ? "available" : "unavailable");
        setMessage(data.message);
      } catch (error) {
        if (error.name !== "AbortError") {
          setStatus("error");
          setMessage("Unable to check username right now");
        }
      }
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [normalizedUsername, username, validationMessage]);

  return {
    normalizedUsername,
    status,
    message,
    isChecking: status === "checking",
    isAvailable: status === "available",
    isInvalid: status === "invalid" || status === "unavailable" || status === "error",
  };
};
