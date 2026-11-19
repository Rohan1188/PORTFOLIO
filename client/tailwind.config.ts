import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { bg: "var(--bg)", "bg-soft": "var(--bg-soft)", surface: "var(--surface)", "surface-2": "var(--surface-2)", border: "var(--border)", text: "var(--text)", "text-muted": "var(--text-muted)", "text-faint": "var(--text-faint)", crimson: "var(--crimson)", blue: "var(--blue)" },
      fontFamily: { display: ["var(--font-fraunces)", "Georgia", "serif"], body: ["var(--font-inter)", "system-ui", "sans-serif"], mono: ["var(--font-mono)", "monospace"] },
      maxWidth: { content: "1180px" },
      keyframes: { floaty: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } }, blink: { "50%": { opacity: "0" } } },
      animation: { floaty: "floaty 7s ease-in-out infinite", "floaty-slow": "floaty 10s ease-in-out infinite -3s", blink: "blink 1s steps(1) infinite" },
    },
  },
  plugins: [],
};
export default config;
