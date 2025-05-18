import {createContext,useContext} from "react";
import { useEffect } from "react";
import {useState} from "react";
import toast from "react-hot-toast";

const ProblemsContext=createContext();

export const ProblemsProvider=({children})=>{
  const [problems,setProblems]=useState([]);

  useEffect(()=>{
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/problem/getAllProblems`, {
      method: "GET"
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          // <-- use res.ok or res.status
          toast.error("Error in fetching the problems");
          setProblems([]);
          console.log("error in fetching the problems", data);
        } else {
          setProblems(data.problems);
        }
      })
      .catch((err) => {
        console.log("Error in fetching the problems", err);
      });

      console.log("Fetched problems:", problems);
  },[]);
  return (
    <ProblemsContext.Provider value={{problems,setProblems}}>
      {children}
    </ProblemsContext.Provider>
  )
}

export const useProblems=()=> useContext(ProblemsContext);
