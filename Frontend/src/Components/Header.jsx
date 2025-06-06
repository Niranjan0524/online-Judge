import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import toast from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
const Header=()=>{

  const navigate = useNavigate();
  const { isLoggedIn, logout ,user} = useAuth();

  
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
          <a
            href="/#"
            className="hover:text-cyan-400 transition hover:border-b-2 border-cyan-400"
          >
            Home
          </a>
          <a
            href="/#problems"
            className="hover:text-red-400 transition hover:border-b-2 border-red-400"
          >
            Problems
          </a>
          <a
            href="/#features"
            className="hover:text-pink-400 transition hover:border-b-2 border-pink-400"
          >
            Features
          </a>
          <a
            href="/#about"
            className="hover:text-yellow-400 transition hover:border-b-2 border-yellow-400"
          >
            About
          </a>

          <div className="relative group">
            <Link to='/profile'>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-yellow-400 text-yellow-400 font-semibold rounded-full shadow hover:bg-gray-700 hover:text-yellow-300 transition">
              <CgProfile size={25} />
              {isLoggedIn ? `Hello, ${user.name}` : "Profile"}
            </button>
            </Link>
            <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition z-50">
            
              <a
                href="/settings"
                className="block px-4 py-2 text-gray-100 hover:bg-gray-800 hover:text-yellow-400 transition"
              >
                Settings
              </a>
              <a
                href="/dashboard"
                className="block px-4 py-2 text-gray-100 hover:bg-gray-800 hover:text-yellow-400 transition"
              >
                DashBoard
              </a>
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
          </div>
        </div>
      </nav>
      <main className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] min-h-screen">
        <Outlet />
      </main>
    </>
  );
}

export default Header;  