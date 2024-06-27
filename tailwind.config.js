const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'background-land': "url('/src/assets/spin_wheel/background.webp')",
        'background-wheel': "url('/src/assets/spin_wheel/wheel.webp')",
      },
      fontFamily: {
        sans: ["'Inter Variable'", ...defaultTheme.fontFamily.sans],
        passero: ["'Passero One'"],
        passion: ["'Passion One'"],
      },
      colors: {
        "dark-blue": "#1E3557",
        "bold-blue": "#0754C4",
        "bright-red": "#EE5151",
        "warning-yellow": "#FAC515",
        "warm-white": "#FAF7EE",
        "dark-cream": "#DDD9CB",
        'primary-gray': '#C4BCC8'
      },
    },
  },
  plugins: [],
};
