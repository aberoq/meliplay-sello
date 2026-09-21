import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ProvenanceChip } from './ProvenanceChip'
import type { AttachmentKind, Person } from '../data/demo'
import './PosterCard.css'

type PosterCardProps = {
  src: string
  alt?: string
  size?: 'hero' | 'med' | 'small'
  provenance?: {
    person: Person
    attachment?: AttachmentKind
  }
  badge?: string
  progress?: number
  className?: string
  onClick?: () => void
  style?: CSSProperties
  children?: ReactNode
  layoutId?: string
}

export function PosterCard({
  src,
  alt = '',
  size = 'med',
  provenance,
  badge,
  progress,
  className = '',
  onClick,
  style,
  layoutId,
}: PosterCardProps) {
  const classes = ['poster-card', `poster-card--${size}`, className]
    .filter(Boolean)
    .join(' ')

  const img = layoutId ? (
    <motion.img
      className="poster-card__img"
      layoutId={layoutId}
      src={src}
      alt={alt}
      draggable={false}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
    />
  ) : (
    <img className="poster-card__img" src={src} alt={alt} draggable={false} />
  )

  const content = (
    <>
      {img}

      {badge && <span className="poster-card__badge caption">{badge}</span>}

      {provenance && (
        <span className="poster-card__chip">
          <ProvenanceChip
            person={provenance.person}
            attachment={provenance.attachment}
          />
        </span>
      )}

      {typeof progress === 'number' && (
        <span className="poster-card__progress" aria-hidden>
          <span
            className="poster-card__progress-fill"
            style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
          />
        </span>
      )}
    </>
  )

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick} style={style}>
        {content}
      </button>
    )
  }

  return (
    <div className={classes} style={style}>
      {content}
    </div>
  )
}
