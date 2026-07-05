import { cn } from '../../lib/format'

/** The graph-node glyph from the favicon, inline and the-able. */
export function Glyph({ className, size = 22 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" fill="var(--color-surface)" />
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="6.5"
        fill="none"
        stroke="var(--color-line-strong)"
      />
      <g stroke="var(--color-accent)" strokeWidth="1.6" fill="none" opacity="0.9">
        <line x1="16" y1="9" x2="9" y2="21" />
        <line x1="16" y1="9" x2="23" y2="21" />
        <line x1="9" y1="21" x2="23" y2="21" />
      </g>
      <circle cx="16" cy="9" r="3.4" fill="var(--color-accent)" />
      <circle cx="9" cy="21" r="2.6" fill="var(--color-ink-mute)" />
      <circle cx="23" cy="21" r="2.6" fill="var(--color-ink-mute)" />
    </svg>
  )
}

export function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <Glyph size={size} />
      <span className="text-[15px] font-semibold tracking-tight text-ink">
        agentic<span className="text-ink-mute">-os</span>
      </span>
    </span>
  )
}
