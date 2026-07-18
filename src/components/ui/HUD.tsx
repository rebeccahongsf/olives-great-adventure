import { useGameStore } from '../../game/store/gameStore'
import { LOCATIONS } from '../../game/data/locations'
import { MEMORIES } from '../../game/data/memories'

export function HUD() {
  const currentLocation = useGameStore((s) => s.currentLocation)
  const interactTarget = useGameStore((s) => s.interactTarget)
  const unlockedMemories = useGameStore((s) => s.unlockedMemories)
  const activeDialog = useGameStore((s) => s.activeDialog)
  const toggleGallery = useGameStore((s) => s.toggleGallery)
  const toggleMap = useGameStore((s) => s.toggleMap)

  return (
    <div className="hud">
      <div className="hud-location">{LOCATIONS[currentLocation].name}</div>
      {interactTarget && <div className="hud-interact">Press E to talk to {interactTarget}</div>}
      <div className="hud-buttons">
        <button
          className="hud-map-btn"
          disabled={!!activeDialog}
          onClick={() => toggleMap(true)}
        >
          Map (M)
        </button>
        <button className="hud-gallery-btn" onClick={() => toggleGallery(true)}>
          Memories ({unlockedMemories.length}/{Object.keys(MEMORIES).length})
        </button>
      </div>
    </div>
  )
}
