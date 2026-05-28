import { useState, useEffect } from 'react'

export default function AffectionBadge({ delta, visible, onComplete }) {
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (visible && delta !== 0) {
      // Start the animation on next frame so CSS transition kicks in
      const frame = requestAnimationFrame(() => setAnimating(true))
      return () => cancelAnimationFrame(frame)
    } else {
      setAnimating(false)
    }
  }, [visible, delta])

  const handleTransitionEnd = () => {
    setAnimating(false)
    if (onComplete) onComplete()
  }

  if (delta === 0) return null

  const isPositive = delta > 0
  const arrow = isPositive ? '↑' : '↓'
  const sign = isPositive ? '+' : ''
  const colorClass = isPositive
    ? 'text-green-400 bg-green-400/10 border-green-400/30'
    : 'text-red-400 bg-red-400/10 border-red-400/30'

  return (
    <div
      className={`
        absolute top-2 right-2 z-40 px-3 py-1.5 rounded-badge border text-sm font-bold font-heading
        select-none pointer-events-none
        transition-all duration-[2500ms] ease-out
        ${colorClass}
        ${animating ? 'opacity-0 translate-y-[-24px]' : 'opacity-100 translate-y-0'}
      `}
      onTransitionEnd={handleTransitionEnd}
    >
      {sign}{delta}{arrow}
    </div>
  )
}
