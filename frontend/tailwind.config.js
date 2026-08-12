import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    // "slice" is first, so it is the default theme
    themes: [
      {
        slice: {
          primary: "#f06292",
          "primary-content": "#2a0f18",
          secondary: "#b04a63",
          "secondary-content": "#fff0f4",
          accent: "#f7c8d4",
          "accent-content": "#2a0f18",
          neutral: "#231318",
          "neutral-content": "#f7e9ee",
          "base-100": "#1a1013",
          "base-200": "#150c0f",
          "base-300": "#241519",
          "base-content": "#f6e9ec",
          info: "#7dd3fc",
          "info-content": "#08131c",
          success: "#86efac",
          "success-content": "#08170e",
          warning: "#fcd34d",
          "warning-content": "#1c1405",
          error: "#fb7185",
          "error-content": "#1f0709",
        },
      },
      "coffee",
      "forest",
    ],
  },
};
