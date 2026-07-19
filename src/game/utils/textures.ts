import Phaser from 'phaser'
import type { LocationId } from '../types'

export function backgroundKey(locationId: LocationId) {
  return `bg_${locationId}`
}

export function makeRectTexture(
  scene: Phaser.Scene,
  key: string,
  width: number,
  height: number,
  color: number,
) {
  const g = scene.add.graphics()
  g.fillStyle(color, 1)
  g.fillRoundedRect(0, 0, width, height, 4)
  g.generateTexture(key, width, height)
  g.destroy()
}

export function makeCircleTexture(scene: Phaser.Scene, key: string, radius: number, color: number) {
  const g = scene.add.graphics()
  g.fillStyle(color, 1)
  g.fillCircle(radius, radius, radius)
  g.generateTexture(key, radius * 2, radius * 2)
  g.destroy()
}
