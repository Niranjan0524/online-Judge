import toast from "react-hot-toast";
import {
  FiArrowRight,
  FiCheck,
  FiCode,
  FiFileText,
  FiShield,
  FiStar,
  FiZap,
} from "react-icons/fi";

const plans = [
  {
    name: "Monthly",
    price: "Rs. 299",
    cadence: "/ month",
    note: "Flexible access for active practice cycles.",
    badge: "Start small",
    accent: "primary",
    features: [
      "AI Code Review for submitted solutions",
      "AI Resume Review with improvement notes",
      "Priority access to upcoming AI practice tools",
      "Cancel or switch plans later",
    ],
  },
  {
    name: "Yearly",
    price: "Rs. 2,499",
    cadence: "/ year",
    note: "Best value for long-term interview prep.",
    badge: "Best value",
    accent: "success",
    features: [
      "Everything in Monthly",
      "Save compared with month-to-month billing",
      "Full-year access to AI feedback workflows",
      "Early access to premium experiments",
    ],
  },
];

const aiFeatures = [
  {
    title: "AI Code Review",
    description:
      "Get feedback on correctness, readability, edge cases, and ways to improve your submitted solution.",
    icon: FiCode,
    tone: "primary",
  },
  {
    title: "AI Resume Review",
    description:
      "Upload a resume and receive structured notes on strengths, weak spots, and practical improvements.",
    icon: FiFileText,
    tone: "secondary",
  },
];

const toneClasses = {
  primary: "border-vibe-primary/30 bg-vibe-primary/10 text-vibe-primary",
  secondary: "border-vibe-secondary/30 bg-vibe-secondary/10 text-vibe-secondary",
  success: "border-vibe-success/30 bg-vibe-success/10 text-vibe-success",
};

const Subscriptions = () => {
  const handlePlanClick = (planName) => {
    toast(`${planName} subscription checkout is coming soon.`);
  };

  return (
    <div className="min-h-screen bg-vibe-background px-4 py-10 text-vibe-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="grid gap-8 border-b border-vibe-border pb-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-vibe-secondary/30 bg-vibe-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-vibe-secondary">
              <FiStar size={14} />
              Premium AI
            </span>
            <h1 className="mt-5 max-w-3xl font-heading text-4xl font-bold text-vibe-text sm:text-5xl">
              Choose the plan that keeps your practice moving.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-vibe-subtext">
              Unlock CodeVibe&apos;s AI tools for smarter solution feedback and
              sharper resume improvements with a simple plan built around your
              preparation timeline.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {aiFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-vibe-border bg-vibe-surface p-5 shadow-panel"
                >
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${
                      toneClasses[feature.tone]
                    }`}
                  >
                    <Icon size={20} />
                  </span>
                  <h2 className="mt-4 font-heading text-xl font-semibold text-vibe-text">
                    {feature.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-vibe-subtext">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 py-10 lg:grid-cols-2">
          {plans.map((plan) => {
            const isYearly = plan.name === "Yearly";
            return (
              <article
                key={plan.name}
                className={`relative overflow-hidden rounded-2xl border bg-vibe-surface p-6 shadow-panel sm:p-8 ${
                  isYearly
                    ? "border-vibe-success/40"
                    : "border-vibe-border"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                        toneClasses[plan.accent]
                      }`}
                    >
                      {isYearly ? <FiZap size={13} /> : <FiShield size={13} />}
                      {plan.badge}
                    </span>
                    <h2 className="mt-4 font-heading text-3xl font-bold text-vibe-text">
                      {plan.name}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-vibe-subtext">
                      {plan.note}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-heading text-4xl font-bold text-vibe-text">
                      {plan.price}
                    </p>
                    <p className="mt-1 text-sm text-vibe-subtext">
                      {plan.cadence}
                    </p>
                  </div>
                </div>

                <div className="mt-7 h-px bg-vibe-border" />

                <ul className="mt-7 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm leading-6 text-vibe-subtext"
                    >
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-vibe-success/15 text-vibe-success">
                        <FiCheck size={13} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handlePlanClick(plan.name)}
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
                    isYearly
                      ? "bg-vibe-success text-vibe-background hover:bg-vibe-success/90"
                      : "bg-vibe-primary text-white hover:bg-vibe-primary/90"
                  }`}
                >
                  Subscribe {plan.name}
                  <FiArrowRight size={16} />
                </button>
              </article>
            );
          })}
        </section>

        <section className="rounded-2xl border border-vibe-border bg-vibe-surface p-5 shadow-panel sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-vibe-secondary">
                Included with both plans
              </p>
              <h2 className="mt-3 font-heading text-2xl font-bold text-vibe-text">
                Built for focused coding and career prep.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Solution feedback", "Resume insights", "Future AI tools"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-vibe-border bg-vibe-background px-4 py-3 text-sm font-semibold text-vibe-text"
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
};

export default Subscriptions;
