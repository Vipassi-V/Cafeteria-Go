/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#F97316", // The Orange accent
        background: "#0a0a0a", // Deep Black
        card: "#111111", // Dark Gray card
        foreground: "#ffffff",
      },
      fontFamily: {
        outfit: ["Outfit"], // Supporting the luxury premium font
      }
    },
  },
  plugins: [],
}
