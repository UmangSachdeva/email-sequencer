/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#E4E0E1',
        secondary: '#D6C0B3',
        tertiary: '#AB886D',
        extra: '#493628',
      }
    },
  },
  plugins: [],
};
