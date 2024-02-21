/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#156164",
        "button": "#33D0AE"
      },
      fontFamily: {
        "Inter": ["Inter", "sans-serif"],
        "sans": ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}