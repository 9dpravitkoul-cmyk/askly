/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          dark: 'var(--color-primary-dark)',
          soft: 'var(--color-primary-soft)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          hover: 'var(--color-secondary-hover)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          strong: 'var(--color-accent-strong)',
          soft: 'var(--color-accent-soft)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          secondary: 'var(--color-surface-secondary)',
        },
        background: 'var(--color-background)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        live: 'var(--color-live)',

        // Backward compatibility mappings
        brand: {
          navy: 'var(--color-primary)',
          'navy-dark': 'var(--color-primary-dark)',
          'navy-light': 'var(--color-primary-hover)',
          orange: 'var(--color-accent)',
          'orange-hover': 'var(--color-accent-strong)',
          'light-blue': 'var(--color-primary-soft)',
          'light-gray': 'var(--color-background)',
          'border-gray': 'var(--color-border)',
          'text-primary': 'var(--color-text)',
          'text-secondary': 'var(--color-muted)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        card: 'var(--shadow-card)',
      },
      borderRadius: {
        card: '16px',
      },
    },
  },
  plugins: [],
}
