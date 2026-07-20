export const GAME_WIDTH = 800
export const GAME_HEIGHT = 600
export const PLAYER_SPEED = 160
export const INTERACT_DISTANCE = 48
// Doors get their own, larger interact radius (spec'd separately from NPCs)
// since a door's interact point is measured from its center, and its sprite
// is much taller than an NPC's.
export const DOOR_INTERACT_DISTANCE = 80
// Items are small props at ground level, so a tighter radius than NPCs/doors
// keeps the "Press E to collect" prompt from lighting up before the player
// is actually standing next to the item.
export const ITEM_INTERACT_DISTANCE = 40

// Player sprite frames are 96x96 canvases with the character art occupying
// roughly the bottom two-thirds. The physics body is inset to the character's
// feet/torso footprint so collisions and item overlaps feel accurate instead
// of triggering off empty canvas padding or the sprite's head.
export const PLAYER_FRAME_SIZE = 96
export const PLAYER_BODY_WIDTH = 40
export const PLAYER_BODY_HEIGHT = 32

// Items render above every furniture layer regardless of y-position: a
// collectible is a small prop sitting on a surface (floor or furniture top),
// not a walkable obstacle, so it should never be painted over by a piece of
// furniture whose sortY happens to be higher.
export const ITEM_DEPTH = 1000
