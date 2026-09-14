/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#c1272d', // fire-safety red, matches KK Fire Services branding
          dark: '#8f1b20',
        },
      },
    },
  },
  plugins: [],
};
