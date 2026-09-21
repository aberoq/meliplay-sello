import { useState } from 'react'
import { Button } from './Button'
import { Icon } from './Icon'
import './HomeHeader.css'

const TABS = ['Inicio', 'Gratis', 'Premium'] as const
const CHIPS = ['Todos', 'Series', 'Películas', 'Infantil'] as const

type HomeHeaderProps = {
  /** Hides the segmented control + category chips. Logo row stays. */
  chipsHidden?: boolean
}

export function HomeHeader({ chipsHidden = false }: HomeHeaderProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Inicio')
  const [chip, setChip] = useState<(typeof CHIPS)[number]>('Todos')

  return (
    <header className={`home-header${chipsHidden ? ' is-chips-hidden' : ''}`}>
      <div className="home-header__nav">
        <Button variant="tertiary" iconOnly aria-label="Atrás">
          <Icon name="chevron-left" size={20} />
        </Button>
        <img
          className="home-header__logo"
          src="/assets/logo/meli-play-logo.svg"
          alt="mercado play"
          width={140}
          height={36}
          draggable={false}
        />
        <Button variant="tertiary" iconOnly aria-label="Ajustes">
          <Icon name="settings" size={20} />
        </Button>
      </div>

      <div className="home-header__sticky" aria-hidden={chipsHidden}>
        <div className="home-header__tabs-row">
          <div
            className="home-header__segment"
            role="tablist"
            aria-label="Secciones"
          >
            {TABS.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={tab === item}
                className={`home-header__tab ui${tab === item ? ' is-active' : ''}`}
                onClick={() => setTab(item)}
                tabIndex={chipsHidden ? -1 : 0}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="home-header__search"
            aria-label="Buscar"
            tabIndex={chipsHidden ? -1 : 0}
          >
            <Icon name="search" size={16} />
          </button>
        </div>

        <div className="home-header__chips">
          {CHIPS.map((item) => (
            <button
              key={item}
              type="button"
              className={`home-header__chip ui${chip === item ? ' is-active' : ''}`}
              onClick={() => setChip(item)}
              tabIndex={chipsHidden ? -1 : 0}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
