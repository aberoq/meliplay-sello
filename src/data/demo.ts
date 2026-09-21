export type PersonaColor = 'terracota' | 'oliva' | 'azul' | 'ocre'

export type AttachmentKind = 'none' | 'comment' | 'voice'

export type Person = {
  id: string
  name: string
  initials: string
  color: PersonaColor
  photo?: string
}

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
}

export const movies: Record<string, Movie> = {
  iceAge: {
    id: 'ice-age',
    title: 'La Era de Hielo',
    poster: '/assets/movie-posters/movie-poster-med_03.png',
    heroPoster: '/assets/movie-posters/hero-movie-without-chip.png',
  },
  rookie: {
    id: 'rookie',
    title: 'The Rookie',
    poster: '/assets/movie-posters/hero-movie_03.png',
    heroPoster: '/assets/movie-posters/hero-movie_03.png',
  },
  supergirl: {
    id: 'supergirl',
    title: 'Supergirl',
    poster: '/assets/movie-posters/movie-poster-med_07.png',
    heroPoster: '/assets/movie-posters/hero-movie_01.png',
  },
  interstellar: {
    id: 'interstellar',
    title: 'Interstellar',
    poster: '/assets/movie-posters/movie-poster-med_08.png',
  },
  troy: {
    id: 'troy',
    title: 'Troya',
    poster: '/assets/movie-posters/movie-poster-med_09.png',
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
    movie: movies.interstellar,
    provenance: { person: people.lupe, attachment: 'comment' },
    progress: 0.38,
  },
  {
    movie: movies.rookie,
    provenance: { person: people.lupe, attachment: 'comment' },
    badge: 'ÚLTIMOS DÍAS',
  },
  {
    movie: movies.troy,
    provenance: { person: people.lupe, attachment: 'comment' },
    badge: 'NUEVA',
  },
]

export const top10Posters: string[] = Array.from(
  { length: 9 },
  (_, i) =>
    `/assets/movie-posters/movie-poster-small_${String(i + 1).padStart(2, '0')}.png`,
)

export const couldLikePosters: string[] = Array.from(
  { length: 7 },
  (_, i) =>
    `/assets/movie-posters/movie-poster-med_${String(i + 1).padStart(2, '0')}.png`,
)

export const initialDemo: DemoState = {
  movie: movies.iceAge,
  recommendedBy: people.lupe,
  sentTo: null,
  attachment: 'comment',
}
