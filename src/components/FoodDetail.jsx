import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavourites } from '../hooks/useFavourites'
import { useLanguage } from '../context/LanguageContext'
import { uiStrings } from '../data/uiStrings'
import NutrientBadge from './NutrientBadge'
import DailyCheckmark from './DailyCheckmark'
import LanguageToggle from './LanguageToggle'

const CATEGORY_BADGE = {
  Fruit: 'bg-ochre-light text-ochre',
  Vegetable: 'bg-moss-light text-moss',
  'Meat & Fish': 'bg-coral-light text-coral',
  Dairy: 'bg-violet-light text-violet',
  'Grains & Legumes': 'bg-teal-light text-teal',
  Other: 'bg-terracotta-light text-terracotta',
}

function SectionLabel({ children }) {
  return (
    <p className="font-body text-xs font-medium uppercase tracking-wider text-text-tertiary mb-2">
      {children}
    </p>
  )
}

function FadeSection({ children, delay = 0 }) {
  return (
    <div
      className="opacity-0"
      style={{ animation: 'fadeUp 0.5s ease forwards', animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function FoodDetail({ food }) {
  const { isFavourite, toggleFavourite } = useFavourites()
  const { lang } = useLanguage()
  const s = uiStrings[lang]

  const favourited = isFavourite(food.id)
  const badgeStyle = CATEGORY_BADGE[food.category] ?? 'bg-surface-sunken text-text-secondary'
  const [heartPopKey, setHeartPopKey] = useState(0)

  const handleFavourite = () => {
    toggleFavourite(food.id)
    setHeartPopKey(k => k + 1)
  }

  // Resolve language-specific fields, falling back to English
  const primaryName   = lang === 'pl' ? (food.namePl || food.name) : food.name
  const secondaryName = lang === 'pl' ? food.name : food.namePl
  const categoryLabel = lang === 'pl' ? (food.categoryPl || food.category) : food.category
  const servingLabel  = lang === 'pl' ? (food.servingSizePl || food.servingSize) : food.servingSize
  const benefits      = lang === 'pl' ? (food.benefitsPl || food.benefits) : food.benefits
  const pairsWith     = lang === 'pl' ? (food.pairsWithPl || food.pairsWith) : food.pairsWith
  const funFact       = lang === 'pl' ? (food.funFactPl || food.funFact) : food.funFact

  return (
    <article>
      {/* Hero image */}
      <div className="aspect-[16/10] overflow-hidden w-full">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-4 sm:px-6 mt-4 pb-12 space-y-6 max-w-2xl mx-auto">

        {/* Back + header */}
        <FadeSection delay={0}>
          <div className="flex items-center justify-between mb-3">
            <Link
              to="/"
              className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-sunken border border-border-default text-text-secondary hover:text-text-primary transition-colors duration-200 active:scale-90"
              aria-label={s.back}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M13 4L7 10l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <LanguageToggle />
          </div>

          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-text-primary leading-tight">
                {primaryName}
              </h1>
              <p className="mt-1">
                <span className="font-heading italic text-xl text-text-secondary">{secondaryName}</span>
                {' '}
                <span className="font-mono text-sm text-text-tertiary">({food.pronunciation})</span>
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${badgeStyle}`}>
                  {categoryLabel}
                </span>
                <span className="text-sm text-text-secondary">
                  {s.serving}: {servingLabel}
                </span>
              </div>
            </div>

            {/* Favourite toggle */}
            <button
              onClick={handleFavourite}
              className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-full bg-surface-sunken border border-border-default transition-colors duration-200 active:scale-90"
              aria-label={favourited ? 'Remove from favourites' : 'Add to favourites'}
            >
              <span key={heartPopKey} className={heartPopKey > 0 ? 'animate-heart-pop' : ''}>
                <svg
                  width="24" height="24" viewBox="0 0 24 24"
                  fill={favourited ? '#E07A5F' : 'none'}
                  stroke={favourited ? '#E07A5F' : 'currentColor'}
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  className={favourited ? '' : 'text-text-secondary'}
                  aria-hidden="true"
                >
                  <path d="M12 21s-9-5.8-9-11.5a5 5 0 0 1 9-3A5 5 0 0 1 21 9.5C21 15.2 12 21 12 21z" />
                </svg>
              </span>
            </button>
          </div>
        </FadeSection>

        {/* Daily checkmark */}
        <FadeSection delay={80}>
          <DailyCheckmark foodId={food.id} />
        </FadeSection>

        {/* Nutrients */}
        <FadeSection delay={160}>
          <SectionLabel>{s.keyNutrients}</SectionLabel>
          <div className="flex flex-wrap gap-2.5">
            {food.nutrients.map((n) => (
              <NutrientBadge
                key={n.name}
                name={n.name}
                namePl={n.namePl}
                strength={n.strength}
              />
            ))}
          </div>
        </FadeSection>

        {/* Benefits */}
        <FadeSection delay={240}>
          <SectionLabel>{s.whatItDoes}</SectionLabel>
          <p className="font-body text-base text-text-secondary leading-relaxed max-w-prose">
            {benefits}
          </p>
        </FadeSection>

        {/* Pairs with */}
        <FadeSection delay={320}>
          <SectionLabel>{s.pairsWellWith}</SectionLabel>
          <p className="font-body text-base text-text-secondary leading-relaxed max-w-prose flex gap-2">
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              className="text-teal flex-shrink-0 mt-0.5" aria-hidden="true"
            >
              <path
                d="M5 8a3 3 0 1 0 6 0 3 3 0 0 0-6 0zM2 8h1M13 8h1M8 2v1M8 13v1"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
              />
            </svg>
            {pairsWith}
          </p>
        </FadeSection>

        {/* Fun fact */}
        <FadeSection delay={400}>
          <div className="bg-surface-sunken rounded-card p-4 border border-border-default">
            <p className="text-ochre font-medium text-xs uppercase tracking-wider mb-1.5">
              {s.funFact}
            </p>
            <p className="font-body text-sm text-text-primary">{funFact}</p>
          </div>
        </FadeSection>

        {/* Image credit */}
        <FadeSection delay={480}>
          <p className="text-xs text-text-tertiary">{s.photoCredit}: {food.imageCredit}</p>
        </FadeSection>

      </div>
    </article>
  )
}
