/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0a16",
        card: "#141129",
        text: "#ecebff",
        muted: "#b7b3d9",
        brand: "#6b5bd7",   // violetti
        accent: "#f2a24a",  // oranssi
      },
      dropShadow: {
        glow: "0 0 20px rgba(107,91,215,.45)",
      },
    },
  },
  plugins: [],
};
