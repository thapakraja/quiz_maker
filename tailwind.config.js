/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#000000',
        surface: '#1a1a1a',
        primary: '#DC2626',
        secondary: '#B91C1C',
        accent: '#EF4444',
        'on-surface': '#FFFFFF',
        'text-muted': '#D1D5DB',
      },
      boxShadow: {
        'glow': '0 0 15px 0 rgba(220, 38, 38, 0.5)',
        'glow-strong': '0 0 25px 0 rgba(220, 38, 38, 0.7)',
      },
    }
  },
  plugins: [],
}
