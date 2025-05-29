import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
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

function App() {


  return (
    <AuthProvider>
      <Toaster />
      <ProblemsProvider>
        <TestCaseProvider>
          <SolutionContextProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/" element={<Header />}>
                <Route index element={<Home />} />
                <Route path="problem/solve/:id" element={<SolveProblem />} />
                <Route path="profile" element={<Profile />} />
                <Route path="dashboard" element={<Dashboard />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </SolutionContextProvider>
        </TestCaseProvider>
      </ProblemsProvider>
    </AuthProvider>
  );
}

export default App;
