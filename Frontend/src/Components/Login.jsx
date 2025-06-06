import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../store/AuthContext";

const Login = () => {

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <div className="w-full max-w-md bg-gray-900/80 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-yellow-400 text-center">
          Login
        </h2>
        <div className="mt-4">
          {error !== null ? (
            <p className="text-red-400 text-sm text-center">{error}</p>
          ) : null}
        </div>
        <form className="mt-6 space-y-4">
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
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-blue-200"
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
              className="mt-1 block w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-2 rounded-lg shadow hover:scale-105 transition"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>
        <div className="mt-4 flex  gap-4">
          <div className="w-1/2">
            <button
              className="w-full bg-gray-800 hover:bg-gray-700 text-gray-100 py-2 rounded-lg flex items-center justify-center gap-2 border border-gray-700 transition"
              onClick={loginWithGoogle}
            >
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
          Don't have an account?{" "}
          <Link to="/signup" className="text-yellow-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}


export default Login;