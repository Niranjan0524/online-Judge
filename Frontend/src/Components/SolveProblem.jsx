import { useState } from "react";
import { useAuth } from "../store/authContext";
import toast from "react-hot-toast";
import { Circles } from "react-loader-spinner";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { useProblems } from "../store/ProblemsContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useTestCases } from "../store/TestCases";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { BsLightningCharge } from "react-icons/bs";

const TABS = ["Description","Result", "Reviews", "Discussions", "Hints"];

const SolveProblem = () => {
  const [activeTab, setActiveTab] = useState("Description");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [testcase, setTestcase] = useState("");
  const [running ,setRunning]=useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [className,setClassName]=useState("");
  const {testCases}=useTestCases();
  const [correctness, setCorrectness] = useState({correct:0,total:0}); 
  const [lang, setLang] = useState("cpp");
  const [status, setStatus] = useState(null);
  const [aiReview, setAiReview] = useState(null);

  const {problems}=useProblems();
  const navigate=useNavigate();
  const { id: problemId } = useParams();
  const problem=problems.find((p)=> p._id===problemId);
  const currTestCases=testCases.filter(tc=> tc.problemId===problemId);
  console.log("Current Test Cases:",currTestCases);

  const {token}=useAuth();
  

  const handleLangChange = (value) => {
    console.log(value);
    setLang(value);
    let className;
    if (value === "java") {
      className = uuidv4();
      
      className = "N" + className.replace(/-/g, "_");
      setClassName(className);
      setCode(`public class ${className} {
                  public static void main(String[] args) {

    }
}`);
    } else {
      setCode("// Write your code here...");
    }
    
  }
  const handleRun = async() => {
    let data={}
   if(lang==="java"){
      data = {
      lang,
      code,
      className,
      problemId,
      input:input
    };
   }
   else{
    if(lang==="javascript"){
      data = {
        lang:"js",
        code,
        problemId,
        input:input
      };
    }
    else if(lang==="python"){
      data = {
        lang:"py",
        code,
        problemId,
        input:input
      };
    }
    else{
      data = {
        lang,
        code,
        problemId,
        input:input
      };
    }

   }

    if(!token){
      toast.error("Unauthorized, Please login.");
      return;
    }
    setRunning(true);
    console.log("input:", input);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/code/run`, {
      method:"POST",
      headers:{
        "Content-Type": "application/json",
        authorization:`Bearer ${token}`
      },
      body:JSON.stringify(data)
    }).then(async(res)=>{
      const data=await res.json();
      setRunning(false);
      if(!res.ok){

        if(res.status===401){
          toast.error("Unauthorized. Please login again.");
          return;
        }
        else if(res.status===400){
          setOutput(data.message || "Error in running code");
          toast.error(data.message || "Error in running code");
          return;
        }
        toast.error(data.message || "Failed to run code");
        return;
      }
      setStatus("Attempted");
      setOutput(data.output || "No output");
      toast.success("Code ran successfully");
    })
  };

  const handleSubmit = () => {
 
    console.log("token in submit:",token);
    if(!token){
      toast.error("Unauthorized,Please Login");
      return ;
    }

    let data = {};
    if (lang === "java") {
      data = {
        lang,
        code,
        className,
        problemId,
        
      };
    } else {
      if (lang === "javascript") {
        data = {
          lang: "js",
          code,
          problemId
        };
      } else if (lang === "python") {
        data = {
          lang: "py",
          code,
          problemId
        };
      } else {
        data = {
          lang,
          code,
          problemId
        };
      }
    }

    setSubmitting(true);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/code/submit`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      const data = await res.json();
      setSubmitting(false);
      console.log(" submit Response Data:", data);
      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Unauthorized. Please login again.");
          return;
        } else if (res.status === 400) {
          toast.error(data.message || "Error in submission");
          return;
        } else if (res.status === 406) {
          toast.error("Wrong code . please check your code");
          setCorrectness(false);
          return;
        }
        toast.error(data.message || "Failed to submit code");
        
        return;
      }
      setActiveTab("Result");
      setCorrectness(true);
      setStatus("Accepted");
      let c=0,t=0;
      for (const opStatus of data.output) {
        t++;
        if (opStatus.correct === false) {
          setCorrectness(false);
          setStatus("Wrong Answer");
          toast.error("Wrong Answer");
          break;
        }
        else{
          c++;
        }

      }
      setCorrectness({correct:c,total:t});

      toast.success("Code submitted Successfully");
      
    });
 
  };


  const handleAIReview=()=>{

    if(!token){
      toast.error("Unauthorized,Please Login");
      return ;
    }

    if(!code || code.trim() === ""){
      toast(
        " please write some code to get AI review.",
        {
          duration: 6000,
        }
      );
    }
    else{
    
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/code/ai-review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code, problemId }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Error in AI Review");
        return;
      }
      toast.success("AI Review generated successfully");
    })
    .catch((err) => {
      console.error("Error in AI Review:", err);
      toast.error("Error in AI Review");
    });
  };
};

  useEffect(()=>{
    window.scrollTo(0,0);
    if (problems.length>0 && !problem) {
      toast.error("Problem not found");
      navigate("/");
    }
  },[problems,problem,navigate]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white flex flex-col md:flex-row gap-6 px-4 py-8 md:px-12">
      {/* Left: Problem Details */}
      <div className="md:w-2/5  w-full bg-gray-900/80 rounded-2xl shadow-lg p-6 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-yellow-400">
            {problem && problem.title}
          </h2>
          <div className="ml-4">
            <span
              className={`px-3 py-1 rounded-lg text-sm font-semibold shadow
      ${
        problem?.difficulty === "Hard"
          ? "bg-red-800 text-red-300 border border-red-400"
          : problem?.difficulty === "Medium"
          ? "bg-yellow-800 text-yellow-300 border border-yellow-400"
          : "bg-green-800 text-green-300 border border-green-400"
      }`}
            >
              {status ? status : problem?.difficulty}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-gray-700">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`px-3 py-1 text-sm font-semibold rounded-t ${
                activeTab === tab
                  ? "bg-gray-800 text-red-400 border-b-2 border-red-400"
                  : "text-blue-200 hover:text-red-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div className="flex-1 h-auto overflow-y-auto">
          {activeTab === "Description" && (
            <div>
              <p className="text-gray-200 font-mono text-lg">
                {problem && problem.description}
              </p>
              <div>
                {currTestCases &&
                  currTestCases.map((tc) => (
                    <div
                      key={tc._id}
                      className="font-mono  glass-card mt-2 p-2 rounded bg-gray-800 border border-gray-300 mb-4 "
                    >
                      <div className="text-blue-300 font-semibold">Input:</div>
                      {tc.input && typeof tc.input === "object" ? (
                        Object.entries(tc.input).map(([key, value]) => (
                          <div key={key} className="ml-2">
                            <span className="text-gray-300">{key}:</span>{" "}
                            <span className="text-gray-100">
                              {Array.isArray(value)
                                ? JSON.stringify(value)
                                : String(value)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="ml-2 text-gray-100">
                          {String(tc.input)}
                        </div>
                      )}
                      <div className="text-green-300 font-semibold mt-1">
                        Expected Output:
                      </div>
                      <div className="ml-2 text-gray-100">
                        {String(tc.output)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {activeTab === "Reviews" && (
            <div className="text-gray-400 italic">No reviews yet.</div>
          )}
          {activeTab === "Result" && (
            <div className="flex flex-col items-center justify-center my-6">
              {status === "Accepted" ? (
                <div className="bg-green-900/80 border border-green-400 rounded-xl px-6 py-4 flex flex-col items-center shadow">
                  <span className="text-green-300 text-2xl font-bold flex items-center gap-2">
                    <svg
                      className="w-6 h-6 inline-block"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Submission Accepted
                  </span>
                  <span className="mt-2 text-lg text-gray-100">
                    Correctness:{" "}
                    <span className="font-semibold text-yellow-300">
                      {correctness.correct}
                    </span>
                    <span className="text-gray-400"> / </span>
                    <span className="font-semibold text-yellow-300">
                      {correctness.total}
                    </span>{" "}
                    test cases passed
                  </span>
                </div>
              ) : (
                <div className="bg-gray-800/80 border border-yellow-400 rounded-xl px-6 py-4 flex flex-col items-center shadow">
                  <span className="text-yellow-400 text-lg font-semibold flex items-center gap-2">
                    <svg
                      className="w-5 h-5 inline-block"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                      />
                    </svg>
                    Please submit to view result
                  </span>
                </div>
              )}
            </div>
          )}
          {activeTab === "Discussions" && (
            <div className="text-gray-400 italic">No discussions yet.</div>
          )}
          {activeTab === "Hints" && (
            <div className="text-gray-400 italic">No hints available.</div>
          )}
        </div>
      </div>

      {/* Right: Code Editor & Actions */}
      <div className="md:w-3/5 w-full flex flex-col gap-4">
        {/* Code Editor Card */}
        <div className="bg-gray-900/80 rounded-2xl shadow-lg p-4 flex flex-col">
          {/* Label and Language Selector in one row */}
          <div className="flex items-center justify-between mb-2">
            <label className="text-lg font-semibold text-blue-300">
              Code Editor
            </label>
            <select
              className="bg-gray-800 text-gray-100 rounded-lg p-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[120px]"
              value={lang}
              onChange={(e) => handleLangChange(e.target.value)}
            >
              <option value="cpp">c++</option>
              <option value="java">java</option>
              <option value="python">python</option>
              <option value="javascript">javascript</option>
            </select>
          </div>
          <div
            style={{ height: "60vh", width: "100%" }}
            className="flex flex-row items-start"
          >
            <Editor
              height="100%"
              defaultLanguage={lang}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
            />
          </div>
          <div className="flex gap-4 mt-4 justify-between items-center">
            <div className="flex gap-4">
              {running ? (
                <button className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white font-bold px-6 py-2 rounded-lg shadow hover:scale-105 transition">
                  <Circles
                    height="24"
                    width="24"
                    color="#fff"
                    ariaLabel="loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                </button>
              ) : (
                <button
                  className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white font-bold px-6 py-2 rounded-lg shadow hover:scale-105 transition"
                  onClick={handleRun}
                >
                  Run
                </button>
              )}
              {submitting ? (
                <button className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold px-6 py-2 rounded-lg shadow hover:scale-105 transition">
                  <Circles
                    height="24"
                    width="24"
                    color="#fff"
                    ariaLabel="loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                </button>
              ) : (
                <button
                  className="bg-gradient-to-r from-green-400 to-green-600 text-black font-bold px-6 py-2 rounded-lg shadow hover:scale-105 transition"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              )}
            </div>
            <div>
              <button
                className="bg-gray-900/80 border border-red-300 px-6 py-2 rounded-lg shadow hover:scale-105 transition font-bold"
                onClick={handleAIReview}
              >
                
                <span className="bg-gradient-to-r from-red-400 via-gray-400 to-yellow-400 bg-clip-text text-transparent text-lg flex items-center gap-2">
                  AI Review
                </span>
              </button>
            </div>
          </div>
        </div>
        {/* Output Area */}
        <div className="bg-gray-900/80 rounded-2xl shadow-lg p-4">
          <label className="text-lg font-semibold  text-red-300 mb-2">
            Input
          </label>
          <div className="bg-gray-800 text-gray-100 rounded-lg p-3 min-h-[48px] font-mono text-sm">
            <textarea
              className="w-full h-full bg-transparent text-gray-100 font-mono text-sm outline-none resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input here..."
              rows={2}
            />
          </div>
        </div>
        <div className="bg-gray-900/80 rounded-2xl shadow-lg p-4">
          <label className="text-lg font-semibold text-green-300 mb-2">
            Output
          </label>
          <div className="bg-gray-800 text-gray-100 rounded-lg p-3 min-h-[48px] font-mono text-sm">
            {output || "Output will appear here."}
          </div>
        </div>
        {/* Testcase Area */}
        <div className="bg-gray-900/80 rounded-2xl shadow-lg p-4">
          <label className="text-lg font-semibold text-pink-300 mb-2">
            Custom Testcase
          </label>
          <textarea
            className="w-full h-16 bg-gray-800 text-gray-100 rounded-lg p-3 font-mono text-sm resize-y border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={testcase}
            onChange={(e) => setTestcase(e.target.value)}
            placeholder="Enter custom input here..."
          />
        </div>
      </div>
    </div>
  );
};

export default SolveProblem;
