import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-vibe-background px-4 text-vibe-text">
      <section className="max-w-lg rounded-2xl border border-vibe-border bg-vibe-surface p-8 text-center shadow-subtle">
        <p className="font-heading text-7xl font-bold text-vibe-primary">404</p>
        <h1 className="mt-4 font-heading text-3xl font-bold text-vibe-text">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm leading-7 text-vibe-subtext">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-xl bg-vibe-primary px-5 py-3 text-sm font-semibold text-white hover:bg-vibe-primary/90"
        >
          Go Home
        </Link>
      </section>
    </div>
  );
};

export default PageNotFound;
