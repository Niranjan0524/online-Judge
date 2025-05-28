import {createContext,useContext,useState,useEffect} from 'react';
import {useAuth} from './AuthContext';

const SolutionContext=createContext();


export const SolutionContextProvider=({children})=>{
    const {user,token,isLoggedIn} = useAuth();

    const [solutions,setSolutions]=useState(null);

    useEffect(()=>{
      if(!token || !isLoggedIn){
        setSolutions(null);
        return;
      }

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/getSolutions/:${user.id}`,{
        method:"GET",
        headers:{
          "content-type":"application/json",
          "authorization":`Bearer ${token}`
        }
      })
      .then(async(res)=>{
        const data=await res.json();
        if(!res.ok){
          console.log("Error in fetching the solutions",data.message);
          setSolutions(null);
        }
        else{
          setSolutions(data.solutions);
        }
      })
      .catch((err)=>{
        console.log("Error in fetching the solutions",err);
        setSolutions(null);
      })
    },[]);

    return (
        <SolutionContext.Provider value={{solutions,setSolutions}}>
            {children}
        </SolutionContext.Provider>
    )

};

export const useSolutions=()=> useContext(SolutionContext);

