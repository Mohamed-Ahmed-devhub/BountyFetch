<<<<<<< HEAD
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './locales/ar.json'
import en from './locales/en.json'

i18n.use(initReactI18next).init({
  lng: localStorage.getItem('app_language') || 'ar',
  fallbackLng: 'ar',
  resources: { ar: { translation: ar }, en: { translation: en } },
  interpolation: { escapeValue: false },
})
=======
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

>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
export default i18n
