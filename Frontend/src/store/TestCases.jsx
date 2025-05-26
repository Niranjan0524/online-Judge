import { createContext ,useState,useEffect,useContext} from "react";


const TestCasesContext=createContext();

export const TestCaseProvider=({children})=>{

   const [testCases,setTestCases]=useState([]);

  useEffect(()=>{
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/problem/getAllTestCases`,{
      method:'GET'
    })
    .then(async (res)=>{
      const data=await res.json();

      if(!res.ok){
        console.log("Error in fetching the test cases",data.message);
        setTestCases([]);
      }
      else{
        setTestCases(data.testCases);
        console.log(data.testCases)
      }
    })
    .catch((err)=>{
      console.log("Error in fetching the test cases",err);
    })
  },[]);

  return(
    <TestCasesContext.Provider value={{testCases}}>
      {children}
    </TestCasesContext.Provider>
  )
}


export const useTestCases=()=> useContext(TestCasesContext);
