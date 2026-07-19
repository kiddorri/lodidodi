import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ivory: "#F9EAD2",
        champagne: "#F8EEC2",
        peach: "#DB918F",
        bistre: "#837534",
        codium: "#4F5127",
      },
    },
  },
  plugins: [],
};
export default config;
