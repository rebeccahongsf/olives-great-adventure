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
    playerSpawn: { x: 200, y: 360 },
    entryHint: "Olive's not in her bed! Let's look around the room for clues.",
    items: ['tissueBox'],
    npcs: [],
    puzzleId: 'bedroomPuzzle',
    walkableBounds: { x: 170, y: 190, width: 470, height: 298 },
    blockedZones: [
      { x: 200, y: 70, width: 117, height: 139 }, // bookshelf
      { x: 154, y: 246, width: 154, height: 118 }, // bed
      { x: 164, y: 438, width: 132, height: 50 }, // dresser (up)
      { x: 600, y: 281, width: 50, height: 128 }, // dresser (right)
      { x: 590, y: 311, width: 10, height: 98 }, // dresser (right drawer)
      { x: 327, y: 438, width: 165, height: 50 }, // table
      { x: 416, y: 372, width: 39, height: 30 }, // chair
      { x: 510, y: 455, width: 102, height: 30 }, // couch
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
      { key: 'calender_purple', path: '/furniture/calender_purple.png', x: 450, y: 100, sortY: 144 },
      { key: 'bookshelf_down', path: '/furniture/bookshelf_down.png', x: 200, y: 70, sortY: 144 },
      { key: 'bed_left', path: '/furniture/bed_left.png', x: 151, y: 220, sortY: 322 },
      { key: 'dresser_right', path: '/furniture/dresser_right.png', x: 585, y: 275, sortY: 350 },
      { key: 'chair_right', path: '/furniture/chair_right.png', x: 408, y: 350, sortY: 390 },
      { key: 'dresser_up', path: '/furniture/dresser_up.png', x: 160, y: 395, sortY: 441 },
      { key: 'table_white_down', path: '/furniture/table_white_down.png', x: 322, y: 410, sortY: 447 },
      {
        key: 'olive_full_couch_down',
        path: '/furniture/olive_full_couch_down.png',
        x: 505,
        y: 416,
        sortY: 200,
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
    backgroundPath: '/background/backyard_base.png',
    playerSpawn: { x: 400, y: 300 },
    items: ['duckToy', 'blueBall'],
    npcs: ['momIntro'],
    puzzleId: 'backyardPuzzle',
    walkableBounds: { x: 156, y: 192, width: 488, height: 296 },
    // x/y is each piece's top-left (its draw position); blockedZones are
    // taken as-given rather than derived from image bounds, since several
    // pieces (dog house roof, planters) are meant to be walkable in front
    // of/around, not blocked across their full sprite. sortY = y + the
    // piece's actual PNG height / 2, per the pattern established in
    // bedroom above.
    blockedZones: [
      { x: 331, y: 432, width: 104, height: 56 }, // dog_house
      { x: 404, y: 307, width: 32, height: 27 }, // outdoor_chair
      { x: 435, y: 289, width: 38, height: 45 }, // outdoor_table
      { x: 444, y: 247, width: 75, height: 36 }, // long_planters
      { x: 162, y: 372, width: 91, height: 53 }, // dirt_bags
      { x: 306, y: 268, width: 22, height: 9 }, // shovel
      { x: 285, y: 270, width: 20, height: 39 }, // wheat_plant
      { x: 307, y: 230, width: 22, height: 40 }, // lavender_plant
      { x: 261, y: 284, width: 20, height: 39 }, // snake_plant
    ],
    furniture: [
      // Full-canvas (800x600) dirt-bed overlay layer, not a physical prop —
      // its own "collision" bounds cover almost the entire walkable area
      // (and directly overlap the blue_ball pickup and mom's spot), so it's
      // drawn as background decoration only, just above backyard_base and
      // below every other piece, with no blockedZone of its own.
      { key: 'garden_box', path: '/furniture/garden_box.png', x: 0, y: 0, sortY: -0.5 },
      { key: 'dirt_bags', path: '/furniture/dirt_bags.png', x: 160, y: 370, sortY: 410 },
      { key: 'lavender_plant', path: '/furniture/lavender_plant.png', x: 305, y: 225, sortY: 250 },
      { key: 'shovel', path: '/furniture/shovel.png', x: 302, y: 270, sortY: 255 },
      { key: 'wheat_plant', path: '/furniture/wheat_plant.png', x: 280, y: 270, sortY: 300 },
      { key: 'snake_plant', path: '/furniture/snake_plant.png', x: 258, y: 286, sortY: 300 },
      { key: 'long_planters', path: '/furniture/long_planters.png', x: 440, y: 245, sortY: 288.5 },
      { key: 'outdoor_table', path: '/furniture/outdoor_table.png', x: 435, y: 288, sortY: 325 },
      { key: 'outdoor_chair', path: '/furniture/outdoor_chair.png', x: 400, y: 285, sortY: 325 },
      { key: 'dog_house', path: '/furniture/dog_house.png', x: 323, y: 370, sortY: 481.5 },
    ],
    doors: [
      {
        key: 'door_down',
        path: '/furniture/door_down.png',
        x: 515,
        y: 475,
        width: 86,
        height: 14,
        sortY: 490,
        interactive: true,
        promptText: 'Press SPACE to exit',
        blocksMovement: true,
      },
    ],
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
