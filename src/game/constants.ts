export const GAME_WIDTH = 800
export const GAME_HEIGHT = 600
export const PLAYER_SPEED = 160
export const INTERACT_DISTANCE = 48

// Player sprite frames are 96x96 canvases with the character art occupying
// roughly the bottom two-thirds. The physics body is inset to the character's
// feet/torso footprint so collisions and item overlaps feel accurate instead
// of triggering off empty canvas padding or the sprite's head.
export const PLAYER_FRAME_SIZE = 96
export const PLAYER_BODY_WIDTH = 40
export const PLAYER_BODY_HEIGHT = 32
