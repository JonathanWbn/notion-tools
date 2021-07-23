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
      blue: '#5893b3',
      lightBlue: '#ddebf0',
      darkBlue: '#2576a0',
      red: '#ea7271',
      lightRed: '#fbe4e3',
      darkRed: '#e03d3d',
      yellow: '#e49759',
      lightYellow: '#f9eadd',
      darkYellow: '#d9720e',
      link: '#73726d',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
