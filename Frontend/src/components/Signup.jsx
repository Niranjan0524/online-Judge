import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowRight, FiGithub, FiLock, FiMail, FiUser } from "react-icons/fi";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "user",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const errors = Array.isArray(error) ? error : error ? [error] : [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(null);
    setLoading(true);
    const toastId = toast.loading("Signing up...");

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        const data = await res.json();

        if (res.status !== 200) {
          setError(data.errors || "Signup failed");
          toast.dismiss(toastId);
          toast.error("Signup failed");
        } else {
          navigate("/login");
          toast.dismiss(toastId);
          toast.success("Signup successful");
        }
      })
      .catch(() => {
        setError("An error occurred during signup. Please try again.");
        toast.dismiss(toastId);
        toast.error("An error occurred during signup. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const signupWithGoogle = () => {
    toast.error("This feature is under development, sorry for the inconvenience");
  };

  return (
    <div className="min-h-screen bg-vibe-background px-4 py-10 text-vibe-text sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1fr]">
        <section className="mx-auto w-full max-w-xl rounded-2xl border border-vibe-border bg-vibe-surface p-6 shadow-subtle sm:p-8">
          <div>
            <p className="font-heading text-2xl font-bold text-vibe-text">
              Create account
            </p>
            <p className="mt-2 text-sm text-vibe-subtext">
              Set up your CodeVibe workspace and start solving.
            </p>
          </div>

          {errors.length > 0 && (
            <div className="mt-5 rounded-xl border border-vibe-danger/30 bg-vibe-danger/10 px-4 py-3 text-sm text-vibe-danger">
              <ul className="space-y-1">
                {errors.map((item, idx) => (
                  <li key={`${item}-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-vibe-subtext"
              >
                Full Name
              </label>
              <div className="relative mt-2">
                <FiUser
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-vibe-muted"
                />
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                  className="block w-full rounded-xl border border-vibe-border bg-vibe-background py-3 pl-10 pr-3 text-sm text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/50 focus:border-vibe-primary"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-vibe-subtext"
              >
                Email
              </label>
              <div className="relative mt-2">
                <FiMail
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-vibe-muted"
                />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="you@example.com"
                  className="block w-full rounded-xl border border-vibe-border bg-vibe-background py-3 pl-10 pr-3 text-sm text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/50 focus:border-vibe-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-vibe-subtext"
                >
                  Password
                </label>
                <div className="relative mt-2">
                  <FiLock
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-vibe-muted"
                  />
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Password"
                    className="block w-full rounded-xl border border-vibe-border bg-vibe-background py-3 pl-10 pr-3 text-sm text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/50 focus:border-vibe-primary"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-vibe-subtext"
                >
                  Confirm Password
                </label>
                <div className="relative mt-2">
                  <FiLock
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-vibe-muted"
                  />
                  <input
                    type="password"
                    id="confirm-password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm"
                    className="block w-full rounded-xl border border-vibe-border bg-vibe-background py-3 pl-10 pr-3 text-sm text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/50 focus:border-vibe-primary"
                  />
                </div>
              </div>
            </div>

            <fieldset>
              <legend className="block text-sm font-medium text-vibe-subtext">
                User Type
              </legend>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {[
                  ["user", "Normal"],
                  ["admin", "Admin"],
                ].map(([value, label]) => (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold ${
                      formData.type === value
                        ? "border-vibe-primary bg-vibe-primary/10 text-vibe-text"
                        : "border-vibe-border bg-vibe-background text-vibe-subtext hover:border-vibe-primary/60 hover:text-vibe-text"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={value}
                      checked={formData.type === value}
                      onChange={() => setFormData({ ...formData, type: value })}
                      className="sr-only"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-vibe-primary px-4 py-3 text-sm font-semibold text-white shadow-panel hover:bg-vibe-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <FiArrowRight size={16} />}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-vibe-border" />
            <span className="text-xs font-medium uppercase tracking-wide text-vibe-muted">
              or
            </span>
            <div className="h-px flex-1 bg-vibe-border" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              className="flex items-center justify-center gap-2 rounded-xl border border-vibe-border bg-vibe-background px-4 py-3 text-sm font-semibold text-vibe-text hover:border-vibe-primary/60 hover:bg-vibe-elevated"
              onClick={signupWithGoogle}
              type="button"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt=""
                className="h-5 w-5"
              />
              Google
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-xl border border-vibe-border bg-vibe-background px-4 py-3 text-sm font-semibold text-vibe-text hover:border-vibe-primary/60 hover:bg-vibe-elevated"
              type="button"
            >
              <FiGithub size={18} />
              GitHub
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-vibe-subtext">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-vibe-primary hover:text-vibe-primary/80"
            >
              Login
            </Link>
          </p>
        </section>

        <section className="hidden lg:block">
          <p className="text-sm font-semibold uppercase tracking-wide text-vibe-secondary">
            New workspace
          </p>
          <h1 className="mt-4 max-w-xl font-heading text-5xl font-bold leading-tight text-vibe-text">
            Build a habit around clear feedback.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-8 text-vibe-subtext">
            Create an account to track solved problems, submissions, contests,
            and leaderboard progress in one focused interface.
          </p>
          <div className="mt-8 rounded-2xl border border-vibe-border bg-vibe-surface p-5 shadow-panel">
            <p className="text-sm font-semibold text-vibe-text">
              Included from day one
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-vibe-subtext">
              {["Problem solving", "Submissions", "Progress dashboard", "Contests"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-vibe-border bg-vibe-background p-3"
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
