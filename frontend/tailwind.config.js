import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Foundations 1a + type direction 1d, straight off the design handoff.
      // Namespaced under `sop-` so it sits beside the daisyUI theme rather
      // than replacing it.
      colors: {
        sop: {
          "bone-100": "#FBF7F1",
          "bone-200": "#F3EDE4",
          "bone-300": "#E7DFD3",
          "bone-400": "#C9C0B2",
          blush: "#F7D9D3",
          "blush-edge": "#E0BDB7",
          loin: "#EFB2A8",
          cured: "#B2726C",
          rust: "#7A3A16",
          ink: "#221E1C",
          "ink-70": "#45403C",
          "ink-50": "#6E6863",
          "ink-40": "#8E8781",
          ash: "#A9A29C",
          ember: "#C4661C",
          "ember-dark": "#A0511A",
          chill: "#A9B8BE",
          "chill-band": "#31383B",
        },
      },
      fontFamily: {
        sans: ["Archivo", "system-ui", "sans-serif"],
        display: ["'Instrument Serif'", "serif"],
        archivo: ["Archivo", "system-ui", "sans-serif"],
        plex: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    // "slice" is first, so it is the default theme. The storefront is built on
    // the sop-* palette directly; this keeps any residual daisyUI class on the
    // same colours and square corners rather than fighting the design.
    themes: [
      {
        slice: {
          primary: "#C4661C",
          "primary-content": "#FBF7F1",
          secondary: "#EFB2A8",
          "secondary-content": "#221E1C",
          accent: "#F7D9D3",
          "accent-content": "#221E1C",
          neutral: "#221E1C",
          "neutral-content": "#FBF7F1",
          "base-100": "#FBF7F1",
          "base-200": "#F3EDE4",
          "base-300": "#E7DFD3",
          "base-content": "#221E1C",
          info: "#A9B8BE",
          "info-content": "#221E1C",
          success: "#7A9A72",
          "success-content": "#FBF7F1",
          warning: "#C4661C",
          "warning-content": "#FBF7F1",
          error: "#B2726C",
          "error-content": "#FBF7F1",
          "--rounded-box": "0",
          "--rounded-btn": "0",
          "--rounded-badge": "0",
          "--animation-btn": "0",
          "--animation-input": "0",
          "--btn-focus-scale": "1",
          "--border-btn": "1.5px",
          "--tab-radius": "0",
        },
      },
      "coffee",
      "forest",
    ],
  },
};
