/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        card: "var(--card)",
        border: "var(--border)",
        accent: "var(--accent)",
        danger: "var(--danger)",
        ct: "var(--ct)",
        text: "var(--text-primary)",
        muted: "var(--text-muted)",
      },
      fontFamily: {
        display: ["Rajdhani", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(245,166,35,0.12), 0 14px 40px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(245, 166, 35, 0.14), transparent 28%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "hero-grid": "auto, 32px 32px, 32px 32px",
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseEdge: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245,166,35,0.20)" },
          "50%": { boxShadow: "0 0 0 10px rgba(245,166,35,0)" },
        },
      },
      animation: {
        "float-in": "floatIn 320ms ease-out",
        "pulse-edge": "pulseEdge 1.6s infinite",
      },
    },
  },
  plugins: [],
};
