/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        accent: 'var(--color-accent)',
        'accent-strong': 'var(--color-accent-strong)',
        surface: 'var(--color-surface)',
        background: 'var(--color-background)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        brand: {
          navy: 'var(--color-primary)',
          'navy-dark': 'var(--color-primary-dark)',
          'navy-light': 'var(--color-primary-hover)',
          orange: 'var(--color-accent-strong)',
          'orange-hover': 'var(--color-accent-hover)',
          'light-blue': 'var(--color-primary-soft)',
          'light-gray': 'var(--color-background)',
          'border-gray': 'var(--color-border)',
          'text-primary': 'var(--color-text)',
          'text-secondary': 'var(--color-muted)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 24px rgba(15, 35, 67, 0.06)',
        card: '0 2px 8px rgba(15, 35, 67, 0.04), 0 12px 32px rgba(15, 35, 67, 0.04)',
      },
      borderRadius: { card: '18px' },
    },
  },
  plugins: [],
}
