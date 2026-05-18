// ===== سياق اللغة والاتجاه =====
// يتحكم في تبديل العربية/الإنجليزية وRTL/LTR لكل التطبيق
// TODO (الأسبوع 4): ربط i18next لترجمة النصوص تلقائياً

import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ar') // اللغة الافتراضية: عربي
  const isRTL = language === 'ar'

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar'
    setLanguage(newLang)

    // تغيير اتجاه الصفحة كاملة
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', newLang)
  }

  return (
    <LanguageContext.Provider value={{ language, isRTL, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
