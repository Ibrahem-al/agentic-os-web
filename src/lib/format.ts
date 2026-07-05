// Shared formatters — mirror the desktop app's lib/format.ts grammar so the
// cockpit recreations read identically.

export type ClassValue = string | false | null | undefined

/** Tiny classnames joiner (no tailwind-merge; we write non-conflicting classes). */
export function cn(...parts: ClassValue[]): string {
  return parts.filter(Boolean).join(' ')
}

/** Relative time, mono grammar: "6s ago", "4m ago", "2h ago", "3d ago", ISO date. */
export function relTime(input: number | string | Date): string {
  const then = input instanceof Date ? input.getTime() : new Date(input).getTime()
  const secs = Math.max(0, Math.round((Date.now() - then) / 1000))
  if (secs < 60) return `${secs}s ago`
  const mins = Math.round(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 48) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 60) return `${days}d ago`
  return new Date(then).toISOString().slice(0, 10)
}

/** A frozen relative time for seeded/static demo data (no live clock drift). */
export function agoLabel(value: string): string {
  return value
}

/** USD money: "$0.00", or 4 decimals below a cent. */
export function usd(v: number | null | undefined): string {
  if (v == null) return '-'
  if (v > 0 && v < 0.01) return `$${v.toFixed(4)}`
  return `$${v.toFixed(2)}`
}

/** Token counts: "-", "1.2k", or the integer. */
export function tokens(n: number | null | undefined): string {
  if (n == null) return '-'
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return `${n}`
}

/** Duration in ms -> "840ms", "2.3s", "4m 12s". */
export function duration(ms: number | null | undefined): string {
  if (ms == null) return '…'
  if (ms < 1000) return `${Math.round(ms)}ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`
  const m = Math.floor(ms / 60_000)
  const s = Math.round((ms % 60_000) / 1000)
  return `${m}m ${s}s`
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max - 1).trimEnd() + '…'
}
