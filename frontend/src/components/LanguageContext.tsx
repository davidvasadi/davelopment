import React, { useState, createContext, useContext } from 'react'
import { Language } from '../types'
import { defaultLanguage, translate } from '../i18n'

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  t: <T = string>(key: string) => T
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(defaultLanguage)

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hu' : 'en'))
  }

  const t = <T = string,>(key: string): T => {
    return translate(key, language) as T
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
