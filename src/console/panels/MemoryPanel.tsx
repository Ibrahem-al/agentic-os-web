import { useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'
import {
  PanelHeader,
  DataTable,
  Confidence,
  EmptyState,
  Button,
  TextInput,
  type Column,
} from '../../components/kit'
import { cn, truncate } from '../../lib/format'
import {
  LABEL_COUNTS,
  nodesForLabel,
  nodeById,
  SEARCH_HITS,
  type MemNode,
  type MemEdge,
  type SearchHit,
} from '../data'

function EdgeList({
  title,
  edges,
  onNavigate,
}: {
  title: string
  edges: MemEdge[]
  onNavigate: (id: string) => void
}) {
  return (
    <div className="mt-5">
      <div className="flex items-baseline gap-2">
        <h3 className="text-[14px] font-semibold">{title}</h3>
        <span className="font-mono text-[11px] text-ink-mute">{edges.length}</span>
      </div>
      {edges.length === 0 ? (
        <p className="mt-1.5 text-[13px] text-ink-mute">no {title} edges</p>
      ) : (
        <div className="mt-1.5">
          {edges.map((e, i) => (
            <div
              key={i}
              className="flex min-h-[34px] flex-wrap items-center gap-x-2 gap-y-0.5 border-b border-line py-1.5"
            >
              <span className="font-mono text-[11px] text-ink-mute">{e.type}</span>
              <button
                onClick={() => onNavigate(e.targetId)}
                className="cursor-pointer text-left text-[13px] text-accent hover:underline"
              >
                {truncate(e.targetDisplay, 100)}
              </button>
              <span className="font-mono text-[11px] text-ink-faint">{e.targetLabel}</span>
              {e.confidence != null && <Confidence value={e.confidence} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Inspector({
  node,
  canBack,
  onBack,
  onNavigate,
}: {
  node: MemNode | null
  canBack: boolean
  onBack: () => void
  onNavigate: (id: string) => void
}) {
  if (!node) {
    return <EmptyState>select a node to inspect it</EmptyState>
  }
  return (
    <div className="px-4 py-3" data-testid="memory-inspector">
      <div className="flex items-center gap-2">
        {canBack && (
          <button
            onClick={onBack}
            className="flex size-6 cursor-pointer items-center justify-center rounded text-ink-mute hover:bg-raised hover:text-ink"
            aria-label="back"
          >
            <ArrowLeft size={14} />
          </button>
        )}
        <span className="font-mono text-[11px] text-ink-mute">{node.label}</span>
      </div>
      <div className="mt-1.5 font-mono text-[12px] break-all">{node.id}</div>

      {(node.extractedBy || node.confidence != null) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line pb-2.5">
          {node.extractedBy && (
            <span className="font-mono text-[11px] text-ink-mute">{node.extractedBy}</span>
          )}
          {node.confidence != null && <Confidence value={node.confidence} />}
        </div>
      )}

      <dl className="mt-3 grid grid-cols-[minmax(96px,max-content)_1fr] gap-x-4 gap-y-1.5 text-[12px]">
        {node.props.map((p, i) => (
          <div key={i} className="contents">
            <dt className="font-mono text-[11px] leading-5 text-ink-mute">{p.k}</dt>
            <dd
              className={cn(
                'min-w-0 leading-5 break-words',
                p.mono && 'font-mono text-[12px]',
              )}
            >
              {p.v}
            </dd>
          </div>
        ))}
      </dl>

      <EdgeList title="outgoing" edges={node.outgoing} onNavigate={onNavigate} />
      <EdgeList title="incoming" edges={node.incoming} onNavigate={onNavigate} />
    </div>
  )
}

export function MemoryPanel() {
  const [label, setLabel] = useState<string>('Preference')
  const [stack, setStack] = useState<string[]>(['pref-palette'])
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)

  const currentId = stack[stack.length - 1] ?? null
  const node = currentId ? (nodeById(currentId) ?? null) : null
  const nodes = nodesForLabel(label)

  const navigate = (id: string) => setStack((s) => [...s, id])
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s))
  const select = (id: string) => setStack([id])

  const runSearch = () => setSearching(query.trim().length > 0)
  const clearSearch = () => {
    setSearching(false)
    setQuery('')
  }

  const listCols: Column<MemNode>[] = [
    { key: 'display', header: 'display', render: (n) => truncate(n.display, 160) },
    {
      key: 'updated',
      header: 'updated',
      className: 'whitespace-nowrap w-24 text-right',
      render: (n) => <span className="font-mono text-[11px] text-ink-mute">{n.updated}</span>,
    },
  ]

  const hitCols: Column<SearchHit>[] = [
    {
      key: 'label',
      header: 'label',
      className: 'w-28',
      render: (h) => <span className="font-mono text-[11px] text-ink-mute">{h.label}</span>,
    },
    { key: 'text', header: 'text', render: (h) => truncate(h.text, 120) },
    {
      key: 'score',
      header: 'rerank',
      className: 'w-16 text-right font-mono',
      render: (h) => h.rerankScore.toFixed(2),
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <PanelHeader
        title="memory"
        actions={
          <div className="flex items-center gap-2">
            <TextInput
              value={query}
              onChange={setQuery}
              onEnter={runSearch}
              placeholder="search memory (vector + keyword + rerank)"
              ariaLabel="search memory"
              className="w-72"
            />
            {searching && (
              <Button size="dense" onClick={clearSearch}>
                clear
              </Button>
            )}
          </div>
        }
      />
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="min-h-0 overflow-y-auto border-r border-line">
          {searching ? (
            <div className="px-4 py-3">
              <div className="flex items-baseline gap-2 pt-1 pb-2">
                <h2 className="text-[14px] font-semibold">results for '{query}'</h2>
                <span className="text-[12px] text-ink-mute">{SEARCH_HITS.length} hits</span>
              </div>
              <DataTable
                columns={hitCols}
                rows={SEARCH_HITS}
                rowKey={(h) => h.id}
                onRowClick={(h) => nodeById(h.id) && select(h.id)}
                selectedKey={currentId}
              />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-1.5 px-4 py-3">
                {LABEL_COUNTS.map((lc) => {
                  const active = lc.label === label
                  return (
                    <button
                      key={lc.label}
                      onClick={() => setLabel(lc.label)}
                      className={cn(
                        'flex items-baseline gap-1.5 rounded-md px-2 py-1 text-[12px] transition-colors duration-120',
                        active
                          ? 'bg-raised text-ink shadow-[inset_2px_0_0_var(--color-accent)]'
                          : 'text-ink-mute hover:bg-raised hover:text-ink',
                      )}
                    >
                      {lc.label}
                      <span className="font-mono text-[11px]">{lc.count}</span>
                    </button>
                  )
                })}
              </div>
              <div className="px-4">
                <div className="flex items-baseline gap-2 pt-1 pb-2">
                  <h2 className="text-[14px] font-semibold">{label}</h2>
                  <span className="font-mono text-[11px] text-ink-mute">
                    {nodes.length} of {LABEL_COUNTS.find((l) => l.label === label)?.count}
                  </span>
                </div>
                <DataTable
                  columns={listCols}
                  rows={nodes}
                  rowKey={(n) => n.id}
                  onRowClick={(n) => select(n.id)}
                  selectedKey={currentId}
                  empty={`the other ${label} nodes are elided in this demo profile`}
                />
              </div>
            </>
          )}
        </div>
        <div className="min-h-0 overflow-y-auto">
          <Inspector node={node} canBack={stack.length > 1} onBack={back} onNavigate={navigate} />
        </div>
      </div>
    </div>
  )
}
