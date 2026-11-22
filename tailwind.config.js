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
          obsidian: '#0B0F13',
          surface: '#12181F',
          card: '#161E26',
          cardHover: '#1C2630',
          hairline: '#24303C',
          ivory: '#F1EFEA',
          muted: '#94A3B8',
          teal: '#185B63',
          tealHover: '#1F737D',
          tealLight: '#38B2AC',
          gold: '#C59538',
          copper: '#D4722C',
          crimson: '#D14338',
          /* Backwards-compatible aliases */
          amber: '#D4722C',
          charcoal: '#24303C',
          dark: '#0B0F13',
          darkElevated: '#12181F',
          border: '#24303C',
          borderMuted: '#24303C',
        }
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-teal': '0 0 24px rgba(56, 178, 172, 0.28)',
        'glow-gold': '0 0 24px rgba(197, 149, 56, 0.28)',
        'glow-copper': '0 0 24px rgba(212, 114, 44, 0.3)',
        'glow-amber': '0 0 24px rgba(212, 114, 44, 0.3)',
        'glow-crimson': '0 0 24px rgba(209, 67, 56, 0.3)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        chatEnter: {
          '0%': { opacity: '0', transform: 'translateY(14px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        orbitPulse: {
          '0%, 100%': { opacity: '0.75', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.12)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 200ms ease-out forwards',
        slideUp: 'slideUp 260ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        chatEnter: 'chatEnter 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        orbitPulse: 'orbitPulse 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
