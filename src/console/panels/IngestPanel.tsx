import { useEffect, useRef, useState } from 'react'
import { PanelHeader, Badge, Button, SectionHead, TextInput, KV } from '../../components/kit'

type Phase = 'idle' | 'walking' | 'parsing' | 'writing' | 'knowledge' | 'done'

const FILES = [
  'src/main/index.ts',
  'src/main/storage/ryugraph.ts',
  'src/main/retrieval/pipeline.ts',
  'src/main/mcp/server.ts',
  'src/main/agents/extraction/agent.ts',
  'docs/spec.md',
]

export function IngestPanel() {
  const [root, setRoot] = useState('C:\\Users\\ibrah\\Documents\\agentic-os')
  const [phase, setPhase] = useState<Phase>('idle')
  const [walked, setWalked] = useState(0)
  const [parsed, setParsed] = useState(0)
  const [components, setComponents] = useState(0)
  const [file, setFile] = useState('')
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const run = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setPhase('walking')
    setWalked(0)
    setParsed(0)
    setComponents(0)
    const push = (fn: () => void, ms: number) => {
      timers.current.push(window.setTimeout(fn, ms))
    }
    // walk
    for (let i = 1; i <= 189; i += 9) {
      push(() => setWalked(Math.min(i, 189)), i * 3)
    }
    push(() => {
      setWalked(189)
      setPhase('parsing')
    }, 620)
    // parse
    for (let i = 1; i <= 130; i += 7) {
      push(() => {
        setParsed(Math.min(i, 130))
        setFile(FILES[i % FILES.length] ?? '')
      }, 620 + i * 6)
    }
    push(() => {
      setParsed(130)
      setPhase('writing')
    }, 1500)
    for (let i = 1; i <= 282; i += 18) {
      push(() => setComponents(Math.min(i, 282)), 1500 + i * 2)
    }
    push(() => {
      setComponents(282)
      setPhase('knowledge')
      setFile('README.md, docs/*.md digests')
    }, 2100)
    push(() => setPhase('done'), 2700)
  }

  const active = phase !== 'idle' && phase !== 'done'

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="ingestion" meta="knowledge documents and codebases become graph memory" />
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 py-4">
        <section className="max-w-3xl">
          <SectionHead title="ingest a document" meta="markdown and plain text, chunked and embedded; re-adding unchanged content is a no-op" />
          <div className="flex flex-col gap-2">
            <TextInput value="" onChange={() => {}} label="path" placeholder="absolute path to a document" mono />
            <TextInput value="" onChange={() => {}} label="tags" placeholder="tags, comma separated" />
            <div>
              <Button size="default" variant="primary" disabled>ingest document</Button>
            </div>
          </div>
        </section>

        <section className="max-w-3xl border-t border-line pt-5">
          <SectionHead title="ingest a codebase" meta="tree-sitter component graph + doc digests; unchanged re-ingest writes nothing" />
          <div className="flex flex-col gap-2">
            <TextInput value={root} onChange={setRoot} label="root" placeholder="absolute path to a repository root" mono />
            <TextInput value="" onChange={() => {}} label="project" placeholder="project name (optional, matched or created)" />
            <div>
              <Button size="default" variant="primary" onClick={run} disabled={active}>
                {active ? 'ingesting…' : 'ingest codebase'}
              </Button>
            </div>
          </div>

          {active && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[11px] text-accent">{phase}</span>
              <span className="font-mono text-[12px]">{walked} walked</span>
              <span className="font-mono text-[12px]">{parsed} parsed</span>
              <span className="font-mono text-[12px]">{components} components</span>
              {file && <span className="truncate font-mono text-[11px] text-ink-faint">{file}</span>}
            </div>
          )}

          {phase === 'done' && (
            <div className="mt-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge status="created" label="created" />
                <span className="text-[13px]">agentic-os</span>
                <span className="font-mono text-[11px] text-ink-faint">proj-5e5e315f</span>
              </div>
              <KV
                rows={[
                  { k: 'files walked', v: <span className="font-mono">189</span> },
                  { k: 'parsed', v: <span className="font-mono">130</span> },
                  { k: 'components', v: <span className="font-mono">282 (+282 / -0)</span> },
                  { k: 'depends_on', v: <span className="font-mono">197</span> },
                  { k: 'knowledge docs', v: <span className="font-mono">85 (555 chunks)</span> },
                  { k: 'skipped', v: <span className="font-mono">25</span> },
                ]}
              />
              <p className="mt-2 font-mono text-[11px] text-ink-faint">
                re-run this exact root: status unchanged, 0 created / 0 deleted, ~1.3s
              </p>
            </div>
          )}
        </section>

        <p className="text-[11px] text-ink-faint">recurring folders live in tasks & watchers as watched folders</p>
      </div>
    </div>
  )
}
