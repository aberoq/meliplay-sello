export type MovieRecord = {
  id: string
  title?: string
  poster: string
  heroPoster?: string
  trailer?: string
  year?: number
  rating?: string
  genre?: string
  duration?: string
  synopsis?: string
  selloNote?: string
  selloWhen?: string
  /** Similar titles as movie ids */
  similar?: { id: string; badge?: string }[]
}

const small = (n: number) =>
  `/assets/movie-posters/movie-poster-small_${String(n).padStart(2, '0')}.png`
const med = (n: number) =>
  `/assets/movie-posters/movie-poster-med_${String(n).padStart(2, '0')}.png`

/** Shared placeholder copy so generic fichas match Ice Age layout. */
export const GENERIC_FICHA = {
  rating: 'A',
  genre: 'Familia',
  duration: '1 h 21',
  year: 2002,
  synopsis:
    'Una historia para toda la familia, llena de humor y aventura, que sigue a personajes inolvidables en un viaje que pondrá a prueba su amistad y su coraje.',
} as const

/** Catalog keyed by id. Ice Age / XXL keep real data; others get ficha defaults via getMovie. */
export const movieCatalog: Record<string, MovieRecord> = {
  'ice-age': {
    id: 'ice-age',
    title: 'La era de hielo',
    poster: '/assets/movie-posters/movie-poster-med_03.png',
    heroPoster: '/assets/movie-posters/hero-movie-without-chip.png',
    trailer: '/assets/movie-posters/trailer.png',
    year: 2002,
    rating: 'A',
    genre: 'Familia',
    duration: '1 h 21',
    synopsis:
      'Un solitario mamut lanudo con un trágico pasado se une a un perezoso gracioso y a un tigre dientes de sable calculador en un viaje peligroso para reunir a un niño de un año con su padre cazador.',
    selloNote: 'La vimos mil veces cuando eras chiquito.',
    selloWhen: 'hoy',
    similar: [
      { id: 'impacto-profundo', badge: 'NUEVO' },
      { id: 'transformers', badge: 'ÚLTIMOS DÍAS' },
      { id: 'escuela-de-rock' },
      { id: 'shazam' },
      { id: 'gulliver' },
      { id: 'legado-superior' },
      { id: 'rey-arturo' },
      { id: 'cena-para-tontos' },
      { id: 'superman', badge: 'NUEVO' },
    ],
  },
  xxl: {
    id: 'xxl',
    title: 'XXL',
    poster: '/assets/movie-posters/movie-poster-xxl.png',
    year: 2024,
    rating: 'A',
    genre: 'Familia',
    duration: '1 h 17',
    synopsis: 'Un viaje por las calles de Helsinki, lleno de humor y atmó...',
  },
  interstellar: {
    id: 'interstellar',
    title: 'Interstellar',
    poster: '/assets/movie-posters/movie-poster-med_08.png',
  },
  rookie: {
    id: 'rookie',
    title: 'The Rookie',
    poster: '/assets/movie-posters/hero-movie_03.png',
    heroPoster: '/assets/movie-posters/hero-movie_03.png',
  },
  troy: {
    id: 'troy',
    title: 'Troya',
    poster: '/assets/movie-posters/movie-poster-med_09.png',
  },
  supergirl: {
    id: 'supergirl',
    title: 'Supergirl',
    poster: '/assets/movie-posters/movie-poster-med_07.png',
    heroPoster: '/assets/movie-posters/hero-movie_01.png',
  },
  // Similar titles named in reference/1.2
  'impacto-profundo': {
    id: 'impacto-profundo',
    title: 'Impacto Profundo',
    poster: small(1),
  },
  transformers: {
    id: 'transformers',
    title: 'Transformers',
    poster: small(2),
  },
  'escuela-de-rock': {
    id: 'escuela-de-rock',
    title: 'Escuela de Rock',
    poster: small(3),
  },
  shazam: {
    id: 'shazam',
    title: 'Shazam!',
    poster: small(4),
  },
  gulliver: {
    id: 'gulliver',
    title: 'Los viajes de Gulliver',
    poster: small(5),
  },
  'legado-superior': {
    id: 'legado-superior',
    title: 'El legado superior',
    poster: small(6),
  },
  'rey-arturo': {
    id: 'rey-arturo',
    title: 'Rey Arturo',
    poster: small(7),
  },
  'cena-para-tontos': {
    id: 'cena-para-tontos',
    title: 'Una cena para tontos',
    poster: small(8),
  },
  superman: {
    id: 'superman',
    title: 'Superman',
    poster: small(9),
  },
  // Top 10 / rails — titles mirror matching poster assets
  'top-1': { id: 'top-1', title: 'Impacto Profundo', poster: small(1) },
  'top-2': { id: 'top-2', title: 'Transformers', poster: small(2) },
  'top-3': { id: 'top-3', title: 'Escuela de Rock', poster: small(3) },
  'top-4': { id: 'top-4', title: 'Shazam!', poster: small(4) },
  'top-5': { id: 'top-5', title: 'Los viajes de Gulliver', poster: small(5) },
  'top-6': { id: 'top-6', title: 'El legado superior', poster: small(6) },
  'top-7': { id: 'top-7', title: 'Rey Arturo', poster: small(7) },
  'top-8': { id: 'top-8', title: 'Una cena para tontos', poster: small(8) },
  'top-9': { id: 'top-9', title: 'Superman', poster: small(9) },
  'like-1': { id: 'like-1', title: 'Noche en el museo', poster: med(1) },
  'like-2': { id: 'like-2', title: 'Los increíbles', poster: med(2) },
  'like-3': { id: 'like-3', title: 'La era de hielo', poster: med(3) },
  'like-4': { id: 'like-4', title: 'Kung Fu Panda', poster: med(4) },
  'like-5': { id: 'like-5', title: 'Cómo entrenar a tu dragón', poster: med(5) },
  'like-6': { id: 'like-6', title: 'Up: una aventura de altura', poster: med(6) },
  'like-7': { id: 'like-7', title: 'Supergirl', poster: med(7) },
}

function fallbackTitle(id: string): string {
  return id
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

/** Resolves a movie and fills generic ficha fields (Ice Age / XXL unchanged). */
export function getMovie(id: string): MovieRecord {
  const base = movieCatalog[id] ?? { id, poster: med(1) }
  if (base.id === 'ice-age' || base.id === 'xxl') return base

  return {
    ...base,
    title: base.title ?? fallbackTitle(base.id),
    rating: base.rating ?? GENERIC_FICHA.rating,
    genre: base.genre ?? GENERIC_FICHA.genre,
    duration: base.duration ?? GENERIC_FICHA.duration,
    year: base.year ?? GENERIC_FICHA.year,
    synopsis: base.synopsis ?? GENERIC_FICHA.synopsis,
  }
}

/** Ice Age / XXL keep their own data; generics get a poster grid from assets. */
export function isRichFicha(movie: MovieRecord): boolean {
  return movie.id === 'ice-age' || movie.id === 'xxl'
}

export function getSimilarForMovie(
  movie: MovieRecord,
): { id: string; badge?: string }[] {
  if (movie.similar && movie.similar.length > 0) return movie.similar
  if (isRichFicha(movie)) return []

  const seenPosters = new Set<string>([movie.poster])
  const result: { id: string; badge?: string }[] = []

  for (const candidate of Object.values(movieCatalog)) {
    if (candidate.id === movie.id) continue
    if (seenPosters.has(candidate.poster)) continue
    seenPosters.add(candidate.poster)
    result.push({ id: candidate.id })
    if (result.length >= 9) break
  }

  return result
}

export function movieMetaParts(movie: MovieRecord): string[] {
  const parts: string[] = []
  if (movie.rating) parts.push(movie.rating)
  if (movie.genre) parts.push(movie.genre)
  if (movie.duration) parts.push(movie.duration)
  if (movie.year != null) parts.push(String(movie.year))
  return parts
}

export const top10Movies: MovieRecord[] = [
  movieCatalog['top-1'],
  movieCatalog['top-2'],
  movieCatalog['top-3'],
  movieCatalog['top-4'],
  movieCatalog['top-5'],
  movieCatalog['top-6'],
  movieCatalog['top-7'],
  movieCatalog['top-8'],
  movieCatalog['top-9'],
]

export const couldLikeMovies: MovieRecord[] = [
  movieCatalog['like-1'],
  movieCatalog['like-2'],
  movieCatalog['like-3'],
  movieCatalog['like-4'],
  movieCatalog['like-5'],
  movieCatalog['like-6'],
  movieCatalog['like-7'],
]
