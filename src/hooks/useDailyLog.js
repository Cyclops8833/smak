import { useState, useEffect } from 'react'

const STORAGE_KEY = 'smak_daily_log'

/**
 * Returns today's date as "YYYY-MM-DD" in the Australia/Melbourne timezone.
 */
function getTodayMelbourne() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Australia/Melbourne' })
}

/**
 * Returns the ISO date string for N days ago in Melbourne time.
 */
function getDateMelbourneOffset(daysAgo) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toLocaleDateString('en-CA', { timeZone: 'Australia/Melbourne' })
}

/**
 * Load the log from localStorage.
 * Storage format: { 'YYYY-MM-DD': ['foodId', ...], ... }
 * Migrates automatically from old single-day format.
 * Prunes entries older than 7 days.
 */
function loadLog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const stored = JSON.parse(raw)

    // Migrate from old format: { date: 'YYYY-MM-DD', eaten: [] }
    if (stored.date && Array.isArray(stored.eaten)) {
      return { [stored.date]: stored.eaten }
    }

    // Prune anything older than 7 days
    const cutoffDate = getDateMelbourneOffset(7)
    const pruned = {}
    for (const [date, eaten] of Object.entries(stored)) {
      if (date >= cutoffDate) pruned[date] = eaten
    }
    return pruned
  } catch {
    return {}
  }
}

/**
 * Tracks which foods have been eaten each day over the past 7 days.
 * Keyed by Melbourne-timezone date strings.
 *
 * Exposes:
 *   eaten           — array of food IDs eaten today
 *   weekEaten       — array of all food IDs eaten across the past 7 days (with duplicates)
 *   toggleEaten(id) — marks a food as eaten or un-eaten for today
 *   hasEaten(id)    — returns true if the food has been eaten today
 */
export function useDailyLog() {
  const [log, setLog] = useState(loadLog)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log))
  }, [log])

  const toggleEaten = (id) => {
    setLog(prev => {
      const today = getTodayMelbourne()
      const todayList = prev[today] ?? []
      return {
        ...prev,
        [today]: todayList.includes(id)
          ? todayList.filter(e => e !== id)
          : [...todayList, id],
      }
    })
  }

  const today = getTodayMelbourne()
  const eaten = log[today] ?? []
  const weekEaten = Object.values(log).flat()

  const hasEaten = (id) => eaten.includes(id)

  return { eaten, weekEaten, toggleEaten, hasEaten }
}
