import { HomeHeader } from '../components/HomeHeader'
import { PosterCard } from '../components/PosterCard'
import { StatusBar } from '../components/StatusBar'
import {
  couldLikePosters,
  heroCarousel,
  people,
  recommendedRail,
  top10Posters,
} from '../data/demo'
import { useScrollDirection } from '../hooks/useScrollDirection'
import './HomeScreen.css'

/** Near-top threshold before chips can hide (status + logo). */
const HOME_NAV_SHOW_HEIGHT = 96

export function HomeScreen() {
  const { hidden: chipsHidden, onScroll } = useScrollDirection({
    threshold: 12,
    headerHeight: HOME_NAV_SHOW_HEIGHT,
  })

  return (
    <div className="home-screen">
      <div
        className={`home-screen__chrome${chipsHidden ? ' is-chips-hidden' : ''}`}
      >
        <StatusBar />
        <HomeHeader chipsHidden={chipsHidden} />
      </div>

      <div className="home-screen__body" onScroll={onScroll}>
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

        <section className="home-rail" aria-label="Te recomendaron">
          <h2 className="section home-rail__title">Te recomendaron</h2>
          <div className="home-rail__track">
            {recommendedRail.map((item) => (
              <PosterCard
                key={item.movie.id}
                size="med"
                src={item.movie.poster}
                alt={item.movie.title}
                badge={item.badge}
                progress={item.progress}
                provenance={item.provenance}
              />
            ))}
          </div>
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

      <button type="button" className="home-fab" aria-label="Me recomendaron">
        <span className="home-fab__orb" aria-hidden />
        <span className="home-fab__label ui">Me recomendaron...</span>
      </button>
    </div>
  )
}
