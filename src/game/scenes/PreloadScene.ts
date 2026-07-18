import Phaser from 'phaser'
import { useGameStore } from '../store/gameStore'
import { makeCircleTexture, makeRectTexture } from '../utils/textures'
import { PLAYER_ANIMATIONS, PLAYER_LOAD_FRAMES } from '../data/playerAnimations'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload')
  }

  preload() {
    for (const frame of PLAYER_LOAD_FRAMES) {
      this.load.image(frame.key, frame.path)
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

    const locationId = useGameStore.getState().currentLocation
    this.scene.start('Location', { locationId })
  }
}
