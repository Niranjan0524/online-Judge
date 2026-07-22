import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiAward,
  FiBriefcase,
  FiClock,
  FiFileText,
} from "react-icons/fi";
import { useAuth } from "../store/AuthContext";

const Explore = () => {
  const { user } = useAuth();

  const actions = [
    {
      label: "Resume Reviewer",
      to: "/resume-reviewer",
      icon: FiBriefcase,
      description: "Get targeted feedback before applying.",
    },
    user?.type === "user"
      ? {
          label: "Participate in Contest",
          to: "/contest",
          icon: FiAward,
          description: "Compete in timed problem sets.",
        }
      : null,
    {
      label: "Host a Contest",
      to: "/host-contest",
      icon: FiClock,
      description: "Contest creation is coming soon.",
      badge: "Upcoming",
    },
    {
      label: "Blog",
      to: "/blog",
      icon: FiFileText,
      description: "Editorials and updates are coming soon.",
      badge: "Upcoming",
    },
  ].filter(Boolean);

  return (
    <aside className="w-full rounded-2xl border border-vibe-border bg-vibe-surface p-5 shadow-panel md:max-w-md">
      <div className="mb-5">
        <p className="text-sm font-semibold text-vibe-text">Explore CodeVibe</p>
        <p className="mt-1 text-sm text-vibe-subtext">
          Jump into the workflows that support deliberate practice.
        </p>
      </div>

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.label}
              to={action.to}
              className="group flex items-center gap-4 rounded-xl border border-vibe-border bg-vibe-elevated/60 p-4 hover:border-vibe-primary/60 hover:bg-vibe-elevated"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-vibe-border bg-vibe-background text-vibe-secondary group-hover:border-vibe-secondary/60">
                <Icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-semibold text-vibe-text">
                  {action.label}
                  {action.badge && (
                    <span className="rounded-full border border-vibe-warning/30 bg-vibe-warning/10 px-2 py-0.5 text-[11px] font-medium text-vibe-warning">
                      {action.badge}
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-sm text-vibe-subtext">
                  {action.description}
                </span>
              </span>
              <FiArrowRight
                size={17}
                className="text-vibe-muted group-hover:translate-x-0.5 group-hover:text-vibe-text"
              />
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Explore;
