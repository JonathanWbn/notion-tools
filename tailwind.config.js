/** @type {import('tailwindcss').Config} */

module.exports = {
  purge: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
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
    boxShadow: {
      DEFAULT: '0 8px 30px rgba(0,0,0,0.12);',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
