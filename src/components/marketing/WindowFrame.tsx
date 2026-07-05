import type { ReactNode } from 'react'
import { cn } from '../../lib/format'
import { Glyph } from '../site/Wordmark'

/** A restrained app-window chrome. No macOS traffic lights — the app ships a
 *  standard OS frame; this evokes it without cosplay. */
export function WindowFrame({
  children,
  title = 'agentic-os',
  meta,
  className,
  bodyClassName,
}: {
  children: ReactNode
  title?: string
  meta?: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-line-strong bg-bg shadow-2xl shadow-black/40',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2">
        <Glyph size={15} />
        <span className="text-[12px] font-medium text-ink">{title}</span>
        {meta != null && (
          <span className="ml-auto font-mono text-[11px] text-ink-faint">{meta}</span>
        )}
      </div>
      <div className={cn('min-h-0', bodyClassName)}>{children}</div>
    </div>
  )
}
