import { useEffect } from 'react'
import { useGameStore } from '../../game/store/gameStore'

export function HintToast() {
  const hint = useGameStore((s) => s.activeHint)
  const clearHint = useGameStore((s) => s.clearHint)

  useEffect(() => {
    if (!hint) return
    const timer = setTimeout(() => clearHint(), 6000)
    return () => clearTimeout(timer)
  }, [hint, clearHint])

  if (!hint) return null

  return (
    <div className="hint-toast">
      <span>{hint}</span>
    </div>
  )
}
