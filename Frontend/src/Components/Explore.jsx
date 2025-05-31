import { useAuth } from "../store/authContext";


const Explore=()=>{

  const {user} =useAuth();

  return (
    <>
    <div className="glass-card w-full md:w-[400px] p-8 flex flex-col gap-6 shadow-2xl border border-gray-700 hover:border-yellow-400 transition animate-fade-in">
              <h3 className="text-2xl font-bold text-center mb-2 text-yellow-400 tracking-wide animate-bounce">
                Up Comings
              </h3>
              <div className="flex flex-col gap-4">
                <a
                  href="/resume-reviewer"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold py-3 rounded-lg shadow-md text-lg transition transform hover:scale-105 hover:from-blue-400 hover:to-cyan-500 hover:shadow-xl animate-slide-in"
                >
                  <svg
                    className="w-6 h-6 text-black"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Resume Reviewer
                </a>
                <a
                  href="/host-contest"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-400 to-red-400 text-black font-bold py-3 rounded-lg shadow-md text-lg transition transform hover:scale-105 hover:from-red-400 hover:to-pink-400 hover:shadow-xl animate-slide-in"
                  style={{ animationDelay: "0.1s" }}
                >
                  <svg
                    className="w-6 h-6 text-black"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 8v4l3 3"></path>
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                  Host a Contest
                </a>
                {user &&user.type==="user" &&
                  <a
                  href="/participate-contest"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-3 rounded-lg shadow-md text-lg transition transform hover:scale-105 hover:from-orange-400 hover:to-yellow-400 hover:shadow-xl animate-slide-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  <svg
                    className="w-6 h-6 text-black"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Participate in Contest
                </a>}
                <a
                  href="/blog"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-lime-400 to-green-400 text-black font-bold py-3 rounded-lg shadow-md text-lg transition transform hover:scale-105 hover:from-green-400 hover:to-lime-400 hover:shadow-xl animate-slide-in"
                  style={{ animationDelay: "0.3s" }}
                >
                  <svg
                    className="w-6 h-6 text-black"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  </svg>
                  Blog
                </a>
              </div>
            </div>
    </>
  )
}

export default Explore;