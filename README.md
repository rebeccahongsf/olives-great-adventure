# Olive's Great Adventure

A short 2D top-down adventure game built with **Phaser 3** (game engine/canvas) embedded in a **React** shell (UI overlays). The player explores a house and backyard looking for a missing dog, Olive, solving small puzzles in each room that unlock family photo memories along the way.

The full story beats and room-by-room design are laid out in [PLAN.md](PLAN.md).

## Tech Stack

- **Phaser 3.87** — game scenes, physics (Arcade), sprites, animation
- **React 18** — mounts the Phaser canvas and renders UI overlays (dialog box, HUD, map, memory gallery) on top of it
- **Zustand 5** — single global game store (`useGameStore`) shared between Phaser scenes and React components
- **TypeScript** + **Vite** — build tooling

## Getting Started

```bash
npm install
npm run dev      # start Vite dev server
npm run build    # tsc -b && vite build
npm run preview  # preview a production build
```

Sprite/image assets live in `assets/` at the project root and are served as static files via Vite's `publicDir: 'assets'` config ([vite.config.ts](vite.config.ts)) — e.g. `assets/sprites/characters/player/foo.png` is available at `/sprites/characters/player/foo.png`.

## Project Structure

```
src/
├── main.tsx / App.tsx          React entry point
├── components/
│   ├── GameCanvas.tsx          Mounts the Phaser.Game instance
│   └── ui/                     React overlays: DialogBox, HUD, LocationMap, MemoryGallery, HintToast
└── game/
    ├── config.ts                Phaser game config (scenes, physics, pixelArt)
    ├── constants.ts             Tunable numbers (game size, player speed/body, per-interaction-type
    │                            interact distances for NPCs/doors/items, item render depth)
    ├── types.ts                  Shared TypeScript types: rooms, furniture, doors, items, NPCs, dialog trees
    ├── gameBridge.ts            Lets React reach into the live Phaser.Game instance
    ├── scenes/
    │   ├── BootScene.ts          Kicks off Preload
    │   ├── PreloadScene.ts       Loads sprite frames, registers animations, generates placeholder textures
    │   └── LocationScene.ts      The main gameplay scene — spawns player/furniture/doors/items/NPCs per
    │                             room; handles E (context-sensitive interact), SPACE (dialogue
    │                             advance/choice confirm), arrow keys (choice highlight), and M (map)
    ├── entities/
    │   └── Player.ts             Movement, facing, and animation state machine
    ├── store/
    │   └── gameStore.ts          Zustand store: current location, collected items, completed puzzles,
    │                             dialog state (incl. highlighted choice), interact prompt text, flags,
    │                             unlocked memories
    ├── utils/
    │   ├── textures.ts            Generates placeholder rect/circle textures + resolves art texture keys
    │   └── trail.ts                Overworld map trail/path helpers
    └── data/                     Static content, keyed by id — the "content" of the game
        ├── locations.ts          Rooms: size, spawn point, background, furniture, doors, item/NPC ids,
        │                         blocked collision zones, puzzle id
        ├── items.ts               Collectible items per location
        ├── npcs.ts                 Dad, Sister, Axel (follows player), Mom, Olive
        ├── puzzles.ts              Required items → reward memory → completion hint, per room
        ├── memories.ts             Unlockable photo memory title/caption
        ├── dialog.ts               Branching dialog trees per NPC
        ├── mapLayout.ts            Overworld map overlay node positions (860x600)
        ├── mapIcons.ts             Icons for the map overlay
        └── playerAnimations.ts     Generates the player's sprite load list + animation defs from the frames on disk
```

## Controls

- **Move** — arrow keys or WASD (disabled while a dialogue or the map overlay is open)
- **E** — context-sensitive interact, in priority order: talk to the nearest NPC, else collect the nearest item, else exit through the nearest door (opens the map overlay). A "Press E to …" prompt appears in the HUD for NPCs/items, or floating above the door in-world for doors, whenever something is in range.
- **SPACE** — advance dialogue to the next line or close it; when the current line offers choices, confirms whichever choice is highlighted instead
- **Up/Down arrows** — move the highlighted choice during a branching dialogue prompt
- **M** — toggle the overworld map overlay

Note: items no longer collect on simple collision — walking into one just surfaces the prompt; collecting requires pressing E while in range.

## Gameplay Systems

- **Locations**: 7 rooms (`bedroom`, `backyard`, `kitchen`, `sistersBedroom`, `livingRoom`, `dogPark`, `finale`), each an independent Phaser scene restart with its own bounds. Most are 800×600 (matching the viewport, so no camera scroll); `dogPark` is 1600×1200.
- **Progression**: rooms unlock in `LOCATION_ORDER` sequence — a room's puzzle must be completed before the next room counts as unlocked (`isLocationUnlocked` in `gameStore.ts`).
- **Furniture & doors**: rooms can define depth-sorted `furniture` pieces and `doors` (`DoorDef`); `blockedZones` plus any door's `blocksMovement` build the room's static collision layer. So far only `bedroom` and `backyard` have furniture/doors defined.
- **Puzzles**: collecting all of a puzzle's `requiredItemIds` completes it, unlocks a memory, and surfaces a hint pointing to the next location.
- **Dialog**: NPCs run branching `DialogTree`s with choices, flags, and memory unlocks, rendered by `DialogBox.tsx`. See Controls above for how SPACE/arrow keys drive it.
- **Memories**: unlocked photo entries collect in `unlockedMemories`, viewable in the `MemoryGallery` overlay.
- **Overworld map**: `M` (or approaching a door and pressing E) toggles the map overlay (`LocationMap.tsx`) showing all locations and the trail between them.

## Assets

- `assets/sprites/characters/player/` — full sprite art, 96×96px frames:
  - Walk: all 4 directions, 4 frames each
  - Idle: **left/right only** — up/down idle currently fall back to a held first walk-frame (no dedicated idle_up/idle_down art yet)
  - `player/old/` holds the previous 32×32 sprite set, unused by code
- `assets/sprites/npcs/mom/` — Mom (backyard) has a real 2-frame idle animation. Dad, Sister, Axel, dog-park Mom, and Olive are still **procedurally-generated placeholder shapes** (solid-color rects from `utils/textures.ts`).
- `assets/items/` — `tissueBox`, `duckToy`, and `blueBall` have real art. `coffeeMug`, `legoLeg`, `poohBear`, and `dogToy1-3` are still flat-color placeholder squares.
- `assets/background/` + `assets/furniture/` — `bedroom` and `backyard` have full background art plus a matching furniture/door layer. `kitchen`, `sistersBedroom`, `livingRoom`, `dogPark`, and `finale` are still flat `backgroundColor` fills with no furniture (`sister_bedroom_base.png` exists in `assets/background/` but isn't wired into `locations.ts` yet).
- `assets/aseprite_base/` — source `.aseprite` files exported into the `background/`, `furniture/`, and `items/` folders above.

## Current Status / In-Progress

**Done:**
- Core scene flow (Boot → Preload → Location) and room-to-room progression
- Furniture, doors, and per-room collision layout for `bedroom` and `backyard`, with matching background/furniture art
- Item pickup (explicit E press, not auto-collision), puzzle completion, and memory unlock logic
- Branching NPC dialog system, including keyboard-only choice navigation (arrow keys + SPACE)
- Unified E-to-interact model across NPCs, items, and doors, with a shared HUD prompt for NPCs/items and a world-space prompt for doors
- Overworld map overlay and memory gallery UI
- Player sprite loading + walk/idle animations wired to movement input, with a properly inset physics body for the 96×96 art

**Open / not yet done:**
- Olive and Axel have no sprite art or folders yet (only `player/` and `npcs/mom/` exist under `assets/sprites/`) — they still render as colored placeholder rectangles despite being interactive NPCs (Axel follows the player)
- Missing `player_idle_up` / `player_idle_down` art — currently synthesized from the first walk frame
- Most item art (`coffeeMug`, `legoLeg`, `poohBear`, `dogToy1-3`) and NPC art beyond Mom
- Background/furniture art for `kitchen`, `sistersBedroom`, `livingRoom`, `dogPark`, `finale`
- Camera zoom/framing hasn't been revisited since the player sprite grew from 32×32 to 96×96 — may want a `setZoom()` pass once more art is in
- No audio (music/SFX) loading anywhere in the codebase yet
- No persistence — `gameStore` is in-memory only and resets on page reload
- No automated tests configured (no test runner in `package.json`)
