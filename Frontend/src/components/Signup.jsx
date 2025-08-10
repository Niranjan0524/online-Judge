import { Link } from "react-router-dom";
import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "user",
  });

  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const { name, email, password, confirmPassword,type } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const toastId = toast.loading("Signing up...");

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then(async (res) => {
        const data = await res.json();
        
        if (res.status !== 200) {
          setError(data.errors);
          toast.dismiss(toastId);
          toast.error("Signup failed");
        } else {
          navigate("/login");
          toast.dismiss(toastId);
          toast.success("Signup successful");
        }
      });
    } catch (err) {
      
      toast.error("An error occurred during signup. Please try again.");
    }
  };

  const signupWithGoogle = () => {
    
    toast.error("This feature is under development , Sorry for the inconvenience");
    // window.location.href=`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  };

  // ...existing code...


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="w-full max-w-md bg-gray-900/80 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
          Sign Up
        </h2>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-blue-200"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter your full name"
              className="mt-1 block w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-blue-200"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-blue-200"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
                className="mt-1 block w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-blue-200"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Confirm your password"
                className="mt-1 block w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-1">
              User Type
            </label>
            <div className="flex gap-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="user"
                  checked={formData.type === "user"}
                  onChange={() => setFormData({ ...formData, type: "user" })}
                  className="form-radio text-yellow-400"
                />
                <span className="ml-2 text-gray-100">Normal</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="admin"
                  checked={formData.type === "admin"}
                  onChange={() => setFormData({ ...formData, type: "admin" })}
                  className="form-radio text-yellow-400"
                />
                <span className="ml-2 text-gray-100">Admin</span>
              </label>
            </div>
          </div>
          <div>
            {error !== null
              ? error.map((err, idx) => (
                  <li key={idx} className="text-red-400 text-sm">
                    {err}
                  </li>
                ))
              : null}
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-2 rounded-lg shadow hover:scale-105 transition"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 flex  gap-2">
          <div className="w-1/2">
          
          <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-100 py-2 rounded-lg flex items-center justify-center gap-2 border border-gray-700 transition"
          onClick={signupWithGoogle}>
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google"
              className="w-5 h-5"
            />
             Google
          </button>
          </div>
          <div className="w-1/2">
          <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-100 py-2 rounded-lg flex items-center justify-center gap-2 border border-gray-700 transition">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
              alt="GitHub"
              className="w-5 h-5"
            />
            GitHub
          </button>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
