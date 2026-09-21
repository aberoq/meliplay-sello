import { useCallback, useRef, useState, type UIEvent } from 'react'

type Options = {
  /** Pixels of accumulated delta before toggling (default 12). */
  threshold?: number
  /** Header height in px — below this scrollY the header stays visible. */
  headerHeight?: number
}

type ScrollDirectionResult = {
  /** `true` when the header should be hidden. */
  hidden: boolean
  /** Attach to the scrollport's `onScroll`. */
  onScroll: (event: UIEvent<HTMLElement>) => void
}

/**
 * Scroll-driven header visibility.
 * Accumulates directional delta; toggles only after `threshold` px.
 * Ignores rubber-band bounce via clamp. Callers hide with transform only.
 */
export function useScrollDirection({
  threshold = 12,
  headerHeight = 0,
}: Options = {}): ScrollDirectionResult {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const accumulated = useRef(0)
  const direction = useRef<'up' | 'down' | null>(null)
  const hiddenRef = useRef(false)
  const rafId = useRef<number | null>(null)

  const onScroll = useCallback(
    (event: UIEvent<HTMLElement>) => {
      const el = event.currentTarget

      if (rafId.current !== null) return
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null

        const max = Math.max(0, el.scrollHeight - el.clientHeight)
        const y = Math.max(0, Math.min(el.scrollTop, max))

        if (y < headerHeight) {
          accumulated.current = 0
          direction.current = null
          lastY.current = y
          if (hiddenRef.current) {
            hiddenRef.current = false
            setHidden(false)
          }
          return
        }

        const delta = y - lastY.current
        lastY.current = y

        if (delta === 0) return

        const nextDir: 'up' | 'down' = delta > 0 ? 'down' : 'up'
        if (direction.current !== nextDir) {
          direction.current = nextDir
          accumulated.current = 0
        }

        accumulated.current += Math.abs(delta)

        if (accumulated.current > threshold) {
          const nextHidden = nextDir === 'down'
          accumulated.current = 0
          if (hiddenRef.current !== nextHidden) {
            hiddenRef.current = nextHidden
            setHidden(nextHidden)
          }
        }
      })
    },
    [threshold, headerHeight],
  )

  return { hidden, onScroll }
}
