/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./src/**/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: colors.sky,
                default: {
                    1: "#2a2a2e",
                    2: "#313136",
                    3: "#3a3a40",
                },
            },
        },
    },
    plugins: [],
};
