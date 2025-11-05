import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages-old/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        playfair: ["var(--font-playfair)"],
      },
      animation: {
        fadeIn: "fadeIn 1s ease-out",
        fadeInZoom: "fadeInZoom 1.5s ease-out forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;