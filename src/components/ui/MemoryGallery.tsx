import { useGameStore } from '../../game/store/gameStore'
import { MEMORIES } from '../../game/data/memories'

export function MemoryGallery() {
  const galleryOpen = useGameStore((s) => s.galleryOpen)
  const unlockedMemories = useGameStore((s) => s.unlockedMemories)
  const toggleGallery = useGameStore((s) => s.toggleGallery)

  if (!galleryOpen) return null

  return (
    <div className="memory-gallery-overlay">
      <div className="memory-gallery">
        <div className="memory-gallery-header">
          <h2>Memories</h2>
          <button onClick={() => toggleGallery(false)}>Close</button>
        </div>
        <div className="memory-grid">
          {Object.values(MEMORIES).map((memory) => {
            const unlocked = unlockedMemories.includes(memory.id)
            return (
              <div key={memory.id} className={`memory-card ${unlocked ? 'unlocked' : 'locked'}`}>
                <div className="memory-card-title">{unlocked ? memory.title : '???'}</div>
                {unlocked && <div className="memory-card-caption">{memory.caption}</div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
