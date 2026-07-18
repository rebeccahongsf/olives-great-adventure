import type Phaser from 'phaser'
import type { LocationId } from './types'
import { useGameStore } from './store/gameStore'

let gameInstance: Phaser.Game | null = null

export function registerGame(game: Phaser.Game) {
  gameInstance = game
}

export function unregisterGame(game: Phaser.Game) {
  if (gameInstance === game) gameInstance = null
}

export function travelToLocation(id: LocationId) {
  useGameStore.getState().goToLocation(id)
  gameInstance?.scene.start('Location', { locationId: id })
}
