import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { Circles } from "react-loader-spinner";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiCheckCircle,
  FiClock,
  FiCpu,
  FiFileText,
  FiPlay,
  FiSend,
  FiTerminal,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import { useAuth } from "../store/AuthContext";
import { useProblems } from "../store/ProblemsContext";
import { useTestCases } from "../store/TestCases";
import { useSolutions } from "../store/SolutionContext";
import { useLeaderBoard } from "../store/LeaderBoardContext";
import CodeBlock from "./CodeBlock";
import Discussion from "./Discussion";

const TABS = ["Description", "Result", "Submissions", "Discussions", "Hints"];

const difficultyStyles = {
  easy: "border-vibe-success/30 bg-vibe-success/10 text-vibe-success",
  medium: "border-vibe-warning/30 bg-vibe-warning/10 text-vibe-warning",
  hard: "border-vibe-danger/30 bg-vibe-danger/10 text-vibe-danger",
};

const statusStyles = {
  Accepted: "border-vibe-success/30 bg-vibe-success/10 text-vibe-success",
  "Wrong Answer": "border-vibe-danger/30 bg-vibe-danger/10 text-vibe-danger",
  Attempted: "border-vibe-primary/30 bg-vibe-primary/10 text-vibe-primary",
  "Not Attempted": "border-vibe-warning/30 bg-vibe-warning/10 text-vibe-warning",
};

const renderCaseValue = (value) => {
  if (value && typeof value === "object") {
    return Object.entries(value).map(([key, item]) => (
      <div key={key} className="flex gap-2">
        <span className="text-vibe-muted">{key}:</span>
        <span className="text-vibe-text">
          {Array.isArray(item) ? JSON.stringify(item) : String(item)}
        </span>
      </div>
    ));
  }

  return <div className="whitespace-pre-wrap text-vibe-text">{String(value)}</div>;
};

const LoadingIcon = () => (
  <Circles
    height="18"
    width="18"
    color="#FAFAFA"
    ariaLabel="loading"
    wrapperStyle={{}}
    wrapperClass=""
    visible={true}
  />
);

const SolveProblem = () => {
  const [activeTab, setActiveTab] = useState("Description");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [testcase, setTestcase] = useState("");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [className, setClassName] = useState("");
  const { testCases } = useTestCases();
  const [correctness, setCorrectness] = useState({ correct: 0, total: 0 });
  const [lang, setLang] = useState("cpp");
  const [status, setStatus] = useState("Not Attempted");
  const [aiReview, setAiReview] = useState(null);
  const [reviewing, setReviewing] = useState(false);
  const [currSolution, setCurrSolution] = useState();
  const [viewSubmission, setViewSubmission] = useState(false);
  const [currSubmission, setCurrSubmission] = useState(null);

  const { solutions, fetchSolutions } = useSolutions();
  const { problems } = useProblems();
  const navigate = useNavigate();
  const { problemId, contestId } = useParams();

  const problem = problems.find((p) => p._id === problemId);
  const currTestCases = testCases.filter((tc) => tc.problemId === problemId);
  const { fetchLeaderBoardData } = useLeaderBoard();

  const { token } = useAuth();

  const handleLangChange = (value) => {
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
  };

  const handleRun = async () => {
    let data = {};
    if (lang === "java") {
      data = {
        lang,
        code,
        className,
        problemId,
        input: input,
      };
    } else {
      if (lang === "javascript") {
        data = {
          lang: "js",
          code,
          problemId,
          input: input,
        };
      } else if (lang === "python") {
        data = {
          lang: "py",
          code,
          problemId,
          input: input,
        };
      } else {
        data = {
          lang,
          code,
          problemId,
          input: input,
        };
      }
    }

    if (!token) {
      toast.error("Unauthorized, Please login.");
      return;
    }

    setRunning(true);
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/code/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        const data = await res.json();
        setRunning(false);
        if (!res.ok) {
          if (res.status === 401) {
            toast.error("Unauthorized. Please login again.");
            return;
          } else if (res.status === 400) {
            setOutput(data.message || "Error in running code");
            toast.error(data.message || "Error in running code");
            return;
          } else if (res.status === 504) {
            setOutput("Server Timeout, Time Limit Exceeded");

            toast.error("Server Timeout, Time Limit Exceeded");
            return;
          }
          toast.error(data.message || "Failed to run code");
          return;
        }

        if (res.status === 201) {
          setOutput(data.error || "Error in code");
          toast.error(data.message);
          return;
        }
        if (status === "Not Attempted") {
          setStatus("Attempted");
        }
        setOutput(data.output || "No output");
        toast.success("Code ran successfully");
      })
      .catch((err) => {
        setRunning(false);
        console.error("Error in running code:", err);
        toast.error("Error in running code");
      });
  };

  const handleSubmit = async () => {
    const url = contestId
      ? `${import.meta.env.VITE_BACKEND_URL}/api/contest/${contestId}/submit`
      : `${import.meta.env.VITE_BACKEND_URL}/api/code/submit`;

    if (!token) {
      toast.error("Unauthorized,Please Login");
      return;
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
          problemId,
        };
      } else if (lang === "python") {
        data = {
          lang: "py",
          code,
          problemId,
        };
      } else {
        data = {
          lang,
          code,
          problemId,
        };
      }
    }

    setSubmitting(true);

    await fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        const data = await res.json();
        setSubmitting(false);

        if (!res.ok) {
          if (res.status === 401) {
            toast.error("Unauthorized. Please login again.");
            return;
          } else if (res.status === 400) {
            toast.error(data.message || "Error in submission");
            return;
          } else if (res.status === 406) {
            toast.error("Wrong code . please check your code");
            setStatus("Wrong Answer");
            return;
          } else if (res.status === 504) {
            toast.error("Server Timeout ,Time Limit Exceeded");
            setStatus("Wrong Answer");

            return;
          }
          toast.error(data.message || "Failed to submit code");

          return;
        }

        if (res.status === 201) {
          setOutput(data.error || "Error in code");
          return;
        }

        let c = data.solution.testCasesPassed;
        let t = data.output.length;

        setStatus(data.solution.status);

        setCorrectness({ correct: c, total: t });

        toast.success("Code submitted Successfully");
        setActiveTab("Result");
        fetchLeaderBoardData();
      })
      .catch((err) => {
        setSubmitting(false);
        console.error("Error in submission:", err);
        toast.error("Error in submission");
      });
  };

  const handleAIReview = () => {
    if (!token) {
      toast.error("Unauthorized,Please Login");
      return;
    }

    if (!code || code.trim() === "") {
      toast.error(" please write some code to get AI review.", {
        duration: 6000,
      });
      return;
    } else {
      setReviewing(true);
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/code/aiReview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code, problemId }),
      })
        .then(async (res) => {
          setReviewing(false);
          const data = await res.json();

          if (!res.ok) {
            toast.error(data.message || "Error in AI Review");
            return;
          }
          toast.success("AI Review generated successfully");
          setAiReview(data.output);
        })
        .catch((err) => {
          setReviewing(false);
          console.error("Error in AI Review:", err);
          toast.error("Error in AI Review");
        });
    }
  };

  const handleSolutionView = (solutionId) => {
    setViewSubmission(true);
    const code = solutions.find((sol) => sol._id === solutionId)?.code;
    setCurrSolution(code);
  };

  const handleSolutionClose = () => {
    setViewSubmission(false);
  };

  const handleTabChange=async(newTab)=>{
    if(newTab==="Submissions"){
      await fetchSolutions();
    }

    setActiveTab(newTab);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveTab("Description");
    if (problems.length > 0 && !problem) {
      toast.error("Problem not found");
      navigate("/");
    }

    const sub = solutions?.filter((sol) => sol.problemId === problemId);

    if (!sub || sub.length === 0) {
      setStatus("Not Attempted");
      setCurrSolution(null);
      setCurrSubmission(null);
      return;
    }
    setCurrSubmission(sub);

    if (sub && sub.length > 0) {
      for (const sol of sub) {
        if (sol.status === "Accepted") {
          setStatus("Accepted");
          setCorrectness({
            correct: sol.testCasesPassed,
            total: currTestCases.length,
          });
          return;
        }
      }
      setStatus("Wrong Answer");
      setCorrectness({
        correct: sub[0].testCasesPassed,
        total: currTestCases.length,
      });
    } else {
    }
  }, [problemId, problem]);

  return (
    <div className="min-h-screen bg-vibe-background px-4 py-6 text-vibe-text sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1800px] gap-5 xl:grid-cols-[minmax(420px,0.9fr)_minmax(0,1.25fr)]">
        <section className="flex min-h-[calc(100vh-7rem)] flex-col rounded-2xl border border-vibe-border bg-vibe-surface shadow-panel">
          <div className="border-b border-vibe-border p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 w-full">
                <p className="text-sm font-semibold uppercase tracking-wide text-vibe-secondary">
                  Problem
                </p>
                <h1 className="mt-2 font-heading text-2xl font-bold text-vibe-text sm:text-3xl">
                  {problem?.title || "Loading problem"}
                </h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                      difficultyStyles[problem?.difficulty] ||
                      "border-vibe-border bg-vibe-background text-vibe-subtext"
                    }`}
                  >
                    {problem?.difficulty || "unknown"}
                  </span>
                  
                  <span className="inline-flex items-center gap-1 rounded-full border border-vibe-border bg-vibe-background px-3 py-1 text-xs font-semibold text-vibe-subtext">
                    <FiClock size={13} />
                    {problem?.timeLimit || 1000} ms
                  </span>
                  <span
                    className={`ml-auto rounded-full border px-3 py-1 text-xs font-semibold ${
                      statusStyles[status] ||
                      "border-vibe-border bg-vibe-background text-vibe-subtext"
                    }`}
                  >
                    {status==="Accepted" ? "Solved":status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`shrink-0 rounded-xl px-3 py-2 text-sm font-semibold ${
                    activeTab === tab
                      ? "bg-vibe-primary text-white"
                      : "border border-vibe-border bg-vibe-background text-vibe-subtext hover:border-vibe-primary/60 hover:text-vibe-text"
                  }`}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === "Description" && (
              <div className="space-y-5">
                <div className="rounded-2xl border border-vibe-border bg-vibe-background p-4">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-vibe-subtext">
                    {problem?.description || "Problem description is loading."}
                  </p>
                </div>

                {problem?.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-vibe-border bg-vibe-background px-2.5 py-1 text-xs font-medium text-vibe-subtext"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {problem?.inputFormat && problem.inputFormat.length > 0 && (
                  <div className="rounded-2xl border border-vibe-border bg-vibe-background p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-vibe-text">
                      <FiTerminal className="text-vibe-secondary" size={16} />
                      Input Format
                    </div>
                    <ul className="space-y-2 text-sm leading-6 text-vibe-subtext">
                      {problem.inputFormat.map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {problem?.outputFormat && problem.outputFormat.length > 0 && (
                  <div className="rounded-2xl border border-vibe-border bg-vibe-background p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-vibe-text">
                      <FiFileText className="text-vibe-success" size={16} />
                      Output Format
                    </div>
                    <ul className="space-y-2 text-sm leading-6 text-vibe-subtext">
                      {problem.outputFormat.map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-vibe-text">
                    Sample test cases
                  </p>
                  {currTestCases && currTestCases.length > 0 ? (
                    currTestCases.slice(0, 2).map((tc, index) => (
                      <div
                        key={tc._id}
                        className="rounded-2xl border border-vibe-border bg-vibe-background p-4"
                      >
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-vibe-muted">
                          Sample {index + 1}
                        </p>
                        <div className="grid gap-4 lg:grid-cols-2">
                          <div>
                            <p className="mb-2 text-sm font-semibold text-vibe-secondary">
                              Input
                            </p>
                            <div className="rounded-xl border border-vibe-border bg-vibe-surface p-3 font-mono text-sm">
                              {renderCaseValue(tc.input)}
                            </div>
                          </div>
                          <div>
                            <p className="mb-2 text-sm font-semibold text-vibe-success">
                              Expected Output
                            </p>
                            <div className="rounded-xl border border-vibe-border bg-vibe-surface p-3 font-mono text-sm text-vibe-text">
                              {String(tc.output)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-vibe-border bg-vibe-background p-6 text-center text-sm text-vibe-subtext">
                      No sample test cases available.
                    </div>
                  )}
                </div>

                {aiReview && (
                  <div className="rounded-2xl border border-vibe-primary/30 bg-vibe-primary/10 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-vibe-text">
                      <FiCpu className="text-vibe-primary" size={16} />
                      AI Review
                    </div>
                    <div className="max-h-64 overflow-y-auto text-sm leading-7 text-vibe-subtext">
                      <ReactMarkdown
                        components={{
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            const code = String(children).replace(/\n$/, "");
                            return !inline && match ? (
                              <CodeBlock code={code} language={match[1]} />
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {aiReview}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Result" && (
              <div className="flex min-h-80 items-center justify-center">
                <div
                  className={`w-full max-w-md rounded-2xl border p-6 text-center ${
                    statusStyles[status] ||
                    "border-vibe-border bg-vibe-background text-vibe-subtext"
                  }`}
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-current/20 bg-vibe-background/40">
                    {status === "Accepted" ? (
                      <FiCheckCircle size={24} />
                    ) : status === "Wrong Answer" ? (
                      <FiXCircle size={24} />
                    ) : (
                      <FiClock size={24} />
                    )}
                  </div>
                  <p className="font-heading text-2xl font-bold">
                    {status === "Accepted"
                      ? "Submission Accepted"
                      : status === "Wrong Answer"
                      ? "Wrong Answer"
                      : "Please attempt the problem"}
                  </p>
                  {status !== "Not Attempted" && (
                    <p className="mt-3 text-sm">
                      {correctness.correct} / {correctness.total} test cases
                      passed
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "Submissions" && (
              <div className="space-y-3">
                {!viewSubmission && solutions && (
                  <>
                    {solutions && solutions.length > 0 ? (
                      solutions.map((sol) => (
                        <button
                          key={sol._id}
                          className="flex w-full flex-col gap-3 rounded-2xl border border-vibe-border bg-vibe-background p-4 text-left hover:border-vibe-primary/60 hover:bg-vibe-elevated sm:flex-row sm:items-center sm:justify-between"
                          onClick={() => handleSolutionView(sol._id)}
                          type="button"
                        >
                          <span className="min-w-0">
                            <span className="block truncate font-medium text-vibe-text">
                              {sol.titleName}
                            </span>
                            <span className="mt-1 block text-xs text-vibe-muted">
                              {sol.submittedAt
                                ? new Date(sol.submittedAt).toLocaleString()
                                : "Not submitted"}
                            </span>
                          </span>
                          <span className="flex items-center gap-3">
                            <span className="font-mono text-xs text-vibe-subtext">
                              {sol.testCasesPassed ?? 0} /{" "}
                              {currTestCases.length ?? "-"} tests
                            </span>
                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                statusStyles[sol.status] ||
                                "border-vibe-border bg-vibe-surface text-vibe-subtext"
                              }`}
                            >
                              {sol.status}
                            </span>
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-vibe-border bg-vibe-background p-8 text-center text-sm text-vibe-subtext">
                        No submissions yet.
                      </div>
                    )}
                  </>
                )}

                {viewSubmission && currSolution && (
                  <div className="rounded-2xl border border-vibe-border bg-vibe-background p-4">
                    <button
                      onClick={handleSolutionClose}
                      className="mb-3 inline-flex items-center gap-2 rounded-xl border border-vibe-border bg-vibe-surface px-3 py-2 text-sm font-semibold text-vibe-text hover:border-vibe-primary/60 hover:bg-vibe-elevated"
                      type="button"
                    >
                      <FiX size={16} />
                      Close submission
                    </button>
                    <CodeBlock code={currSolution} language={lang} />
                  </div>
                )}

                {!solutions && !currSolution && (
                  <div className="rounded-2xl border border-dashed border-vibe-border bg-vibe-background p-8 text-center text-sm text-vibe-subtext">
                    No submissions available for this problem.
                  </div>
                )}
              </div>
            )}

            {activeTab === "Discussions" && (
              <div className="overflow-hidden rounded-2xl border border-vibe-border bg-vibe-background p-3">
                <Discussion problemId={problemId} />
              </div>
            )}

            {activeTab === "Hints" && (
              <div className="rounded-2xl border border-dashed border-vibe-border bg-vibe-background p-8 text-center text-sm text-vibe-subtext">
                No hints available.
              </div>
            )}
          </div>
        </section>

        <section className="flex min-h-[calc(100vh-7rem)] flex-col gap-4">
          <div className="flex min-h-[560px] flex-1 flex-col rounded-2xl border border-vibe-border bg-vibe-surface shadow-panel">
            <div className="flex flex-col gap-3 border-b border-vibe-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-vibe-text">
                  Code Editor
                </p>
                <p className="mt-1 text-xs text-vibe-subtext">
                  Write, run, submit, and review your solution.
                </p>
              </div>
              <select
                className="min-w-32 rounded-xl border border-vibe-border bg-vibe-background px-3 py-2 text-sm text-vibe-text hover:border-vibe-primary/60 focus:border-vibe-primary"
                value={lang}
                onClick={() => toast("More languages coming soon!")}
                onChange={(e) => handleLangChange(e.target.value)}
              >
                <option value="cpp">C++</option>
              </select>
            </div>

            <div className="min-h-[420px] flex-1 overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage={lang}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value)}
                options={{
                  minimap: { enabled: false },
                  fontFamily: "JetBrains Mono",
                  fontSize: 14,
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-vibe-border p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-vibe-warning/30 bg-vibe-warning/10 px-4 py-2.5 text-sm font-semibold text-vibe-warning hover:bg-vibe-warning/15 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handleRun}
                  disabled={reviewing || submitting || running}
                  type="button"
                >
                  {running ? <LoadingIcon /> : <FiPlay size={16} />}
                  {running ? "Running..." : "Run"}
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-vibe-success px-4 py-2.5 text-sm font-semibold text-vibe-background hover:bg-vibe-success/90 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handleSubmit}
                  disabled={reviewing || running || submitting}
                  type="button"
                >
                  {submitting ? <LoadingIcon /> : <FiSend size={16} />}
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>

              {!contestId && (
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-vibe-primary/40 bg-vibe-primary/10 px-4 py-2.5 text-sm font-semibold text-vibe-primary hover:bg-vibe-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handleAIReview}
                  disabled={running || submitting || reviewing}
                  type="button"
                >
                  {reviewing ? <LoadingIcon /> : <FiCpu size={16} />}
                  {reviewing ? "Reviewing..." : "AI Review"}
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-vibe-border bg-vibe-surface p-4 shadow-panel">
              <label
                htmlFor="custom-input"
                className="text-sm font-semibold text-vibe-text"
              >
                Input
              </label>
              <textarea
                id="custom-input"
                className="mt-3 h-24 w-full resize-none rounded-xl border border-vibe-border bg-vibe-background p-3 font-mono text-sm text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/60 focus:border-vibe-primary"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input here..."
              />
            </div>

            <div className="rounded-2xl border border-vibe-border bg-vibe-surface p-4 shadow-panel">
              <p className="text-sm font-semibold text-vibe-text">Output</p>
              <div className="mt-3 min-h-24 rounded-xl border border-vibe-border bg-vibe-background p-3 font-mono text-sm text-vibe-subtext">
                <pre className="whitespace-pre-wrap">
                  {output || "Output will appear here."}
                </pre>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-vibe-border bg-vibe-surface p-4 shadow-panel">
            <label
              htmlFor="custom-testcase"
              className="text-sm font-semibold text-vibe-text"
            >
              Custom Testcase
            </label>
            <textarea
              id="custom-testcase"
              className="mt-3 h-20 w-full resize-y rounded-xl border border-vibe-border bg-vibe-background p-3 font-mono text-sm text-vibe-text placeholder:text-vibe-muted hover:border-vibe-primary/60 focus:border-vibe-primary"
              value={testcase}
              onChange={(e) => setTestcase(e.target.value)}
              placeholder="Enter custom input here..."
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default SolveProblem;
