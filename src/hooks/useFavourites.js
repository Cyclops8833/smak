import { useState, useEffect } from 'react'

const STORAGE_KEY = 'smak_favourites'

/**
 * Persists a list of favourited food IDs in localStorage.
 * Returns the array, a toggle function, and a quick membership check.
 */
export function useFavourites() {
  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
    } catch {
      return []
    }
  })

  // Write to localStorage whenever the favourites array changes.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
  }, [favourites])

  const toggleFavourite = (id) => {
    setFavourites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const isFavourite = (id) => favourites.includes(id)

  return { favourites, toggleFavourite, isFavourite }
}
