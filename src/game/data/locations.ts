import type { LocationDef, LocationId } from '../types'

export const LOCATION_ORDER: LocationId[] = [
  'bedroom',
  'backyard',
  'kitchen',
  'sistersBedroom',
  'livingRoom',
  'dogPark',
  'finale',
]

export const LOCATIONS: Record<LocationId, LocationDef> = {
  bedroom: {
    id: 'bedroom',
    name: "Your Bedroom",
    width: 800,
    height: 600,
    backgroundColor: 0x3a2e39,
    backgroundPath: '/background/player_bedroom_base.png',
    playerSpawn: { x: 400, y: 350 },
    entryHint: "Olive's not in her bed! Let's look around the room for clues.",
    items: ['tissueBox'],
    npcs: [],
    puzzleId: 'bedroomPuzzle',
    walkableBounds: { x: 155, y: 190, width: 495, height: 298 },
    blockedZones: [
      { x: 200, y: 70, width: 117, height: 139 }, // bookshelf
      { x: 154, y: 246, width: 154, height: 118 }, // bed
      { x: 164, y: 402, width: 132, height: 86 }, // dresser (up)
      { x: 600, y: 281, width: 50, height: 128 }, // dresser (right)
      { x: 327, y: 414, width: 165, height: 74 }, // table
      { x: 416, y: 372, width: 39, height: 41 }, // chair
      { x: 510, y: 423, width: 102, height: 65 }, // couch
    ],
    // x/y is each piece's top-left; sortY is its vertical center
    // (y + height / 2, from the cropped PNG's actual dimensions), so draw
    // order runs back-to-front matching room depth and the player sorts
    // correctly against it by y position. All pieces are kept within the
    // room frame (154, 57)-(649, 488) — dresser_right, dresser_up,
    // table_white_down, and olive_full_couch_down were nudged a few px from
    // their original blockedZones corner because their cropped art (68x137,
    // 140x95, 175x83, 112x74) is larger than that box and was overflowing
    // the frame's right/bottom edge.
    furniture: [
      { key: 'bookshelf_down', path: '/furniture/bookshelf_down.png', x: 200, y: 70, sortY: 144 },
      { key: 'bed_left', path: '/furniture/bed_left.png', x: 151, y: 220, sortY: 322 },
      { key: 'dresser_right', path: '/furniture/dresser_right.png', x: 585, y: 275, sortY: 350 },
      { key: 'chair_right', path: '/furniture/chair_right.png', x: 408, y: 350, sortY: 412 },
      { key: 'dresser_up', path: '/furniture/dresser_up.png', x: 160, y: 395, sortY: 441 },
      { key: 'table_white_down', path: '/furniture/table_white_down.png', x: 322, y: 410, sortY: 447 },
      {
        key: 'olive_full_couch_down',
        path: '/furniture/olive_full_couch_down.png',
        x: 505,
        y: 416,
        sortY: 451,
      },
    ],
    // door_right.png is 27x182; x/y are clamped so both doors stay fully
    // inside the room frame (154, 57)-(649, 488) — overlapping dresser_right
    // is fine, only the frame bound matters here.
    doors: [
      {
        key: 'door_right',
        path: '/furniture/door_right.png',
        x: 628,
        y: 80,
        width: 27,
        height: 182,
        sortY: 191,
        interactive: true,
        promptText: 'Press SPACE to exit',
        blocksMovement: true,
      },
      {
        key: 'door_right',
        path: '/furniture/door_right.png',
        x: 628,
        y: 305,
        width: 27,
        height: 182,
        sortY: 396,
      },
    ],
  },
  backyard: {
    id: 'backyard',
    name: 'Backyard',
    width: 800,
    height: 600,
    backgroundColor: 0x2d4a2d,
    playerSpawn: { x: 400, y: 300 },
    items: ['rope', 'stuffedAnimal'],
    npcs: [],
    puzzleId: 'backyardPuzzle',
  },
  kitchen: {
    id: 'kitchen',
    name: 'Kitchen',
    width: 800,
    height: 600,
    backgroundColor: 0x4a3728,
    playerSpawn: { x: 400, y: 300 },
    items: ['coffeeMug'],
    npcs: ['dad'],
    puzzleId: 'kitchenPuzzle',
  },
  sistersBedroom: {
    id: 'sistersBedroom',
    name: "Sister's Bedroom",
    width: 800,
    height: 600,
    backgroundColor: 0x3d2b4f,
    playerSpawn: { x: 400, y: 300 },
    items: ['legoLeg'],
    npcs: ['sister'],
    puzzleId: 'sistersBedroomPuzzle',
  },
  livingRoom: {
    id: 'livingRoom',
    name: 'Living Room',
    width: 800,
    height: 600,
    backgroundColor: 0x2b3a4a,
    playerSpawn: { x: 400, y: 300 },
    items: ['poohBear'],
    npcs: ['axel'],
    puzzleId: 'livingRoomPuzzle',
  },
  dogPark: {
    id: 'dogPark',
    name: 'Dog Park',
    width: 1600,
    height: 1200,
    backgroundColor: 0x386641,
    playerSpawn: { x: 800, y: 600 },
    items: ['dogToy1', 'dogToy2', 'dogToy3'],
    npcs: ['mom'],
    puzzleId: 'dogParkPuzzle',
  },
  finale: {
    id: 'finale',
    name: 'Birthday Party',
    width: 800,
    height: 600,
    backgroundColor: 0xd4a5a5,
    playerSpawn: { x: 400, y: 500 },
    entryHint: 'Wait... is that a party?!',
    items: [],
    npcs: ['olive'],
  },
}
