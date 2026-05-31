/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#002D62', light: '#003D82', xs: '#E8EEF7' },
        bf:   { bg: '#F4F6F9', border: '#D8DEE9', muted: '#5A6478' },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Cairo', 'system-ui', 'sans-serif'],
        body:    ['DM Sans', 'Tajawal', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
