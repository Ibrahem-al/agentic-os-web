import { CaretRight } from '@phosphor-icons/react'

const STEPS = [
  { name: 'embed', tag: 'bge-m3 · 1024d' },
  { name: 'search', tag: 'vector 30 + fts 30' },
  { name: 'fuse', tag: '0.5 / 0.2 / 0.3' },
  { name: 'rerank', tag: 'cross-encoder → 8' },
  { name: 'critic', tag: 'pass ≥ 0.7' },
  { name: 'bundle', tag: '8,192 tok budget' },
]

export function PipelineStrip() {
  return (
    <div className="flex flex-wrap items-stretch gap-2">
      {STEPS.map((s, i) => (
        <div key={s.name} className="flex items-center gap-2">
          <div className="rounded-md border border-line bg-surface px-3 py-2">
            <div className="text-[13px] font-medium text-ink">{s.name}</div>
            <div className="mt-0.5 font-mono text-[10.5px] text-ink-faint">{s.tag}</div>
          </div>
          {i < STEPS.length - 1 && (
            <CaretRight size={14} className="shrink-0 text-ink-faint" weight="bold" />
          )}
        </div>
      ))}
      <div className="flex items-center gap-2">
        <CaretRight size={14} className="shrink-0 text-ink-faint" weight="bold" />
        <div className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2">
          <div className="text-[13px] font-medium text-accent">loop</div>
          <div className="mt-0.5 font-mono text-[10.5px] text-ink-faint">≤ 5 · rewrite</div>
        </div>
      </div>
    </div>
  )
}
