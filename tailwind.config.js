const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "background-land": "url('/src/assets/spin_wheel/background.webp')",
        "background-wheel": "url('/src/assets/spin_wheel/wheel.webp')",
      },
      fontFamily: {
        sans: ["'Inter Variable'", ...defaultTheme.fontFamily.sans],
        passion: ["Passion One", "sans-seerif"],
        passero: ["Passero One", "sans-serif"],
        alatsi: ["Alatsi", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      keyframes: {
        customBounce: {
          "0%, 100%": { transform: "translateY(0) scaleX(-1) rotate(130deg)" },
          "50%": { transform: "translateY(-10px) scaleX(-1) rotate(130deg)" },
        },
      },
      animation: {
        customBounce: "customBounce 0.5s ease-out 3",
      },
      colors: {
        "dark-blue": "#1E3557",
        "bold-blue": "#0754C4",
        "bright-red": "#EE5151",
        "warning-yellow": "#FAC515",
        "warm-white": "#FAF7EE",
        "dark-cream": "#DDD9CB",
        "primary-gray": "#C4BCC8",
      },
    },
  },
  plugins: [],
};
