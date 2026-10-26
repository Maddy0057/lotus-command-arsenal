/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FAF9F6',
        panel: '#F5F4EE',
        card: '#FFFFFF',
        'card-code': '#F8FAFC',
        'card-hover': '#F3F2EB',
        elevated: '#FFFFFF',
        'border-subtle': '#E7E5DF',
        'border-bright': '#D6D3CC',
        brand: {
          DEFAULT: '#EA580C',
          light: '#F97316',
          tint: '#FFF7ED',
          border: '#FED7AA',
        },
        'brand-light': '#F97316',
        'brand-tint': '#FFF7ED',
        'brand-border': '#FED7AA',
        'terminal-green': '#166534',
        'terminal-dim': '#4D7C0F',
        'token-orange': '#9A3412',
        'token-bg': '#FFF7ED',
        'token-border': '#FDBA74',
        'token-cyan': '#C2410C',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 2px rgba(28, 25, 23, 0.04), 0 1px 3px rgba(28, 25, 23, 0.03)',
        glow: '0 0 0 1px rgba(234, 88, 12, 0.12), 0 10px 28px -18px rgba(234, 88, 12, 0.28)',
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
          '0%, 100%': { opacity: '0.55', boxShadow: '0 0 0 0 rgba(22,101,52,0.35)' },
          '50%': { opacity: '1', boxShadow: '0 0 0 4px rgba(22,101,52,0)' },
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
