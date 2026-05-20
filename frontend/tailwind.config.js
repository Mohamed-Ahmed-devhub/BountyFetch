// ===================================================
// tailwind.config.js — إعداد Tailwind CSS لـ BountyFetch
// يحتوي على ألوان البراند المخصصة وإعدادات RTL
// المسار: frontend/tailwind.config.js
// ===================================================

/** @type {import('tailwindcss').Config} */
export default {
  // الملفات التي يفحصها Tailwind لإزالة الكلاسات غير المستخدمة
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  // Dark Mode عبر class (نتحكم فيه يدوياً)
  darkMode: 'class',

  theme: {
    extend: {
      // ── ألوان BountyFetch المخصصة ──
      colors: {
        // الألوان الأساسية للخلفيات
        'bf-bg':        '#020617',  // slate-950
        'bf-surface':   '#0f172a',  // slate-900
        'bf-border':    '#1e293b',  // slate-800
        'bf-border-lt': '#334155',  // slate-700

        // ألوان البراند — Royal Blue
        'bf-royal':     '#2563eb',  // blue-600
        'bf-royal-lt':  '#3b82f6',  // blue-500
        'bf-sky':       '#0ea5e9',  // sky-500
        'bf-indigo':    '#6366f1',  // indigo-500

        // ألوان النص
        'bf-text':      '#f1f5f9',  // slate-100
        'bf-muted':     '#94a3b8',  // slate-400
        'bf-subtle':    '#475569',  // slate-600

        // ألوان الحالات
        'bf-green':     '#22c55e',
        'bf-red':       '#f87171',
        'bf-yellow':    '#fbbf24',
      },

      // ── الخطوط ──
      fontFamily: {
        display: ['Syne', 'Cairo', 'system-ui', 'sans-serif'],
        body:    ['DM Sans', 'Tajawal', 'system-ui', 'sans-serif'],
        arabic:  ['Cairo', 'Tajawal', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },

      // ── حجم الخط السائل ──
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        'xs':  ['0.75rem',  { lineHeight: '1.1rem' }],
      },

      // ── أنيميشن مخصص ──
      animation: {
        'live-pulse':    'livePulse 1.6s ease-in-out infinite',
        'fade-up':       'fadeUp .5s ease-out forwards',
        'fade-in':       'fadeIn .4s ease-out forwards',
        'scale-in':      'scaleIn .35s ease-out forwards',
        'skeleton':      'skeletonShimmer 1.5s ease-in-out infinite',
        'spin-slow':     'spin 3s linear infinite',
      },

      keyframes: {
        livePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%':      { transform: 'scale(1.35)', opacity: '0.65' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        skeletonShimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },

      // ── Border Radius موسّع ──
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // ── أحجام مخصصة ──
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '92': '23rem',
        '96': '24rem',
      },

      // ── Box Shadows مخصصة ──
      boxShadow: {
        'royal':    '0 0 20px rgba(37,99,235,0.4), 0 0 40px rgba(37,99,235,0.15)',
        'sky':      '0 0 20px rgba(14,165,233,0.4)',
        'glass':    '0 4px 24px rgba(0,0,0,0.4)',
        'card':     '0 1px 3px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.4), 0 16px 40px rgba(0,0,0,0.3)',
      },

      // ── Backdrop Blur ──
      backdropBlur: {
        xs: '2px',
        '4xl': '64px',
      },

      // ── Grid Template ──
      gridTemplateColumns: {
        'auto-fit-card': 'repeat(auto-fill, minmax(300px, 1fr))',
        'auto-fit-sm':   'repeat(auto-fill, minmax(180px, 1fr))',
      },

      // ── Max Width ──
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },

      // ── Transition ──
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },
    },
  },

  plugins: [
    // يمكن إضافة @tailwindcss/forms أو @tailwindcss/typography هنا لاحقاً
  ],
}
