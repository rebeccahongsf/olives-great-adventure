import { useGameStore } from '../../game/store/gameStore'
import { DIALOG_TREES } from '../../game/data/dialog'

export function DialogBox() {
  const activeDialog = useGameStore((s) => s.activeDialog)
  const selectedChoiceIndex = useGameStore((s) => s.selectedChoiceIndex)
  const chooseDialogOption = useGameStore((s) => s.chooseDialogOption)
  const advanceDialog = useGameStore((s) => s.advanceDialog)
  const closeDialog = useGameStore((s) => s.closeDialog)

  if (!activeDialog) return null

  const node = DIALOG_TREES[activeDialog.treeId].nodes[activeDialog.nodeId]

  return (
    <div className="dialog-box">
      <div className="dialog-speaker">{node.speaker}</div>
      <div className="dialog-text">{node.text}</div>
      {node.choices ? (
        <div className="dialog-choices">
          {node.choices.map((choice, i) => (
            <button
              key={choice.text}
              className={i === selectedChoiceIndex ? 'selected' : undefined}
              onClick={() => chooseDialogOption(i)}
            >
              {choice.text}
            </button>
          ))}
          <div className="dialog-hint">&uarr;/&darr; to select, SPACE to confirm</div>
        </div>
      ) : (
        <button className="dialog-next" onClick={node.next ? advanceDialog : closeDialog}>
          {node.next ? 'Continue (SPACE)' : 'Close (SPACE)'}
        </button>
      )}
    </div>
  )
}
