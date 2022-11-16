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
    boxShadow: {
      DEFAULT: '0 8px 30px rgba(0,0,0,0.12);',
    },
    colors: {
      ...colors,
      black: '#37352f',
      green: {
        ...colors.green,
        light: '#ddecea',
        DEFAULT: '#5b9d92',
        dark: '#107b6b',
      },
      blue: {
        ...colors.blue,
        light: '#ddebf0',
        DEFAULT: '#5893b3',
        dark: '#2576a0',
      },
      red: {
        ...colors.red,
        light: '#fbe4e3',
        DEFAULT: '#ea7271',
        dark: '#e03d3d',
      },
      yellow: {
        ...colors.yellow,
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
