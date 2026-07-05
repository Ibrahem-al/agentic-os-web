import { useState } from 'react'
import { Copy, Check } from '@phosphor-icons/react'
import { cn } from '../../lib/format'

function renderLine(line: string, i: number) {
  const trimmed = line.trimStart()
  const isComment = trimmed.startsWith('#') || trimmed.startsWith('//')
  return (
    <div key={i} className={cn(isComment ? 'text-ink-faint' : 'text-ink')}>
      {line || ' '}
    </div>
  )
}

export function CodeBlock({
  code,
  label,
  className,
  copyable = true,
}: {
  code: string
  label?: string
  className?: string
  copyable?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    })
  }
  const lines = code.replace(/\n$/, '').split('\n')

  return (
    <div
      className={cn(
        'min-w-0 overflow-hidden rounded-md border border-line-strong bg-void',
        className,
      )}
    >
      {(label || copyable) && (
        <div className="flex items-center justify-between border-b border-line bg-surface px-3 py-1.5">
          <span className="font-mono text-[11px] text-ink-faint">{label ?? ''}</span>
          {copyable && (
            <button
              onClick={copy}
              className="flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[11px] text-ink-mute transition-colors hover:bg-raised hover:text-ink"
              aria-label="copy code"
            >
              {copied ? (
                <>
                  <Check size={13} weight="bold" className="text-ok" /> copied
                </>
              ) : (
                <>
                  <Copy size={13} /> copy
                </>
              )}
            </button>
          )}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-[1.7]">
        <code>{lines.map(renderLine)}</code>
      </pre>
    </div>
  )
}

/** Inline mono token for prose. */
export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-raised px-1.5 py-0.5 font-mono text-[0.86em] text-ink">
      {children}
    </code>
  )
}
