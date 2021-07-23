// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/infrastructure/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
    },
    colors: {
      ...colors,
      black: '#37352f',
      green: '#5b9d92',
      lightGreen: '#ddecea',
      darkGreen: '#107b6b',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
