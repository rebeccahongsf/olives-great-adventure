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
    ├── constants.ts             Tunable numbers (game size, player speed/body, interact distance)
    ├── gameBridge.ts            Lets React reach into the live Phaser.Game instance
    ├── scenes/
    │   ├── BootScene.ts          Kicks off Preload
    │   ├── PreloadScene.ts       Loads sprite frames, registers animations, generates placeholder textures
    │   └── LocationScene.ts      The main gameplay scene — spawns player/items/NPCs per room, handles interact/map input
    ├── entities/
    │   └── Player.ts             Movement, facing, and animation state machine
    ├── store/
    │   └── gameStore.ts          Zustand store: current location, collected items, completed puzzles, dialog state, flags, unlocked memories
    └── data/                     Static content, keyed by id — the "content" of the game
        ├── locations.ts          Rooms: size, spawn point, background color, item/NPC ids, puzzle id
        ├── items.ts               Collectible items per location
        ├── npcs.ts                 Dad, Sister, Axel (follows player), Mom, Olive
        ├── puzzles.ts              Required items → reward memory → completion hint, per room
        ├── memories.ts             Unlockable photo memory title/caption
        ├── dialog.ts               Branching dialog trees per NPC
        ├── mapLayout.ts            Overworld map overlay node positions (860x600)
        ├── mapIcons.ts             Icons for the map overlay
        └── playerAnimations.ts     Generates the player's sprite load list + animation defs from the frames on disk
```

## Gameplay Systems

- **Locations**: 7 rooms (`bedroom`, `backyard`, `kitchen`, `sistersBedroom`, `livingRoom`, `dogPark`, `finale`), each an independent Phaser scene restart with its own bounds. Most are 800×600 (matching the viewport, so no camera scroll); `dogPark` is 1600×1200.
- **Progression**: rooms unlock in `LOCATION_ORDER` sequence — a room's puzzle must be completed before the next room counts as unlocked (`isLocationUnlocked` in `gameStore.ts`).
- **Puzzles**: collecting all of a puzzle's `requiredItemIds` completes it, unlocks a memory, and surfaces a hint pointing to the next location.
- **Dialog**: NPCs run branching `DialogTree`s with choices, flags, and memory unlocks, rendered by `DialogBox.tsx`.
- **Memories**: unlocked photo entries collect in `unlockedMemories`, viewable in the `MemoryGallery` overlay.
- **Overworld map**: `M` toggles a map overlay (`LocationMap.tsx`) showing all locations and the trail between them.
- **Player movement**: arrow keys / WASD, 8-directional input normalized to 4 facing directions (up/down/left/right), animated via `player_{walk|idle}_{facing}` Phaser animations.

## Assets

- `assets/sprites/characters/player/` — the only character with real sprite art so far, 96×96px frames:
  - Walk: all 4 directions, 4 frames each
  - Idle: **left/right only** — up/down idle currently fall back to a held first walk-frame (no dedicated idle_up/idle_down art yet)
  - `player/old/` holds the previous 32×32 sprite set, unused by code
- NPCs (`dad`, `sister`, `axel`, `mom`, `olive`) and items are still **procedurally-generated placeholder shapes** (solid-color rects/circles from `utils/textures.ts`) — no sprite art yet.
- Room backgrounds are flat fill colors (`backgroundColor` per location) — no background/tile art yet.

## Current Status / In-Progress

**Done:**
- Core scene flow (Boot → Preload → Location) and room-to-room progression
- Item pickup, puzzle completion, and memory unlock logic
- Branching NPC dialog system
- Overworld map overlay and memory gallery UI
- Player sprite loading + walk/idle animations wired to movement input, with a properly inset physics body for the 96×96 art

**Open / not yet done:**
- Olive and Axel have no sprite art or folders yet (only `player/` exists under `assets/sprites/characters/`) — they still render as colored placeholder rectangles despite being interactive NPCs (Axel follows the player)
- Missing `player_idle_up` / `player_idle_down` art — currently synthesized from the first walk frame
- NPC and item art/animations in general
- Room background/tile art (currently flat colors)
- Camera zoom/framing hasn't been revisited since the player sprite grew from 32×32 to 96×96 — may want a `setZoom()` pass once more art is in
- No audio (music/SFX) loading anywhere in the codebase yet
- No persistence — `gameStore` is in-memory only and resets on page reload
- No automated tests configured (no test runner in `package.json`)
