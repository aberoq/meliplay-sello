import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from 'framer-motion'
import { useEffect, useId, useRef, useState } from 'react'
import { Avatar } from './Avatar'
import { Icon } from './Icon'
import { Orb } from './Orb'
import { PosterCard } from './PosterCard'
import {
  captureCircle,
  captureResult,
  type CapturePhase,
  type Person,
} from '../data/demo'
import './CaptureFlow.css'

const THINK_PHRASES = [
  'Entendiendo lo que recuerdas…',
  'Buscando en el catálogo…',
  'Revisando que esté disponible…',
] as const

type CaptureFlowProps = {
  phase: CapturePhase
  query: string
  onQueryChange: (value: string) => void
  selectedPerson: Person | null | 'otro'
  onSelectPerson: (person: Person | null | 'otro') => void
  onOpen: () => void
  onClose: () => void
  onSubmit: () => void
  onSave: () => void
}

function ThinkingPhrases({ reduce }: { reduce: boolean | null }) {
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhraseIndex(1), 1400)
    const t2 = window.setTimeout(() => setPhraseIndex(2), 2800)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  const phrase = THINK_PHRASES[phraseIndex]

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={phrase}
        className="label capture-thinking__phrase"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
        transition={{ duration: 0.3 }}
      >
        {phrase}
      </motion.p>
    </AnimatePresence>
  )
}

export function CaptureFlow({
  phase,
  query,
  onQueryChange,
  selectedPerson,
  onSelectPerson,
  onOpen,
  onClose,
  onSubmit,
  onSave,
}: CaptureFlowProps) {
  const reduce = useReducedMotion()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const resultSheetRef = useRef<HTMLDivElement>(null)
  const [sheetPad, setSheetPad] = useState(240)
  const canSearch = query.trim().length >= 3
  const showOverlay = phase !== 'idle' && phase !== 'saved'
  const showFab = phase === 'idle' || phase === 'saved'
  const showSheet = phase === 'open' || phase === 'typing'
  const formId = useId()

  useEffect(() => {
    if (phase === 'open' || phase === 'typing') {
      const t = window.setTimeout(() => inputRef.current?.focus(), 280)
      return () => window.clearTimeout(t)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'result') return
    const el = resultSheetRef.current
    if (!el) return

    const update = () => {
      setSheetPad(el.getBoundingClientRect().height + 24)
    }
    update()

    const ro = new ResizeObserver(() => update())
    ro.observe(el)
    return () => ro.disconnect()
  }, [phase])

  const fade = reduce
    ? { duration: 0.2 }
    : { type: 'spring' as const, stiffness: 380, damping: 32 }

  return (
    <LayoutGroup id="capture-flow">
      {showFab && (
        <motion.button
          type="button"
          className="capture-fab"
          layoutId="capture-shell"
          onClick={onOpen}
          whileTap={reduce ? undefined : { scale: 0.94 }}
          transition={
            reduce
              ? { duration: 0.2 }
              : { type: 'spring', stiffness: 400, damping: 25 }
          }
          aria-label="Me recomendaron"
        >
          <Orb layoutId="orb" size={40} mode="idle" />
          <span className="capture-fab__label ui">Me recomendaron...</span>
        </motion.button>
      )}

      <AnimatePresence>
        {showOverlay && (
          <motion.button
            type="button"
            key="scrim"
            className="capture-scrim"
            aria-label="Cerrar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.2 }}
            onClick={phase === 'result' ? undefined : onClose}
          />
        )}
      </AnimatePresence>

      {showSheet && (
        <motion.div
          className="capture-sheet"
          layoutId="capture-shell"
          transition={fade}
          role="dialog"
          aria-modal
          aria-labelledby={`${formId}-title`}
        >
          <div className="capture-sheet__top">
            <Orb layoutId="orb" size={44} mode="idle" />
            <button
              type="button"
              className="capture-sheet__close"
              aria-label="Cerrar"
              onClick={onClose}
            >
              <Icon name="close" size={18} />
            </button>
          </div>

          <h2 id={`${formId}-title`} className="label capture-sheet__title">
            ¿Qué te recomendaron?
          </h2>
          <p className="ui capture-sheet__subtitle">
            Cuéntame cualquier cosa que recuerdes.
          </p>

          <textarea
            ref={inputRef}
            className="capture-sheet__input persona"
            placeholder="La del mamut y la ardilla..."
            value={query}
            rows={3}
            onChange={(e) => onQueryChange(e.target.value)}
          />

          <div className="capture-sheet__actions">
            <div className="capture-sheet__tools">
              <button
                type="button"
                className="capture-tool"
                aria-label="Cámara"
                onClick={(e) => {
                  const el = e.currentTarget
                  el.animate(
                    [
                      { transform: 'scale(1)' },
                      { transform: 'scale(0.92)' },
                      { transform: 'scale(1)' },
                    ],
                    { duration: 160 },
                  )
                }}
              >
                <Icon name="camera" size={20} />
              </button>
              <button
                type="button"
                className="capture-tool"
                aria-label="Galería"
                onClick={(e) => {
                  const el = e.currentTarget
                  el.animate(
                    [
                      { transform: 'scale(1)' },
                      { transform: 'scale(0.92)' },
                      { transform: 'scale(1)' },
                    ],
                    { duration: 160 },
                  )
                }}
              >
                <Icon name="image" size={20} />
              </button>
            </div>
            <button
              type="button"
              className={`capture-sheet__search label${canSearch ? ' is-enabled' : ''}`}
              disabled={!canSearch}
              onClick={onSubmit}
            >
              Buscar
            </button>
          </div>
        </motion.div>
      )}

      {phase === 'thinking' && (
        <motion.div
          className="capture-thinking"
          layoutId="capture-shell"
          transition={fade}
        >
          <p className="capture-thinking__query meta">{query}</p>
          <div className="capture-thinking__stage">
            <Orb layoutId="orb" size={96} mode="thinking" />
            <ThinkingPhrases reduce={reduce} />
          </div>
        </motion.div>
      )}

      {phase === 'result' && (
        <motion.div
          className="capture-result"
          layoutId="capture-shell"
          initial={reduce ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <header className="capture-result__nav">
            <button
              type="button"
              className="capture-result__back"
              aria-label="Cerrar"
              onClick={onClose}
            >
              <Icon name="chevron-left" size={20} />
            </button>
            <h1 className="label">Capturar</h1>
            <span className="capture-result__nav-spacer" />
          </header>

          <div
            className="capture-result__body"
            style={{ paddingBottom: sheetPad }}
          >
            <div className="capture-result__wrote">
              <div className="capture-result__wrote-head">
                <Orb size={28} mode="idle" />
                <span className="meta">Escribiste</span>
              </div>
              <p className="persona capture-result__quote">
                “{query.trim()}”
              </p>
            </div>

            <section className="capture-result__match">
              <h2 className="label">Creo que es esta</h2>
              <div className="capture-result__card">
                <motion.img
                  className="capture-result__poster"
                  src={captureResult.movie.poster}
                  alt={captureResult.movie.title}
                  initial={
                    reduce
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.96, filter: 'blur(16px)' }
                  }
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{
                    duration: reduce ? 0.2 : 0.45,
                    ease: 'easeOut',
                    delay: reduce ? 0 : 0.25,
                  }}
                />
                <div className="capture-result__info">
                  <motion.h3
                    className="subtitle"
                    style={{ fontWeight: 600 }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.31 }}
                  >
                    {captureResult.movie.title}
                  </motion.h3>
                  <motion.p
                    className="meta capture-result__meta"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.37 }}
                  >
                    <span className="capture-result__rating">A</span>
                    {' · Familia · 1 h 17 · 2024'}
                  </motion.p>
                  <motion.span
                    className="capture-result__badge caption"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.43 }}
                  >
                    {captureResult.badge}
                  </motion.span>
                  <motion.p
                    className="ui capture-result__hits"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.49 }}
                  >
                    Coincide con{' '}
                    <strong>hermanos</strong>, <strong>viaje</strong> y{' '}
                    <strong>Helsinki</strong>
                  </motion.p>
                  <motion.p
                    className="meta capture-result__synopsis"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.55 }}
                  >
                    {captureResult.synopsis}
                  </motion.p>
                </div>
              </div>
            </section>

            <section className="capture-result__alts">
              <h2 className="label">¿O era alguna de estas?</h2>
              <div className="capture-result__alts-track">
                {captureResult.altPosters.map((src) => (
                  <PosterCard key={src} size="small" src={src} alt="" />
                ))}
              </div>
            </section>
          </div>

          <div className="capture-result__sheet" ref={resultSheetRef}>
            <span className="capture-result__sheet-fade" aria-hidden />
            <span className="capture-result__handle" aria-hidden />
            <p className="meta">¿Quién te la recomendó? (opcional)</p>
            <div className="capture-result__people">
              {captureCircle.map((person) => {
                const selected =
                  selectedPerson !== 'otro' &&
                  selectedPerson?.id === person.id
                return (
                  <button
                    key={person.id}
                    type="button"
                    className={`capture-person${selected ? ' is-selected' : ''}`}
                    onClick={() =>
                      onSelectPerson(selected ? null : person)
                    }
                  >
                    <Avatar
                      size={48}
                      initials={person.initials}
                      color={person.color}
                      selected={selected}
                    />
                    <span className="caption">{person.name}</span>
                  </button>
                )
              })}
              <button
                type="button"
                className={`capture-person capture-person--otro${
                  selectedPerson === 'otro' ? ' is-selected' : ''
                }`}
                onClick={() =>
                  onSelectPerson(selectedPerson === 'otro' ? null : 'otro')
                }
              >
                <span className="capture-person__otro-avatar" aria-hidden>
                  +
                </span>
                <span className="caption">Otro</span>
              </button>
            </div>
            <button
              type="button"
              className="capture-result__primary label"
              onClick={onSave}
            >
              Guardar
            </button>
            <button type="button" className="capture-result__secondary label">
              No es esta, buscar otra
            </button>
          </div>
        </motion.div>
      )}
    </LayoutGroup>
  )
}
