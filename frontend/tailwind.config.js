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
        "secondary": "#33D0AE",
        "tertiary" :"#156064",
        "button": "#00C49A",
        "background": "#15606424"
      },
      fontFamily: {
        "Inter": ["Inter", "sans-serif"],
        "sans": ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}