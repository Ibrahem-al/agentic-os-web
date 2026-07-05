import type { Variants, Transition } from 'motion/react'
import { useReducedMotion } from 'motion/react'

// Exponential ease-out — the app's motion is feedback-only; the marketing
// surfaces add restrained reveals that respect prefers-reduced-motion.
export const easeOut: Transition['ease'] = [0.16, 1, 0.3, 1]

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
}

export const revealIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: easeOut } },
}

export function staggerContainer(stagger = 0.06, delay = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  }
}

/** Default viewport config for whileInView reveals. */
export const inView = { once: true, amount: 0.3 } as const

export { useReducedMotion }
