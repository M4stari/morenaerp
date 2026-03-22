export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        morena: {
          50: '#faf7f4',
          100: '#f5f0e8',
          200: '#ede1d7',
          300: '#dfc4b8',
          400: '#d4a896',
          500: '#c8917a',
          600: '#b8765a',
          700: '#8f5a3f',
          800: '#744b37',
          900: '#5d3d2d',
        },
        brand: {
          black: '#373435',
          ink: '#161314',
          graphite: '#211d1f',
          gray: '#BDBFC1',
          pink: '#FF43A3',
          yellow: '#F84E4E',
          green: '#5CC6D0',
          turquoise: '#00F281',
          red: '#ED3237',
          orange: '#F58634',
        }
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Manrope', 'Segoe UI', 'sans-serif']
      },
    },
  },
  plugins: [],
}
