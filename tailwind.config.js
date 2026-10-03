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
        brand: {
          teal: '#185b63',       /* Deep Teal */
          tealHover: '#1f737d',
          crimson: '#c0261c',    /* Carmesim */
          amber: '#ba460d',      /* Terracota / Burnt Orange */
          gold: '#c59538',       /* Ocre Dourado */
          charcoal: '#404040',   /* Dark Slate */
          dark: '#101418',       /* Fundo principal escuro */
          darkElevated: '#12161a',
          surface: '#14181e',    /* Superfícies secundárias */
          card: '#181e24',       /* Superfície dos cards */
          cardHover: '#202830',  /* Hover de cards */
          border: '#2c3540',     /* Bordas sutis */
          borderMuted: '#404040' /* Bordas dos divisores */
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'glow-teal': '0 0 20px rgba(24, 91, 99, 0.45)',
        'glow-amber': '0 0 20px rgba(186, 70, 13, 0.4)',
        'glow-gold': '0 0 20px rgba(197, 149, 56, 0.4)',
        'glow-crimson': '0 0 20px rgba(192, 38, 28, 0.4)',
      }
    },
  },
  plugins: [],
}
