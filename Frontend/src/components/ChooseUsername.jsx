import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowRight, FiAtSign, FiLogOut } from "react-icons/fi";
import { useAuth } from "../store/AuthContext";
import { useUsernameAvailability } from "../hooks/useUsernameAvailability";
import LoadingState from "./LoadingState";

const ChooseUsername = () => {
  const { user, token, isLoggedIn, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const usernameAvailability = useUsernameAvailability(username);
  const canSubmit =
    usernameAvailability.isAvailable && !usernameAvailability.isChecking;

  if (!token && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (token && !user) {
    return <LoadingState />;
  }

  if (user?.username) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmit) {
      setErrors(["Choose an available username to continue"]);
      return;
    }

    setErrors([]);
    setLoading(true);
    const toastId = toast.loading("Saving username...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me/username`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        const responseErrors = data.errors || data.message || "Username update failed";
        setErrors(Array.isArray(responseErrors) ? responseErrors : [responseErrors]);
        toast.dismiss(toastId);
        toast.error("Username update failed");
        return;
      }

      updateUser(data.user);
      toast.dismiss(toastId);
      toast.success(data.message || "Username selected successfully");
      navigate("/");
    } catch (error) {
      setErrors([error.message || "Unable to save username right now"]);
      toast.dismiss(toastId);
      toast.error("Unable to save username right now");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-vibe-background px-4 py-10 text-vibe-text sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl items-center">
        <section className="w-full rounded-2xl border border-vibe-border bg-vibe-surface p-6 shadow-subtle sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-vibe-secondary">
                Username Required
              </p>
              <h1 className="mt-2 font-heading text-3xl font-bold text-vibe-text">
                Choose your username
              </h1>
              <p className="mt-3 text-sm leading-6 text-vibe-subtext">
                This username will identify your CodeVibe account.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-vibe-border bg-vibe-background text-vibe-subtext hover:bg-vibe-elevated hover:text-vibe-text"
              aria-label="Logout"
            >
              <FiLogOut size={16} />
            </button>
          </div>

          {errors.length > 0 && (
            <div className="mt-5 rounded-xl border border-vibe-danger/30 bg-vibe-danger/10 px-4 py-3 text-sm text-vibe-danger">
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={`${error}-${index}`}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="choose-username"
                className="block text-sm font-medium text-vibe-subtext"
              >
                Username
              </label>
              <div className="relative mt-2">
                <FiAtSign
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-vibe-muted"
                />
                <input
                  type="text"
                  id="choose-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="parth.dev"
                  className="block w-full rounded-xl border border-vibe-border bg-vibe-background py-3 pl-10 pr-3 text-sm text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/50 focus:border-vibe-primary"
                  autoFocus
                />
              </div>
              {usernameAvailability.message && (
                <p
                  className={`mt-2 text-xs ${
                    usernameAvailability.isAvailable
                      ? "text-vibe-success"
                      : "text-vibe-danger"
                  }`}
                >
                  {usernameAvailability.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-vibe-primary px-4 py-3 text-sm font-semibold text-white shadow-panel hover:bg-vibe-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Continue"}
              {!loading && <FiArrowRight size={16} />}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ChooseUsername;
