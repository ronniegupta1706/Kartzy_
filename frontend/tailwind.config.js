/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",  // ensure all source files with Tailwind classes are included
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
