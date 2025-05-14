import { createContext ,useContext} from "react";
import {jwtDecode} from "jwt-decode";
import { useEffect, useState } from "react";

const AuthContext=createContext();


export const AuthProvider=({children})=>{

  const isTokenExpired=(token)=>{
    if(!token || token==='undefined' || token==='null'){
      return true
    }

    const decodedToken=jwtDecode(token);
    const currentTime=Date.now()/1000;

    return decodedToken.exp<currentTime;

  }

  const [user,setUser]=useState(null);
  const [token,setToken]=useState(localStorage.getItem('token')||null);
  const [isLoading,setLoading]=useState(false);
  const [isLoggedIn,setIsLoggedIn]=useState(false);

  useEffect(()=>{
    setLoading(true);
    const token=localStorage.getItem('token')||null;

    if(isTokenExpired(token)){
      console.log('Token Expired');
      logout();
    }
    else{
      console.log('Token Valid');
      setToken(token);
      console.log(token);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/getUser`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          // <-- use res.ok or res.status
          setIsLoggedIn(false);
          setUser(null);
          console.log("error in fetching the user", data);
        } else {
          setIsLoggedIn(true);
          setUser(data.user);
        }
      })
      .catch((err) => {
        console.log("Error in fetching the user", err);
      });

    setLoading(false);
    }
  },[token])


//login 
//logout

  const login=(data)=>{

    setUser(data.user);
    setToken(data.token);
    setIsLoggedIn(true);
    localStorage.setItem('token',data.token);
    console.log("User logged in successfully");
    console.log("isLoggedIn",isLoggedIn);
    console.log("user",user);
    console.log("token",token);
  }

  const logout=()=>{
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    console.log("User Logged out Successfully");
  }
  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth=()=> useContext(AuthContext)