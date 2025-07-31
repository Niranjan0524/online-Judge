import { useAuth } from "../store/AuthContext";
import { Link } from "react-router-dom";
import { useEffect ,useState} from "react";
import { LineWave } from "react-loader-spinner";

const Explore=()=>{

  const {user,isLoggedIn} =useAuth();



  return (
    <>
      <div className="glass-card bg-slate-800 w-full md:w-[400px] p-8 flex flex-col gap-6 shadow-2xl border border-gray-700 hover:border-yellow-400 transition animate-fade-in">
        <h3 className="text-2xl font-bold text-center mb-2 text-yellow-400 tracking-wide animate-bounce">
          Explore Our Features
        </h3>

        <div className="flex flex-col gap-4">
          <Link
            to="/resume-reviewer"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold py-3 rounded-lg shadow-md text-lg transition transform hover:scale-105 hover:from-grey-600 hover:to-grey-600 hover:shadow-xl animate-slide-in border border-slate-500/30"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Resume Reviewer
          </Link>
          <Link
            to="/host-contest"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold py-3 rounded-lg shadow-md text-lg transition transform hover:scale-105 hover:from-grey-600 hover:to-grey-600 hover:shadow-xl animate-slide-in border border-slate-500/30"
            style={{ animationDelay: "0.1s" }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 8v4l3 3"></path>
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
            Host a Contest
            <span className="text-xs font-bold uppercase tracking-wide bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 text-black px-3 py-1 rounded-full ml-2 shadow-lg ring-2 ring-yellow-300 animate-pulse">
              upcoming
            </span>
          </Link>
          {user && user.type === "user" && (
            <Link
              to="/contest"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold py-3 rounded-lg shadow-md text-lg transition transform hover:scale-105 hover:from-grey-600 hover:to-grey-600 hover:shadow-xl animate-slide-in border border-slate-500/30"
              style={{ animationDelay: "0.2s" }}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Participate in Contest
              <span className="text-xs font-bold uppercase tracking-wide bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 text-black px-3 py-1 rounded-full ml-2 shadow-lg ring-2 ring-yellow-300 animate-pulse">
                upcoming
              </span>
            </Link>
          )}
          <Link
            to="/blog"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold py-3 rounded-lg shadow-md text-lg transition transform hover:scale-105 hover:from-grey-600 hover:to-grey-600 hover:shadow-xl animate-slide-in border border-slate-500/30"
            style={{ animationDelay: "0.3s" }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
            </svg>
            Blog
            <span className="text-xs font-bold uppercase tracking-wide bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 text-black px-3 py-1 rounded-full ml-2 shadow-lg ring-2 ring-yellow-300 animate-pulse">
              upcoming
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Explore;