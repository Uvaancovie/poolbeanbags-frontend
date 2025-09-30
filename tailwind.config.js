/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    logs: false,
    themes: [
      {
        aquarius: {
          "primary": "#0ea5e9", /* sky blue */
          "primary-focus": "#0284c7",
          "primary-content": "#ffffff",

          "secondary": "#7dd3fc",
          "secondary-focus": "#38bdf8",
          "secondary-content": "#0f172a",

          "accent": "#60a5fa",
          "neutral": "#0f172a",
          "base-100": "#f8fafc",
          "info": "#93c5fd",
          "success": "#34d399",
          "warning": "#f59e0b",
          "error": "#f87171"
        }
      }
    ],
  }
}
