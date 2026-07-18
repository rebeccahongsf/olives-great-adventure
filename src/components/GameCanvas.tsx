import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { createGameConfig } from '../game/config'
import { registerGame, unregisterGame } from '../game/gameBridge'

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return
    const game = new Phaser.Game(createGameConfig(containerRef.current))
    gameRef.current = game
    registerGame(game)

    return () => {
      unregisterGame(game)
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return <div ref={containerRef} className="game-canvas" />
}
