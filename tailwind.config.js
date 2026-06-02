/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans KR", "sans-serif"],
      },
      colors: {
        pastel: {
          purple: "#e8d5f5",
          "purple-deep": "#c9a8e8",
          "purple-text": "#7c3aed",
          lavender: "#f0e6ff",
          pink: "#fce4ec",
          "pink-deep": "#f48fb1",
          mint: "#e0f7f0",
          "mint-deep": "#80cbc4",
          yellow: "#fff9e6",
          "yellow-deep": "#ffd54f",
          blue: "#e3f2fd",
          "blue-deep": "#90caf9",
          peach: "#fbe9e7",
          sage: "#e8f5e9",
        },
      },
      boxShadow: {
        soft: "0 2px 15px rgba(139, 92, 246, 0.08)",
        card: "0 4px 20px rgba(139, 92, 246, 0.12)",
        float: "0 8px 30px rgba(139, 92, 246, 0.18)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
