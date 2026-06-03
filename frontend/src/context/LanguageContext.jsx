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
    localStorage.setItem('app_language', lang)
    setLanguage(lang)
  }

  useEffect(() => { apply(language) }, [])

  return (
    <Ctx.Provider value={{ language, toggleLanguage: () => apply(language === 'ar' ? 'en' : 'ar'), isRTL: language === 'ar' }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLanguage() { return useContext(Ctx) }
