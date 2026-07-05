import { motion } from 'motion/react'
import { useReducedMotion } from '../../lib/motion'
import { cn } from '../../lib/format'

interface Layer {
  name: string
  desc: string
  tag?: string
  tone?: 'accent' | 'neutral' | 'ok'
}

const LAYERS: Layer[] = [
  { name: 'Claude', desc: 'external orchestrator, over MCP', tag: 'reads live · writes only staged', tone: 'accent' },
  { name: 'MCP server', desc: 'streamable HTTP, bearer auth, every call logged', tag: '127.0.0.1:4517' },
  { name: 'Kernel', desc: 'scheduler · context · permissions · budget · audit/undo', tag: 'one chokepoint' },
  { name: 'Background agents', desc: 'extraction · skill improvement · rules · watchers', tag: 'learn + automate' },
  { name: 'Hybrid retrieval', desc: 'vector + full-text + graph → rerank → bounded loop', tag: 'top-8 bundle' },
  { name: 'RyuGraph', desc: 'embedded vector + graph + full-text store', tag: 'the persistent memory', tone: 'ok' },
  { name: 'Local models', desc: 'Ollama bge-m3 + qwen3 · in-process ONNX reranker', tag: 'cloud brain optional' },
]

export function ArchitectureStack({ animate = true }: { animate?: boolean }) {
  const reduce = useReducedMotion()
  const flow = animate && !reduce

  return (
    <div className="relative">
      {/* spine */}
      <div className="absolute top-4 bottom-4 left-[15px] w-px bg-line-strong sm:left-[19px]" />
      {flow && (
        <motion.span
          aria-hidden
          className="absolute left-[13px] size-[9px] rounded-full bg-accent sm:left-[17px]"
          style={{ boxShadow: '0 0 10px 1px oklch(0.68 0.14 268 / 0.6)' }}
          initial={{ top: 8 }}
          animate={{ top: ['4%', '96%'] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <ol className="flex flex-col gap-2.5">
        {LAYERS.map((l, i) => (
          <li key={l.name} className="relative flex items-stretch gap-4 pl-9 sm:pl-11">
            <span
              className={cn(
                'absolute top-1/2 left-[11px] size-2.5 -translate-y-1/2 rounded-full border-2 border-bg sm:left-[15px]',
                l.tone === 'accent' ? 'bg-accent' : l.tone === 'ok' ? 'bg-ok' : 'bg-ink-faint',
              )}
            />
            <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-0.5 rounded-md border border-line bg-surface/60 px-4 py-2.5">
              <span className="text-[14px] font-semibold text-ink">{l.name}</span>
              <span className="min-w-0 flex-1 text-[12.5px] text-ink-mute">{l.desc}</span>
              {l.tag && (
                <span className="font-mono text-[10.5px] whitespace-nowrap text-ink-faint">{l.tag}</span>
              )}
            </div>
            {i < LAYERS.length - 1 && (
              <span className="pointer-events-none absolute -bottom-2.5 left-[15px] font-mono text-[10px] text-ink-faint sm:left-[19px]" />
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
