/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F8FA",
        card: "#FFFFFF",
        primary: {
          DEFAULT: "#6D35C8",
          hover: "#7E45DD",
          active: "#5B24B3",
          light: "#F4EFFE",
          border: "#E9DCFF",
        },
        dark: {
          DEFAULT: "#1F2024",
          soft: "#33353A",
          muted: "#4A4D53",
        },
        secondary: {
          DEFAULT: "#6B6F76",
          light: "#9CA1AA",
          extraLight: "#E8E9EC",
        },
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(0, 0, 0, 0.04)",
        card: "0 4px 20px -2px rgba(109, 53, 200, 0.06)",
        float: "0 10px 25px -5px rgba(109, 53, 200, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
        primaryGlow: "0 4px 14px 0 rgba(109, 53, 200, 0.35)",
      },
    },
  },
  plugins: [],
};
