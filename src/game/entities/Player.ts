import Phaser from 'phaser'
import {
  PLAYER_SPEED,
  PLAYER_FRAME_SIZE,
  PLAYER_BODY_WIDTH,
  PLAYER_BODY_HEIGHT,
} from '../constants'
import { useGameStore } from '../store/gameStore'

export type Direction = 'up' | 'down' | 'left' | 'right'

export class Player {
  sprite: Phaser.Physics.Arcade.Sprite
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private wasd: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>
  private facing: Direction = 'down'

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, 'player_walk_down_01')
    this.sprite.setCollideWorldBounds(true)
    this.sprite.setSize(PLAYER_BODY_WIDTH, PLAYER_BODY_HEIGHT)
    this.sprite.setOffset(
      (PLAYER_FRAME_SIZE - PLAYER_BODY_WIDTH) / 2,
      PLAYER_FRAME_SIZE - PLAYER_BODY_HEIGHT - 8,
    )
    this.sprite.anims.play('player_idle_down')
    this.cursors = scene.input.keyboard!.createCursorKeys()
    this.wasd = scene.input.keyboard!.addKeys('W,A,S,D') as Record<
      'W' | 'A' | 'S' | 'D',
      Phaser.Input.Keyboard.Key
    >
  }

  update() {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body

    const store = useGameStore.getState()
    if (store.activeDialog || store.mapOpen) {
      body.setVelocity(0, 0)
      return
    }

    let vx = 0
    let vy = 0
    if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -1
    else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = 1
    if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -1
    else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = 1

    const velocity = new Phaser.Math.Vector2(vx, vy).normalize().scale(PLAYER_SPEED)
    body.setVelocity(velocity.x, velocity.y)

    const isMoving = vx !== 0 || vy !== 0
    if (isMoving) {
      this.facing = vy < 0 ? 'up' : vy > 0 ? 'down' : vx < 0 ? 'left' : 'right'
    }

    const animKey = `player_${isMoving ? 'walk' : 'idle'}_${this.facing}`
    this.sprite.anims.play(animKey, true)
  }

  getFacing() {
    return this.facing
  }
}
