/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        // appliance / factor hues (light values; dark handled via CSS vars)
        ar: "var(--ac-h)",
        chuveiro: "var(--ac-e)",
        tv: "var(--ac-x)",
        ventilador: "var(--ac-a)",
        fogao: "var(--ac-c)",
        luz: "var(--ac-o)",
      },
    },
  },
  plugins: [],
};
