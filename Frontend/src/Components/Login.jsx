import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import toast from "react-hot-toast";

export default function Login() {

  const loginWithGoogle = () => {
    console.log("Login with Google");
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;

  };
  const [formData,setFormData]=useState({
    email:"",
    password:""
  })
  const [error,setError]=useState(null);
  const navigate=useNavigate();
  const {login}=useAuth();


  const handleLogin=async(e)=>{
    
    e.preventDefault();
  
    const {email,password}=formData;

    if(email==="" || password===""){

      toast.error("Please fill in all fields");
      return;
    }

    const toastId=toast.loading("Logging in...");

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
      method:"POST",
      headers:{
        'content-type':'application/json',
      },
      body:JSON.stringify(formData)
    })
    .then(async(res)=>{
      const data=await res.json();


      if(res.status!==200){
        toast.dismiss(toastId);  
        toast.error(data.message);      
      }
      else{
        login(data);
        console.log("Login successful");
        navigate("/");
        toast.dismiss(toastId);
        toast.success("Login successful");
      }
    })
    .catch((err)=>{
      console.log("Error:",err);
      toast.dismiss(toastId);
      toast.error(err.message);
    })
    
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/getUser`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        const data = await res.json();
        if (res.status === 200) {
          login(data); // Save token and user info in context/localStorage
         
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          toast.success("Login successful");
          navigate("/");
        }
      });
    }
   
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center">
          Login
        </h2>
        <div className="mt-4">
          {error !== null ? (
            <p className="text-red-500 text-sm text-center">{error}</p>
          ) : null}
        </div>
        <form className="mt-6 space-y-4">
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
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border-b border-t-0 border-l-0 border-r-0 focus:outline-none bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
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
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              type="password"
              id="password"
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border-b border-t-0 border-l-0 border-r-0 focus:outline-none bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>
        <div className="mt-4 flex justify-between items-center">
          <button
            className="w-[180px] bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-md flex items-center justify-center gap-2"
            onClick={loginWithGoogle}
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Login with Google
          </button>
          <button className="w-[180px] bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-md flex items-center justify-center gap-2">
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
              alt="GitHub"
              className="w-5 h-5"
            />
            Login with GitHub
          </button>
        </div>
        <div className="mt-4 flex justify-between items-center"></div>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 hover:underline dark:text-blue-400"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
