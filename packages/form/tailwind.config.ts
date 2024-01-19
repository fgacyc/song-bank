import { type Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

export default {
  daisyui: {
    themes: ["night"],
    prefix: "daisy-",
    // themes: false,
  },
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.tsx",
  ],
  theme: {
    extend: {
      colors: {
        default: "rgba(255,255,255,0.1)",
      },
    },
  },
  plugins: [
    nextui({
      addCommonColors: false,
      prefix: "nextui",
    }),
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
} satisfies Config;
