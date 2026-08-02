import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiMail, FiSave, FiShield, FiUser } from "react-icons/fi";
import { useAuth } from "../store/AuthContext";
import LoadingState from "./LoadingState";

const defaultPrivacySettings = {
  publicProfile: "public",
  solvedProblems: "public",
  submissionHistory: "public",
  contestHistory: "public",
};

const privacyOptions = [
  {
    key: "publicProfile",
    label: "Public Profile",
    description: "Show your basic public profile details.",
  },
  {
    key: "solvedProblems",
    label: "Solved Problems",
    description: "Show solved problem totals and difficulty counts.",
  },
  {
    key: "submissionHistory",
    label: "Submission History",
    description: "Show total submissions and acceptance rate.",
  },
  {
    key: "contestHistory",
    label: "Contest History",
    description: "Show total contests participated.",
  },
];

const EditProfile = () => {
  const { user, token, isLoggedIn, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [privacySettings, setPrivacySettings] = useState(defaultPrivacySettings);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
      setPrivacySettings({
        ...defaultPrivacySettings,
        ...(user.privacySettings || {}),
      });
    }
  }, [user]);

  const validateForm = () => {
    const validationErrors = [];
    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name) {
      validationErrors.push("Name is Required");
    }
    if (name && name.length < 3) {
      validationErrors.push("Name should be at least 3 characters long");
    }
    if (name && !/^[a-zA-Z ]+$/.test(name)) {
      validationErrors.push("Name should only contain alphabets");
    }
    if (!email) {
      validationErrors.push("Email is Required");
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.push("Email is not valid");
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the highlighted profile details");
      return;
    }

    setLoading(true);
    setErrors([]);
    const toastId = toast.loading("Updating profile...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            privacySettings: privacySettings,
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        const responseErrors = data.errors || data.message || "Profile update failed";
        setErrors(Array.isArray(responseErrors) ? responseErrors : [responseErrors]);
        toast.dismiss(toastId);
        toast.error("Profile update failed");
        return;
      }

      updateUser(data.user);
      toast.dismiss(toastId);
      toast.success(data.message || "Profile updated successfully");
      navigate("/profile");
    } catch (error) {
      setErrors([error.message || "Unable to update profile right now"]);
      toast.dismiss(toastId);
      toast.error("Unable to update profile right now");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn && !token) {
    return (
      <div className="min-h-screen bg-vibe-background px-4 py-10 text-vibe-text sm:px-6 lg:px-8">
        <section className="mx-auto max-w-xl rounded-2xl border border-vibe-border bg-vibe-surface p-8 text-center shadow-panel">
          <h1 className="font-heading text-2xl font-bold text-vibe-text">
            Login required
          </h1>
          <p className="mt-3 text-sm leading-6 text-vibe-subtext">
            You need to be logged in to edit your profile.
          </p>
          <Link
            to="/login"
            className="mt-7 inline-flex rounded-xl bg-vibe-primary px-5 py-3 text-sm font-semibold text-white hover:bg-vibe-primary/90"
          >
            Login
          </Link>
        </section>
      </div>
    );
  }

  if (token && !user) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-vibe-background px-4 py-10 text-vibe-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-vibe-secondary">
              Profile Settings
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold text-vibe-text">
              Edit Profile
            </h1>
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-vibe-border bg-vibe-surface px-4 py-2.5 text-sm font-semibold text-vibe-text hover:border-vibe-primary/60 hover:bg-vibe-elevated"
          >
            <FiArrowLeft size={16} />
            Back
          </Link>
        </div>

        <section className="rounded-2xl border border-vibe-border bg-vibe-surface p-6 shadow-panel sm:p-8">
          {errors.length > 0 && (
            <div className="mb-6 rounded-xl border border-vibe-danger/30 bg-vibe-danger/10 px-4 py-3 text-sm text-vibe-danger">
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={`${error}-${index}`}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="profile-name"
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
                  id="profile-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full rounded-xl border border-vibe-border bg-vibe-background py-3 pl-10 pr-3 text-sm text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/50 focus:border-vibe-primary"
                />
              </div>
              <p className="mt-2 text-xs text-vibe-muted">
                This is also used as your public profile URL name.
              </p>
            </div>

            <div>
              <label
                htmlFor="profile-email"
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
                  id="profile-email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full rounded-xl border border-vibe-border bg-vibe-background py-3 pl-10 pr-3 text-sm text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/50 focus:border-vibe-primary"
                />
              </div>
            </div>

            <div>
              <p className="block text-sm font-medium text-vibe-subtext">
                Account Type
              </p>
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-vibe-border bg-vibe-background px-4 py-3 text-sm text-vibe-subtext">
                <FiShield size={16} className="text-vibe-primary" />
                <span className="font-medium text-vibe-text">
                  {user?.type || "user"}
                </span>
              </div>
            </div>

            <div className="border-t border-vibe-border pt-6">
              <div>
                <h2 className="font-heading text-xl font-semibold text-vibe-text">
                  Profile Privacy
                </h2>
                <p className="mt-2 text-sm text-vibe-subtext">
                  Choose which profile sections other visitors can see.
                </p>
              </div>

              <div className="mt-5 space-y-4">
                {privacyOptions.map((option) => (
                  <div
                    key={option.key}
                    className="rounded-xl border border-vibe-border bg-vibe-background p-4"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-vibe-text">
                          {option.label}
                        </p>
                        <p className="mt-1 text-sm text-vibe-subtext">
                          {option.description}
                        </p>
                      </div>
                      <div className="grid w-full grid-cols-2 overflow-hidden rounded-xl border border-vibe-border bg-vibe-surface p-1 sm:w-56">
                        {["public", "private"].map((visibility) => (
                          <button
                            key={visibility}
                            type="button"
                            onClick={() =>
                              setPrivacySettings({
                                ...privacySettings,
                                [option.key]: visibility,
                              })
                            }
                            className={`rounded-lg px-3 py-2 text-sm font-semibold capitalize ${
                              privacySettings[option.key] === visibility
                                ? "bg-vibe-primary text-white"
                                : "text-vibe-subtext hover:bg-vibe-elevated hover:text-vibe-text"
                            }`}
                          >
                            {visibility}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-vibe-primary px-4 py-3 text-sm font-semibold text-white shadow-panel hover:bg-vibe-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <FiSave size={16} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default EditProfile;
