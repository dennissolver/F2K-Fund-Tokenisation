import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1A2744",
        "f2k-blue": "#2B5797",
        gold: "#D4A843",
        "gold-light": "#E8C97A",
      },
    },
  },
  plugins: [],
};
export default config;
