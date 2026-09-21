import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion'
import { useMemo, useState } from 'react'
import { Avatar } from './Avatar'
import { Icon } from './Icon'
import { PosterCard } from './PosterCard'
import { StatusBar } from './StatusBar'
import {
  getMovie,
  getSimilarForMovie,
  isRichFicha,
  shareCircle,
  type FichaTarget,
  type MandarPhase,
  type Person,
} from '../data/demo'
import type { MovieRecord } from '../data/movies'
import './MandarFlow.css'

export type ToastState = {
  id: number
  message: string
  variant?: 'success' | 'whatsapp'
} | null

type MandarFlowProps = {
  phase: MandarPhase
  target: FichaTarget | null
  selected: Person[]
  alreadySent: Person[]
  note: string
  sending: boolean
  toast: ToastState
  onNoteChange: (value: string) => void
  onTogglePerson: (person: Person) => void
  onBack: () => void
  onClose: () => void
  onOpenShare: () => void
  onCloseShare: () => void
  onSend: () => void
  onWhatsApp: () => void
  onCopyLink: () => void
  onOpenMovie: (movieId: string) => void
}

function sendLabel(selected: Person[]) {
  if (selected.length === 0) return 'Mandar'
  if (selected.length === 1) return `Mandar a ${selected[0].name}`
  if (selected.length === 2)
    return `Mandar a ${selected[0].name} y ${selected[1].name}`
  return `Mandar a ${selected[0].name} y ${selected.length - 1} más`
}

function sentLine(peopleList: Person[]) {
  if (peopleList.length === 0) return null
  if (peopleList.length === 1) {
    return (
      <>
        Se la recomendaste a <strong>{peopleList[0].name}</strong>
        {' · ahora'}
      </>
    )
  }
  if (peopleList.length === 2) {
    return (
      <>
        Se la recomendaste a <strong>{peopleList[0].name}</strong> y{' '}
        <strong>{peopleList[1].name}</strong>
        {' · ahora'}
      </>
    )
  }
  return (
    <>
      Se la recomendaste a <strong>{peopleList[0].name}</strong> y{' '}
      {peopleList.length - 1} más
      {' · ahora'}
    </>
  )
}

function MetaRow({ movie }: { movie: MovieRecord }) {
  const rest: string[] = []
  if (movie.genre) rest.push(movie.genre)
  if (movie.duration) rest.push(movie.duration)
  if (movie.year != null) rest.push(String(movie.year))

  if (!movie.rating && rest.length === 0) return null

  return (
    <p className="ui mandar-meta">
      {movie.rating && <span className="mandar-rating">{movie.rating}</span>}
      {rest.map((part, i) => (
        <span key={`${part}-${i}`}>
          {(movie.rating || i > 0) && (
            <span className="mandar-meta__sep"> · </span>
          )}
          {part}
        </span>
      ))}
    </p>
  )
}

export function MandarFlow({
  phase,
  target,
  selected,
  alreadySent,
  note,
  sending,
  toast,
  onNoteChange,
  onTogglePerson,
  onBack,
  onClose,
  onOpenShare,
  onCloseShare,
  onSend,
  onWhatsApp,
  onCopyLink,
  onOpenMovie,
}: MandarFlowProps) {
  const reduce = useReducedMotion()
  const [tab, setTab] = useState<'similares' | 'detalles'>('similares')
  const shareOpen = phase === 'share'
  const movie = target ? getMovie(target.movieId) : null
  const recommender = target?.provenance?.person ?? null
  const showSello = Boolean(recommender)
  const rich = movie ? isRichFicha(movie) : false
  const alreadyIds = useMemo(
    () => new Set(alreadySent.map((p) => p.id)),
    [alreadySent],
  )
  const canSend = selected.length >= 1
  const heroSrc = movie?.trailer ?? movie?.poster ?? ''
  const hasTrailer = Boolean(movie?.trailer)
  const similar = useMemo(() => {
    if (!movie) return [] as { id: string; badge?: string; record: MovieRecord }[]
    return getSimilarForMovie(movie)
      .map((entry) => ({ ...entry, record: getMovie(entry.id) }))
      .filter((entry) => Boolean(entry.record.poster))
  }, [movie])

  const movieId = target?.movieId ?? ''
  const [tabForMovie, setTabForMovie] = useState(movieId)
  if (movieId !== tabForMovie) {
    setTabForMovie(movieId)
    setTab('similares')
  }

  const sheetMeta = movie
    ? [
        movie.rating,
        movie.genre,
        movie.duration,
        movie.year != null ? String(movie.year) : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : ''

  const spring = reduce
    ? { duration: 0.2 }
    : { type: 'spring' as const, stiffness: 380, damping: 32 }

  const slide = reduce
    ? { duration: 0.2 }
    : { duration: 0.25, ease: 'easeOut' as const }

  return (
    <>
      <AnimatePresence>
        {phase !== 'idle' && target && movie && (
          <motion.div
            key={`mandar-ficha-${target.movieId}`}
            className="mandar"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
            transition={slide}
          >
            <div className="mandar-ficha">
              <StatusBar />
              <div className="mandar-ficha__body">
                <div className="mandar-player">
                  <img
                    className="mandar-player__poster"
                    src={heroSrc}
                    alt={movie.title ?? ''}
                    draggable={false}
                  />
                  {!hasTrailer && (
                    <span className="mandar-player__scrim" aria-hidden />
                  )}
                  <button
                    type="button"
                    className="mandar-player__back"
                    aria-label="Volver"
                    onClick={onBack}
                  >
                    <Icon name="chevron-left" size={20} />
                  </button>
                  <button
                    type="button"
                    className="mandar-player__close"
                    aria-label="Cerrar"
                    onClick={onClose}
                  >
                    <Icon name="close" size={20} />
                  </button>
                  <span className="mandar-player__play" aria-hidden>
                    <Icon name="play" size={48} />
                  </span>
                  <button
                    type="button"
                    className="mandar-player__comment"
                    aria-label="Comentarios"
                  >
                    <Icon name="comment" size={16} />
                  </button>
                  <div className="mandar-player__progress" aria-hidden>
                    <span className="mandar-player__progress-fill">
                      <span className="mandar-player__progress-thumb" />
                    </span>
                  </div>
                </div>

                {showSello && recommender && (
                  <section className="mandar-sello">
                    <div className="mandar-sello__head">
                      <Avatar
                        size={32}
                        initials={recommender.initials}
                        color={recommender.color}
                        src={recommender.photo}
                      />
                      <p className="mandar-sello__line">
                        <span className="ui mandar-sello__label">
                          Te la recomendó
                        </span>
                        <span className="mandar-sello__name">
                          {recommender.name}
                        </span>
                        <span className="meta mandar-sello__when">
                          · {movie.selloWhen ?? 'hoy'}
                        </span>
                      </p>
                    </div>
                    {movie.selloNote && (
                      <p className="persona mandar-sello__note">
                        “{movie.selloNote}”
                      </p>
                    )}
                  </section>
                )}

                <section className="mandar-title-row">
                  <div className="mandar-title-row__text">
                    {movie.title && (
                      <h1 className="section mandar-title">{movie.title}</h1>
                    )}
                    <MetaRow movie={movie} />
                  </div>
                  <button
                    type="button"
                    className="mandar-share-btn"
                    aria-label="Compartir"
                    onClick={onOpenShare}
                  >
                    <Icon name="share" size={24} />
                  </button>
                </section>

                <button type="button" className="mandar-cta label">
                  Ver gratis
                </button>

                {movie.synopsis && (
                  <p className="ui mandar-synopsis">{movie.synopsis}</p>
                )}

                {alreadySent.length > 0 && (
                  <div className="mandar-sent-line">
                    <div className="mandar-sent-line__avatars">
                      {alreadySent.map((person, index) => (
                        <motion.span
                          key={person.id}
                          className="mandar-sent-line__avatar"
                          initial={
                            reduce
                              ? { opacity: 0 }
                              : { opacity: 0, scale: 0.85 }
                          }
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: reduce ? 0 : index * 0.06,
                            duration: 0.25,
                          }}
                        >
                          <Avatar
                            size={22}
                            initials={person.initials}
                            color={person.color}
                            src={person.photo}
                          />
                        </motion.span>
                      ))}
                    </div>
                    <p className="meta mandar-sent-line__text">
                      {sentLine(alreadySent)}
                    </p>
                  </div>
                )}

                {(similar.length > 0 || !rich) && (
                  <>
                    <div className="mandar-tabs" role="tablist">
                      <button
                        type="button"
                        className={`mandar-tab ui${
                          tab === 'similares' ? ' is-active' : ''
                        }`}
                        role="tab"
                        aria-selected={tab === 'similares'}
                        onClick={() => setTab('similares')}
                      >
                        Títulos similares
                      </button>
                      <button
                        type="button"
                        className={`mandar-tab ui${
                          tab === 'detalles' ? ' is-active' : ''
                        }`}
                        role="tab"
                        aria-selected={tab === 'detalles'}
                        onClick={() => setTab('detalles')}
                      >
                        Detalles
                      </button>
                    </div>

                    {tab === 'similares' && similar.length > 0 && (
                      <div className="mandar-grid">
                        {similar.map((entry) => (
                          <PosterCard
                            key={entry.id}
                            size="small"
                            src={entry.record.poster}
                            alt={entry.record.title ?? ''}
                            badge={entry.badge}
                            className="mandar-grid__poster"
                            onClick={() => onOpenMovie(entry.id)}
                          />
                        ))}
                      </div>
                    )}

                    {tab === 'detalles' && (
                      <div className="mandar-detalles">
                        {movie.title && (
                          <h2 className="section mandar-detalles__title">
                            {movie.title}
                          </h2>
                        )}
                        <MetaRow movie={movie} />
                        {movie.synopsis && (
                          <p className="ui mandar-synopsis mandar-detalles__synopsis">
                            {movie.synopsis}
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <AnimatePresence>
              {shareOpen && (
                <motion.button
                  type="button"
                  key="mandar-scrim"
                  className="mandar-scrim"
                  aria-label="Cerrar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0.15 : 0.2 }}
                  onClick={sending ? undefined : onCloseShare}
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {shareOpen && (
                <motion.div
                  key="mandar-sheet"
                  className="mandar-sheet"
                  role="dialog"
                  aria-modal
                  aria-label="Compartir"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                  transition={spring}
                >
                  <span className="mandar-sheet__handle" aria-hidden />
                  <h2 className="label mandar-sheet__title">
                    Pásasela a alguien
                  </h2>

                  <div className="mandar-sheet__movie">
                    <img
                      className="mandar-sheet__thumb"
                      src={movie.poster}
                      alt=""
                      draggable={false}
                    />
                    <div>
                      {movie.title && (
                        <p className="label mandar-sheet__movie-title">
                          {movie.title}
                        </p>
                      )}
                      {sheetMeta && <p className="meta">{sheetMeta}</p>}
                    </div>
                  </div>

                  <div className="mandar-people">
                    {shareCircle.map((person) => {
                      const sent = alreadyIds.has(person.id)
                      const isOn = selected.some((p) => p.id === person.id)
                      return (
                        <button
                          key={person.id}
                          type="button"
                          className={`mandar-person${isOn ? ' is-selected' : ''}${
                            sent ? ' is-sent' : ''
                          }`}
                          disabled={sent || sending}
                          onClick={() => onTogglePerson(person)}
                        >
                          <span
                            className={`mandar-avatar-wrap${
                              isOn ? ' is-selected' : ''
                            }`}
                          >
                            <span className="mandar-avatar-ring" aria-hidden />
                            <Avatar
                              size={48}
                              initials={person.initials}
                              color={person.color}
                              src={person.photo}
                            />
                            {sent && (
                              <span className="mandar-avatar-check" aria-hidden>
                                <Icon name="check" size={10} />
                              </span>
                            )}
                          </span>
                          <span
                            className={
                              sent ? 'meta mandar-person__sent-label' : 'caption'
                            }
                          >
                            {sent ? 'Enviada' : person.name}
                          </span>
                        </button>
                      )
                    })}
                    <button
                      type="button"
                      className="mandar-person"
                      aria-label="Otro"
                      disabled={sending}
                    >
                      <span className="mandar-avatar-wrap">
                        <span className="mandar-avatar-ring" aria-hidden />
                        <span className="mandar-person__otro" aria-hidden>
                          +
                        </span>
                      </span>
                      <span className="caption">Otro</span>
                    </button>
                  </div>

                  <textarea
                    className="mandar-note persona"
                    placeholder="¿Por qué crees que le va a gustar?"
                    value={note}
                    rows={3}
                    disabled={sending}
                    onChange={(e) => onNoteChange(e.target.value)}
                  />

                  <div className="mandar-sheet__extras">
                    <button
                      type="button"
                      className="mandar-extra"
                      aria-label="WhatsApp"
                      disabled={sending}
                      onClick={onWhatsApp}
                    >
                      {sending ? (
                        <span className="mandar-spinner" aria-hidden />
                      ) : (
                        <Icon name="whatsapp" size={22} />
                      )}
                    </button>
                    <button
                      type="button"
                      className="mandar-extra"
                      aria-label="Copiar enlace"
                      disabled={sending}
                      onClick={onCopyLink}
                    >
                      <Icon name="url" size={22} />
                    </button>
                    <button
                      type="button"
                      className="mandar-extra"
                      aria-label="Más"
                      disabled={sending}
                      onClick={onCopyLink}
                    >
                      <Icon name="more" size={22} />
                    </button>
                  </div>

                  <button
                    type="button"
                    className={`mandar-sheet__send label${
                      canSend ? ' is-enabled' : ''
                    }`}
                    disabled={!canSend || sending}
                    onClick={onSend}
                  >
                    {sending ? (
                      <span className="mandar-spinner" aria-hidden />
                    ) : (
                      sendLabel(selected)
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className="mandar-toast"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <span
              className={
                toast.variant === 'whatsapp'
                  ? 'mandar-toast__wa'
                  : 'mandar-toast__check'
              }
              aria-hidden
            >
              <Icon
                name={toast.variant === 'whatsapp' ? 'whatsapp' : 'check'}
                size={toast.variant === 'whatsapp' ? 16 : 12}
              />
            </span>
            <span className="ui mandar-toast__text">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
