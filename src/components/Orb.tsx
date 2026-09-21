import { motion, useReducedMotion } from 'framer-motion'
import './Orb.css'

type OrbProps = {
  size?: number
  layoutId?: string
  mode?: 'idle' | 'thinking'
  className?: string
}

/** Layer order (bottom → top): blue, green, yellow. */
function blobMotion(size: number) {
  const p = (n: number) => size * n
  return [
    {
      className: 'orb-blob orb-blob--blue',
      color: '#2F80F5',
      duration: 5,
      x: [p(-0.12), p(-0.25), p(-0.05), p(-0.2), p(-0.12)],
      y: [p(0.1), p(0.25), p(0.05), p(0.18), p(0.1)],
      scale: [1, 1.12, 0.9, 1.08, 1],
      rotate: [0, 25, -15, 0],
    },
    {
      className: 'orb-blob orb-blob--green',
      color: '#9AAA1A',
      duration: 6.5,
      x: [p(0.1), p(0.25), p(0.02), p(0.18), p(0.1)],
      y: [p(-0.05), p(0.15), p(-0.25), p(0.08), p(-0.05)],
      scale: [1, 0.9, 1.12, 0.95, 1],
      rotate: [0, 25, -15, 0],
    },
    {
      className: 'orb-blob orb-blob--yellow',
      color: '#F2E36B',
      duration: 8,
      x: [0, p(0.2), p(-0.25), p(0.12), 0],
      y: [p(-0.12), p(-0.25), p(-0.02), p(-0.18), p(-0.12)],
      scale: [1, 1.1, 0.9, 1.12, 1],
      rotate: [0, 25, -15, 0],
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
        <motion.span
          className="orb-inner__liquid"
          style={{ ['--orb-blur' as string]: `${blur}px` }}
          animate={
            reduce || mode !== 'thinking' ? { rotate: 0 } : { rotate: 360 }
          }
          transition={
            reduce || mode !== 'thinking'
              ? { duration: 0.2 }
              : { duration: 6, repeat: Infinity, ease: 'linear' }
          }
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
                      rotate: [...blob.rotate],
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
            </motion.span>
          ))}
        </motion.span>
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
