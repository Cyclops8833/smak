import { useState, useEffect } from 'react'

const STORAGE_KEY = 'smak_daily_log'

/**
 * Returns today's date as "YYYY-MM-DD" in the Australia/Melbourne timezone.
 * This ensures the midnight reset fires at Melbourne local midnight,
 * not UTC midnight.
 */
function getTodayMelbourne() {
  // 'en-CA' locale formats as YYYY-MM-DD — convenient for date comparison.
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Australia/Melbourne' })
}

/**
 * Reads the stored log and resets the eaten list if the date has changed.
 * Called once during hook initialisation.
 */
function loadLog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const today = getTodayMelbourne()
    if (!raw) return { date: today, eaten: [] }
    const stored = JSON.parse(raw)
    // New day — clear the eaten list.
    if (stored.date !== today) return { date: today, eaten: [] }
    return stored
  } catch {
    return { date: getTodayMelbourne(), eaten: [] }
  }
}

/**
 * Tracks which foods have been eaten today.
 * Resets automatically at midnight (Melbourne time) on next page load.
 *
 * Exposes:
 *   eaten           — array of food IDs eaten today
 *   toggleEaten(id) — marks a food as eaten or un-eaten
 *   hasEaten(id)    — returns true if the food has been eaten today
 */
export function useDailyLog() {
  const [log, setLog] = useState(loadLog)

  // Persist to localStorage whenever the log changes.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log))
  }, [log])

  const toggleEaten = (id) => {
    setLog(prev => {
      const today = getTodayMelbourne()
      // Guard: if the day has rolled over between renders, reset first.
      const eaten = prev.date === today ? prev.eaten : []
      return {
        date: today,
        eaten: eaten.includes(id)
          ? eaten.filter(e => e !== id)
          : [...eaten, id],
      }
    })
  }

  const hasEaten = (id) => log.eaten.includes(id)

  return { eaten: log.eaten, toggleEaten, hasEaten }
}
