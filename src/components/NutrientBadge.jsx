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
  const wrapperRef = useRef(null)
  const popoverRef = useRef(null)
  const caretRef   = useRef(null)

  const toggle = () => setVisible(v => !v)

  // Outside-tap dismiss (added on next tick so the opening tap isn't caught)
  useEffect(() => {
    if (!visible) return
    const id = setTimeout(() => {
      const handler = (e) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
          setVisible(false)
        }
      }
      document.addEventListener('pointerdown', handler, { once: true })
    }, 0)
    return () => clearTimeout(id)
  }, [visible])

  // Clamp popover to viewport — positions with px not transform so the CSS
  // animation (translateY only) doesn't fight the left offset
  useEffect(() => {
    if (!visible || !popoverRef.current || !wrapperRef.current) return
    const el = popoverRef.current
    const wrapperRect = wrapperRef.current.getBoundingClientRect()
    const popoverWidth = el.offsetWidth
    const pad = 8
    const idealViewportLeft = wrapperRect.left + (wrapperRect.width - popoverWidth) / 2
    const clampedViewportLeft = Math.max(pad, Math.min(idealViewportLeft, window.innerWidth - popoverWidth - pad))
    const localLeft = clampedViewportLeft - wrapperRect.left
    el.style.left = localLeft + 'px'
    if (caretRef.current) {
      caretRef.current.style.left = (wrapperRect.width / 2 - localLeft) + 'px'
    }
  }, [visible])

  const displayName = lang === 'pl' ? (namePl || name) : name
  const entry = NUTRIENT_INFO[name]
  const popoverText = entry
    ? (lang === 'pl' && entry.pl ? entry.pl : entry.en)
    : null

  const badgeStyle = STRENGTH_STYLES[strength] ?? STRENGTH_STYLES.good
  const dots = DOTS[strength] ?? DOTS.good

  return (
    <div className="relative inline-flex" ref={wrapperRef}>
      <button
        onClick={toggle}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-medium
          select-none active:scale-95 transition-transform duration-100
          ${badgeStyle}
        `}
      >
        {displayName}
        <span className="text-sm" aria-hidden="true">{dots}</span>
      </button>

      {visible && popoverText && (
        <div
          ref={popoverRef}
          className="absolute z-20 bottom-full mb-2 bg-surface-elevated border border-border-default rounded-card shadow-lg p-4 max-w-[260px] w-max"
          style={{ left: 0, animation: 'popoverIn 0.2s ease forwards' }}
        >
          <span
            ref={caretRef}
            className="absolute -bottom-[7px] w-3 h-3 bg-surface-elevated border-r border-b border-border-default"
            style={{ transform: 'translateX(-50%) rotate(45deg)' }}
          />
          <p className="font-heading font-semibold text-base text-text-primary">{displayName}</p>
          <p className="font-body text-sm text-text-secondary mt-1 leading-relaxed">{popoverText}</p>
        </div>
      )}
    </div>
  )
}
