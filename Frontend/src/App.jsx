import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./store/AuthContext";
import { Toaster } from "react-hot-toast";
import { ProblemsProvider } from "./store/ProblemsContext";
import Header from "./components/Header";
import { TestCaseProvider } from "./store/TestCases";
import { SolutionContextProvider } from "./store/SolutionContext";
import { LeaderBoardProvider } from "./store/LeaderBoardContext";
import { SocketContextProvider } from "./store/SocketContext";
import LoadingState from "./components/loadingState";
import "./index.css";

// Lazy load components
const Signup = lazy(() => import("./components/Signup"));
const Login = lazy(() => import("./components/Login"));
const Home = lazy(() => import("./components/Home"));
const SolveProblem = lazy(() => import("./components/SolveProblem"));
const Profile = lazy(() => import("./components/Profile"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));
const ResumeReviewer = lazy(() => import("./components/ResumeReviewer"));
const AddProblem = lazy(() => import("./components/AddProblem"));
const Contest = lazy(() => import("./components/Contest"));
const SolveContest = lazy(() => import("./components/SolveContest"));
const ViewContest = lazy(() => import("./components/ViewContest"));
const ContestSubmissions = lazy(() =>
  import("./components/ContestSubmissions")
);
const ContestLeaderboard = lazy(() =>
  import("./components/ContestLeaderboard")
);

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
                  <Route
                    path="/login"
                    element={
                      <Suspense fallback={<LoadingState />}>
                        <Login />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <Suspense fallback={<LoadingState />}>
                        <Signup />
                      </Suspense>
                    }
                  />

                  <Route path="/" element={<Header />}>
                    <Route
                      index
                      element={
                        <Suspense fallback={<LoadingState />}>
                          <Home />
                        </Suspense>
                      }
                    />
                    <Route
                      path="problem/solve/:problemId"
                      element={
                        <Suspense fallback={<LoadingState />}>
                          <SolveProblem />
                        </Suspense>
                      }
                    />
                    <Route
                      path="profile"
                      element={
                        <Suspense fallback={<LoadingState />}>
                          <Profile />
                        </Suspense>
                      }
                    />
                    <Route
                      path="dashboard"
                      element={
                        <Suspense fallback={<LoadingState />}>
                          <Dashboard />
                        </Suspense>
                      }
                    />
                    <Route
                      path="resume-reviewer"
                      element={
                        <Suspense fallback={<LoadingState />}>
                          <ResumeReviewer />
                        </Suspense>
                      }
                    />
                    <Route
                      path="contest"
                      element={
                        <Suspense fallback={<LoadingState />}>
                          <Contest />
                        </Suspense>
                      }
                    />
                    <Route
                      path="problem/add"
                      element={
                        <Suspense fallback={<LoadingState />}>
                          <AddProblem />
                        </Suspense>
                      }
                    />
                    <Route
                      path="contest/:contestId"
                      element={
                        <Suspense fallback={<LoadingState />}>
                          <ViewContest />
                        </Suspense>
                      }
                    />
                    <Route
                      path="contest/:contestId/solve/:problemId"
                      element={
                        <Suspense fallback={<LoadingState />}>
                          <SolveContest />
                        </Suspense>
                      }
                    />
                    <Route
                      path="contest/:contestId/submissions"
                      element={
                        <Suspense fallback={<LoadingState />}>
                          <ContestSubmissions />
                        </Suspense>
                      }
                    />
                    <Route
                      path="contest/:contestId/leaderboard"
                      element={
                        <Suspense fallback={<LoadingState />}>
                          <ContestLeaderboard />
                        </Suspense>
                      }
                    />
                  </Route>
                  <Route
                    path="*"
                    element={
                      <Suspense fallback={<LoadingState />}>
                        <PageNotFound />
                      </Suspense>
                    }
                  />
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
