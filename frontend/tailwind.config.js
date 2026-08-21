/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        walnut: {
          50: '#f7f3ef',
          100: '#ece2d6',
          200: '#d8c3a8',
          300: '#c1a179',
          400: '#a87f55',
          500: '#8a6440',
          600: '#6f4f34',
          700: '#573f2b',
          800: '#402e20',
          900: '#2a1e16',
        },
        linen: {
          50: '#faf8f4',
          100: '#f2ede3',
          200: '#e6dcc9',
        },
        sage: {
          400: '#8a9a7e',
          500: '#6f8062',
          600: '#586750',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
