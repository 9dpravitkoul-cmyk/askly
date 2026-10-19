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
        'primary-soft': 'var(--color-primary-soft)',
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
        live: 'var(--color-live)',
        brand: {
          navy: 'var(--color-primary)',
          'navy-dark': 'var(--color-primary-dark)',
          'navy-light': 'var(--color-primary-hover)',
          orange: 'var(--color-accent)',
          'orange-hover': 'var(--color-accent-hover)',
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
        soft: '0 8px 24px rgba(12, 40, 84, 0.06)',
        card: '0 2px 8px rgba(12, 40, 84, 0.04), 0 12px 32px rgba(12, 40, 84, 0.05)',
      },
      borderRadius: { card: '16px' },
    },
  },
  plugins: [],
}
