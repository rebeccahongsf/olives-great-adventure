import type { LocationId } from '../types'

/**
 * Drop real artwork in by importing it and assigning it here, e.g.
 * import bedroomIcon from '../../assets/locations/bedroom.png'
 * LOCATION_ICONS.bedroom = bedroomIcon
 * Anything left unset falls back to the emoji below.
 */
export const LOCATION_ICONS: Partial<Record<LocationId, string>> = {}

export const LOCATION_ICON_FALLBACK: Record<LocationId, string> = {
  bedroom: '🛏️',
  backyard: '🌳',
  kitchen: '☕',
  sistersBedroom: '🧱',
  livingRoom: '🛋️',
  dogPark: '🎾',
  finale: '🎂',
}
