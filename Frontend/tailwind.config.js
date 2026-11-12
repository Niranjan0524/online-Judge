/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        vibe: {
          background: "rgb(var(--vibe-background) / <alpha-value>)",
          surface: "rgb(var(--vibe-surface) / <alpha-value>)",
          elevated: "rgb(var(--vibe-elevated) / <alpha-value>)",
          border: "rgb(var(--vibe-border) / <alpha-value>)",
          primary: "rgb(var(--vibe-primary) / <alpha-value>)",
          secondary: "rgb(var(--vibe-secondary) / <alpha-value>)",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          text: "rgb(var(--vibe-text) / <alpha-value>)",
          subtext: "rgb(var(--vibe-subtext) / <alpha-value>)",
          muted: "rgb(var(--vibe-muted) / <alpha-value>)",
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', "Inter", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        subtle: "var(--vibe-shadow-subtle)",
        panel: "var(--vibe-shadow-panel)",
      },
    },
  },
  plugins: [],
};
