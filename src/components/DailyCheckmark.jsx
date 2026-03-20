import { useState } from 'react'
import { useDailyLog } from '../hooks/useDailyLog'
import { useLanguage } from '../context/LanguageContext'
import { uiStrings } from '../data/uiStrings'

export default function DailyCheckmark({ foodId }) {
  const { hasEaten, toggleEaten } = useDailyLog()
  const { lang } = useLanguage()
  const s = uiStrings[lang]
  const eaten = hasEaten(foodId)

  const [popKey, setPopKey] = useState(0)

  const handleClick = () => {
    toggleEaten(foodId)
    if (!eaten) setPopKey(k => k + 1)
  }

  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg
        text-base font-medium font-body
        active:scale-95 transition-all duration-200
        ${eaten
          ? 'bg-moss-light text-moss border border-moss/30'
          : 'bg-surface-sunken text-text-secondary border border-border-default'
        }
      `}
    >
      {eaten ? (
        <span key={popKey} className={popKey > 0 ? 'animate-heart-pop' : ''}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <circle cx="10" cy="10" r="9" />
            <path d="M6 10l3 3 5-5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </span>
      ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
      {eaten ? s.eatenToday : s.ateToday}
    </button>
  )
}
