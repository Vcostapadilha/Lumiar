import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        laranja: "#F5A623",
        amarelo: "#F9D342",
        verde: "#6DBE6D",
        lilas: "#C9B8E8",
        creme: "#FDF9F0",
      },
      fontFamily: {
        display: ["var(--font-baloo)", "cursive"],
        body: ["var(--font-nunito)", "sans-serif"],
      },
      animation: {
        "pulse-wa": "pulse-wa 2.5s ease-in-out infinite",
        "fade-up": "fade-up 0.7s ease-out both",
        "fade-up-2": "fade-up 0.7s ease-out 0.2s both",
      },
      keyframes: {
        "pulse-wa": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(37, 211, 102, 0.5)" },
          "50%": { boxShadow: "0 0 0 14px rgba(37, 211, 102, 0)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
