import { useState,useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import toast from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";

const Header=()=>{

  const navigate = useNavigate();
  const { isLoggedIn, logout ,user} = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileBtnRef = useRef();


  const handleLogout = () => {
    const status = confirm("Are you sure you want to logout?");
    const toastId = toast.loading("Logging out...");
    if (status) {
      setTimeout(() => {
        logout();
        navigate("/login");
        toast.dismiss(toastId);
        toast.success("Logged out successfully");
      }, 2000);
    } else {
      toast.dismiss(toastId);
      toast.error("You are Logged in");
    }
  };
  useEffect(() => {
    function handleClick(e) {
      if (
        showProfileMenu &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showProfileMenu]);
  return (
    <>
      <nav
        className="relative flex justify-between items-center px-8 py-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white
  before:content-[''] before:absolute before:left-0 before:bottom-0 before:w-full before:h-[3px] before:bg-gradient-to-r before:from-red-400 before:via-gray-400 before:to-yellow-400"
      >
        <Link to="/">
          <div className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-gray-400 to-yellow-400 ">
            CodeVibe
          </div>
        </Link>

        <div className="space-x-6 text-lg flex items-center">
          <Link
            to="/"
            className="hover:text-cyan-400 transition hover:border-b-2 border-cyan-400"
          >
            Home
          </Link>
          <Link
            to="/#problems"
            className="hover:text-red-400 transition hover:border-b-2 border-red-400"
          >
            Problems
          </Link>
          <Link
            to="/dashboard"
            className="hover:text-green-700 transition hover:border-b-2 border-green-700"
          >
            Dashboard
          </Link>
          <Link
            to="/#features"
            className="hover:text-pink-400 transition hover:border-b-2 border-pink-400"
          >
            Features
          </Link>
          <Link
            to="/#about"
            className="hover:text-yellow-400 transition hover:border-b-2 border-yellow-400"
          >
            About
          </Link>

          {isLoggedIn && (
            <div
              className="relative group"
              ref={profileBtnRef}
              onMouseEnter={() => setShowProfileMenu(true)}
              onMouseLeave={() =>
                setTimeout(() => setShowProfileMenu(false), 100)
              }
            >
              <Link to="/profile">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-yellow-400 text-yellow-400 font-semibold rounded-full shadow hover:bg-gray-700 hover:text-yellow-300 transition"
                  type="button"
                >
                  <CgProfile size={25} />
                  {isLoggedIn ? `Hello, ${user.name}` : "Profile"}
                </button>
              </Link>
              {showProfileMenu && (
                <div
                  className="absolute right-0  w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-lg  transition z-50"
                  onMouseEnter={() => setShowProfileMenu(true)}
                  onMouseLeave={() =>
                    setTimeout(() => setShowProfileMenu(false), 200)
                  }
                >
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-gray-100 hover:bg-gray-800 hover:text-yellow-400 transition"
                  >
                    Settings
                  </Link>
                  {" "}
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-gray-100 hover:bg-gray-800 hover:text-yellow-400 transition"
                  >
                    DashBoard
                  </Link>
                  {isLoggedIn ? (
                    <button
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300 transition rounded-b-lg"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-gray-100 hover:bg-gray-800 hover:text-yellow-400 transition rounded-b-lg"
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
          {!isLoggedIn && (
            <Link
              to="/login"
              className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold rounded-full shadow-lg hover:bg-white/20 hover:border-cyan-300 hover:text-cyan-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
      <main className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] min-h-screen">
        <Outlet />
      </main>
    </>
  );
}

export default Header;  