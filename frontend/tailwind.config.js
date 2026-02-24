/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cdi: {
          purple: "#5B5EF5",
          gold: "#F5B800",
          navy: "#2D3250",
        },
      },
    },
  },
  plugins: [],
};
