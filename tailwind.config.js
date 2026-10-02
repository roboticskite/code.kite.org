/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        kite: {
          50: "#eef6ff",
          100: "#d9ecff",
          200: "#bcdcff",
          300: "#8ec6ff",
          400: "#59a6ff",
          500: "#3385fc",
          600: "#1c66f2",
          700: "#1551e0",
          800: "#1842b6",
          900: "#193c8f",
        },
        motion: { 500: "#4c97ff", 600: "#3d87f0" },
        looks: { 500: "#9966ff", 600: "#8a5cf0" },
        sound: { 500: "#cf63cf", 600: "#c053c0" },
        events: { 500: "#ffbf00", 600: "#f0af00" },
        control: { 500: "#ffab19", 600: "#f09b09" },
        sensing: { 500: "#5cb1d6", 600: "#4ca1c6" },
        operators: { 500: "#59c059", 600: "#49b049" },
        variables: { 500: "#ff8c1a", 600: "#f07c0a" },
        functions: { 500: "#ff6680", 600: "#f05670" },
        drawing: { 500: "#e8b1d6", 600: "#d8a1c6" },
        game: { 500: "#4caf50", 600: "#3c9f40" },
        advanced: { 500: "#795548", 600: "#694538" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
