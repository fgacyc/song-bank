import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["var(--font-primary)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        "bg-primary": "var(--color-bg-primary)",
        "bg-secondary": "var(--color-bg-secondary)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
      },
    },
  },
  plugins: [],
  darkMode: ["class", '[data-theme="dark"]'],
} satisfies Config;
