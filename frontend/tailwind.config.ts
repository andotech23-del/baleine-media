import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f8ff",
          100: "#d6ecff",
          500: "#2563eb",
          600: "#1e40af"
        }
      }
    }
  },
  plugins: []
};

export default config;
