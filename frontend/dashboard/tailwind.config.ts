import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FDFCF8",
          100: "#FAF7F2",
          200: "#F3EDE0",
        },
        sage: {
          400: "#7FAD8E",
          500: "#5B8A6F",
          600: "#4A7259",
          700: "#3A5A46",
        },
        terra: {
          400: "#D4896A",
          500: "#C4704A",
          600: "#A85C3A",
        },
        stone: {
          warm: "#8A8577",
          mid: "#5C5850",
          dark: "#2C2A25",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        warm: "0 2px 16px 0 rgba(44, 42, 37, 0.08)",
        card: "0 1px 4px 0 rgba(44, 42, 37, 0.06), 0 4px 24px 0 rgba(44, 42, 37, 0.06)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
