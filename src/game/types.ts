export type LocationId =
  | 'bedroom'
  | 'backyard'
  | 'kitchen'
  | 'sistersBedroom'
  | 'livingRoom'
  | 'dogPark'
  | 'finale'

export interface Vec2 {
  x: number
  y: number
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

// Furniture art is cropped to each piece's own bounding box (not a
// full-canvas layer), so x/y is drawn directly at the piece's top-left —
// the same top-left used by its blockedZones rect. sortY is the piece's
// vertical center in room space: it sets draw depth so pieces closer to the
// camera (larger sortY) render in front of pieces farther back, and lets the
// player render behind or in front of a piece depending on which side of
// sortY they're standing on.
export interface FurnitureDef {
  key: string
  path: string
  x: number
  y: number
  sortY: number
}

// x/y is the item's pickup hotspot: the pickup hitbox is centered there, and
// (art is cropped to the item's own bounding box) it's also the sprite's
// draw position, same as the flat-color fallback used when texturePath is
// absent.
export interface ItemDef {
  id: string
  locationId: LocationId
  name: string
  x: number
  y: number
  color: number
  texturePath?: string
}

// Doors reuse the furniture rendering path (cropped art, top-left position,
// sortY depth) plus an optional SPACE-to-interact zone sized to the sprite.
// promptText is shown floating above the door while the player is in range;
// only meaningful when interactive is true. blocksMovement, if set, blocks
// the door's own x/y/width/height rect (no separate blockedZones entry
// needed — one less place for collision to drift from the visual).
export interface DoorDef {
  key: string
  path: string
  x: number
  y: number
  width: number
  height: number
  sortY: number
  interactive?: boolean
  promptText?: string
  blocksMovement?: boolean
}

export interface DialogChoice {
  text: string
  next?: string
  setFlags?: string[]
}

export interface DialogNodeEffects {
  setFlags?: string[]
  unlockMemory?: string
  hint?: string
}

export interface DialogNode {
  id: string
  speaker: string
  text: string
  choices?: DialogChoice[]
  next?: string
  onEnter?: DialogNodeEffects
}

export interface DialogTree {
  id: string
  startNodeId: string
  nodes: Record<string, DialogNode>
}

export interface NpcDef {
  id: string
  locationId: LocationId
  name: string
  x: number
  y: number
  color: number
  dialogTreeId: string
  followsPlayer?: boolean
}

export interface PuzzleDef {
  id: string
  locationId: LocationId
  name: string
  description: string
  requiredItemIds: string[]
  rewardMemoryId: string
  completionHint: string
}

export interface MemoryDef {
  id: string
  title: string
  caption: string
}

export interface LocationDef {
  id: LocationId
  name: string
  width: number
  height: number
  backgroundColor: number
  backgroundPath?: string
  playerSpawn: Vec2
  entryHint?: string
  items: string[]
  npcs: string[]
  puzzleId?: string
  furniture?: FurnitureDef[]
  doors?: DoorDef[]
  walkableBounds?: Rect
  blockedZones?: Rect[]
}
