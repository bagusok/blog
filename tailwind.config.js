/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        melrose: {
          50: '#f4f3ff',
          100: '#ebe8ff',
          200: '#d8d5ff',
          300: '#ada2ff',
          400: '#9a88fd',
          500: '#7a58fa',
          600: '#6a35f2',
          700: '#5b23de',
          800: '#4c1dba',
          900: '#401a98',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
