import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        zencall: {
          coral: {
            50: "#FFF5F5", 100: "#FFE8E8", 200: "#FFBCBC", 300: "#FFA0A0",
            400: "#FF8080", 500: "#FF6B6B", 600: "#E55A5A", 700: "#CC4A4A",
          },
          blue: {
            50: "#F0F9FC", 100: "#E1F3F9", 200: "#7EC8E3", 300: "#5BB8D9",
            400: "#38A8CF", 500: "#2196C5", 600: "#1A7BA3",
          },
          mint: {
            50: "#F2FBF8", 100: "#E5F7F1", 200: "#98D7C2", 300: "#7ACDB0",
            400: "#5CC39E", 500: "#3EB98C", 600: "#319470",
          },
          lavender: {
            50: "#F8F6FA", 100: "#F1EDF5", 200: "#B8A9C9", 300: "#A490B8",
          },
        },
        background: { DEFAULT: "#FAFBFC", card: "#FFFFFF" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px 0 rgba(0, 0, 0, 0.05)",
        medium: "0 4px 16px 0 rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
