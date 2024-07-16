/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./src/**/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
        colors: {
          default: {
                1: '#2a2a2e',
            },
        }
    },
  },
  plugins: [],
}
