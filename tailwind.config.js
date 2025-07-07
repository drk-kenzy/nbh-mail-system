/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // active le mode sombre via la classe 'dark'
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // bleu NBH
          dark: '#1e40af',
          light: '#60a5fa',
        },
        accent: {
          DEFAULT: '#f59e42', // orange accent
          dark: '#b45309',
        },
        success: '#22c55e',
        warning: '#fbbf24',
        danger: '#ef4444',
        surface: '#18181b',
        muted: '#374151',
        secondary: "#90CAF9",
        light: "#1E1E1E",
        neutral: "#9CA3AF"
      },
      fontFamily: {
        sans: [
          'Inter', 'Geist', 'Geist Mono', 'ui-sans-serif', 'system-ui', 'sans-serif',
        ],
      },
      borderRadius: {
        xl: '1rem',
      },
      boxShadow: {
        focus: '0 0 0 3px #2563eb55',
      },
    },
  },
  plugins: [],
}

