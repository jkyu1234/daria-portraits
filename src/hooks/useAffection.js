import { useState, useCallback } from 'react'
import { getAffectionLevel } from '../data/daria'

const STORAGE_KEY = 'daria_affection_score'
const BASE_SCORE = 20

export function useAffection() {
  const [score, setScore] = useState(() => {
    if (typeof window === 'undefined') return BASE_SCORE
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored !== null ? Number(stored) : BASE_SCORE
  })
  const [lastDelta, setLastDelta] = useState(0)
  const [showDelta, setShowDelta] = useState(false)

  const applyDelta = useCallback((delta) => {
    if (typeof delta !== 'number' || delta === 0) {
      setLastDelta(0)
      return score
    }
    const newScore = Math.max(0, Math.min(100, score + delta))
    setScore(newScore)
    setLastDelta(delta)
    setShowDelta(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(newScore))
    }
    setTimeout(() => setShowDelta(false), 3000)
    return newScore
  }, [score])

  const level = getAffectionLevel(score)

  return {
    score,
    level,
    lastDelta,
    showDelta,
    applyDelta,
  }
}
