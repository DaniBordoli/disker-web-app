/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores del proyecto mobile - Sistema de diseño consistente
        primary: {
          950: '#191919',
          900: '#3D3D3D',
          800: '#454545',
          700: '#4F4F4F',
          600: '#5D5D5D',
          500: '#6D6D6D',
          400: '#888888',
          300: '#B0B0B0',
          200: '#D1D1D1',
          100: '#E7E7E7',
          50: '#F6F6F6',
        },
        violet: {
          950: '#3A0269',
          900: '#5178C',
          800: '#691AAF',
          700: '#7B1AD6',
          600: '#8F2AF3',
          500: '#B063FF',
          400: '#BE7EFF',
          300: '#D7B6FF',
          200: '#E8D3FF',
          100: '#F3E7FF',
          50: '#FAF5FF',
        },
      },
    },
  },
  plugins: [],
}
