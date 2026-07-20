import Phaser from 'phaser'
import { useGameStore } from '../store/gameStore'
import { makeCircleTexture, makeRectTexture } from '../utils/textures'
import { PLAYER_ANIMATIONS, PLAYER_LOAD_FRAMES } from '../data/playerAnimations'
import { LOCATIONS } from '../data/locations'
import { ITEMS } from '../data/items'
import { NPCS } from '../data/npcs'
import { backgroundKey } from '../utils/textures'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload')
  }

  preload() {
    for (const frame of PLAYER_LOAD_FRAMES) {
      this.load.image(frame.key, frame.path)
    }

    const loadedKeys = new Set<string>()
    for (const loc of Object.values(LOCATIONS)) {
      if (loc.backgroundPath) {
        this.load.image(backgroundKey(loc.id), loc.backgroundPath)
      }
      for (const piece of [...(loc.furniture ?? []), ...(loc.doors ?? [])]) {
        if (loadedKeys.has(piece.key)) continue
        loadedKeys.add(piece.key)
        this.load.image(piece.key, piece.path)
      }
    }

    for (const item of Object.values(ITEMS)) {
      if (item.texturePath) {
        this.load.image(item.id, item.texturePath)
      }
    }

    for (const npc of Object.values(NPCS)) {
      for (const frame of npc.idleFrames ?? []) {
        this.load.image(frame.key, frame.path)
      }
    }
  }

  create() {
    makeRectTexture(this, 'npc', 28, 36, 0x06d6a0)
    makeCircleTexture(this, 'item', 12, 0xef476f)

    for (const anim of PLAYER_ANIMATIONS) {
      this.anims.create({
        key: anim.key,
        frames: anim.frameKeys.map((key) => ({ key })),
        frameRate: anim.frameRate,
        repeat: anim.repeat,
      })
    }

    for (const npc of Object.values(NPCS)) {
      if (!npc.idleFrames || npc.idleFrames.length === 0) continue
      this.anims.create({
        key: `npc_${npc.id}_idle`,
        frames: npc.idleFrames.map((f) => ({ key: f.key })),
        frameRate: 2,
        repeat: -1,
      })
    }

    const locationId = useGameStore.getState().currentLocation
    this.scene.start('Location', { locationId })
  }
}
