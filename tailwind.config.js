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
        poolbeanbags: {
          "primary": "#2563eb", /* blue */
          "primary-focus": "#1e40af",
          "primary-content": "#ffffff",

          "secondary": "#3b82f6", /* lighter blue */
          "secondary-focus": "#2563eb",
          "secondary-content": "#ffffff",

          "accent": "#eab308", /* yellow accent */
          "neutral": "#000000", /* black */
          "base-100": "#ffffff", /* white */
          "base-200": "#f8fafc", /* light gray */
          "base-300": "#e2e8f0",
          "base-content": "#000000",
          "info": "#3b82f6",
          "success": "#22c55e", /* bright green */
          "warning": "#eab308", /* yellow */
          "error": "#ef4444" /* bright red/pink */
        }
      }
    ],
  }
}
