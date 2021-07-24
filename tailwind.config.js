// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/infrastructure/components/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
    },
    colors: {
      ...colors,
      black: '#37352f',
      green: {
        light: '#ddecea',
        DEFAULT: '#5b9d92',
        dark: '#107b6b',
      },
      blue: {
        light: '#ddebf0',
        DEFAULT: '#5893b3',
        dark: '#2576a0',
      },
      red: {
        light: '#fbe4e3',
        DEFAULT: '#ea7271',
        dark: '#e03d3d',
      },
      yellow: {
        light: '#f9eadd',
        DEFAULT: '#e49759',
        dark: '#d9720e',
      },
      link: '#73726d',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
