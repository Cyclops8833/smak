import { useState } from 'react'

const STORAGE_KEY = 'smak-custom-foods'

export function useCustomFoods() {
  const [customFoods, setCustomFoods] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const addCustomFood = (food) => {
    const updated = [...customFoods, food]
    setCustomFoods(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const removeCustomFood = (id) => {
    const updated = customFoods.filter(f => f.id !== id)
    setCustomFoods(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const exportCustomFoods = async () => {
    const json = JSON.stringify(customFoods, null, 2)
    await navigator.clipboard.writeText(json)
    return true
  }

  const clearCustomFoods = () => {
    setCustomFoods([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return { customFoods, addCustomFood, removeCustomFood, exportCustomFoods, clearCustomFoods }
}
