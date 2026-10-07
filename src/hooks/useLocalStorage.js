import { useEffect, useState } from 'react'

// Keeps a piece of state in sync with localStorage so data survives a page refresh.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved !== null ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage can be full or blocked (private mode) — the app still works in memory.
    }
  }, [key, value])

  return [value, setValue]
}
