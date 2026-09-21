import {
  couldLikeMovies,
  getMovie,
  getSimilarForMovie,
  isRichFicha,
  movieCatalog,
  movieMetaParts,
  top10Movies,
} from './movies'

export type PersonaColor = 'terracota' | 'oliva' | 'azul' | 'ocre'

export type AttachmentKind = 'none' | 'comment' | 'voice'

export type Person = {
  id: string
  name: string
  initials: string
  color: PersonaColor
  photo?: string
}

/** Kept for CaptureFlow compatibility */
export type Movie = {
  id: string
  title: string
  poster: string
  heroPoster?: string
}

export type Provenance = {
  person: Person
  attachment: AttachmentKind
}

export type DemoState = {
  movie: Movie | null
  recommendedBy: Person | null
  sentTo: Person | null
  attachment: AttachmentKind
}

export const people: Record<string, Person> = {
  lupe: {
    id: 'lupe',
    name: 'Lupe',
    initials: 'LP',
    color: 'terracota',
  },
  mario: {
    id: 'mario',
    name: 'Mario',
    initials: 'MR',
    color: 'ocre',
  },
  rob: {
    id: 'rob',
    name: 'Rob',
    initials: 'RG',
    color: 'oliva',
  },
  ana: {
    id: 'ana',
    name: 'Ana',
    initials: 'AN',
    color: 'azul',
  },
  oscar: {
    id: 'oscar',
    name: 'Oscar',
    initials: 'OJ',
    color: 'azul',
  },
}

export const captureCircle: Person[] = [
  people.lupe,
  people.mario,
  people.rob,
  people.ana,
  people.oscar,
]

export const movies: Record<string, Movie> = {
  iceAge: {
    id: 'ice-age',
    title: movieCatalog['ice-age'].title ?? 'La Era de Hielo',
    poster: movieCatalog['ice-age'].poster,
    heroPoster: movieCatalog['ice-age'].heroPoster,
  },
  rookie: {
    id: 'rookie',
    title: movieCatalog.rookie.title ?? 'The Rookie',
    poster: movieCatalog.rookie.poster,
    heroPoster: movieCatalog.rookie.heroPoster,
  },
  supergirl: {
    id: 'supergirl',
    title: movieCatalog.supergirl.title ?? 'Supergirl',
    poster: movieCatalog.supergirl.poster,
    heroPoster: movieCatalog.supergirl.heroPoster,
  },
  interstellar: {
    id: 'interstellar',
    title: movieCatalog.interstellar.title ?? 'Interstellar',
    poster: movieCatalog.interstellar.poster,
  },
  troy: {
    id: 'troy',
    title: movieCatalog.troy.title ?? 'Troya',
    poster: movieCatalog.troy.poster,
  },
  xxl: {
    id: 'xxl',
    title: movieCatalog.xxl.title ?? 'XXL',
    poster: movieCatalog.xxl.poster,
  },
}

export const heroCarousel: Movie[] = [
  movies.rookie,
  movies.iceAge,
  movies.supergirl,
]

export type RailItem = {
  movie: Movie
  provenance?: Provenance
  badge?: string
  progress?: number
}

export const recommendedRail: RailItem[] = [
  {
    movie: movies.iceAge,
    provenance: { person: people.lupe, attachment: 'comment' },
  },
  {
    movie: movies.interstellar,
    provenance: { person: people.mario, attachment: 'comment' },
    progress: 0.38,
  },
  {
    movie: movies.rookie,
    provenance: { person: people.ana, attachment: 'comment' },
    badge: 'ÚLTIMOS DÍAS',
  },
  {
    movie: movies.troy,
    provenance: { person: people.oscar, attachment: 'comment' },
    badge: 'NUEVA',
  },
]

export type MandarPhase = 'idle' | 'ficha' | 'share'

export type FichaTarget = {
  movieId: string
  provenance?: Provenance
}

export const shareCircle: Person[] = [
  people.lupe,
  people.mario,
  people.rob,
  people.ana,
  people.oscar,
]

export {
  couldLikeMovies,
  getMovie,
  getSimilarForMovie,
  isRichFicha,
  movieCatalog,
  movieMetaParts,
  top10Movies,
}

export const top10Posters: string[] = top10Movies.map((m) => m.poster)

export const couldLikePosters: string[] = couldLikeMovies.map((m) => m.poster)

export const captureResult = {
  movie: movies.xxl,
  meta: 'A · Familia · 1 h 17 · 2024',
  badge: 'Gratis en Mercado Play',
  querySample: 'La de dos hermanos que van de viaje a Helsinki.',
  matchLine: {
    before: 'Coincide con ',
    words: ['hermanos', 'viaje', 'Helsinki'] as const,
  },
  synopsis: getMovie('xxl').synopsis ?? '',
  altPosters: [
    '/assets/movie-posters/movie-poster-med_06.png',
    '/assets/movie-posters/movie-poster-med_05.png',
    '/assets/movie-posters/movie-poster-med_01.png',
  ],
}

export type CapturePhase =
  | 'idle'
  | 'open'
  | 'typing'
  | 'thinking'
  | 'result'
  | 'saved'

export const initialDemo: DemoState = {
  movie: movies.iceAge,
  recommendedBy: people.lupe,
  sentTo: null,
  attachment: 'comment',
}
