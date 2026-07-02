/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#002a35",
        yellow: "#ffda00",
        fallback: "#1a1a2e",
        menuBg: "#6682c2"
      },
      fontFamily: {
        barlow: ['"Barlow Condensed"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
