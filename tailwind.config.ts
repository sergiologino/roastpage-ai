import type { Config } from "tailwindcss"
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1",
          400: "#94a3b8", 500: "#64748b", 600: "#475569", 700: "#334155",
          800: "#1e293b", 900: "#0f172a", 950: "#020617",
        }
      },
      animation: {
        flame: "flame 1.5s ease-in-out infinite",
      },
      keyframes: {
        flame: {
          "0%, 100%": { transform: "scaleY(1) rotate(-2deg)" },
          "50%": { transform: "scaleY(1.1) rotate(2deg)" },
        },
      },
    },
  },
  plugins: [],
}
export default config
