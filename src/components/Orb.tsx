import { motion, useReducedMotion } from 'framer-motion'
import './Orb.css'

type OrbProps = {
  size?: number
  layoutId?: string
  mode?: 'idle' | 'thinking'
  className?: string
}

const BLOBS = [
  {
    className: 'orb-blob orb-blob--a',
    color: 'rgba(255, 230, 0, 0.95)',
    duration: 7,
    x: [0, 18, -10, 0],
    y: [0, -14, 12, 0],
    scale: [1, 1.15, 0.92, 1],
  },
  {
    className: 'orb-blob orb-blob--b',
    color: 'rgba(0, 166, 80, 0.9)',
    duration: 9,
    x: [0, -16, 14, 0],
    y: [0, 10, -18, 8],
    scale: [1, 0.9, 1.18, 1],
  },
  {
    className: 'orb-blob orb-blob--c',
    color: 'rgba(52, 131, 250, 0.95)',
    duration: 11,
    x: [0, 12, -18, 6],
    y: [0, 16, -8, 0],
    scale: [1, 1.1, 0.88, 1.05],
  },
  {
    className: 'orb-blob orb-blob--d',
    color: 'rgba(255, 255, 255, 0.85)',
    duration: 13,
    x: [0, -8, 10, -4],
    y: [0, -12, 6, 0],
    scale: [1, 1.08, 0.95, 1.12],
  },
] as const

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
  const blur = Math.max(6, size * 0.2)

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
          {BLOBS.map((blob) => (
            <motion.span
              key={blob.className}
              className={blob.className}
              style={{
                background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
              }}
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
            />
          ))}
        </span>
        <span className="orb-inner__specular" aria-hidden />
        <span className="orb-inner__shade" aria-hidden />
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
