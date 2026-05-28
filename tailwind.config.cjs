/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Comic Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        daria: {
          bg:              'var(--color-bg)',
          surface:         'var(--color-surface)',
          border:          'var(--color-border)',
          'border-light':  'var(--color-border-light)',
          green:           'var(--color-green)',
          'green-bright':  'var(--color-green-bright)',
          'green-muted':   'var(--color-green-muted)',
          purple:          'var(--color-purple)',
          'purple-bright': 'var(--color-purple-bright)',
          'purple-muted':  'var(--color-purple-muted)',
          orange:          'var(--color-orange)',
          'orange-bright': 'var(--color-orange-bright)',
          pink:            'var(--color-pink)',
          text:            'var(--color-text)',
          'text-muted':    'var(--color-text-muted)',
          'text-dim':      'var(--color-text-dim)',
        },
      },
      boxShadow: {
        'glow-green':  'var(--shadow-glow-green)',
        'glow-purple': 'var(--shadow-glow-purple)',
        'glow-orange': 'var(--shadow-glow-orange)',
        'card':        'var(--shadow-card)',
      },
      borderRadius: {
        'card': '12px',
        'button': '10px',
        'input': '10px',
        'badge': '8px',
      },
    },
  },
  plugins: [],
}
