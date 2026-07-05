// The instrument palette in raw OKLCH — for SVG diagrams, inline meters, and
// canvas work where Tailwind utilities can't reach. Values are identical to
// the desktop app's design-tokens.ts / main.css @theme block.

export const color = {
  bg: 'oklch(0.145 0 0)',
  void: 'oklch(0.125 0 0)',
  surface: 'oklch(0.185 0 0)',
  raised: 'oklch(0.225 0 0)',
  line: 'oklch(1 0 0 / 0.09)',
  lineStrong: 'oklch(1 0 0 / 0.16)',
  ink: 'oklch(0.93 0 0)',
  inkMute: 'oklch(0.72 0 0)',
  inkFaint: 'oklch(0.62 0 0)',
  accent: 'oklch(0.68 0.14 268)',
  accentInk: 'oklch(0.97 0.01 268)',
  accentDim: 'oklch(0.58 0.13 268)',
  ok: 'oklch(0.75 0.15 155)',
  warn: 'oklch(0.8 0.14 85)',
  err: 'oklch(0.7 0.19 25)',
  undo: 'oklch(0.72 0.12 315)',
} as const

export type StatusToken = 'ok' | 'warn' | 'err' | 'undo' | 'accent' | 'neutral'

// The single status grammar every panel shares (DESIGN.md statusColor).
const STATUS_MAP: Record<string, StatusToken> = {
  staged: 'warn',
  approved: 'warn',
  committed: 'ok',
  rejected: 'err',
  pending: 'warn',
  denied: 'err',
  running: 'accent',
  done: 'ok',
  failed: 'err',
  deferred: 'warn',
  ok: 'ok',
  error: 'err',
  success: 'ok',
  failure: 'err',
  unchanged: 'ok',
  undone: 'undo',
  created: 'ok',
  replaced: 'accent',
  updated: 'accent',
  flagged: 'err',
  ready: 'ok',
  'models-missing': 'warn',
  'daemon-not-running': 'err',
  active: 'ok',
  candidate: 'warn',
  retired: 'undo',
  adopted: 'ok',
  'drift-flagged': 'warn',
  'rolled-back': 'undo',
  'key set': 'ok',
  regex: 'err',
  llm: 'err',
  'graph-write': 'neutral',
  'file-write': 'neutral',
  'file-delete': 'neutral',
  action: 'neutral',
  undo: 'neutral',
}

export function statusToken(status: string): StatusToken {
  return STATUS_MAP[status] ?? 'neutral'
}

// Tailwind text + bg tint classes per token.
export const STATUS_TEXT: Record<StatusToken, string> = {
  ok: 'text-ok',
  warn: 'text-warn',
  err: 'text-err',
  undo: 'text-undo',
  accent: 'text-accent',
  neutral: 'text-ink-mute',
}

export const STATUS_BG: Record<StatusToken, string> = {
  ok: 'bg-ok/15',
  warn: 'bg-warn/15',
  err: 'bg-err/15',
  undo: 'bg-undo/15',
  accent: 'bg-accent/15',
  neutral: 'bg-raised',
}

export const STATUS_FILL: Record<StatusToken, string> = {
  ok: color.ok,
  warn: color.warn,
  err: color.err,
  undo: color.undo,
  accent: color.accent,
  neutral: color.inkMute,
}
