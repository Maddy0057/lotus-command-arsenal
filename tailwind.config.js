/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#090a0f',
        panel: '#0c0d12',
        card: '#111319',
        'card-hover': '#161922',
        elevated: '#1b1f2b',
        'border-subtle': 'rgba(255, 255, 255, 0.08)',
        'border-bright': '#1b1f2b',
        brand: {
          DEFAULT: '#06b6d4',
          light: '#22d3ee',
          bright: '#00e5ff',
        },
        'terminal-green': '#4ade80',
        'terminal-dim': '#6a9955',
        'token-cyan': '#22d3ee',
        'token-bg': 'rgba(8, 51, 68, 0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        panel: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 1px 2px rgba(0,0,0,0.5)',
        glow: '0 0 0 1px rgba(0,229,255,0.18), 0 0 24px -10px rgba(0,229,255,0.35)',
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
