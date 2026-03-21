import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCustomFoods } from '../hooks/useCustomFoods'
import { useLanguage } from '../context/LanguageContext'
import FoodDetail from '../components/FoodDetail'
import { generateFood } from '../lib/generateFood'
import staticFoods from '../data/foods.json'

const CATEGORIES = [
  { id: 'Fruit',            labelEn: 'Fruit',            labelPl: 'Owoce' },
  { id: 'Vegetable',        labelEn: 'Vegetable',        labelPl: 'Warzywa' },
  { id: 'Meat & Fish',      labelEn: 'Meat & Fish',      labelPl: 'Mięso i Ryby' },
  { id: 'Dairy',            labelEn: 'Dairy',            labelPl: 'Nabiał' },
  { id: 'Grains & Legumes', labelEn: 'Grains & Legumes', labelPl: 'Zboża i Rośliny' },
  { id: 'Other',            labelEn: 'Other',            labelPl: 'Inne' },
]

const CATEGORY_BADGE = {
  Fruit:              'bg-ochre-light text-ochre',
  Vegetable:          'bg-moss-light text-moss',
  'Meat & Fish':      'bg-coral-light text-coral',
  Dairy:              'bg-violet-light text-violet',
  'Grains & Legumes': 'bg-teal-light text-teal',
  Other:              'bg-terracotta-light text-terracotta',
}

const CATEGORY_ACTIVE = {
  Fruit:              'bg-ochre text-white',
  Vegetable:          'bg-moss text-white',
  'Meat & Fish':      'bg-coral text-white',
  Dairy:              'bg-violet text-white',
  'Grains & Legumes': 'bg-teal text-white',
  Other:              'bg-terracotta text-white',
}

function SectionTitle({ children }) {
  return (
    <p className="font-body text-xs font-medium uppercase tracking-wider text-text-tertiary mb-3">
      {children}
    </p>
  )
}

export default function Admin() {
  const { lang } = useLanguage()
  const { customFoods, addCustomFood, removeCustomFood, exportCustomFoods, clearCustomFoods } = useCustomFoods()

  // API key
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('smak-api-key') ?? '')

  const saveApiKey = (val) => {
    setApiKey(val)
    if (val) localStorage.setItem('smak-api-key', val)
    else localStorage.removeItem('smak-api-key')
  }

  // Form state
  const [name, setName]         = useState('')
  const [category, setCategory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [preview, setPreview]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [added, setAdded]       = useState(false)
  const [copied, setCopied]     = useState(false)
  const [confirmClear, setConfirmClear]   = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const isReady = name.trim() && category && imageUrl.trim() && apiKey.trim()

  // De-duplicate ID against static + existing custom foods
  const resolveId = (baseId) => {
    const allIds = new Set([
      ...staticFoods.map(f => f.id),
      ...customFoods.map(f => f.id),
    ])
    if (!allIds.has(baseId)) return baseId
    let n = 2
    while (allIds.has(`${baseId}-${n}`)) n++
    return `${baseId}-${n}`
  }

  const handleGenerate = async () => {
    if (!isReady) return
    setLoading(true)
    setError(null)
    setPreview(null)
    try {
      const food = await generateFood({
        name: name.trim(),
        category,
        imageUrl: imageUrl.trim(),
        apiKey: apiKey.trim(),
      })
      food.id = resolveId(food.id)
      setPreview(food)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    if (!preview) return
    addCustomFood(preview)
    setPreview(null)
    setName('')
    setCategory('')
    setImageUrl('')
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleCancel = () => {
    setPreview(null)
    setError(null)
  }

  const handleCopy = async () => {
    await exportCustomFoods()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      removeCustomFood(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
    }
  }

  const handleClearAll = () => {
    if (confirmClear) {
      clearCustomFoods()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
    }
  }

  return (
    <div className="min-h-screen bg-surface-base page-enter">
      <div className="max-w-2xl mx-auto px-4 pt-5 pb-16">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-sunken border border-border-default text-text-secondary hover:text-text-primary transition-colors duration-200 active:scale-90 flex-shrink-0"
            aria-label="Back"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M13 4L7 10l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div>
            <h1 className="font-heading font-bold text-2xl text-text-primary leading-tight">
              {lang === 'pl' ? 'Dodaj jedzenie' : 'Add a food'}
            </h1>
            <p className="font-body text-sm text-text-tertiary mt-0.5">
              {lang === 'pl' ? 'Generuj zawartość z pomocą AI' : 'Generate content with AI'}
            </p>
          </div>
        </div>

        {/* ── API Key ── */}
        <div className="mb-7 bg-surface-elevated border border-border-default rounded-card p-4">
          <SectionTitle>{lang === 'pl' ? 'Klucz API Anthropic' : 'Anthropic API key'}</SectionTitle>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={e => saveApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="flex-1 font-mono text-sm bg-surface-base border border-border-default rounded-xl px-3 py-2.5 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-moss transition-colors duration-150"
            />
            {apiKey && (
              <button
                onClick={() => saveApiKey('')}
                className="font-body text-sm text-text-tertiary hover:text-terracotta transition-colors duration-150 px-2 active:scale-95"
              >
                {lang === 'pl' ? 'Usuń' : 'Clear'}
              </button>
            )}
          </div>
          <p className="font-body text-xs text-text-tertiary mt-2 leading-relaxed">
            {lang === 'pl'
              ? 'Klucz jest przechowywany tylko na tym urządzeniu i wysyłany wyłącznie do Anthropic API.'
              : 'Your key is stored locally on this device only and is never sent anywhere except the Anthropic API.'}
          </p>
        </div>

        {/* ── Form ── */}
        <div className="space-y-5">

          {/* Food name */}
          <div>
            <SectionTitle>{lang === 'pl' ? 'Nazwa (angielski)' : 'Food name (English)'}</SectionTitle>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={lang === 'pl' ? 'np. Pear' : 'e.g. Pear'}
              className="w-full font-body text-base bg-surface-elevated border border-border-default rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-moss transition-colors duration-150"
            />
          </div>

          {/* Category */}
          <div>
            <SectionTitle>{lang === 'pl' ? 'Kategoria' : 'Category'}</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => {
                const isActive = category === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl font-body font-medium text-sm transition-all duration-150 active:scale-95 ${
                      isActive
                        ? CATEGORY_ACTIVE[cat.id]
                        : 'bg-surface-sunken border border-border-default text-text-secondary'
                    }`}
                  >
                    {lang === 'pl' ? cat.labelPl : cat.labelEn}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <SectionTitle>{lang === 'pl' ? 'URL zdjęcia (Unsplash)' : 'Image URL (Unsplash)'}</SectionTitle>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full font-body text-base bg-surface-elevated border border-border-default rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-moss transition-colors duration-150"
            />
            {imageUrl && (
              <div className="mt-2 rounded-card overflow-hidden aspect-video border border-border-default">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = 'none' }}
                />
              </div>
            )}
          </div>

          {/* Generate button */}
          {!preview && (
            <div>
              <button
                onClick={handleGenerate}
                disabled={!isReady || loading}
                title={!apiKey.trim() ? (lang === 'pl' ? 'Wprowadź klucz API powyżej' : 'Enter your API key above') : undefined}
                className="w-full bg-moss text-white font-body font-medium rounded-xl px-6 py-3 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    {lang === 'pl' ? 'Generuję...' : 'Generating...'}
                  </>
                ) : (
                  lang === 'pl' ? 'Generuj z AI' : 'Generate with AI'
                )}
              </button>
              {!apiKey.trim() && (
                <p className="font-body text-xs text-text-tertiary mt-2 text-center">
                  {lang === 'pl' ? 'Wprowadź klucz API powyżej' : 'Enter your API key above'}
                </p>
              )}
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="border-2 border-dashed border-border-strong rounded-card p-4 animate-pulse space-y-3">
              <div className="h-48 bg-surface-sunken rounded-card" />
              <div className="h-6 bg-surface-sunken rounded w-1/2" />
              <div className="h-4 bg-surface-sunken rounded w-3/4" />
              <div className="h-4 bg-surface-sunken rounded w-full" />
              <div className="h-4 bg-surface-sunken rounded w-2/3" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-terracotta-light border border-terracotta/30 rounded-card p-4">
              <p className="font-body text-sm text-terracotta">{error}</p>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div>
              <p className="font-body text-xs text-text-tertiary mb-3">
                {lang === 'pl'
                  ? 'Podgląd — sprawdź szczegóły przed dodaniem'
                  : 'Preview — check the details before adding'}
              </p>
              <div className="border-2 border-dashed border-border-strong rounded-card overflow-hidden">
                <FoodDetail food={preview} />
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <button
                  onClick={handleAdd}
                  className="w-full bg-moss text-white font-body font-medium rounded-xl px-6 py-3 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2"
                >
                  {added
                    ? (lang === 'pl' ? '✓ Dodano!' : '✓ Added!')
                    : (lang === 'pl' ? 'Dodaj do Smak' : 'Add to Smak')}
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex-1 bg-surface-sunken text-text-primary border border-border-default font-body rounded-xl px-4 py-3 active:scale-95 transition-all duration-150 text-sm"
                  >
                    {lang === 'pl' ? 'Generuj ponownie' : 'Regenerate'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-3 font-body text-sm text-text-secondary active:scale-95 transition-all duration-150"
                  >
                    {lang === 'pl' ? 'Anuluj' : 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="my-10 h-px bg-border-default" />

        {/* ── Custom foods manager ── */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <h2 className="font-heading font-semibold text-lg text-text-primary">
              {lang === 'pl' ? 'Własne potrawy' : 'Custom foods'}
            </h2>
            {customFoods.length > 0 && (
              <span className="font-mono text-xs bg-moss-light text-moss px-2 py-0.5 rounded-full">
                {customFoods.length}
              </span>
            )}
          </div>

          {customFoods.length === 0 ? (
            <p className="font-body text-sm text-text-tertiary">
              {lang === 'pl' ? 'Brak własnych potraw.' : 'No custom foods yet.'}
            </p>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {customFoods.map(food => (
                  <div
                    key={food.id}
                    className="flex items-center gap-3 bg-surface-elevated border border-border-default rounded-card p-3"
                  >
                    {food.image && (
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-12 h-12 rounded-card object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-medium text-sm text-text-primary truncate">{food.name}</p>
                      <p className="font-body italic text-xs text-text-tertiary truncate">{food.namePl}</p>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${CATEGORY_BADGE[food.category] ?? 'bg-surface-sunken text-text-secondary'}`}>
                        {food.category}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(food.id)}
                      className={`flex-shrink-0 font-body text-xs px-3 py-1.5 rounded-lg transition-colors duration-150 active:scale-95 ${
                        confirmDelete === food.id
                          ? 'bg-terracotta text-white'
                          : 'text-terracotta border border-terracotta/40'
                      }`}
                    >
                      {confirmDelete === food.id
                        ? (lang === 'pl' ? 'Usuń?' : 'Remove?')
                        : '×'}
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCopy}
                className="w-full bg-surface-sunken text-text-primary border border-border-default font-body rounded-xl px-4 py-3 active:scale-95 transition-all duration-150 text-sm mb-3"
              >
                {copied ? (
                  <span className="text-moss">
                    {lang === 'pl' ? 'Skopiowano! ✓' : 'Copied! ✓'}
                  </span>
                ) : (
                  lang === 'pl' ? 'Kopiuj wszystkie do schowka' : 'Copy all custom foods to clipboard'
                )}
              </button>

              <button
                onClick={handleClearAll}
                className="w-full font-body text-sm active:scale-95 transition-all duration-150 py-2"
              >
                {confirmClear ? (
                  <span className="text-terracotta font-medium">
                    {lang === 'pl' ? 'Na pewno? Kliknij ponownie aby potwierdzić' : 'Sure? Tap again to confirm'}
                  </span>
                ) : (
                  <span className="text-text-tertiary">
                    {lang === 'pl' ? 'Usuń wszystkie własne potrawy' : 'Clear all custom foods'}
                  </span>
                )}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
