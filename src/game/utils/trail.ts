import type { LocationId } from '../types'

interface Point {
  x: number
  y: number
}

export interface PawPrintPlacement {
  key: string
  x: number
  y: number
  rotation: number
  side: 1 | -1
}

export function buildTrail(
  segments: [LocationId, LocationId][],
  positions: Record<LocationId, Point>,
  stepsPerSegment = 5,
): Record<string, PawPrintPlacement[]> {
  const trail: Record<string, PawPrintPlacement[]> = {}

  for (const [from, to] of segments) {
    const a = positions[from]
    const b = positions[to]
    const dx = b.x - a.x
    const dy = b.y - a.y
    const length = Math.hypot(dx, dy) || 1
    const rotation = (Math.atan2(dy, dx) * 180) / Math.PI + 90
    const perpX = -dy / length
    const perpY = dx / length

    const prints: PawPrintPlacement[] = []
    for (let i = 1; i <= stepsPerSegment; i++) {
      const t = i / (stepsPerSegment + 1)
      const side: 1 | -1 = i % 2 === 0 ? 1 : -1
      prints.push({
        key: `${from}-${to}-${i}`,
        x: a.x + dx * t + perpX * side * 10,
        y: a.y + dy * t + perpY * side * 10,
        rotation,
        side,
      })
    }
    trail[`${from}-${to}`] = prints
  }

  return trail
}
