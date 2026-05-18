// إعدادات Tailwind CSS مع تخصيص ألوان وفونتات المشروع
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // دعم الوضع المظلم يدوياً عبر class
  darkMode: 'class',
  theme: {
    extend: {
      // ألوان المشروع: Cyberpunk Dark
      colors: {
        'neon-cyan':    '#00D4FF',
        'neon-purple':  '#7B2FFF',
        'neon-green':   '#00FF88',
        'dark-bg':      '#0A0A0F',
        'dark-card':    '#12121A',
        'dark-border':  '#1E1E2E',
      },
      // فونتات المشروع
      fontFamily: {
        'arabic': ['Cairo', 'Tajawal', 'sans-serif'],
        'english': ['Inter', 'Space Grotesk', 'sans-serif'],
      },
      // أنيميشن النبضة للرادار
      animation: {
        'pulse-neon': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
