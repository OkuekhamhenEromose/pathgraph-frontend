/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0A0C11",
          900: "#0D0F16",
          800: "#141826",
          700: "#1B2033",
          600: "#262C42",
          500: "#3A4160",
        },
        line: {
          ic: "#E8A23C",
          mgmt: "#8B7FE8",
        },
        signal: {
          teal: "#4FD9C5",
          coral: "#E8636B",
        },
        paper: {
          50: "#F5F6F9",
          200: "#C7CBD9",
          400: "#8A90A6",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
    },
  },
  plugins: [],
};
