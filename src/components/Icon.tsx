type IconName =
  | 'camera'
  | 'chevron-left'
  | 'close'
  | 'comment'
  | 'image'
  | 'mic'
  | 'more'
  | 'play'
  | 'search'
  | 'settings'
  | 'share'
  | 'silence'
  | 'soundwave'
  | 'tv-play'
  | 'url'
  | 'whatsapp'

type IconProps = {
  name: IconName
  size?: number
  alt?: string
  className?: string
}

export function Icon({ name, size = 16, alt = '', className }: IconProps) {
  return (
    <img
      className={className}
      src={`/icons/variant=${name}.svg`}
      width={size}
      height={size}
      alt={alt}
      draggable={false}
    />
  )
}
