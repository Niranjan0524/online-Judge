import { FiCheckCircle, FiCpu, FiRefreshCw, FiZap } from "react-icons/fi";

const Features = () => {
  const features = [
    {
      icon: FiZap,
      title: "Fast feedback",
      desc: "Run code, inspect output, and submit without leaving the workspace.",
    },
    {
      icon: FiRefreshCw,
      title: "Live progress",
      desc: "Track submissions, solved tags, accuracy, and leaderboard movement.",
    },
    {
      icon: FiCpu,
      title: "AI assist",
      desc: "Use reviews and resume feedback as coaching layers around practice.",
    },
    {
      icon: FiCheckCircle,
      title: "Responsive UI",
      desc: "A focused interface that stays usable across desktop, tablet, and mobile.",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-vibe-secondary">
          Platform
        </p>
        <h2 className="mt-3 font-heading text-3xl font-bold text-vibe-text">
          Built for consistent coding momentum
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article
              key={feature.title}
              className="rounded-2xl border border-vibe-border bg-vibe-surface p-5 shadow-panel hover:border-vibe-primary/50 hover:bg-vibe-elevated"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-vibe-border bg-vibe-background text-vibe-primary">
                <Icon size={20} />
              </div>
              <h3 className="font-heading text-lg font-semibold text-vibe-text">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-vibe-subtext">
                {feature.desc}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Features;
