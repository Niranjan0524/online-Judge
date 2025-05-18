import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import { AuthProvider } from "./store/AuthContext";
import { Toaster } from "react-hot-toast";
import { ProblemsProvider } from "./store/ProblemsContext";

function App() {


  return (
    <AuthProvider>
      <Toaster />
      <ProblemsProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </ProblemsProvider>
    </AuthProvider>
  );
}

export default App;
