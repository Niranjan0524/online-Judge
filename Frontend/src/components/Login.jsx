import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowRight, FiGithub, FiLock, FiMail } from "react-icons/fi";
import { useAuth } from "../store/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const loginWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (email === "" || password === "") {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields");
      return;
    }

    setError(null);
    setLoading(true);
    const toastId = toast.loading("Logging in...");

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        const data = await res.json();

        if (res.status !== 200) {
          setError(data.message || "Login failed");
          toast.dismiss(toastId);
          toast.error(data.message);
        } else {
          login(data);

          navigate("/");
          toast.dismiss(toastId);
          toast.success("Login successful");
        }
      })
      .catch((err) => {
        console.log("Error:", err);
        setError(err.message);
        toast.dismiss(toastId);
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/getUser`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        const data = await res.json();
        if (res.status === 200) {
          login(data);

          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          toast.success("Login successful");
          navigate("/");
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-vibe-background px-4 py-10 text-vibe-text sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <section className="hidden lg:block">
          <p className="text-sm font-semibold uppercase tracking-wide text-vibe-secondary">
            Welcome back
          </p>
          <h1 className="mt-4 max-w-xl font-heading text-5xl font-bold leading-tight text-vibe-text">
            Continue your coding momentum.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-8 text-vibe-subtext">
            Sign in to resume problem solving, review submissions, and keep your
            progress moving across the CodeVibe workspace.
          </p>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {["Problems", "AI review", "Leaderboard"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-vibe-border bg-vibe-surface p-4 text-sm font-medium text-vibe-subtext"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-2xl border border-vibe-border bg-vibe-surface p-6 shadow-subtle sm:p-8">
          <div>
            <p className="font-heading text-2xl font-bold text-vibe-text">
              Login
            </p>
            <p className="mt-2 text-sm text-vibe-subtext">
              Enter your credentials to access your workspace.
            </p>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-vibe-danger/30 bg-vibe-danger/10 px-4 py-3 text-sm text-vibe-danger">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
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
                  placeholder="Enter your password"
                  className="block w-full rounded-xl border border-vibe-border bg-vibe-background py-3 pl-10 pr-3 text-sm text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/50 focus:border-vibe-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-vibe-primary px-4 py-3 text-sm font-semibold text-white shadow-panel hover:bg-vibe-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
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
              onClick={loginWithGoogle}
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
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-vibe-primary hover:text-vibe-primary/80"
            >
              Sign up
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Login;
