/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#0F172A",
        secondary: {
          DEFAULT: "#F8FAFC",
          foreground: "#475569",
        },
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#94A3B8",
        },
        accent: {
          DEFAULT: "#2563EB",
          foreground: "#FFFFFF",
        },
        border: "#E2E8F0",
        input: "#E2E8F0",
        ring: "#2563EB",
        success: "#10B981",
        destructive: "#EF4444",
        warning: "#F59E0B",
        neutral: "#64748B",
        intel: {
          slate: "#0F172A",
          muted: "#475569",
          border: "#E2E8F0",
          light: "#F8FAFC",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        'sidebar': '280px',
        'header': '72px',
      },
      boxShadow: {
        'premium': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'subtle': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
      }
    },
  },
  plugins: [],
};
