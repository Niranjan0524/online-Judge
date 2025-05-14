import { use } from "react";
import { useAuth } from "../store/AuthContext";
import { useNavigate } from "react-router-dom";
const Home=()=>{
  
  const nevigate=useNavigate();
  const {isLoggedIn,logout}=useAuth();


  const handleLogin=()=>{
    console.log("Login button clicked");  
    nevigate("/login");
  }
  const handleLogout=()=>{
    console.log("Logout button clicked");  
    const status=confirm("Are you sure you want to logout?") && logout();

    if(status){
      logout();
      nevigate("/login");
    }
  }

  return (    
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the home page of your application.</p>

      {isLoggedIn?<button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleLogout}>Logout</button>:
      <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleLogin}>Login</button>
      }
    </div>
  )
}

export default Home;