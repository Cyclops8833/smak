export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          base: 'var(--surface-base)',
          elevated: 'var(--surface-elevated)',
          sunken: 'var(--surface-sunken)',
          warm: 'var(--surface-warm)',
        },
        moss: {
          DEFAULT: 'var(--moss)',
          light: 'var(--moss-light)',
          dark: 'var(--moss-dark)',
        },
        ochre: {
          DEFAULT: 'var(--ochre)',
          light: 'var(--ochre-light)',
          dark: 'var(--ochre-dark)',
        },
        terracotta: {
          DEFAULT: 'var(--terracotta)',
          light: 'var(--terracotta-light)',
        },
        violet: {
          DEFAULT: 'var(--violet)',
          light: 'var(--violet-light)',
          dark: 'var(--violet-dark)',
        },
        coral: {
          DEFAULT: 'var(--coral)',
          light: 'var(--coral-light)',
        },
        teal: {
          DEFAULT: 'var(--teal)',
          light: 'var(--teal-light)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        border: {
          default: 'var(--border-default)',
          strong: 'var(--border-strong)',
        },
      },
      fontFamily: {
        heading: ['Fraunces', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
}
