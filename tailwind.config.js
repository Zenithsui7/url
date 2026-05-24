/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"',
          '"SF Pro Text"', '"DM Sans"', 'system-ui', 'sans-serif'
        ],
      },
      colors: {
        glass: {
          white: 'rgba(255,255,255,0.08)',
          border: 'rgba(255,255,255,0.12)',
          highlight: 'rgba(255,255,255,0.22)',
        },
        surface: {
          dark: '#020510',
          card: 'rgba(10,10,30,0.6)',
        }
      },
      animation: {
        'float': 'float 7s ease-in-out infinite',
        'float2': 'float 9s ease-in-out infinite 2s',
        'float3': 'float 11s ease-in-out infinite 4s',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'toast-in': 'toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        'toast-out': 'toastOut 0.25s ease-in forwards',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-30px) scale(1.06)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        toastIn: {
          from: { opacity: 0, transform: 'translateX(110%) scale(0.9)' },
          to: { opacity: 1, transform: 'translateX(0) scale(1)' },
        },
        toastOut: {
          from: { opacity: 1, transform: 'translateX(0) scale(1)' },
          to: { opacity: 0, transform: 'translateX(110%) scale(0.9)' },
        },
      },
      backdropBlur: {
        '4xl': '80px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(255,255,255,0.04)',
        'glass-lg': '0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.22)',
        glow: '0 0 40px rgba(139,92,246,0.4)',
        'glow-pink': '0 0 40px rgba(236,72,153,0.35)',
      },
    },
  },
  plugins: [],
}
