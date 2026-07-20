import { create } from 'zustand'
import { LOCATIONS, LOCATION_ORDER } from '../data/locations'
import { PUZZLES } from '../data/puzzles'
import { DIALOG_TREES } from '../data/dialog'
import type { DialogNode, LocationId } from '../types'

interface ActiveDialog {
  treeId: string
  nodeId: string
  npcId: string
}

interface GameState {
  currentLocation: LocationId
  collectedItems: Record<string, boolean>
  completedPuzzles: Record<string, boolean>
  unlockedMemories: string[]
  flags: Record<string, boolean>
  activeDialog: ActiveDialog | null
  activeHint: string | null
  interactTarget: string | null
  galleryOpen: boolean
  mapOpen: boolean
  visitedLocations: LocationId[]

  goToLocation: (id: LocationId) => void
  collectItem: (itemId: string) => void
  startDialog: (npcId: string, treeId: string) => void
  chooseDialogOption: (choiceIndex: number) => void
  advanceDialog: () => void
  closeDialog: () => void
  showHint: (text: string) => void
  clearHint: () => void
  setFlag: (key: string, value?: boolean) => void
  setInteractTarget: (name: string | null) => void
  toggleGallery: (open?: boolean) => void
  toggleMap: (open?: boolean) => void
}

export function isLocationUnlocked(completedPuzzles: Record<string, boolean>, id: LocationId): boolean {
  const index = LOCATION_ORDER.indexOf(id)
  if (index <= 0) return true
  const previous = LOCATIONS[LOCATION_ORDER[index - 1]]
  return previous.puzzleId ? !!completedPuzzles[previous.puzzleId] : true
}

function unlockMemory(state: GameState, memoryId: string): Pick<GameState, 'unlockedMemories'> {
  return {
    unlockedMemories: state.unlockedMemories.includes(memoryId)
      ? state.unlockedMemories
      : [...state.unlockedMemories, memoryId],
  }
}

export const useGameStore = create<GameState>((set, get) => {
  function enterDialogNode(treeId: string, nodeId: string, npcId: string) {
    const node = DIALOG_TREES[treeId].nodes[nodeId]
    applyNodeEffects(node)
    set({ activeDialog: { treeId, nodeId, npcId } })
  }

  function applyNodeEffects(node: DialogNode) {
    if (!node.onEnter) return
    if (node.onEnter.setFlags) {
      node.onEnter.setFlags.forEach((flag) => get().setFlag(flag))
    }
    if (node.onEnter.unlockMemory) {
      const memoryId = node.onEnter.unlockMemory
      set((state) => unlockMemory(state, memoryId))
    }
    if (node.onEnter.hint) {
      set({ activeHint: node.onEnter.hint })
    }
  }

  return {
    // DEV: jumped straight to 'backyard' to iterate on item/furniture
    // positions without replaying the bedroom puzzle first. Revert to
    // 'bedroom' (and LOCATIONS.bedroom.entryHint / ['bedroom'] below)
    // before shipping.
    currentLocation: 'bedroom',
    collectedItems: {},
    completedPuzzles: {},
    unlockedMemories: [],
    flags: {},
    activeDialog: null,
    activeHint: LOCATIONS.backyard.entryHint ?? null,
    interactTarget: null,
    galleryOpen: false,
    mapOpen: false,
    visitedLocations: ['backyard'],

    goToLocation: (id) => {
      const loc = LOCATIONS[id]
      set((state) => ({
        currentLocation: id,
        activeHint: loc.entryHint ?? null,
        interactTarget: null,
        visitedLocations: state.visitedLocations.includes(id)
          ? state.visitedLocations
          : [...state.visitedLocations, id],
      }))
    },

    collectItem: (itemId) => {
      if (get().collectedItems[itemId]) return
      set((state) => ({ collectedItems: { ...state.collectedItems, [itemId]: true } }))

      const puzzle = Object.values(PUZZLES).find((p) => p.requiredItemIds.includes(itemId))
      if (!puzzle || get().completedPuzzles[puzzle.id]) return

      const { collectedItems } = get()
      const allCollected = puzzle.requiredItemIds.every((id) => collectedItems[id])
      if (!allCollected) return

      set((state) => ({
        completedPuzzles: { ...state.completedPuzzles, [puzzle.id]: true },
        activeHint: puzzle.completionHint,
        ...unlockMemory(state, puzzle.rewardMemoryId),
      }))
    },

    startDialog: (npcId, treeId) => {
      const tree = DIALOG_TREES[treeId]
      const entry = tree.entryPoints?.find((e) => get().flags[e.flag])
      enterDialogNode(treeId, entry?.nodeId ?? tree.startNodeId, npcId)
    },

    chooseDialogOption: (choiceIndex) => {
      const { activeDialog } = get()
      if (!activeDialog) return
      const node = DIALOG_TREES[activeDialog.treeId].nodes[activeDialog.nodeId]
      const choice = node.choices?.[choiceIndex]
      if (!choice) return
      if (choice.setFlags) choice.setFlags.forEach((flag) => get().setFlag(flag))
      if (!choice.next) {
        set({ activeDialog: null })
        return
      }
      enterDialogNode(activeDialog.treeId, choice.next, activeDialog.npcId)
    },

    advanceDialog: () => {
      const { activeDialog } = get()
      if (!activeDialog) return
      const node = DIALOG_TREES[activeDialog.treeId].nodes[activeDialog.nodeId]
      if (!node.next) {
        set({ activeDialog: null })
        return
      }
      enterDialogNode(activeDialog.treeId, node.next, activeDialog.npcId)
    },

    closeDialog: () => set({ activeDialog: null }),

    showHint: (text) => set({ activeHint: text }),
    clearHint: () => set({ activeHint: null }),

    setFlag: (key, value = true) => set((state) => ({ flags: { ...state.flags, [key]: value } })),

    setInteractTarget: (name) => set({ interactTarget: name }),

    toggleGallery: (open) => set((state) => ({ galleryOpen: open ?? !state.galleryOpen })),

    toggleMap: (open) => set((state) => ({ mapOpen: open ?? !state.mapOpen })),
  }
})
