import { useGameStore } from '../../game/store/gameStore'

export function ProximityPopup() {
  const proximityText = useGameStore((s) => s.proximityText)

  if (!proximityText) return null

  return (
    <div className="proximity-popup">
      <span>{proximityText}</span>
    </div>
  )
}
