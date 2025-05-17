import { useState, useEffect } from "react";
import { LuChevronsUp } from "react-icons/lu";
function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    isVisible && (
      <div className="relative h-0">
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 transition-all"
        >
          <LuChevronsUp className="inline-block mr-1" size={25} />
          Back To Top
        </button>
      </div>
    )
  );
}

export default BackToTopButton;
