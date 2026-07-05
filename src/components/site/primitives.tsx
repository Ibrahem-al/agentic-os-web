import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '../../lib/format'
import { easeOut, useReducedMotion } from '../../lib/motion'

export function Container({
  children,
  className,
  size = 'default',
}: {
  children: ReactNode
  className?: string
  size?: 'default' | 'wide' | 'prose'
}) {
  const max =
    size === 'wide' ? 'max-w-[1240px]' : size === 'prose' ? 'max-w-[760px]' : 'max-w-[1120px]'
  return <div className={cn('mx-auto px-5 sm:px-8', max, className)}>{children}</div>
}

/**
 * Reveal-on-scroll that can never trap content hidden. It starts hidden and
 * reveals when it scrolls into view (IntersectionObserver), but a failsafe
 * timer forces it visible regardless, so a headless render, a slow observer,
 * or a deep anchor link never ships a blank section.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (reduce) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    const failsafe = window.setTimeout(() => setShown(true), 1400)
    return () => {
      io.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [reduce])

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 18 }}
      transition={{ duration: 0.6, delay: shown ? delay : 0, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        'text-balance text-[clamp(1.6rem,3.4vw,2.5rem)] leading-[1.08] font-semibold tracking-[-0.03em]',
        className,
      )}
    >
      {children}
    </h2>
  )
}

export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('max-w-[62ch] text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-ink-mute', className)}>
      {children}
    </p>
  )
}

/** A hairline-framed note. Not a card; used for asides in docs. */
export function Callout({
  children,
  tone = 'neutral',
  title,
}: {
  children: ReactNode
  tone?: 'neutral' | 'accent' | 'warn'
  title?: string
}) {
  const border =
    tone === 'accent'
      ? 'border-accent/30'
      : tone === 'warn'
        ? 'border-warn/30'
        : 'border-line-strong'
  const bar =
    tone === 'accent' ? 'bg-accent' : tone === 'warn' ? 'bg-warn' : 'bg-line-strong'
  return (
    <div className={cn('flex gap-3 rounded-md border bg-surface/60 px-4 py-3', border)}>
      <span className={cn('mt-0.5 w-0.5 shrink-0 self-stretch rounded-full', bar)} />
      <div className="min-w-0 text-[13.5px] leading-relaxed text-ink-mute">
        {title && <span className="font-medium text-ink">{title}. </span>}
        {children}
      </div>
    </div>
  )
}

/** A mono spec value with a label above — instrument readout, not a hero card. */
export function Stat({
  value,
  label,
  accent,
}: {
  value: ReactNode
  label: string
  accent?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className={cn(
          'font-mono text-[clamp(1.4rem,2.4vw,1.9rem)] leading-none tracking-tight',
          accent ? 'text-accent' : 'text-ink',
        )}
      >
        {value}
      </span>
      <span className="text-[12px] text-ink-faint">{label}</span>
    </div>
  )
}
