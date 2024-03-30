import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        "assistant": ["Assistant", "sans-serif"]
      },
    },
  },
  plugins: [],
} satisfies Config;
