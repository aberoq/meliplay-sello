import { LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { HomeHeader } from '../components/HomeHeader'
import { PosterCard } from '../components/PosterCard'
import { ProvenanceChip } from '../components/ProvenanceChip'
import { StatusBar } from '../components/StatusBar'
import {
  couldLikePosters,
  heroCarousel,
  people,
  top10Posters,
  type RailItem,
} from '../data/demo'
import { useScrollDirection } from '../hooks/useScrollDirection'
import './HomeScreen.css'

const HOME_NAV_SHOW_HEIGHT = 96

type HomeScreenProps = {
  recommended: RailItem[]
  newCardId: string | null
  scrollToken: number
  onNewCardSettled?: () => void
}

export function HomeScreen({
  recommended,
  newCardId,
  scrollToken,
  onNewCardSettled,
}: HomeScreenProps) {
  const reduce = useReducedMotion()
  const bodyRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLElement>(null)
  const { hidden: chipsHidden, onScroll } = useScrollDirection({
    threshold: 12,
    headerHeight: HOME_NAV_SHOW_HEIGHT,
  })

  useEffect(() => {
    if (!scrollToken || !bodyRef.current || !railRef.current) return
    const body = bodyRef.current
    const top = railRef.current.offsetTop - 12
    body.scrollTo({
      top,
      behavior: reduce ? 'auto' : 'smooth',
    })
  }, [scrollToken, reduce])

  return (
    <div className="home-screen">
      <div
        className={`home-screen__chrome${chipsHidden ? ' is-chips-hidden' : ''}`}
      >
        <StatusBar />
        <HomeHeader chipsHidden={chipsHidden} />
      </div>

      <div
        className="home-screen__body"
        ref={bodyRef}
        onScroll={onScroll}
      >
        <section className="home-hero" aria-label="Destacados">
          <div className="home-hero__track">
            {heroCarousel.map((movie, index) => {
              const isCenter = index === 1
              return (
                <PosterCard
                  key={movie.id}
                  size="hero"
                  src={movie.heroPoster ?? movie.poster}
                  alt={movie.title}
                  className={
                    isCenter ? 'home-hero__card is-center' : 'home-hero__card'
                  }
                  provenance={
                    isCenter
                      ? { person: people.lupe, attachment: 'comment' }
                      : undefined
                  }
                />
              )
            })}
          </div>
        </section>

        <section
          className="home-rail"
          aria-label="Te recomendaron"
          ref={railRef}
        >
          <h2 className="section home-rail__title">Te recomendaron</h2>
          <LayoutGroup>
            <div className="home-rail__track">
              {recommended.map((item) => {
                const isNew = item.movie.id === newCardId
                return (
                  <motion.div
                    key={item.movie.id}
                    layout={!reduce}
                    className="home-rail__item"
                    initial={
                      isNew
                        ? reduce
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.9 }
                        : false
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: reduce ? 0.2 : 0.35 }}
                    onAnimationComplete={() => {
                      if (isNew) onNewCardSettled?.()
                    }}
                  >
                    <PosterCard
                      size="med"
                      src={item.movie.poster}
                      alt={item.movie.title}
                      badge={item.badge}
                      progress={item.progress}
                    />
                    {item.provenance && (
                      <motion.span
                        className="home-rail__chip"
                        initial={
                          isNew
                            ? reduce
                              ? { opacity: 0 }
                              : { opacity: 0, y: 6 }
                            : false
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: isNew && !reduce ? 0.2 : 0,
                          duration: 0.25,
                        }}
                      >
                        <ProvenanceChip
                          person={item.provenance.person}
                          attachment={item.provenance.attachment}
                        />
                      </motion.span>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </LayoutGroup>
        </section>

        <section className="home-rail" aria-label="Top 10 en México">
          <h2 className="section home-rail__title">Top 10 en México</h2>
          <div className="home-rail__track home-rail__track--top10">
            {top10Posters.map((src, index) => {
              const rank = index + 1
              return (
                <div
                  className="top10-item"
                  key={src}
                  aria-label={`Puesto ${rank}`}
                >
                  <img
                    className="top10-item__rank"
                    src={`/assets/top-number/${rank}.png`}
                    alt=""
                    aria-hidden
                    draggable={false}
                  />
                  <PosterCard
                    size="small"
                    src={src}
                    alt=""
                    className="top10-item__poster"
                  />
                </div>
              )
            })}
          </div>
        </section>

        <section className="home-rail" aria-label="Podrían gustarte">
          <h2 className="section home-rail__title">Podrían gustarte</h2>
          <div className="home-rail__track">
            {couldLikePosters.map((src) => (
              <PosterCard key={src} size="med" src={src} alt="" />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
