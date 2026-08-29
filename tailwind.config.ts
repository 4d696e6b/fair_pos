import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FDF3EC",
          100: "#FCE4D1",
          200: "#F6C79E",
          400: "#E08A3F",
          600: "#C2570F",
          700: "#9A4508",
          800: "#7C3609",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Noto Sans Thai", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;