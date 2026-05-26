/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cursive: ['"Great Vibes"', 'cursive'],
        calligraphy: ['"Pinyon Script"', 'cursive'],
        sans: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#fffcf7',
          100: '#fff3ed',
          200: '#ffecd6',
          300: '#ffdcb3',
          450: '#fbe2cc',
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(255, 255, 255, 0.2)',
        'glass-glow': '0 8px 32px 0 rgba(253, 186, 116, 0.35)',
        'gold-glow': '0 0 20px 4px rgba(251, 191, 36, 0.4)',
      }
    },
  },
  plugins: [],
}
