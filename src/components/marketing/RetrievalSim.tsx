import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useReducedMotion } from '../../lib/motion'
import { cn } from '../../lib/format'
import { WindowFrame } from './WindowFrame'

const STAGES = [
  { key: 'embed', label: 'embed bge-m3', detail: '1024-dim', ms: 460 },
  { key: 'retrieve', label: 'hybrid retrieve', detail: 'vector 30 + fts 30 → fuse 0.5 / 0.2 / 0.3', ms: 760 },
  { key: 'rerank', label: 'rerank 24 candidates', detail: 'cross-encoder int8 → top 8', ms: 340 },
  { key: 'critic', label: 'critic vs rubric', detail: 'relevance · coverage · specificity', ms: 160 },
]

const RESULTS = [
  { label: 'Preference', text: 'charts must remain readable for colorblind viewers', score: 0.94 },
  { label: 'Skill', text: 'render charts: accessible components with legends', score: 0.81 },
  { label: 'Knowledge', text: 'charts runbook: colorblind-safe categorical palette', score: 0.77 },
  { label: 'Component', text: 'RevenueChart.tsx:RevenueChart', score: 0.71 },
]

// display-scaled durations (real ms compressed for a legible loop)
const SCALE = 1.5

export function RetrievalSim() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(reduce ? STAGES.length : -1)
  const [revealed, setRevealed] = useState(reduce ? RESULTS.length : 0)
  const [done, setDone] = useState(reduce)
  const timers = useRef<number[]>([])

  useEffect(() => {
    if (reduce) return
    const run = () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
      setActive(-1)
      setRevealed(0)
      setDone(false)
      let t = 500
      const at = (fn: () => void, dt: number) => {
        t += dt
        timers.current.push(window.setTimeout(fn, t))
      }
      STAGES.forEach((s, i) => {
        at(() => setActive(i), 220)
        if (s.key === 'rerank') {
          RESULTS.forEach((_, ri) =>
            at(() => setRevealed(ri + 1), (s.ms * SCALE) / RESULTS.length),
          )
        } else {
          at(() => {}, s.ms * SCALE)
        }
      })
      at(() => {
        setActive(STAGES.length)
        setDone(true)
      }, 260)
      at(run, 2600) // pause, then loop
    }
    run()
    return () => timers.current.forEach(clearTimeout)
  }, [reduce])

  return (
    <WindowFrame title="mcp · get_context" meta={done ? 'confidence high' : 'running'}>
      <div className="bg-grid-sm p-4 sm:p-5">
        {/* query */}
        <div className="rounded-md border border-line bg-surface px-3 py-2">
          <div className="flex items-baseline gap-2">
            <span className="shrink-0 font-mono text-[10.5px] text-ink-faint">task</span>
            <span className="min-w-0 text-[12.5px] text-ink">
              how should the revenue chart handle colorblind viewers?
            </span>
          </div>
        </div>

        {/* stages */}
        <div className="mt-4 flex flex-col gap-2">
          {STAGES.map((s, i) => {
            const state = active > i || done ? 'done' : active === i ? 'run' : 'idle'
            return (
              <div key={s.key} className="flex items-center gap-3">
                <span
                  className={cn(
                    'w-28 shrink-0 font-mono text-[10.5px] transition-colors duration-200 sm:w-40 sm:text-[11px]',
                    state === 'idle' ? 'text-ink-faint' : 'text-ink',
                  )}
                >
                  {s.label}
                </span>
                <span className="relative h-[6px] flex-1 overflow-hidden rounded-full bg-line">
                  <span
                    className={cn(
                      'absolute inset-y-0 left-0 rounded-full',
                      state === 'done' ? 'bg-accent' : state === 'run' ? 'bg-accent/80' : 'bg-transparent',
                    )}
                    style={{
                      width: state === 'idle' ? '0%' : '100%',
                      transition: `width ${s.ms * SCALE}ms cubic-bezier(0.16,1,0.3,1)`,
                    }}
                  />
                  {state === 'run' && !reduce && (
                    <span
                      className="absolute inset-y-0 left-0 w-1/3 opacity-40"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, oklch(0.97 0.01 268 / 0.5), transparent)',
                        animation: 'sweep 1s linear infinite',
                      }}
                    />
                  )}
                </span>
                <span className="w-12 shrink-0 text-right font-mono text-[10.5px] text-ink-mute">
                  {state === 'idle' ? '' : `${s.ms}ms`}
                </span>
              </div>
            )
          })}
        </div>

        {/* candidates → bundle */}
        <div className="mt-4 rounded-md border border-line bg-surface/60 p-3">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[10.5px] text-ink-faint">context bundle</span>
            <span className="font-mono text-[10.5px] text-ink-faint">
              {done ? '8 items · 1,842 tokens' : `${revealed} of 8`}
            </span>
          </div>
          <div className="mt-2 flex flex-col gap-1.5">
            <AnimatePresence initial={false}>
              {RESULTS.slice(0, revealed).map((r) => (
                <motion.div
                  key={r.text}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2"
                >
                  <span className="w-20 shrink-0 font-mono text-[10px] text-ink-mute">{r.label}</span>
                  <span className="min-w-0 flex-1 truncate text-[12px] text-ink">{r.text}</span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <span className="font-mono text-[10.5px] text-ink-mute">{r.score.toFixed(2)}</span>
                    <span className="inline-block h-[3px] w-8 bg-line">
                      <span
                        className="block h-full bg-ok"
                        style={{ width: `${Math.round(r.score * 100)}%` }}
                      />
                    </span>
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {revealed === 0 && (
              <div className="py-1 font-mono text-[11px] text-ink-faint">awaiting rerank…</div>
            )}
          </div>
          {done && (
            <div className="mt-2 border-t border-line pt-2 font-mono text-[10.5px] text-ink-mute">
              <span className="text-ok">confidence high</span> · 1 iteration · halt passed · $0.00
            </div>
          )}
        </div>
      </div>
    </WindowFrame>
  )
}
