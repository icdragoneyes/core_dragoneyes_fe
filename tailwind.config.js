/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        customBounce: {
          "0%, 100%": { transform: "translateY(0) scaleX(-1) rotate(130deg)" },
          "50%": { transform: "translateY(-10px) scaleX(-1) rotate(130deg)" },
        },
      },
      animation: {
        customBounce: "customBounce 0.5s ease-out 3",
      },
    },
  },
  plugins: [],
};
