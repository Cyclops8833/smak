import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('smak-lang') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('smak-lang', lang)
  }, [lang])

  const toggleLang = () => setLang(prev => prev === 'en' ? 'pl' : 'en')

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
