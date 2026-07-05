import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { cn, relTime } from '../lib/format'
import { statusToken, STATUS_TEXT, STATUS_BG, color } from '../lib/tokens'

/* ------------------------------------------------------------------ Badge */

export function Badge({ status, label }: { status: string; label?: string }) {
  const token = statusToken(status)
  return (
    <span
      data-status={status}
      className={cn(
        'inline-block rounded-full px-2 py-0.5 font-mono text-[11px] leading-4 whitespace-nowrap',
        STATUS_TEXT[token],
        STATUS_BG[token],
      )}
    >
      {label ?? status}
    </span>
  )
}

/* ------------------------------------------------------------- Confidence */

export function Confidence({ value }: { value: number | null }) {
  if (value == null) return null
  const pct = Math.round(value * 100)
  return (
    <span className="inline-flex items-center gap-1.5" title={`confidence ${value.toFixed(2)}`}>
      <span className="font-mono text-[11px] text-ink-mute">{value.toFixed(2)}</span>
      <span className="inline-block h-[3px] w-8 bg-line">
        <span
          className={cn('block h-full', value >= 0.6 ? 'bg-ok' : 'bg-warn')}
          style={{ width: `${pct}%` }}
        />
      </span>
    </span>
  )
}

/* ----------------------------------------------------------------- Button */

type ButtonVariant = 'primary' | 'danger' | 'ghost'
type ButtonSize = 'dense' | 'default'

const BTN_VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-ink hover:bg-accent/85',
  danger: 'bg-err/85 text-ink hover:bg-err',
  ghost: 'border border-line-strong text-ink hover:bg-raised',
}
const BTN_SIZE: Record<ButtonSize, string> = {
  dense: 'h-7 px-2.5 text-[12px]',
  default: 'h-8 px-3 text-[13px]',
}

export function Button({
  children,
  variant = 'ghost',
  size = 'dense',
  onClick,
  disabled,
  type = 'button',
  className,
  title,
  ariaLabel,
}: {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
  title?: string
  ariaLabel?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex cursor-pointer items-center gap-1.5 rounded-md font-medium whitespace-nowrap transition-colors duration-120 select-none active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45',
        BTN_SIZE[size],
        BTN_VARIANT[variant],
        className,
      )}
    >
      {children}
    </button>
  )
}

/* -------------------------------------------------------------- TextInput */

export function TextInput({
  value,
  onChange,
  onEnter,
  placeholder,
  label,
  ariaLabel,
  mono,
  className,
}: {
  value: string
  onChange: (v: string) => void
  onEnter?: () => void
  placeholder?: string
  label?: string
  ariaLabel?: string
  mono?: boolean
  className?: string
}) {
  const input = (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onEnter?.()
      }}
      placeholder={placeholder}
      aria-label={ariaLabel ?? label}
      className={cn(
        'h-8 rounded-md border border-line-strong bg-raised px-2.5 text-[13px] text-ink transition-colors duration-120 placeholder:text-ink-mute focus:border-accent focus:outline-none',
        mono && 'font-mono text-[12px]',
        className ?? 'w-full',
      )}
    />
  )
  if (!label) return input
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[12px] text-ink-mute">{label}</span>
      {input}
    </label>
  )
}

/* ------------------------------------------------------------------ Select */

export function Select({
  value,
  onChange,
  options,
  label,
  ariaLabel,
  className,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  label?: string
  ariaLabel?: string
  className?: string
}) {
  const select = (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel ?? label}
      className={cn(
        'h-8 cursor-pointer rounded-md border border-line-strong bg-raised px-2 text-[13px] text-ink transition-colors duration-120 focus:border-accent focus:outline-none',
        className,
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
  if (!label) return select
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[12px] text-ink-mute">{label}</span>
      {select}
    </label>
  )
}

/* ------------------------------------------------------------ PanelHeader */

export function PanelHeader({
  title,
  meta,
  actions,
}: {
  title: string
  meta?: ReactNode
  actions?: ReactNode
}) {
  return (
    <header className="flex items-baseline gap-3 border-b border-line px-5 py-3">
      <h1 className="text-[20px] leading-7 font-semibold tracking-tight">{title}</h1>
      {meta != null && <span className="text-[12px] text-ink-mute">{meta}</span>}
      {actions != null && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </header>
  )
}

export function SectionHead({ title, meta }: { title: string; meta?: ReactNode }) {
  return (
    <div className="flex items-baseline gap-2 pt-1 pb-2">
      <h2 className="text-[14px] font-semibold">{title}</h2>
      {meta != null && <span className="text-[12px] text-ink-mute">{meta}</span>}
    </div>
  )
}

/* ------------------------------------------------------------ EmptyState */

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="px-5 py-10 text-center text-[13px] text-ink-mute">{children}</div>
  )
}

/* --------------------------------------------------------------- KV grid */

export function KV({ rows }: { rows: { k: string; v: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-[minmax(96px,max-content)_1fr] gap-x-4 gap-y-1.5 text-[12px]">
      {rows.map((r, i) => (
        <div key={i} className="contents">
          <dt className="font-mono text-[11px] leading-5 text-ink-mute">{r.k}</dt>
          <dd className="min-w-0 leading-5 break-words">{r.v}</dd>
        </div>
      ))}
    </dl>
  )
}

/* ------------------------------------------------------------- Timestamp */

export function Timestamp({ iso, label }: { iso?: string; label?: string }) {
  const text = label ?? (iso ? relTime(iso) : '')
  return (
    <time
      dateTime={iso}
      title={iso}
      className="font-mono text-[11px] whitespace-nowrap text-ink-mute"
    >
      {text}
    </time>
  )
}

/* -------------------------------------------------------------- DataTable */

export interface Column<T> {
  key: string
  header: string
  className?: string
  render: (row: T) => ReactNode
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  selectedKey,
  empty,
}: {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  onRowClick?: (row: T) => void
  selectedKey?: string | null
  empty?: ReactNode
}) {
  if (rows.length === 0 && empty != null) {
    return <EmptyState>{empty}</EmptyState>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr className="sticky top-0 z-10 bg-surface text-left">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  'border-b border-line-strong px-2.5 py-2 font-mono text-[11px] font-normal whitespace-nowrap text-ink-mute',
                  c.className,
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const key = rowKey(row)
            const selected = selectedKey != null && key === selectedKey
            const clickable = onRowClick != null
            return (
              <tr
                key={key}
                tabIndex={clickable ? 0 : undefined}
                onClick={clickable ? () => onRowClick(row) : undefined}
                onKeyDown={
                  clickable
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onRowClick(row)
                        } else if (e.key === 'ArrowDown') {
                          e.preventDefault()
                          ;(e.currentTarget.nextElementSibling as HTMLElement | null)?.focus()
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault()
                          ;(e.currentTarget.previousElementSibling as HTMLElement | null)?.focus()
                        }
                      }
                    : undefined
                }
                className={cn(
                  'border-b border-line transition-colors duration-120',
                  clickable && 'cursor-pointer hover:bg-raised focus-visible:bg-raised',
                  selected && 'bg-raised shadow-[inset_2px_0_0_var(--color-accent)]',
                )}
              >
                {columns.map((c) => (
                  <td key={c.key} className={cn('px-2.5 py-2 align-top', c.className)}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------------ Modal */

export function Modal({
  title,
  onClose,
  children,
  footer,
  wide,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    ref.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-bg/70 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'z-40 flex max-h-[85vh] w-full flex-col rounded-md border border-line-strong bg-surface shadow-2xl outline-none',
          wide ? 'max-w-3xl' : 'max-w-xl',
        )}
      >
        <header className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <h2 className="text-[14px] font-semibold">{title}</h2>
          <Button size="dense" onClick={onClose} title="close" ariaLabel="close">
            esc
          </Button>
        </header>
        <div className="min-h-0 overflow-y-auto px-4 py-3">{children}</div>
        {footer != null && (
          <footer className="flex justify-end gap-2 border-t border-line px-4 py-2.5">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- DiffView */

/** Renders a "+/~/-/·" prefixed diff, tinting the text per line (not the row). */
export function DiffView({ text }: { text: string }) {
  const lines = text.replace(/\n$/, '').split('\n')
  return (
    <pre className="overflow-x-auto rounded-md border border-line bg-bg px-3 py-2 font-mono text-[12px] leading-5 whitespace-pre-wrap">
      {lines.map((line, i) => {
        const c = line.startsWith('+ ')
          ? 'text-ok'
          : line.startsWith('~ ')
            ? 'text-warn'
            : line.startsWith('- ') || line.startsWith('− ')
              ? 'text-err'
              : 'text-ink'
        return (
          <div key={i} className={c}>
            {line || ' '}
          </div>
        )
      })}
    </pre>
  )
}

/* -------------------------------------------------------- Toast provider */

type ToastKind = 'ok' | 'err' | 'info'
interface ToastItem {
  id: number
  kind: ToastKind
  message: string
}

const ToastCtx = createContext<(message: string, kind?: ToastKind) => void>(() => {})

export function useToast() {
  return useContext(ToastCtx)
}

const TOAST_EDGE: Record<ToastKind, string> = {
  ok: 'border-t-ok',
  err: 'border-t-err',
  info: 'border-t-accent',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const push = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = ++idRef.current
    setToasts((t) => [...t, { id, kind, message }])
    if (kind !== 'err') {
      window.setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id))
      }, 5000)
    }
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed right-4 bottom-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.kind === 'err' ? 'alert' : 'status'}
            className={cn(
              'rounded-md border border-t-[3px] border-line-strong bg-surface px-3.5 py-2.5 text-[12px] shadow-xl',
              TOAST_EDGE[t.kind],
            )}
          >
            <div className="flex items-start gap-2">
              <span className="min-w-0 break-words">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="ml-auto cursor-pointer font-mono text-[11px] text-ink-mute hover:text-ink"
                aria-label="dismiss"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

/* ------------------------------------------------------------ status dot */

export function StatusDot({ up }: { up: boolean }) {
  return (
    <span
      className={cn('inline-block size-1.5 rounded-full', up ? 'bg-ok' : 'bg-err')}
      style={up ? undefined : { background: color.err }}
    />
  )
}

/* -------------------------------------------------------- misc constants */

export const memoizedNoop = () => {}

/** The 13 node labels, in the app's order. */
export const NODE_LABELS = [
  'Session',
  'Project',
  'Skill',
  'SkillVersion',
  'Example',
  'Correction',
  'Preference',
  'MCP',
  'Plugin',
  'Component',
  'Document',
  'Knowledge',
  'Tag',
] as const

export function useNow(intervalMs = 0) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!intervalMs) return
    const t = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(t)
  }, [intervalMs])
  return now
}

export { useMemo }
