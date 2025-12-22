import AnimatedHeadline from "./AnimatedHeadline";
import { useAuth } from "../store/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BackToTopButton from "./BackToTop";
import Footer from "./Footer";
import Explore from "./Explore";
import Features from "./Features";
import Problems from "./Problems";

const Home = () => {

  



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white ">
      {/* Navbar */}
      

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 md:py-24">
        <div className="max-w-xl mb-12 md:mb-0">
          <AnimatedHeadline />
          <p className="text-lg text-gray-200 mb-8">
            Solve coding challenges, get instant feedback, and climb the
            leaderboard—all in a sleek, glassy interface.
          </p>
          <button className="bg-gradient-to-r from-red-800  text-black font-bold py-3 px-8 rounded-xl shadow-lg hover:scale-105 transition ml-20">
            Get Started
          </button>
        </div>

        <Explore/>
      </section>

      <section
        id="problems"
        className="max-w-5xl mx-auto px-6 py-10 border-t border-gray-700"
      >
        <Problems />
    
      </section>
      <BackToTopButton />
      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16 ">
        <Features />
      </section>

      {/* Modern Footer */}
      <Footer/>
    </div>
  );
};

export default Home;

