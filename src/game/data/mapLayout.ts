import type { LocationId } from '../types'
import { LOCATION_ORDER } from './locations'

export const MAP_WIDTH = 860
export const MAP_HEIGHT = 600

export const MAP_POSITIONS: Record<LocationId, { x: number; y: number }> = {
  bedroom: { x: 120, y: 460 },
  backyard: { x: 120, y: 150 },
  kitchen: { x: 340, y: 150 },
  sistersBedroom: { x: 560, y: 150 },
  livingRoom: { x: 560, y: 460 },
  dogPark: { x: 760, y: 300 },
  finale: { x: 430, y: 320 },
}

export const MAP_TRAIL_SEGMENTS: [LocationId, LocationId][] = LOCATION_ORDER.slice(0, -1).map(
  (id, i) => [id, LOCATION_ORDER[i + 1]] as [LocationId, LocationId],
)
