import { useState } from 'react'
import { Button } from './Button'
import { Icon } from './Icon'
import './HomeHeader.css'

const TABS = ['Inicio', 'Gratis', 'Premium'] as const
const CHIPS = ['Todos', 'Series', 'Películas', 'Infantil'] as const

export function HomeHeader() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Gratis')
  const [chip, setChip] = useState<(typeof CHIPS)[number]>('Todos')

  return (
    <header className="home-header">
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

      <div className="home-header__tabs-row">
        <div className="home-header__tabs">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              className={`home-header__tab ui${tab === item ? ' is-active' : ''}`}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="home-header__search"
          aria-label="Buscar"
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
          >
            {item}
          </button>
        ))}
      </div>
    </header>
  )
}
