import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import FoodCard from '../components/FoodCard'
import LanguageToggle from '../components/LanguageToggle'
import { useFavourites } from '../hooks/useFavourites'
import { useTheme } from '../hooks/useTheme'
import { useLanguage } from '../context/LanguageContext'
import { uiStrings } from '../data/uiStrings'
import foods from '../data/foods.json'

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9 1.5v1.75M9 14.75V16.5M1.5 9h1.75M14.75 9H16.5M3.7 3.7l1.24 1.24M13.06 13.06l1.24 1.24M14.3 3.7l-1.24 1.24M4.94 13.06l-1.24 1.24"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M15.5 11A7 7 0 0 1 7 2.5a7 7 0 1 0 8.5 8.5z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Home() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const { isFavourite } = useFavourites()
  const { isDark, toggleTheme } = useTheme()
  const { lang } = useLanguage()
  const s = uiStrings[lang]

  const filtered = foods.filter(food => {
    const q = search.trim().toLowerCase()

    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'favourites' && isFavourite(food.id)) ||
      food.category === activeFilter

    // Search works across both languages regardless of current toggle
    const matchesSearch =
      !q ||
      food.name.toLowerCase().includes(q) ||
      food.namePl.toLowerCase().includes(q) ||
      food.category.toLowerCase().includes(q)

    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-surface-base page-enter">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-surface-base/95 backdrop-blur-sm pt-4 pb-3 px-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="font-heading font-bold text-5xl tracking-tight leading-none"
              style={{
                background: 'linear-gradient(135deg, var(--moss) 0%, var(--teal) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {s.appTitle}
            </h1>
            <p className="font-body text-sm text-text-tertiary tracking-wide mt-1.5">
              {s.appSubtitle}
            </p>
            <div className="mt-2 h-px w-16 bg-border-default" />
          </div>

          <div className="flex items-center gap-2 mt-1">
            <LanguageToggle />
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-surface-sunken border border-border-default flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors duration-200 active:scale-95"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>

        <SearchBar
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={s.searchPlaceholder}
        />
        <FilterBar active={activeFilter} onChange={setActiveFilter} />
      </div>

      {/* Grid */}
      <div className="px-4 pb-8 mt-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-heading text-lg text-text-tertiary">{s.noResults}</p>
            <p className="font-body text-sm text-text-tertiary mt-1">{s.noResultsHint}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.map((food, index) => (
              <FoodCard key={food.id} food={food} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
