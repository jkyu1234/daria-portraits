/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Daria 90s MTV color palette
        daria: {
          green:  '#1a4a2e',
          olive:  '#2d5a1e',
          purple: '#3d2b4f',
          orange: '#e8850c',
          pink:   '#d4498b',
          gray:   '#2a2a2a',
        },
      },
    },
  },
  plugins: [],
};
