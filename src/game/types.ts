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

// Fired once, the moment an item is collected (LocationScene.triggerCollectEvent).
// Every field is optional and independent: a sound with no floating text is
// fine, floating text with no sound is fine, etc.
export interface ItemCollectEvent {
  // key must be unique across all items' collect sounds; loaded from `path`
  // in PreloadScene and played via this.sound.play(key). Silently skipped if
  // the asset failed to load (or was never added), so it's safe to wire up
  // sound/text/hint before the audio file exists.
  sound?: { key: string; path: string }
  // World-space text that rises and fades at a fixed point (e.g. a door the
  // sound seems to come from), independent of the item's own x/y.
  floatingText?: { text: string; x: number; y: number }
  // Replaces the on-screen hint/thought toast (same channel as
  // DialogNodeEffects.hint and LocationDef.entryHint).
  hint?: string
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
  // Thought-bubble text shown while the player is within proximityDistance
  // (default ITEM_PROXIMITY_DISTANCE) but hasn't collected the item yet.
  // Independent of the "Press E to collect" HUD prompt, which uses the
  // tighter ITEM_INTERACT_DISTANCE.
  proximityText?: string
  proximityDistance?: number
  onCollect?: ItemCollectEvent
}

// Doors reuse the furniture rendering path (cropped art, top-left position,
// sortY depth) plus an optional E-to-interact zone sized to the sprite.
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

// Lets a tree resume past its normal startNodeId on a later approach instead
// of always replaying from the top. Checked in order the first time a tree
// is entered (see gameStore.startDialog); the first entry whose flag is set
// wins. List entries most-advanced-flag-first, since an NPC conversation
// that has progressed several stages will have every earlier stage's flag
// set too.
export interface DialogEntryPoint {
  flag: string
  nodeId: string
}

export interface DialogTree {
  id: string
  startNodeId: string
  entryPoints?: DialogEntryPoint[]
  nodes: Record<string, DialogNode>
}

// Real NPC art, loaded and looped the same way as furniture (see
// PreloadScene). Omit idleFrames to fall back to the flat-colored 'npc'
// rect placeholder tinted by `color`.
export interface NpcSpriteFrame {
  key: string
  path: string
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
  idleFrames?: NpcSpriteFrame[]
  // Physics body override, mirroring PLAYER_BODY_WIDTH/HEIGHT in
  // constants.ts: shrinks/offsets the collision box from the full sprite
  // frame down to the character's actual footprint. Offsets are measured
  // from the frame's top-left corner, matching Phaser's Arcade body offset.
  bodyWidth?: number
  bodyHeight?: number
  bodyOffsetX?: number
  bodyOffsetY?: number
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
