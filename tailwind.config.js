/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F8F9F7',
          surface: '#FFFFFF',
          text: '#17201D',
          muted: '#68736F',
          red: '#8F1D2C',
          redDark: '#741522',
          redLight: '#F8E9EC',
          green: '#20A878',
          greenLight: '#E8F7F0',
        },
      },
    },
  },
  plugins: [],
}
