import Phaser from 'phaser'
import { useGameStore } from '../store/gameStore'
import { LOCATIONS } from '../data/locations'
import { ITEMS } from '../data/items'
import { NPCS } from '../data/npcs'
import { DIALOG_TREES } from '../data/dialog'
import { DOOR_INTERACT_DISTANCE, INTERACT_DISTANCE, ITEM_DEPTH } from '../constants'
import type { DoorDef, FurnitureDef, LocationId, Rect } from '../types'
import { Player } from '../entities/Player'
import { backgroundKey } from '../utils/textures'

interface LocationSceneData {
  locationId: LocationId
}

export class LocationScene extends Phaser.Scene {
  private player!: Player
  private itemSprites = new Map<string, Phaser.Physics.Arcade.Sprite>()
  private npcSprites = new Map<string, Phaser.Physics.Arcade.Sprite>()
  private blockers?: Phaser.Physics.Arcade.StaticGroup
  private doors: DoorDef[] = []
  private doorPrompts = new Map<DoorDef, Phaser.GameObjects.Text>()
  private interactKey!: Phaser.Input.Keyboard.Key
  private mapKey!: Phaser.Input.Keyboard.Key
  private doorKey!: Phaser.Input.Keyboard.Key
  private nearestNpcId: string | null = null
  private nearestDoor: DoorDef | null = null
  private locationId!: LocationId
  private unsubscribe?: () => void

  constructor() {
    super('Location')
  }

  init(data: LocationSceneData) {
    this.locationId = data.locationId
    this.itemSprites = new Map()
    this.npcSprites = new Map()
    this.blockers = undefined
    this.doors = []
    this.doorPrompts = new Map()
    this.nearestDoor = null
  }

  create() {
    const loc = LOCATIONS[this.locationId]
    this.cameras.main.setBackgroundColor(loc.backgroundColor)

    if (loc.backgroundPath) {
      this.add.image(0, 0, backgroundKey(loc.id)).setOrigin(0, 0).setDepth(-1)
    }

    const worldBounds = loc.walkableBounds ?? { x: 0, y: 0, width: loc.width, height: loc.height }
    this.physics.world.setBounds(worldBounds.x, worldBounds.y, worldBounds.width, worldBounds.height)
    this.cameras.main.setBounds(0, 0, loc.width, loc.height)

    this.spawnFurniture(loc.furniture ?? [])
    this.spawnDoors(loc.doors ?? [])

    const doorBlockedZones: Rect[] = (loc.doors ?? [])
      .filter((door) => door.blocksMovement)
      .map((door) => ({ x: door.x, y: door.y, width: door.width, height: door.height }))
    this.spawnBlockers([...(loc.blockedZones ?? []), ...doorBlockedZones])

    this.player = new Player(this, loc.playerSpawn.x, loc.playerSpawn.y)
    this.cameras.main.startFollow(this.player.sprite, true)

    if (this.blockers) {
      this.physics.add.collider(this.player.sprite, this.blockers)
    }

    this.spawnItems(loc.items)
    this.spawnNpcs(loc.npcs)

    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    this.mapKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.M)
    this.doorKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    this.unsubscribe = useGameStore.subscribe((state, prevState) => {
      if (state.collectedItems !== prevState.collectedItems) {
        this.syncCollectedItems()
      }
    })
    this.syncCollectedItems()

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.unsubscribe?.())
  }

  private spawnFurniture(furniture: FurnitureDef[]) {
    for (const def of furniture) {
      this.add.image(def.x, def.y, def.key).setOrigin(0, 0).setDepth(def.sortY)
    }
  }

  private spawnDoors(doors: DoorDef[]) {
    this.doors = doors
    for (const def of doors) {
      this.add.image(def.x, def.y, def.key).setOrigin(0, 0).setDepth(def.sortY)

      if (def.interactive && def.promptText) {
        const prompt = this.add
          .text(def.x + def.width / 2, def.y - 6, def.promptText, {
            fontFamily: 'monospace',
            fontSize: '13px',
            fontStyle: 'bold',
            color: '#ffd166',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center',
          })
          .setOrigin(0.5, 1)
          .setDepth(2000)
          .setVisible(false)
        this.doorPrompts.set(def, prompt)
      }
    }
  }

  private spawnBlockers(zones: Rect[]) {
    if (zones.length === 0) return
    this.blockers = this.physics.add.staticGroup()
    for (const zone of zones) {
      const blocker = this.add.zone(zone.x + zone.width / 2, zone.y + zone.height / 2, zone.width, zone.height)
      this.physics.add.existing(blocker, true)
      this.blockers.add(blocker)
    }
  }

  private spawnItems(itemIds: string[]) {
    const collected = useGameStore.getState().collectedItems
    for (const itemId of itemIds) {
      if (collected[itemId]) continue
      const def = ITEMS[itemId]
      const hasTexture = this.textures.exists(itemId)
      const sprite = this.physics.add.sprite(def.x, def.y, hasTexture ? itemId : 'item')
      if (!hasTexture) sprite.setTint(def.color)
      sprite.setDepth(ITEM_DEPTH)
      this.itemSprites.set(itemId, sprite)
      this.physics.add.overlap(this.player.sprite, sprite, () => {
        useGameStore.getState().collectItem(itemId)
      })
    }
  }

  private syncCollectedItems() {
    const collected = useGameStore.getState().collectedItems
    for (const [itemId, sprite] of this.itemSprites) {
      if (collected[itemId] && sprite.active) {
        sprite.destroy()
      }
    }
  }

  private spawnNpcs(npcIds: string[]) {
    for (const npcId of npcIds) {
      const def = NPCS[npcId]
      const hasArt = !!def.idleFrames?.length
      const sprite = this.physics.add.sprite(def.x, def.y, hasArt ? def.idleFrames![0].key : 'npc')
      if (hasArt) {
        sprite.anims.play(`npc_${npcId}_idle`)
      } else {
        sprite.setTint(def.color)
      }
      if (def.bodyWidth && def.bodyHeight) {
        sprite.setSize(def.bodyWidth, def.bodyHeight)
        sprite.setOffset(def.bodyOffsetX ?? 0, def.bodyOffsetY ?? 0)
      }
      sprite.setDepth(def.y)
      this.npcSprites.set(npcId, sprite)
      if (!def.followsPlayer) {
        sprite.setImmovable(true)
        this.physics.add.collider(this.player.sprite, sprite)
      }
    }
  }

  update() {
    this.player.update()
    this.updateNearestNpc()
    this.updateNearestDoor()
    this.updateFollowingNpcs()

    const store = useGameStore.getState()

    if (Phaser.Input.Keyboard.JustDown(this.interactKey) && this.nearestNpcId && !store.activeDialog) {
      const npc = NPCS[this.nearestNpcId]
      store.startDialog(npc.id, npc.dialogTreeId)
    }

    if (Phaser.Input.Keyboard.JustDown(this.mapKey) && !store.activeDialog) {
      store.toggleMap(true)
    }

    if (Phaser.Input.Keyboard.JustDown(this.doorKey)) {
      if (store.activeDialog) {
        const node = DIALOG_TREES[store.activeDialog.treeId].nodes[store.activeDialog.nodeId]
        if (!node.choices) {
          node.next ? store.advanceDialog() : store.closeDialog()
        }
      } else if (this.nearestDoor) {
        store.toggleMap(true)
      }
    }
  }

  private updateNearestDoor() {
    let closest: DoorDef | null = null
    let closestDist = DOOR_INTERACT_DISTANCE

    for (const door of this.doors) {
      if (!door.interactive) continue
      const dist = Phaser.Math.Distance.Between(
        this.player.sprite.x,
        this.player.sprite.y,
        door.x + door.width / 2,
        door.y + door.height / 2,
      )
      if (dist < closestDist) {
        closestDist = dist
        closest = door
      }
    }

    if (closest === this.nearestDoor) return
    if (this.nearestDoor) this.doorPrompts.get(this.nearestDoor)?.setVisible(false)
    if (closest) this.doorPrompts.get(closest)?.setVisible(true)
    this.nearestDoor = closest
  }

  private updateNearestNpc() {
    let closest: string | null = null
    let closestDist = INTERACT_DISTANCE

    for (const [npcId, sprite] of this.npcSprites) {
      const dist = Phaser.Math.Distance.Between(
        this.player.sprite.x,
        this.player.sprite.y,
        sprite.x,
        sprite.y,
      )
      if (dist < closestDist) {
        closestDist = dist
        closest = npcId
      }
    }

    if (closest !== this.nearestNpcId) {
      this.nearestNpcId = closest
      useGameStore.getState().setInteractTarget(closest ? NPCS[closest].name : null)
    }
  }

  private updateFollowingNpcs() {
    const flags = useGameStore.getState().flags
    for (const [npcId, sprite] of this.npcSprites) {
      const def = NPCS[npcId]
      if (!def.followsPlayer || !flags[`${npcId}Following`]) continue
      const targetX = Phaser.Math.Linear(sprite.x, this.player.sprite.x - 32, 0.05)
      const targetY = Phaser.Math.Linear(sprite.y, this.player.sprite.y + 8, 0.05)
      sprite.setPosition(targetX, targetY)
      sprite.setDepth(targetY)
    }
  }
}
