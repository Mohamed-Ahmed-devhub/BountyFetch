// ===================================================
// i18n.js — إعداد نظام الترجمة الثنائية
// يدعم العربية (RTL) والإنجليزية (LTR)
// المسار: frontend/src/i18n.js
// ===================================================

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './locales/ar.json'
import en from './locales/en.json'

// اللغة المحفوظة أو الافتراضية
const savedLang = localStorage.getItem('app_language') || 'ar'

i18n
  .use(initReactI18next)
  .init({
    lng:          savedLang,
    fallbackLng:  'ar',
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    interpolation: { escapeValue: false },
  })

export default i18n
