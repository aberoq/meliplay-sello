import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { PhoneFrame } from './components/PhoneFrame'
import { initialDemo, type DemoState } from './data/demo'
import { HomeScreen } from './screens/HomeScreen'
import './App.css'

export type ScreenId = 'home'

function App() {
  const [screen] = useState<ScreenId>('home')
  const [demo] = useState<DemoState>(initialDemo)

  return (
    <PhoneFrame>
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <motion.div
            key="home"
            className="screen-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <HomeScreen />
          </motion.div>
        )}
      </AnimatePresence>
      {/* demo reserved for later screens */}
      <span hidden data-demo-movie={demo.movie?.id ?? ''} />
    </PhoneFrame>
  )
}

export default App
