/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#08090a',
        panel: '#0f1011',
        card: '#16181a',
        'card-hover': '#1f2124',
        'border-subtle': 'rgba(255, 255, 255, 0.06)',
        'border-bright': 'rgba(255, 255, 255, 0.12)',
        brand: {
          DEFAULT: '#5e6ad2',
          light: '#7170ff',
          bright: '#828fff',
        },
        'terminal-green': '#4ade80',
        'token-cyan': '#38bdf8',
        'token-bg': 'rgba(56, 189, 248, 0.15)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 16px 40px -24px rgba(0,0,0,0.9)',
        glow: '0 0 0 1px rgba(113,112,255,0.25), 0 0 32px -8px rgba(113,112,255,0.45)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(14px) scale(0.99)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.55', boxShadow: '0 0 0 0 rgba(74,222,128,0.35)' },
          '50%': { opacity: '1', boxShadow: '0 0 0 4px rgba(74,222,128,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out both',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        'glow-pulse': 'glowPulse 2.4s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
}
