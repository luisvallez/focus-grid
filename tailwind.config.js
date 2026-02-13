/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#09090b',
          50: '#18181b',
          100: '#27272a',
          200: '#3f3f46',
        },
        accent: {
          DEFAULT: '#f59e0b',
          soft: 'rgba(245,158,11,0.08)',
          border: 'rgba(245,158,11,0.15)',
        },
        recover: {
          DEFAULT: '#34d399',
          soft: 'rgba(52,211,153,0.08)',
          border: 'rgba(52,211,153,0.12)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
