import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavourites } from '../hooks/useFavourites'
import { useDailyLog } from '../hooks/useDailyLog'
import { useLanguage } from '../context/LanguageContext'

const CATEGORY_BADGE = {
  Fruit: 'bg-ochre-light text-ochre',
  Vegetable: 'bg-moss-light text-moss',
  'Meat & Fish': 'bg-coral-light text-coral',
  Dairy: 'bg-violet-light text-violet',
  'Grains & Legumes': 'bg-teal-light text-teal',
  Other: 'bg-terracotta-light text-terracotta',
}

function staggerDelay(index) {
  return Math.min(index * 60, 600)
}

export default function FoodCard({ food, index }) {
  const { isFavourite, toggleFavourite } = useFavourites()
  const { hasEaten } = useDailyLog()
  const { lang } = useLanguage()

  const favourited = isFavourite(food.id)
  const eaten = hasEaten(food.id)

  const [heartPopKey, setHeartPopKey] = useState(0)

  const handleFavourite = (e) => {
    e.preventDefault()
    toggleFavourite(food.id)
    setHeartPopKey(k => k + 1)
  }

  // Primary/secondary name based on language. Fall back to English if Polish missing.
  const primaryName   = lang === 'pl' ? (food.namePl || food.name) : food.name
  const secondaryName = lang === 'pl' ? food.name : food.namePl

  // Category badge text
  const categoryLabel = lang === 'pl' ? (food.categoryPl || food.category) : food.category

  const badgeStyle = CATEGORY_BADGE[food.category] ?? 'bg-surface-sunken text-text-secondary'

  return (
    <div
      className="opacity-0"
      style={{
        animation: 'fadeUp 0.5s ease forwards',
        animationDelay: `${staggerDelay(index)}ms`,
      }}
    >
      <div className="
        relative bg-surface-elevated rounded-card border border-border-default
        hover:-translate-y-1 hover:shadow-md
        transition-all duration-200
        active:scale-95
        overflow-hidden
      ">
        {/* Image area */}
        <Link to={`/food/${food.id}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-card">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Category badge */}
            <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full ${badgeStyle}`}>
              {categoryLabel}
            </span>

            {/* Eaten indicator */}
            {eaten && (
              <span className="absolute bottom-2 right-2 w-6 h-6 bg-moss rounded-full shadow-sm flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-label="Eaten today">
                  <path d="M2.5 6l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </div>
        </Link>

        {/* Favourite button */}
        <button
          onClick={handleFavourite}
          className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center rounded-full bg-surface-elevated/80"
          aria-label={favourited ? 'Remove from favourites' : 'Add to favourites'}
        >
          <span key={heartPopKey} className={heartPopKey > 0 ? 'animate-heart-pop' : ''}>
            <svg
              width="15" height="15" viewBox="0 0 15 15"
              fill={favourited ? '#E07A5F' : 'none'}
              stroke={favourited ? '#E07A5F' : 'currentColor'}
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              className={favourited ? '' : 'text-text-secondary'}
              aria-hidden="true"
            >
              <path d="M7.5 13s-6-3.8-6-7.5a3.5 3.5 0 0 1 6-2.45A3.5 3.5 0 0 1 13.5 5.5C13.5 9.2 7.5 13 7.5 13z" />
            </svg>
          </span>
        </button>

        {/* Text content */}
        <Link to={`/food/${food.id}`} className="block p-3">
          <p className="font-heading font-semibold text-lg text-text-primary leading-tight">
            {primaryName}
          </p>
          <p className="font-body italic text-base text-text-secondary mt-0.5">
            {secondaryName}
          </p>
        </Link>
      </div>
    </div>
  )
}
