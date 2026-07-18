import type { Direction } from '../entities/Player'

export interface PlayerAnimDef {
  key: string
  frameKeys: string[]
  frameRate: number
  repeat: number
}

const SPRITE_PATH = '/sprites/characters/player'
const WALK_DIRECTIONS: Direction[] = ['up', 'down', 'left', 'right']
const IDLE_ART_DIRECTIONS: Direction[] = ['left', 'right']

function frameKey(action: 'idle' | 'walk', direction: Direction, frame: number) {
  return `player_${action}_${direction}_${String(frame).padStart(2, '0')}`
}

export const PLAYER_LOAD_FRAMES: { key: string; path: string }[] = []
export const PLAYER_ANIMATIONS: PlayerAnimDef[] = []

for (const dir of WALK_DIRECTIONS) {
  const keys = [1, 2, 3, 4].map((n) => frameKey('walk', dir, n))
  for (const key of keys) PLAYER_LOAD_FRAMES.push({ key, path: `${SPRITE_PATH}/${key}.png` })
  PLAYER_ANIMATIONS.push({ key: `player_walk_${dir}`, frameKeys: keys, frameRate: 8, repeat: -1 })
}

for (const dir of IDLE_ART_DIRECTIONS) {
  const keys = [1, 2].map((n) => frameKey('idle', dir, n))
  for (const key of keys) PLAYER_LOAD_FRAMES.push({ key, path: `${SPRITE_PATH}/${key}.png` })
  PLAYER_ANIMATIONS.push({ key: `player_idle_${dir}`, frameKeys: keys, frameRate: 2, repeat: -1 })
}

// No dedicated idle art for up/down yet: hold the first walk frame as a static pose
// instead of skipping the animation. Swap in real idle_up/idle_down frames when available.
for (const dir of ['up', 'down'] as Direction[]) {
  PLAYER_ANIMATIONS.push({
    key: `player_idle_${dir}`,
    frameKeys: [frameKey('walk', dir, 1)],
    frameRate: 1,
    repeat: -1,
  })
}
