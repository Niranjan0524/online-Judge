import AnimatedHeadline from "./AnimatedHeadline";
import BackToTopButton from "./BackToTop";
import Explore from "./Explore";
import Features from "./Features";
import Footer from "./Footer";
import Problems from "./Problems";
import HomePageImage from "../assets/HomePageImage.jpg";

const Home = () => {
  const scrollToProblems = () => {
    document.getElementById("problems")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-vibe-background text-vibe-text">
      <section className="border-b border-vibe-border px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <AnimatedHeadline />
            <p className="mt-6 max-w-2xl text-base leading-8 text-vibe-subtext sm:text-lg">
              Solve coding challenges, get instant feedback, review submissions,
              and climb the leaderboard in a clean developer-first interface.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={scrollToProblems}
                className="rounded-xl bg-vibe-primary px-5 py-3 text-sm font-semibold text-white shadow-panel hover:bg-vibe-primary/90"
              >
                Start solving
              </button>
              <a
                href="#features"
                className="rounded-xl border border-vibe-border bg-vibe-surface px-5 py-3 text-center text-sm font-semibold text-vibe-text hover:border-vibe-primary/60 hover:bg-vibe-elevated"
              >
                Explore features
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {[
                ["Fast", "judge feedback"],
                ["AI", "code review"],
                ["Live", "leaderboards"],
              ].map(([value, label]) => (
                <div
                  key={value}
                  className="rounded-2xl border border-vibe-border bg-vibe-surface p-4"
                >
                  <p className="font-heading text-xl font-bold text-vibe-text">
                    {value}
                  </p>
                  <p className="mt-1 text-xs text-vibe-subtext">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-vibe-border bg-vibe-surface shadow-subtle">
              <img
                src={HomePageImage}
                alt="CodeVibe dashboard preview"
                className="h-56 w-full object-cover sm:h-72"
              />
              <div className="border-t border-vibe-border p-4">
                <p className="text-sm font-semibold text-vibe-text">
                  Premium practice workspace
                </p>
                <p className="mt-1 text-sm text-vibe-subtext">
                  Designed around readability, speed, and focused iteration.
                </p>
              </div>
            </div>
            <Explore />
          </div>
        </div>
      </section>

      <section id="problems" className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Problems />
        </div>
      </section>

      <BackToTopButton />

      <section
        id="features"
        className="border-t border-vibe-border px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <Features />
        </div>
      </section>

      <section
        id="about"
        className="border-t border-vibe-border px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-vibe-secondary">
            About
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-vibe-text">
            A modern online judge for serious practice
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-vibe-subtext">
            CodeVibe brings problem solving, submissions, contests, AI review,
            and progress tracking into one streamlined platform inspired by the
            best developer tools.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
