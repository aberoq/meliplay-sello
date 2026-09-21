import type { PersonaColor } from '../data/demo'
import './Avatar.css'

const PERSONA_VAR: Record<PersonaColor, string> = {
  terracota: 'var(--persona-terracota)',
  oliva: 'var(--persona-oliva)',
  azul: 'var(--persona-azul)',
  ocre: 'var(--persona-ocre)',
}

type AvatarSize = 22 | 32 | 44 | 48

type AvatarProps = {
  initials?: string
  color?: PersonaColor
  src?: string
  size?: AvatarSize
  selected?: boolean
  className?: string
}

export function Avatar({
  initials = '',
  color = 'terracota',
  src,
  size = 32,
  selected = false,
  className = '',
}: AvatarProps) {
  const classes = [
    'avatar',
    selected ? 'avatar--selected' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span
      className={classes}
      style={{
        width: size,
        height: size,
        fontSize: size <= 22 ? 9 : size <= 32 ? 12 : 16,
        background: src ? undefined : PERSONA_VAR[color],
      }}
      aria-hidden={src ? undefined : true}
    >
      {src ? <img src={src} alt="" /> : initials}
    </span>
  )
}
