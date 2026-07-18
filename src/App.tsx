import { GameCanvas } from './components/GameCanvas'
import { DialogBox } from './components/ui/DialogBox'
import { HintToast } from './components/ui/HintToast'
import { MemoryGallery } from './components/ui/MemoryGallery'
import { LocationMap } from './components/ui/LocationMap'
import { HUD } from './components/ui/HUD'
import './App.css'

function App() {
  return (
    <div className="app">
      <HUD />
      <GameCanvas />
      <HintToast />
      <DialogBox />
      <MemoryGallery />
      <LocationMap />
    </div>
  )
}

export default App
