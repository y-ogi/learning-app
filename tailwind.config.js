/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',   // 縦向きiPad Mini
        'md': '768px',   // 横向きiPad Mini
        'lg': '1024px',  // 縦向きiPad
        'xl': '1280px',  // 横向きiPad
      },
    },
  },
  plugins: [],
}