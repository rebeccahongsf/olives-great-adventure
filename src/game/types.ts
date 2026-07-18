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

export interface ItemDef {
  id: string
  locationId: LocationId
  name: string
  x: number
  y: number
  color: number
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
  playerSpawn: Vec2
  entryHint?: string
  items: string[]
  npcs: string[]
  puzzleId?: string
}
