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
  const [useType,setUserType]=useState(null);

  useEffect(()=>{
    setLoading(true);
    const token=localStorage.getItem('token')||null;

    if(isTokenExpired(token)){
      
      logout();
    }
    else{
      setToken(token);
      
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
          
        } else {
          setIsLoggedIn(true);
          setUser(data.user);
          setUserType(data.user.type);
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
    setUserType(data.user.type);
    localStorage.setItem('token',data.token);

  }

  const logout=()=>{
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    setUserType(null);
    localStorage.removeItem('token');

  }
  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth=()=> useContext(AuthContext)