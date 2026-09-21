import { useCallback, useEffect, useRef } from 'react'
import type { RefObject } from 'react'

const COPIES = 3

function measureSetWidth(el: HTMLElement): number {
  const kids = Array.from(el.children) as HTMLElement[]
  if (kids.length < COPIES) return 0
  const perSet = kids.length / COPIES
  if (!Number.isInteger(perSet) || perSet < 1) return 0
  return kids[perSet].offsetLeft - kids[0].offsetLeft
}

function withSnapDisabled(el: HTMLElement, fn: () => void) {
  const prev = el.style.scrollSnapType
  el.style.scrollSnapType = 'none'
  fn()
  void el.scrollLeft
  el.style.scrollSnapType = prev
}

type InfiniteRailOptions = {
  /** Index within one set to land on initially (default 0). */
  startIndex?: number
  /** How to align that item in the viewport. */
  align?: 'start' | 'center'
  /** Re-run setup when these change (e.g. rail length). */
  deps?: unknown[]
}

/**
 * Seamless horizontal loop: render 3 copies of items, start in the middle,
 * and teleport by exactly one set width at the edges (invisible jump).
 */
export function useInfiniteRail(
  ref: RefObject<HTMLElement | null>,
  options: InfiniteRailOptions = {},
) {
  const { startIndex = 0, align = 'start', deps = [] } = options
  const setWidthRef = useRef(0)
  const jumpingRef = useRef(false)
  const startIndexRef = useRef(startIndex)
  const alignRef = useRef(align)

  useEffect(() => {
    startIndexRef.current = startIndex
    alignRef.current = align
  }, [startIndex, align])

  const scrollToItem = useCallback(
    (indexInSet: number) => {
      const el = ref.current
      if (!el) return
      const all = Array.from(el.children) as HTMLElement[]
      const perSet = all.length / COPIES
      if (!Number.isInteger(perSet) || perSet < 1) return
      const i = perSet + Math.min(Math.max(indexInSet, 0), perSet - 1)
      const target = all[i]
      if (!target) return

      jumpingRef.current = true
      withSnapDisabled(el, () => {
        if (alignRef.current === 'center') {
          el.scrollLeft =
            target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2
        } else {
          const pad = Number.parseFloat(getComputedStyle(el).paddingLeft) || 0
          el.scrollLeft = target.offsetLeft - pad
        }
      })
      requestAnimationFrame(() => {
        jumpingRef.current = false
      })
    },
    [ref],
  )

  const scrollToLoopStart = useCallback(() => {
    const el = ref.current
    if (!el) return
    setWidthRef.current = measureSetWidth(el)
    scrollToItem(0)
  }, [ref, scrollToItem])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      setWidthRef.current = measureSetWidth(el)
      return setWidthRef.current
    }

    const frame = requestAnimationFrame(() => {
      measure()
      scrollToItem(startIndexRef.current)
    })

    const onScroll = () => {
      if (jumpingRef.current) return
      const w = setWidthRef.current || measure()
      if (w <= 0) return
      const left = el.scrollLeft
      if (left < w * 0.5) {
        jumpingRef.current = true
        withSnapDisabled(el, () => {
          el.scrollLeft = left + w
        })
        requestAnimationFrame(() => {
          jumpingRef.current = false
        })
      } else if (left >= w * 1.5) {
        jumpingRef.current = true
        withSnapDisabled(el, () => {
          el.scrollLeft = left - w
        })
        requestAnimationFrame(() => {
          jumpingRef.current = false
        })
      }
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(() => {
      const prev = setWidthRef.current
      const next = measure()
      if (prev > 0 && next > 0 && Math.abs(prev - next) > 1) {
        const rel = el.scrollLeft - prev
        jumpingRef.current = true
        withSnapDisabled(el, () => {
          el.scrollLeft = next + rel
        })
        requestAnimationFrame(() => {
          jumpingRef.current = false
        })
      }
    })
    ro.observe(el)

    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller-supplied deps
  }, [ref, scrollToItem, ...deps])

  return { scrollToLoopStart }
}

/** Triple an array for infinite rails. */
export function loopCopies<T>(
  items: T[],
): { item: T; copy: number; key: string }[] {
  const out: { item: T; copy: number; key: string }[] = []
  for (let copy = 0; copy < COPIES; copy++) {
    items.forEach((item, index) => {
      out.push({ item, copy, key: `${copy}-${index}` })
    })
  }
  return out
}
