import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../store/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      className="fixed right-4 top-4 z-50 inline-flex h-10 items-center gap-2 rounded-xl border border-vibe-border bg-vibe-surface px-3 text-sm font-medium text-vibe-text shadow-panel hover:border-vibe-primary/60 hover:bg-vibe-elevated"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === "light"}
      title={`Switch to ${nextTheme} mode`}
    >
      {theme === "dark" ? <FiSun size={17} /> : <FiMoon size={17} />}
      <span>{nextTheme} mode</span>
    </button>
  );
};

export default ThemeToggle;
