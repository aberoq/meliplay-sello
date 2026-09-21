import { motion, useReducedMotion } from 'framer-motion'
import './Orb.css'

type OrbProps = {
  size?: number
  layoutId?: string
  mode?: 'idle' | 'thinking'
  className?: string
}

/** Layer order (bottom → top): blue, green, yellow. Durations/easing unchanged. */
function blobMotion(size: number) {
  const p = (n: number) => size * n
  return [
    {
      className: 'orb-blob orb-blob--blue',
      color: '#2F80F5',
      duration: 11,
      x: [p(-0.08), p(-0.15), p(-0.04), p(-0.1)],
      y: [p(0.12), p(0.18), p(0.08), p(0.14)],
      scale: [1, 1.1, 0.88, 1.05],
      seam: false,
    },
    {
      className: 'orb-blob orb-blob--green',
      color: '#9AAA1A',
      duration: 9,
      x: [p(0.08), p(0.16), p(0.02), p(0.12)],
      y: [p(-0.02), p(0.1), p(-0.12), p(0.04)],
      scale: [1, 0.9, 1.18, 1],
      seam: false,
    },
    {
      className: 'orb-blob orb-blob--yellow',
      color: '#F2E36B',
      duration: 7,
      x: [0, p(0.1), p(-0.08), 0],
      y: [p(-0.1), p(-0.14), p(-0.04), p(-0.1)],
      scale: [1, 1.15, 0.92, 1],
      seam: true,
    },
  ] as const
}

export function Orb({
  size = 40,
  layoutId,
  mode = 'idle',
  className = '',
}: OrbProps) {
  const reduce = useReducedMotion()
  const speed = mode === 'thinking' ? 0.5 : 1
  const breath = mode === 'thinking' ? [1, 1.06, 1] : [1, 1.03, 1]
  const breathDuration = mode === 'thinking' ? 2.5 : 5
  const blur = Math.max(4, size * 0.12)
  const blobs = blobMotion(size)

  return (
    <motion.span
      className={`orb ${className}`.trim()}
      layoutId={layoutId}
      style={{ width: size, height: size }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
    >
      <motion.span
        className="orb-inner"
        animate={reduce ? { scale: 1 } : { scale: breath }}
        transition={
          reduce
            ? { duration: 0.2 }
            : { duration: breathDuration, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <span
          className="orb-inner__liquid"
          style={{ ['--orb-blur' as string]: `${blur}px` }}
        >
          {blobs.map((blob) => (
            <motion.span
              key={blob.className}
              className={blob.className}
              animate={
                reduce
                  ? undefined
                  : {
                      x: [...blob.x],
                      y: [...blob.y],
                      scale: [...blob.scale],
                    }
              }
              transition={
                reduce
                  ? undefined
                  : {
                      duration: blob.duration * speed,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      ease: 'easeInOut',
                    }
              }
            >
              <span
                className="orb-blob__fill"
                style={{
                  background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
                }}
              />
              {blob.seam && (
                <span className="orb-blob__seam" aria-hidden />
              )}
            </motion.span>
          ))}
        </span>
        <span className="orb-inner__glass" aria-hidden />
        {mode === 'thinking' && !reduce && (
          <>
            <motion.span
              className="orb-inner__ring"
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.span
              className="orb-inner__ring"
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 0.7,
              }}
            />
          </>
        )}
      </motion.span>
    </motion.span>
  )
}
