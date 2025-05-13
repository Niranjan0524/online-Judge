import { Link } from "react-router-dom";
import {useState} from 'react';
import { useNavigate } from "react-router-dom";
export default function Signup() {

  const [formData,setFormData]=useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:"",
    type:"user"

  })

  const navigate=useNavigate();
  const [error,setError]=useState(null);

  const handleSubmit=async(e)=>{
    e.preventDefault();

    console.log("Form Data:", formData);

    const {name,email,password,confirmPassword}=formData;

    if(password!==confirmPassword){
      setError("Passwords do not match");
      return;
    }

    try{
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then(async (res) => {
          const data = await res.json();
          console.log("Response:", data);
          if (res.status !== 200) {
            setError(data.message);
          } else {
            navigate("/login");
          }
        });
    }
    catch(err){
      console.log("Error:",err);
      setError("An error occurred during signup. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center">
          Sign Up
        </h2>
        <form className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              onChange={((e)=>setFormData({...formData,name:e.target.value}))}
              placeholder="Enter your full name"
              className="mt-1 block w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={((e)=>setFormData({...formData,email:e.target.value}))}
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={((e)=>setFormData({...formData,password:e.target.value}))}
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              onChange={((e)=>setFormData({...formData,confirmPassword:e.target.value}))}
              placeholder="Confirm your password"
              className="mt-1 block w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            {error&&<p className="text-red-500 text-sm">{error}</p>}
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 flex justify-between items-center">
          <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-md flex items-center justify-center gap-2">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign up with Google
          </button>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-md flex items-center justify-center gap-2">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
              alt="GitHub"
              className="w-5 h-5"
            />
            Sign up with GitHub
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline dark:text-blue-400"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
