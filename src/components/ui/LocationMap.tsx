import { isLocationUnlocked, useGameStore } from '../../game/store/gameStore'
import { LOCATIONS, LOCATION_ORDER } from '../../game/data/locations'
import { MAP_HEIGHT, MAP_POSITIONS, MAP_TRAIL_SEGMENTS, MAP_WIDTH } from '../../game/data/mapLayout'
import { LOCATION_ICONS, LOCATION_ICON_FALLBACK } from '../../game/data/mapIcons'
import { buildTrail } from '../../game/utils/trail'
import { travelToLocation } from '../../game/gameBridge'
import type { LocationId } from '../../game/types'
import pawPrintSrc from '../../assets/pawprint.svg'

const TRAIL = buildTrail(MAP_TRAIL_SEGMENTS, MAP_POSITIONS)

export function LocationMap() {
  const mapOpen = useGameStore((s) => s.mapOpen)
  const currentLocation = useGameStore((s) => s.currentLocation)
  const visitedLocations = useGameStore((s) => s.visitedLocations)
  const completedPuzzles = useGameStore((s) => s.completedPuzzles)
  const toggleMap = useGameStore((s) => s.toggleMap)

  if (!mapOpen) return null

  function handleTravel(id: LocationId) {
    if (id === currentLocation) {
      toggleMap(false)
      return
    }
    if (!isLocationUnlocked(completedPuzzles, id)) return
    travelToLocation(id)
    toggleMap(false)
  }

  return (
    <div className="location-map-overlay">
      <div className="location-map">
        <div className="location-map-header">
          <h2>Follow Olive's Trail</h2>
          <button onClick={() => toggleMap(false)}>Close</button>
        </div>
        <div className="location-map-canvas" style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}>
          {MAP_TRAIL_SEGMENTS.map(([from, to]) => {
            const destVisited = visitedLocations.includes(to)
            const destUnlocked = isLocationUnlocked(completedPuzzles, to)
            const trailClass = destVisited ? 'trail-visited' : destUnlocked ? 'trail-unlocked' : 'trail-locked'

            return TRAIL[`${from}-${to}`].map((print) => (
              <img
                key={print.key}
                src={pawPrintSrc}
                alt=""
                className={`paw-print ${trailClass}`}
                style={{
                  left: print.x,
                  top: print.y,
                  transform: `translate(-50%, -50%) rotate(${print.rotation}deg)`,
                }}
              />
            ))
          })}

          {LOCATION_ORDER.map((id) => {
            const pos = MAP_POSITIONS[id]
            const unlocked = isLocationUnlocked(completedPuzzles, id)
            const visited = visitedLocations.includes(id)
            const isCurrent = id === currentLocation
            const isNew = unlocked && !visited && !isCurrent
            const icon = LOCATION_ICONS[id]

            return (
              <button
                key={id}
                className={[
                  'map-tile',
                  isCurrent && 'map-tile-current',
                  !unlocked && 'map-tile-locked',
                  isNew && 'map-tile-new',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{ left: pos.x, top: pos.y }}
                disabled={!unlocked}
                onClick={() => handleTravel(id)}
              >
                <span className="map-tile-icon">
                  {icon ? <img src={icon} alt="" /> : LOCATION_ICON_FALLBACK[id]}
                </span>
                <span className="map-tile-label">{LOCATIONS[id].name}</span>
                {!unlocked && <span className="map-tile-badge">🔒</span>}
                {unlocked && visited && !isCurrent && <span className="map-tile-badge">✓</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
