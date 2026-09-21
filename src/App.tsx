import { LayoutGroup } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CaptureFlow } from './components/CaptureFlow'
import { MandarFlow, type ToastState } from './components/MandarFlow'
import { PhoneFrame } from './components/PhoneFrame'
import {
  captureResult,
  initialDemo,
  people,
  recommendedRail,
  type CapturePhase,
  type DemoState,
  type FichaTarget,
  type MandarPhase,
  type Person,
  type RailItem,
} from './data/demo'
import { HomeScreen } from './screens/HomeScreen'
import './App.css'

function toastRecipients(list: Person[]) {
  if (list.length === 0) return ''
  if (list.length === 1) return list[0].name
  if (list.length === 2) return `${list[0].name} y ${list[1].name}`
  return `${list[0].name} y ${list.length - 1} más`
}

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
  const sendTimer = useRef<number | null>(null)
  const toastTimer = useRef<number | null>(null)

  const [mandarPhase, setMandarPhase] = useState<MandarPhase>('idle')
  const [fichaStack, setFichaStack] = useState<FichaTarget[]>([])
  const [shareSelected, setShareSelected] = useState<Person[]>([])
  const [shareNote, setShareNote] = useState('')
  const [sentByMovie, setSentByMovie] = useState<Record<string, Person[]>>({})
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState<ToastState>(null)

  const mandarTarget =
    fichaStack.length > 0 ? fichaStack[fichaStack.length - 1] : null

  useEffect(() => {
    return () => {
      if (thinkTimer.current) window.clearTimeout(thinkTimer.current)
      if (insertTimer.current) window.clearTimeout(insertTimer.current)
      if (sendTimer.current) window.clearTimeout(sendTimer.current)
      if (toastTimer.current) window.clearTimeout(toastTimer.current)
    }
  }, [])

  const showToast = useCallback(
    (message: string, variant: 'success' | 'whatsapp' = 'success') => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current)
      const id = Date.now()
      setToast({ id, message, variant })
      toastTimer.current = window.setTimeout(() => {
        setToast(null)
      }, 2500)
    },
    [],
  )

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

  const openFicha = useCallback((target: FichaTarget) => {
    setFichaStack([target])
    setMandarPhase('ficha')
    setShareSelected([])
    setShareNote('')
    setSending(false)
  }, [])

  const closeFicha = useCallback(() => {
    if (sendTimer.current) window.clearTimeout(sendTimer.current)
    setMandarPhase('idle')
    setFichaStack([])
    setShareSelected([])
    setShareNote('')
    setSending(false)
  }, [])

  const backFicha = useCallback(() => {
    if (sendTimer.current) window.clearTimeout(sendTimer.current)
    setShareSelected([])
    setShareNote('')
    setSending(false)
    setFichaStack((prev) => {
      if (prev.length <= 1) {
        setMandarPhase('idle')
        return []
      }
      setMandarPhase('ficha')
      return prev.slice(0, -1)
    })
  }, [])

  const openShare = useCallback(() => {
    setShareSelected([])
    setShareNote('')
    setSending(false)
    setMandarPhase('share')
  }, [])

  const closeShare = useCallback(() => {
    if (sendTimer.current) window.clearTimeout(sendTimer.current)
    setMandarPhase('ficha')
    setShareSelected([])
    setShareNote('')
    setSending(false)
  }, [])

  const toggleSharePerson = useCallback((person: Person) => {
    setShareSelected((prev) => {
      const exists = prev.some((p) => p.id === person.id)
      if (exists) return prev.filter((p) => p.id !== person.id)
      return [...prev, person]
    })
  }, [])

  const mergeSent = useCallback((movieId: string, recipients: Person[]) => {
    if (recipients.length === 0) return
    setSentByMovie((prev) => {
      const existing = prev[movieId] ?? []
      const merged = [...existing]
      for (const person of recipients) {
        if (!merged.some((p) => p.id === person.id)) merged.push(person)
      }
      return { ...prev, [movieId]: merged }
    })
    setDemo((d) => ({
      ...d,
      sentTo: recipients[0] ?? null,
    }))
  }, [])

  const finishSend = useCallback(
    (
      message: string,
      recipients: Person[],
      options?: { markSent?: boolean; toastVariant?: 'success' | 'whatsapp' },
    ) => {
      if (!mandarTarget) return
      const markSent = options?.markSent ?? true
      const toastVariant = options?.toastVariant ?? 'success'
      setSending(true)
      if (sendTimer.current) window.clearTimeout(sendTimer.current)
      sendTimer.current = window.setTimeout(() => {
        if (markSent) mergeSent(mandarTarget.movieId, recipients)
        setSending(false)
        setMandarPhase('ficha')
        setShareSelected([])
        setShareNote('')
        showToast(message, toastVariant)
      }, 600)
    },
    [mandarTarget, mergeSent, showToast],
  )

  const sendShare = useCallback(() => {
    if (!mandarTarget || shareSelected.length === 0 || sending) return
    const names = toastRecipients(shareSelected)
    finishSend(`Enviada a ${names}`, shareSelected, { markSent: true })
  }, [finishSend, mandarTarget, sending, shareSelected])

  const sendWhatsApp = useCallback(() => {
    if (!mandarTarget || sending) return
    finishSend('Abriendo WhatsApp…', [], {
      markSent: false,
      toastVariant: 'whatsapp',
    })
  }, [finishSend, mandarTarget, sending])

  const copyLink = useCallback(() => {
    if (sending) return
    setMandarPhase('ficha')
    setShareSelected([])
    setShareNote('')
    showToast('Link copiado')
  }, [sending, showToast])

  const openMovieFromFicha = useCallback((movieId: string) => {
    setFichaStack((prev) => [...prev, { movieId }])
    setMandarPhase('ficha')
    setShareSelected([])
    setShareNote('')
    setSending(false)
  }, [])

  const onReset = useCallback(() => {
    if (thinkTimer.current) window.clearTimeout(thinkTimer.current)
    if (insertTimer.current) window.clearTimeout(insertTimer.current)
    if (sendTimer.current) window.clearTimeout(sendTimer.current)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    setDemo(initialDemo)
    setPhase('idle')
    setQuery('')
    setSelectedPerson(people.lupe)
    setRail(recommendedRail)
    setNewCardId(null)
    setScrollToRecommended(0)
    setResetToken((n) => n + 1)
    setMandarPhase('idle')
    setFichaStack([])
    setShareSelected([])
    setShareNote('')
    setSentByMovie({})
    setSending(false)
    setToast(null)
  }, [])

  const alreadySent =
    mandarTarget && sentByMovie[mandarTarget.movieId]
      ? sentByMovie[mandarTarget.movieId]
      : []

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
            onOpenFicha={openFicha}
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
          <MandarFlow
            phase={mandarPhase}
            target={mandarTarget}
            selected={shareSelected}
            alreadySent={alreadySent}
            note={shareNote}
            sending={sending}
            toast={toast}
            onNoteChange={setShareNote}
            onTogglePerson={toggleSharePerson}
            onBack={backFicha}
            onClose={closeFicha}
            onOpenShare={openShare}
            onCloseShare={closeShare}
            onSend={sendShare}
            onWhatsApp={sendWhatsApp}
            onCopyLink={copyLink}
            onOpenMovie={openMovieFromFicha}
          />
        </div>
      </LayoutGroup>
      <span hidden data-demo-movie={demo.movie?.id ?? ''} />
    </PhoneFrame>
  )
}

export default App
