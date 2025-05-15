import AnimatedHeadline from "./AnimatedHeadline";
import { useAuth } from "../store/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useState } from "react";

const features = [
  {
    icon: (
      <svg
        className="w-8 h-8 text-cyan-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 4v16m8-8H4"></path>
      </svg>
    ),
    title: "Fast loading",
    desc: "Optimized for speed and seamless experience.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-pink-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 8v4l2 2"></path>
      </svg>
    ),
    title: "Real-time Feedback",
    desc: "Instant code evaluation and results.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-yellow-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect width="20" height="14" x="2" y="5" rx="2"></rect>
        <path d="M2 10h20"></path>
      </svg>
    ),
    title: "Creative Design",
    desc: "Modern glassmorphism UI for Gen Z.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-lime-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M5 13l4 4L19 7"></path>
      </svg>
    ),
    title: "Fully Responsive",
    desc: "Works beautifully on all devices.",
  },
];

const Home = () => {

  const sampleProblems = [
    {
      id: 1,
      name: "Two Sum",
      difficulty: "Easy",
      rating: 4.2,
      tags: ["Array", "Hash Table"],
    },
    {
      id: 2,
      name: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      rating: 4.8,
      tags: ["Array", "Binary Search", "Divide and Conquer"],
    },
    {
      id: 3,
      name: "Valid Parentheses",
      difficulty: "Easy",
      rating: 4.0,
      tags: ["Stack", "String"],
    },
    {
      id: 4,
      name: "Word Ladder",
      difficulty: "Medium",
      rating: 4.5,
      tags: ["BFS", "Graph"],
    },
  ];
  const difficultyColors = {
    Easy: "text-green-400 border-green-400",
    Medium: "text-yellow-400 border-yellow-400",
    Hard: "text-red-400 border-red-400",
  };
  
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogin = () => navigate("/login");
  const handleLogout = () => {
    const status = confirm("Are you sure you want to logout?");
    const toastId = toast.loading("Logging out...");
    if (status) {
      setTimeout(() => {
        logout();
        navigate("/login");
        toast.dismiss(toastId);
      }, 2000);
    } else {
      toast.dismiss(toastId);
      toast.error("You are Logged in");
    }
  };

  const [sortBy, setSortBy] = useState("name");
  const [problems, setProblems] = useState(sampleProblems);

  const sortedProblems = [...problems].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "difficulty")
      return a.difficulty.localeCompare(b.difficulty);
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const {user}=useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6">
        <div className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-gray-400 to-yellow-400">
          CodeVibe
        </div>
      
        <div className="space-x-6 text-lg flex items-center">
          <a href="#" className="hover:text-cyan-400 transition">
            Home
          </a>
          <a href="#problems" className="hover:text-red-400 transition">
            Problems
          </a>
          <a href="#features" className="hover:text-pink-400 transition">
            Features
          </a>
          <a href="#about" className="hover:text-yellow-400 transition">
            About
          </a>
          {isLoggedIn ? (
            <button
              className="border border-cyan-400 rounded px-4 py-1 hover:bg-cyan-400 hover:text-black transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="border border-pink-400 rounded px-4 py-1 hover:bg-pink-400 hover:text-black transition"
              onClick={handleLogin}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 md:py-24">
        <div className="max-w-xl mb-12 md:mb-0">
          <AnimatedHeadline />
          <p className="text-lg text-gray-200 mb-8">
            Solve coding challenges, get instant feedback, and climb the
            leaderboard-all in a sleek, glassy interface.
          </p>
          <button className="bg-gradient-to-r from-red-400 via-grey-400 to-yellow-700 text-black font-bold py-3 px-8 rounded-xl shadow-lg hover:scale-105 transition">
            Get Started
          </button>
        </div>
      </section>


      {/* Problems List Section */}
      <section
        id="problems"
        className="max-w-5xl mx-auto px-6 py-10 border-t border-gray-700"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-100">Problems</h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-gray-200 focus:outline-none"
            >
              <option value="name">Name</option>
              <option value="difficulty">Difficulty</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 ">
          {sortedProblems.map((problem) => (
            <div
              key={problem.id}
              className="glass-card flex flex-col md:flex-row md:items-center justify-between p-6 border border-gray-700 hover:border-blue-400 transition hover:scale-105 transition"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-semibold text-gray-100">
                    {problem.name}
                  </span>
                  <span
                    className={`border px-2 py-0.5 rounded-full text-xs font-bold ${
                      difficultyColors[problem.difficulty] ||
                      "text-gray-400 border-gray-400"
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-1">
                  {problem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs border border-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 md:mt-0">
                <span className="text-black font-bold">★ {problem.rating}</span>
                <button className="bg-blue-200 text-black font-bold px-4 py-1 rounded hover:scale-105 transition">
                  Solve
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-gray-700 pt-8 ">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`glass-card feature-card delay-${
                i + 1
              } flex flex-col items-center text-center p-8 `}
              style={{ animationFillMode: "forwards" }}
            >
              <div className="mb-4 hover:scale-125 transition ">{f.icon}</div>
              <h4 className="text-xl font-bold mb-2">{f.title}</h4>
              <p className="text-gray-200">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 py-8 text-center text-gray-400">
        &copy; 2025 CodeVibe. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;


//alternate hero sectino:
{/* <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 md:py-24">
 Headline & CTA 
  <div className="max-w-xl mb-12 md:mb-0">
    <AnimatedHeadline />
    <p className="text-lg text-gray-200 mb-8">
      Solve coding challenges, get instant feedback, and climb the
      leaderboard-all in a sleek, glassy interface.
    </p>
    <button className="bg-gradient-to-r from-red-400 via-gray-400 to-yellow-700 text-black font-bold py-3 px-8 rounded-xl shadow-lg hover:scale-105 transition">
      Get Started
    </button>
  </div>

  
  <div className="glass-card w-full md:w-[400px] p-6 flex flex-col gap-4 shadow-2xl border border-gray-700 hover:border-yellow-400 transition">
  
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <svg
          className="w-6 h-6 text-yellow-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 4v16m8-8H4"></path>
        </svg>
        <span className="font-bold text-lg text-yellow-400">4,500+</span>
        <span className="text-gray-300 text-sm">Problems</span>
      </div>
      <div className="flex items-center gap-2">
        <svg
          className="w-6 h-6 text-cyan-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
        <span className="font-bold text-lg text-cyan-400">50K+</span>
        <span className="text-gray-300 text-sm">Coders</span>
      </div>
    </div>
  
    <div className="border-b border-gray-700 my-2" />

    
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm px-2 py-0.5 rounded-full bg-yellow-900/70 text-yellow-300 font-bold">
          Featured
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-900/70 text-cyan-300">
          #Graph
        </span>
      </div>
      <div className="font-semibold text-lg text-white mb-1">Word Ladder</div>
      <div className="flex items-center gap-2 mb-2">
        <span className="border border-yellow-400 text-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full">
          Medium
        </span>
        <span className="text-xs text-gray-400">★ 4.5</span>
      </div>
      <p className="text-gray-300 text-sm mb-2">
        Transform one word into another by changing only one letter at a time.
        Each intermediate word must exist in the dictionary.
      </p>
      <button className="bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 text-black font-semibold px-4 py-1 rounded-lg hover:scale-105 transition text-sm">
        Try Now
      </button>
    </div>

   
    <div className="flex items-center gap-2 mt-4">
      <img
        src="https://randomuser.me/api/portraits/men/32.jpg"
        alt="user1"
        className="w-7 h-7 rounded-full border-2 border-yellow-400"
      />
      <img
        src="https://randomuser.me/api/portraits/women/44.jpg"
        alt="user2"
        className="w-7 h-7 rounded-full border-2 border-pink-400"
      />
      <img
        src="https://randomuser.me/api/portraits/men/45.jpg"
        alt="user3"
        className="w-7 h-7 rounded-full border-2 border-cyan-400"
      />
      <span className="text-xs text-gray-300 ml-2">+2,000 are solving now</span>
    </div>
  </div>
</section> */}
