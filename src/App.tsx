import { LayoutGroup } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CaptureFlow } from './components/CaptureFlow'
import { PhoneFrame } from './components/PhoneFrame'
import {
  captureResult,
  initialDemo,
  people,
  recommendedRail,
  type CapturePhase,
  type DemoState,
  type Person,
  type RailItem,
} from './data/demo'
import { HomeScreen } from './screens/HomeScreen'
import './App.css'

function App() {
  const [demo, setDemo] = useState<DemoState>(initialDemo)
  const [phase, setPhase] = useState<CapturePhase>('idle')
  const [query, setQuery] = useState('')
  const [selectedPerson, setSelectedPerson] = useState<Person | null | 'otro'>(
    people.lupe,
  )
  const [rail, setRail] = useState<RailItem[]>(recommendedRail)
  const [newCardId, setNewCardId] = useState<string | null>(null)
  const [scrollToRecommended, setScrollToRecommended] = useState(0)
  const [resetToken, setResetToken] = useState(0)
  const thinkTimer = useRef<number | null>(null)
  const insertTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (thinkTimer.current) window.clearTimeout(thinkTimer.current)
      if (insertTimer.current) window.clearTimeout(insertTimer.current)
    }
  }, [])

  const openCapture = useCallback(() => {
    setPhase('open')
  }, [])

  const closeCapture = useCallback(() => {
    if (thinkTimer.current) window.clearTimeout(thinkTimer.current)
    setPhase('idle')
    setQuery('')
  }, [])

  const onQueryChange = useCallback((value: string) => {
    setQuery(value)
    setPhase(value.trim().length > 0 ? 'typing' : 'open')
  }, [])

  const onSubmit = useCallback(() => {
    if (query.trim().length < 3) return
    setPhase('thinking')
    thinkTimer.current = window.setTimeout(() => {
      setPhase('result')
    }, 4800)
  }, [query])

  const onRetry = useCallback(() => {
    if (thinkTimer.current) window.clearTimeout(thinkTimer.current)
    setPhase('open')
  }, [])

  const onSave = useCallback(() => {
    const person =
      selectedPerson === 'otro' || selectedPerson === null
        ? null
        : selectedPerson

    const item: RailItem = {
      movie: captureResult.movie,
      provenance: person
        ? { person, attachment: 'comment' }
        : undefined,
    }
    const movieId = item.movie.id

    setDemo((d) => ({
      ...d,
      movie: captureResult.movie,
      recommendedBy: person,
      attachment: 'comment',
    }))

    // Remove existing card first (no entrance anim), before returning home.
    setNewCardId(null)
    setRail((prev) => prev.filter((r) => r.movie.id !== movieId))
    setPhase('saved')
    setQuery('')

    if (insertTimer.current) window.clearTimeout(insertTimer.current)
    insertTimer.current = window.setTimeout(() => {
      setRail((prev) => [item, ...prev.filter((r) => r.movie.id !== movieId)])
      setNewCardId(movieId)
      setScrollToRecommended((n) => n + 1)
    }, 80)

    window.setTimeout(() => {
      setPhase('idle')
    }, 500)
  }, [selectedPerson])

  const onReset = useCallback(() => {
    if (thinkTimer.current) window.clearTimeout(thinkTimer.current)
    if (insertTimer.current) window.clearTimeout(insertTimer.current)
    setDemo(initialDemo)
    setPhase('idle')
    setQuery('')
    setSelectedPerson(people.lupe)
    setRail(recommendedRail)
    setNewCardId(null)
    setScrollToRecommended(0)
    setResetToken((n) => n + 1)
  }, [])

  return (
    <PhoneFrame>
      <LayoutGroup>
        <div className="app-stage">
          <HomeScreen
            recommended={rail}
            newCardId={newCardId}
            scrollToken={scrollToRecommended}
            resetToken={resetToken}
            onNewCardSettled={() => setNewCardId(null)}
            onLogoClick={onReset}
          />
          <CaptureFlow
            phase={phase}
            query={query}
            onQueryChange={onQueryChange}
            selectedPerson={selectedPerson}
            onSelectPerson={setSelectedPerson}
            onOpen={openCapture}
            onClose={closeCapture}
            onSubmit={onSubmit}
            onSave={onSave}
            onRetry={onRetry}
          />
        </div>
      </LayoutGroup>
      <span hidden data-demo-movie={demo.movie?.id ?? ''} />
    </PhoneFrame>
  )
}

export default App
