import {createContext,useContext,useState,useEffect} from 'react';
import {useAuth} from './AuthContext';

const SolutionContext=createContext();


export const SolutionContextProvider=({children})=>{
    const {token,isLoggedIn} = useAuth();

    const [solutions,setSolutions]=useState(null);

    const fetchSolutions=async()=>{
      if(!token || !isLoggedIn){
        setSolutions(null);
        return null;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/me/solutions`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (!response.ok) {
          console.log("Error in fetching the solutions", data.message);
          setSolutions(null);
          return null;
        } else {
          const sortedSolutions = [...(data.solutions || [])].sort(
            (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
          );
          setSolutions(sortedSolutions);
          return sortedSolutions;
        }
      } catch (err) {
        console.log("Error in fetching the solutions", err);
        setSolutions(null);
        return null;
      }
    }
    useEffect(()=>{
      if(!token || !isLoggedIn){
        setSolutions(null);
        return;
      }

      fetchSolutions();
      
    },[token,isLoggedIn]);
    return (
        <SolutionContext.Provider value={{solutions,setSolutions,fetchSolutions}}>
            {children}
        </SolutionContext.Provider>
    )

};



export const useSolutions=()=> useContext(SolutionContext);

