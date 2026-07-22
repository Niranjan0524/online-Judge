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
          className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-vibe-border bg-vibe-surface text-vibe-text shadow-subtle hover:border-vibe-primary/60 hover:bg-vibe-elevated"
          aria-label="Back to top"
        >
          <LuChevronsUp size={22} />
        </button>
      </div>
    )
  );
}

export default BackToTopButton;
