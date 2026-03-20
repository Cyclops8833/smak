import { useState, useEffect } from 'react'

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('smak-theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('smak-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return { isDark, toggleTheme: () => setIsDark(prev => !prev) }
}
