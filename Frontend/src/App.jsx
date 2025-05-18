import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import { AuthProvider } from "./store/AuthContext";
import { Toaster } from "react-hot-toast";
import { ProblemsProvider } from "./store/ProblemsContext";
import SolveProblem from "./components/SolveProblem";
import Header from "./components/Header";

function App() {


  return (
    <AuthProvider>
      <Toaster />
      <ProblemsProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Header />}>
            <Route index element={<Home />} />
            <Route path="problem/solve/:id" element={<SolveProblem />} />
          </Route>
        </Routes>
      </ProblemsProvider>
    </AuthProvider>
  );
}

export default App;
