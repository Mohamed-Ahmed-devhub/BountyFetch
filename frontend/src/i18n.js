// ===================================================
// i18n.js - إعداد نظام الترجمة الثنائية (عربي/إنجليزي)
// يتحكم في اتجاه الصفحة RTL/LTR تلقائياً
// ===================================================
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// استيراد ملفات النصوص لكل لغة
import arTranslations from './locales/ar.json'
import enTranslations from './locales/en.json'

i18n
  .use(initReactI18next)
  .init({
    // اللغة الافتراضية من متغيرات البيئة
    lng: import.meta.env.VITE_DEFAULT_LANG || 'ar',
    fallbackLng: 'ar',
    
    resources: {
      ar: { translation: arTranslations },
      en: { translation: enTranslations },
    },
    
    interpolation: {
      escapeValue: false, // React يحمي من XSS تلقائياً
    },
  })

export default i18n
