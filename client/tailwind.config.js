/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-canvas)',
        background: 'var(--color-bg)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          muted: 'var(--color-surface-muted)',
        },
        border: 'var(--color-border)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          soft: 'var(--color-accent-soft)',
        },
        status: {
          new: {
            bg: 'var(--status-new-bg)',
            text: 'var(--status-new-text)',
            dot: 'var(--status-new-dot)',
          },
          contacted: {
            bg: 'var(--status-contacted-bg)',
            text: 'var(--status-contacted-text)',
            dot: 'var(--status-contacted-dot)',
          },
          qualified: {
            bg: 'var(--status-qualified-bg)',
            text: 'var(--status-qualified-text)',
            dot: 'var(--status-qualified-dot)',
          },
          lost: {
            bg: 'var(--status-lost-bg)',
            text: 'var(--status-lost-text)',
            dot: 'var(--status-lost-dot)',
          },
        },
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        btn: '8px',
        card: '12px',
        pill: '999px',
      },
      boxShadow: {
        floating: '0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
      },
      maxWidth: {
        layout: '1280px',
        reading: '760px',
      },
    },
  },
  plugins: [],
};
