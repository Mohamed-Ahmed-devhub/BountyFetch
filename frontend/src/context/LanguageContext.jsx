// ===================================================
// LanguageContext.jsx — إدارة اللغة والاتجاه
// يتحكم في RTL/LTR وتغيير الخط بلمسة زر واحدة
// المسار: frontend/src/context/LanguageContext.jsx
// ===================================================

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation()

  const [language, setLanguage] = useState(
    localStorage.getItem('app_language') || 'ar'
  )

  // تطبيق اللغة على الـ DOM
  const applyLanguage = (lang) => {
    const isArabic = lang === 'ar'

    // تحديث مكتبة الترجمة
    i18n.changeLanguage(lang)

    // تحديث اتجاه الصفحة ولغتها
    document.documentElement.setAttribute('dir',  isArabic ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', lang)

    // حفظ الاختيار
    localStorage.setItem('app_language', lang)
    setLanguage(lang)
  }

  // تطبيق عند أول تحميل
  useEffect(() => { applyLanguage(language) }, [])

  // تبديل بين العربية والإنجليزية
  const toggleLanguage = () => {
    applyLanguage(language === 'ar' ? 'en' : 'ar')
  }

  return (
    <LanguageContext.Provider value={{
      language,
      toggleLanguage,
      isRTL: language === 'ar',
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
