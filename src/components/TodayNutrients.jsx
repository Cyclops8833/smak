import { useState, useRef, useEffect } from 'react'
import { useDailyLog } from '../hooks/useDailyLog'
import { useLanguage } from '../context/LanguageContext'
import { NUTRIENT_INFO } from '../data/nutrientInfo'
import foods from '../data/foods.json'

function NutrientPill({ name, namePl, count }) {
  const { lang } = useLanguage()
  const [visible, setVisible] = useState(false)
  const wrapperRef = useRef(null)
  const popoverRef = useRef(null)
  const caretRef   = useRef(null)

  const toggle = () => setVisible(v => !v)

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
  const popoverText = entry ? (lang === 'pl' && entry.pl ? entry.pl : entry.en) : null

  return (
    <div className="relative inline-flex flex-shrink-0" ref={wrapperRef}>
      <button
        onClick={toggle}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-base font-medium bg-moss-light text-moss select-none active:scale-95 transition-transform duration-100"
      >
        {displayName}
        <span className="font-mono text-sm opacity-60">×{count}</span>
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

export default function TodayNutrients() {
  const { eaten } = useDailyLog()
  const { lang } = useLanguage()

  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('smak-nutrient-summary-collapsed') === 'true' } catch { return false }
  })

  const eatenFoods = foods.filter(f => eaten.includes(f.id))
  if (eatenFoods.length === 0) return null

  // Count each nutrient across all eaten foods
  const counts = {}
  const nameMap = {}
  for (const food of eatenFoods) {
    for (const n of food.nutrients) {
      counts[n.name] = (counts[n.name] || 0) + 1
      if (!nameMap[n.name]) nameMap[n.name] = n.namePl
    }
  }

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, namePl: nameMap[name], count }))

  const toggleCollapsed = () => {
    setCollapsed(v => {
      const next = !v
      try { localStorage.setItem('smak-nutrient-summary-collapsed', String(next)) } catch {}
      return next
    })
  }

  return (
    <div className="px-4 pt-3 pb-1">
      <div className="flex items-center justify-between mb-2">
        <p className="font-body text-xs font-medium uppercase tracking-wider text-text-tertiary">
          {lang === 'pl' ? 'Dzisiejsze składniki' : "Today's nutrients"}
        </p>
        <button
          onClick={toggleCollapsed}
          className="text-xs text-text-tertiary hover:text-text-secondary transition-colors px-1"
        >
          {collapsed
            ? (lang === 'pl' ? 'pokaż ▸' : 'show ▸')
            : (lang === 'pl' ? 'ukryj ▾' : 'hide ▾')
          }
        </button>
      </div>

      {!collapsed && (
        <div
          className="flex gap-2 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sorted.map(({ name, namePl, count }) => (
            <NutrientPill key={name} name={name} namePl={namePl} count={count} />
          ))}
        </div>
      )}
    </div>
  )
}
