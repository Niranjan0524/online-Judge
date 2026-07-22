// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        vibe: {
          background: "#09090B",
          surface: "#18181B",
          elevated: "#202024",
          border: "#27272A",
          primary: "#6366F1",
          secondary: "#06B6D4",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          text: "#FAFAFA",
          subtext: "#A1A1AA",
          muted: "#71717A",
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
        subtle: "0 16px 50px rgba(0, 0, 0, 0.22)",
        panel: "0 10px 30px rgba(0, 0, 0, 0.18)",
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
