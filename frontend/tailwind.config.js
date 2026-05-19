// إعداد Tailwind CSS مع دعم RTL والألوان المخصصة للمشروع
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // تفعيل الـ Dark Mode عبر class بدلاً من prefers-color-scheme
  darkMode: 'class',
  theme: {
    extend: {
      // ألوان المشروع المخصصة (Cyberpunk Theme)
      colors: {
        brand: {
          cyan:    '#00D4FF',  // اللون الأساسي - السايان النيون
          purple:  '#7B2FFF',  // اللون الثانوي - البنفسجي
          dark:    '#0A0A0F',  // خلفية الصفحة
          surface: '#12121A',  // خلفية الكروت والعناصر
          border:  '#1E1E2E',  // لون الحدود
        },
        neon: {
          green:   '#00FF88',  // للحالات الإيجابية (مهمة جديدة!)
          red:     '#FF3366',  // للتنبيهات والأخطاء
          yellow:  '#FFD700',  // للمهام المتوسطة الأهمية
        },
      },
      // الخطوط المستخدمة
      fontFamily: {
        arabic:  ['Cairo', 'Tajawal', 'sans-serif'],
        english: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono:    ['Fira Code', 'monospace'], // للكود في Code Shield
      },
      // أحجام الرسوم المتحركة
      animation: {
        'pulse-neon': 'pulseNeon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in':   'slideIn 0.3s ease-out',
        'fade-up':    'fadeUp 0.4s ease-out',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 5px #00D4FF' },
          '50%':      { opacity: 0.7, boxShadow: '0 0 20px #00D4FF, 0 0 40px #00D4FF' },
        },
        slideIn: {
          '0%':   { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeUp: {
          '0%':   { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
