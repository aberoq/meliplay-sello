import { HomeHeader } from '../components/HomeHeader'
import { PosterCard } from '../components/PosterCard'
import { StatusBar } from '../components/StatusBar'
import { heroCarousel, recommendedRail } from '../data/demo'
import './HomeScreen.css'

export function HomeScreen() {
  return (
    <div className="home-screen">
      <StatusBar />
      <HomeHeader />

      <div className="home-screen__body">
        <section className="home-hero" aria-label="Destacados">
          <div className="home-hero__track">
            {heroCarousel.map((movie, index) => (
              <PosterCard
                key={movie.id}
                size="hero"
                src={movie.heroPoster ?? movie.poster}
                alt={movie.title}
                className={
                  index === 1 ? 'home-hero__card is-center' : 'home-hero__card'
                }
              />
            ))}
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
      </div>

      <button type="button" className="home-fab" aria-label="Me recomendaron">
        <span className="home-fab__orb" aria-hidden />
        <span className="home-fab__label ui">Me recomendaron...</span>
      </button>
    </div>
  )
}
