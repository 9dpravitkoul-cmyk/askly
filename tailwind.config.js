/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#18396C',
          'navy-dark': '#102649',
          'navy-light': '#244D8D',
          orange: '#F39A24',
          'orange-hover': '#DF8B1D',
          'light-blue': '#EAF1FC',
          'light-gray': '#F5F6F8',
          'border-gray': '#E7EAF0',
          'text-primary': '#17243B',
          'text-secondary': '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
