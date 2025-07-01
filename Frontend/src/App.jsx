import { Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Home from "./components/Home";
import { AuthProvider } from "./store/AuthContext";
import { Toaster } from "react-hot-toast";
import { ProblemsProvider } from "./store/ProblemsContext";
import SolveProblem from "./components/SolveProblem";
import Header from "./components/Header";
import Profile from "./components/Profile";
import { TestCaseProvider } from "./store/TestCases";
import  {SolutionContextProvider}  from "./store/SolutionContext";
import Dashboard from "./components/Dashboard";
import PageNotFound from "./components/PageNotFound";
import "./index.css"
import { LeaderBoardProvider } from "./store/LeaderBoardContext";
import ResumeReviewer from "./components/ResumeReviewer";
import AddProblem from "./components/AddProblem";
import Login from "./components/Login";
import Contest from "./components/Contest";
import { SocketContextProvider } from "./store/SocketContext";
import SolveContest from "./components/SolveContest";

function App() {


  return (
    <AuthProvider>
      <SocketContextProvider>
      <Toaster />
      <ProblemsProvider>
        <TestCaseProvider>
          <SolutionContextProvider>
            <LeaderBoardProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/" element={<Header />}>
                <Route index element={<Home />} />
                <Route path="problem/solve/:id" element={<SolveProblem />} />
                <Route path="profile" element={<Profile />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="resume-reviewer" element={<ResumeReviewer />} />
                <Route path="contest" element={<Contest />} />
                <Route path="problem/add" element={<AddProblem />} />
                <Route path="contest/:id" element={<SolveContest />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />

            </Routes>
            </LeaderBoardProvider>
          </SolutionContextProvider>
        </TestCaseProvider>
      </ProblemsProvider>
      </SocketContextProvider>
    </AuthProvider>
  );
}

export default App;
