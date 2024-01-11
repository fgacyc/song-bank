import { type Config } from "tailwindcss";

export default {
  daisyui: {
    themes: ["night"],
    // themes: false,
  },
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {},
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
} satisfies Config;
