import { Avatar } from './Avatar'
import { Icon } from './Icon'
import type { AttachmentKind, Person } from '../data/demo'
import './ProvenanceChip.css'

type ProvenanceChipProps = {
  person: Person
  attachment?: AttachmentKind
  className?: string
}

export function ProvenanceChip({
  person,
  attachment = 'none',
  className = '',
}: ProvenanceChipProps) {
  return (
    <span className={`provenance-chip ${className}`.trim()}>
      <Avatar
        size={22}
        initials={person.initials}
        color={person.color}
        src={person.photo}
      />
      <span className="provenance-chip__label meta">De {person.name}</span>
      {attachment === 'comment' && (
        <Icon name="comment" size={14} className="provenance-chip__glyph" />
      )}
      {attachment === 'voice' && (
        <Icon name="mic" size={14} className="provenance-chip__glyph" />
      )}
    </span>
  )
}
