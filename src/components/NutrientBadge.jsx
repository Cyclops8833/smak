import { useState, useRef, useEffect } from 'react'
import { NUTRIENT_INFO } from '../data/nutrientInfo'
import { useLanguage } from '../context/LanguageContext'

const STRENGTH_STYLES = {
  excellent:   'bg-moss-light text-moss',
  'very good': 'bg-ochre-light text-ochre',
  good:        'bg-surface-sunken text-text-secondary',
}

const DOTS = {
  excellent:   '●●●',
  'very good': '●●○',
  good:        '●○○',
}

export default function NutrientBadge({ name, namePl, strength }) {
  const { lang } = useLanguage()
  const [visible, setVisible] = useState(false)
  const longPressTimer = useRef(null)
  const hoverTimer     = useRef(null)
  const dismissTimer   = useRef(null)

  const show = () => {
    clearTimeout(dismissTimer.current)
    setVisible(true)
    dismissTimer.current = setTimeout(() => setVisible(false), 4000)
  }

  const hide = () => {
    clearTimeout(dismissTimer.current)
    setVisible(false)
  }

  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') {
      longPressTimer.current = setTimeout(show, 500)
    }
  }
  const onPointerUp     = () => clearTimeout(longPressTimer.current)
  const onPointerCancel = () => clearTimeout(longPressTimer.current)

  const onMouseEnter = () => { hoverTimer.current = setTimeout(show, 1000) }
  const onMouseLeave = () => { clearTimeout(hoverTimer.current); hide() }

  useEffect(() => {
    if (!visible) return
    const id = setTimeout(() => {
      const handler = () => setVisible(false)
      document.addEventListener('pointerdown', handler, { once: true })
    }, 0)
    return () => clearTimeout(id)
  }, [visible])

  useEffect(() => {
    return () => {
      clearTimeout(longPressTimer.current)
      clearTimeout(hoverTimer.current)
      clearTimeout(dismissTimer.current)
    }
  }, [])

  // Display name: use Polish if in PL mode and namePl is provided
  const displayName = lang === 'pl' ? (namePl || name) : name

  // Popover text: look up by English key, fall back to English if Polish empty
  const entry = NUTRIENT_INFO[name]
  const popoverText = entry
    ? (lang === 'pl' && entry.pl ? entry.pl : entry.en)
    : null

  const badgeStyle = STRENGTH_STYLES[strength] ?? STRENGTH_STYLES.good
  const dots = DOTS[strength] ?? DOTS.good

  return (
    <div className="relative inline-flex">
      <span
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-medium
          select-none cursor-default
          ${badgeStyle}
        `}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {displayName}
        <span className="text-sm" aria-hidden="true">{dots}</span>
      </span>

      {visible && popoverText && (
        <div
          className="absolute z-20 bottom-full bg-surface-elevated border border-border-default rounded-card shadow-lg p-4 max-w-[260px] w-max"
          style={{ left: '50%', animation: 'popoverIn 0.2s ease forwards' }}
        >
          <span
            className="absolute -bottom-[7px] w-3 h-3 bg-surface-elevated border-r border-b border-border-default"
            style={{ left: '50%', transform: 'translateX(-50%) rotate(45deg)' }}
          />
          <p className="font-heading font-semibold text-base text-text-primary">{displayName}</p>
          <p className="font-body text-sm text-text-secondary mt-1 leading-relaxed">{popoverText}</p>
        </div>
      )}
    </div>
  )
}
