const AnimatedHeadline = () => {
  return (
    <div className="space-y-5">
      <div className="inline-flex items-center gap-2 rounded-full border border-vibe-border bg-vibe-surface px-3 py-1 text-xs font-medium text-vibe-subtext">
        <span className="h-1.5 w-1.5 rounded-full bg-vibe-success" />
        AI-powered coding practice
      </div>
      <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight text-vibe-text sm:text-5xl lg:text-6xl">
        Practice, submit, and improve in one focused coding workspace.
      </h1>
    </div>
  );
};

export default AnimatedHeadline;
