import type { ItemDef } from '../types'

export const ITEMS: Record<string, ItemDef> = {
  // Open floor position, clear of every blockedZones rect (it previously
  // sat on the table, inside a blocked zone, and was unreachable).
  tissueBox: {
    id: 'tissueBox',
    locationId: 'bedroom',
    name: 'Tissue Box',
    x: 478,
    y: 302,
    color: 0xffffff,
    texturePath: '/items/tissue_box.png',
    proximityText: 'Hm, I wonder why the tissue box is on the floor...',
    onCollect: {
      sound: { key: 'bark', path: '/sounds/bark.mp3' },
      // Bedroom's interactive exit door (locations.ts: door_right at
      // x:628,y:80,w:27,h:182) — same spot its "Press E to exit" prompt
      // floats, so the bark reads as coming from just outside that door.
      floatingText: { text: 'WOOF!', x: 641, y: 74 },
      hint: 'I hear Olive barking outside!',
    },
  },

  duckToy: {
    id: 'duckToy',
    locationId: 'backyard',
    name: 'Duck Toy',
    x: 192,
    y: 454,
    color: 0xf4a261,
    texturePath: '/items/duck_toy.png',
  },
  blueBall: {
    id: 'blueBall',
    locationId: 'backyard',
    name: 'Blue Ball',
    x: 433,
    y: 265,
    color: 0x4d96ff,
    texturePath: '/items/blue_ball.png',
  },

  coffeeMug: { id: 'coffeeMug', locationId: 'kitchen', name: "Dad's Coffee Mug", x: 550, y: 220, color: 0x774936 },

  legoLeg: { id: 'legoLeg', locationId: 'sistersBedroom', name: 'Lego Leg', x: 250, y: 450, color: 0xe63946 },

  poohBear: { id: 'poohBear', locationId: 'livingRoom', name: 'Pooh Bear Toy', x: 500, y: 380, color: 0xffb703 },

  dogToy1: { id: 'dogToy1', locationId: 'dogPark', name: 'Dog Toy', x: 300, y: 300, color: 0x2a9d8f },
  dogToy2: { id: 'dogToy2', locationId: 'dogPark', name: 'Dog Toy', x: 900, y: 650, color: 0x2a9d8f },
  dogToy3: { id: 'dogToy3', locationId: 'dogPark', name: 'Dog Toy', x: 1300, y: 950, color: 0x2a9d8f },
}
