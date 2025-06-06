import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="bg-white/10 backdrop-blur-lg border border-yellow-400/30 rounded-3xl shadow-2xl px-10 py-12 flex flex-col items-center animate-fade-in">
        <h1 className="text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg mb-2">
          404
        </h1>
        <p className="mt-2 text-2xl md:text-3xl font-bold text-yellow-300 drop-shadow">
          Page Not Found
        </p>
        <p className="mt-2 text-gray-300 text-lg text-center max-w-md">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-red-400 via-red-600 to-red-400 text-gray-900 font-bold shadow-lg hover:scale-105 transition-all duration-200"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
