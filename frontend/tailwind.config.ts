import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        base: "#f4f1ea",
        ink: "#1a2232",
        accent: "#136f63",
        warm: "#f2a65a"
      }
    }
  },
  plugins: []
};

export default config;
