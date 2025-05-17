import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authContext";
import toast from "react-hot-toast";
import { useEffect } from "react";


const Header=()=>{

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
        toast.success("Logged out successfully");
      }, 2000);
    } else {
      toast.dismiss(toastId);
      toast.error("You are Logged in");
    }
  };
  return (
    <>
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
    </>
  );
}

export default Header;  