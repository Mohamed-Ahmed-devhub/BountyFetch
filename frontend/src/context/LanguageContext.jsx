<<<<<<< HEAD
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const Ctx = createContext(null)

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation()
  const [language, setLanguage] = useState(localStorage.getItem('app_language') || 'ar')

  const apply = lang => {
    i18n.changeLanguage(lang)
    document.documentElement.setAttribute('dir',  lang === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', lang)
=======
// ===================================================
// LanguageContext.jsx - إدارة تغيير اللغة والاتجاه
// يتحكم في RTL/LTR وتغيير الخط بلمسة زر
// ===================================================
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation()
  
  // تحديد اللغة الافتراضية من البيئة أو من الحفظ المسبق
  const [language, setLanguage] = useState(
    localStorage.getItem('app_language') || import.meta.env.VITE_DEFAULT_LANG || 'ar'
  )

  // دالة تبديل اللغة بين العربية والإنجليزية
  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar'
    applyLanguage(newLang)
  }

  // دالة تطبيق اللغة على كل عناصر الصفحة
  const applyLanguage = (lang) => {
    // تغيير مكتبة الترجمة
    i18n.changeLanguage(lang)
    
    // تغيير اتجاه الصفحة بالكامل
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', lang)
    
    // حفظ اختيار المستخدم
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
    localStorage.setItem('app_language', lang)
    setLanguage(lang)
  }

<<<<<<< HEAD
  useEffect(() => { apply(language) }, [])

  return (
    <Ctx.Provider value={{ language, toggleLanguage: () => apply(language === 'ar' ? 'en' : 'ar'), isRTL: language === 'ar' }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLanguage() { return useContext(Ctx) }
=======
  // تطبيق اللغة عند أول تشغيل للتطبيق
  useEffect(() => {
    applyLanguage(language)
  }, [])

  const isRTL = language === 'ar'

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, isRTL }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
>>>>>>> 22a803e267d6039fa8b6e56f42ee908d4fd7465a
