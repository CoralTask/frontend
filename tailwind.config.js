/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          300: '#00BDBD',
        },
        fontFamily: {
          pretendard: ['Pretendard', 'sans-serif'],
        },
      },
    },
  },
  plugins: [],
}