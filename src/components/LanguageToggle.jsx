import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguage()
  const [popKey, setPopKey] = useState(0)

  const handleClick = () => {
    toggleLang()
    setPopKey(k => k + 1)
  }

  return (
    <button
      onClick={handleClick}
      className="w-10 h-10 rounded-full bg-surface-sunken border border-border-default flex items-center justify-center transition-all duration-200 active:scale-90"
      aria-label={lang === 'en' ? 'Switch to Polish' : 'Switch to English'}
    >
      <span
        key={popKey}
        className={`font-mono text-xs font-medium ${lang === 'pl' ? 'text-violet' : 'text-text-secondary'} ${popKey > 0 ? 'animate-heart-pop' : ''}`}
      >
        {lang === 'en' ? 'EN' : 'PL'}
      </span>
    </button>
  )
}
