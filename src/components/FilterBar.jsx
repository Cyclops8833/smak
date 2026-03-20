import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

const FILTERS = [
  { id: 'all',              labelEn: 'All',              labelPl: 'Wszystko',        heart: false },
  { id: 'favourites',       labelEn: 'Favourites',       labelPl: 'Ulubione',        heart: true  },
  { id: 'Fruit',            labelEn: 'Fruit',            labelPl: 'Owoce',           heart: false },
  { id: 'Vegetable',        labelEn: 'Vegetable',        labelPl: 'Warzywa',         heart: false },
  { id: 'Meat & Fish',      labelEn: 'Meat & Fish',      labelPl: 'Mięso i Ryby',    heart: false },
  { id: 'Dairy',            labelEn: 'Dairy',            labelPl: 'Nabiał',          heart: false },
  { id: 'Grains & Legumes', labelEn: 'Grains & Legumes', labelPl: 'Zboża i Rośliny', heart: false },
  { id: 'Other',            labelEn: 'Other',            labelPl: 'Inne',            heart: false },
]

// Selected state: full accent colour + white text
const ACTIVE_BG = {
  all:                'bg-surface-warm',
  favourites:         'bg-coral',
  Fruit:              'bg-ochre',
  Vegetable:          'bg-moss',
  'Meat & Fish':      'bg-coral',
  Dairy:              'bg-violet',
  'Grains & Legumes': 'bg-teal',
  Other:              'bg-terracotta',
}

const ACTIVE_TEXT = {
  all: 'text-text-primary',
}

// Touch/press state: light tint bg + category text colour
const TOUCH_STYLE = {
  all:                'bg-surface-warm text-text-primary',
  favourites:         'bg-coral-light text-coral',
  Fruit:              'bg-ochre-light text-ochre',
  Vegetable:          'bg-moss-light text-moss',
  'Meat & Fish':      'bg-coral-light text-coral',
  Dairy:              'bg-violet-light text-violet',
  'Grains & Legumes': 'bg-teal-light text-teal',
  Other:              'bg-terracotta-light text-terracotta',
}

export default function FilterBar({ active, onChange }) {
  const { lang } = useLanguage()
  const [pressedId, setPressedId] = useState(null)

  return (
    <div
      className="flex gap-3 overflow-x-auto pb-1"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {FILTERS.map(({ id, labelEn, labelPl, heart }) => {
        const isActive  = active === id
        const isPressed = pressedId === id && !isActive

        const activeBg   = ACTIVE_BG[id] ?? 'bg-surface-warm'
        const activeText = ACTIVE_TEXT[id] ?? 'text-white'
        const touchStyle = TOUCH_STYLE[id] ?? 'bg-surface-warm text-text-primary'

        const primaryLabel   = lang === 'pl' ? labelPl : labelEn
        const secondaryLabel = lang === 'pl' ? labelEn : labelPl

        let buttonStyle
        if (isActive) {
          buttonStyle = `${activeBg} ${activeText}`
        } else if (isPressed) {
          buttonStyle = touchStyle
        } else {
          buttonStyle = 'bg-surface-sunken border border-border-default text-text-secondary'
        }

        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            onPointerDown={() => setPressedId(id)}
            onPointerUp={() => setPressedId(null)}
            onPointerLeave={() => setPressedId(null)}
            onPointerCancel={() => setPressedId(null)}
            className={`
              flex-shrink-0 flex flex-col items-center justify-center
              px-5 py-3 rounded-xl
              transition-all duration-150
              ${isPressed || isActive ? 'scale-95' : 'scale-100'}
              ${buttonStyle}
            `}
          >
            <span className="flex items-center gap-1.5 font-heading font-semibold text-base whitespace-nowrap leading-tight">
              {heart && (
                <svg
                  width="12" height="12" viewBox="0 0 12 12"
                  fill={isActive || isPressed ? 'currentColor' : 'none'}
                  stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 10.5s-4.5-2.9-4.5-5.75a2.75 2.75 0 0 1 4.5-2.1 2.75 2.75 0 0 1 4.5 2.1C10.5 7.6 6 10.5 6 10.5z" />
                </svg>
              )}
              {primaryLabel}
            </span>
            <span
              className={`font-body italic text-sm whitespace-nowrap leading-tight mt-0.5 ${
                isActive
                  ? (ACTIVE_TEXT[id] ? 'opacity-70' : 'text-white/70')
                  : isPressed
                    ? 'opacity-70'
                    : 'text-text-tertiary'
              }`}
            >
              {secondaryLabel}
            </span>
          </button>
        )
      })}
    </div>
  )
}
