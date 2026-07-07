/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          primary: 'rgba(var(--color-primary-rgb), <alpha-value>)',
          hover: 'rgba(var(--color-primary-hover-rgb), <alpha-value>)',
          dark: 'rgba(var(--color-primary-dark-rgb), <alpha-value>)',
        }
      },
      boxShadow: {
        'theme-glow': '0 0 15px var(--color-primary-glow)',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
        ],
      },
    },
  },
  plugins: [],
}
