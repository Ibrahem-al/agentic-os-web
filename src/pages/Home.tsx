import { Link } from 'react-router-dom'
import {
  ArrowRight,
  MagnifyingGlass,
  GraduationCap,
  TrendUp,
  ShieldCheck,
  Gauge,
} from '@phosphor-icons/react'
import { Container, Reveal, SectionTitle, Lead, Stat, Callout } from '../components/site/primitives'
import { RetrievalSim } from '../components/marketing/RetrievalSim'
import { ArchitectureStack } from '../components/marketing/ArchitectureStack'
import { PipelineStrip } from '../components/marketing/PipelineStrip'
import { WindowFrame } from '../components/marketing/WindowFrame'
import { CodeBlock } from '../components/site/CodeBlock'
import { CLAUDE_MCP_ADD } from '../lib/site'

/* ------------------------------------------------------------------- hero */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="bg-halo absolute inset-0" />
      <div className="bg-grid absolute inset-0 opacity-60" />
      <Container size="wide" className="relative py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="min-w-0">
            <h1 className="text-balance text-[clamp(2.3rem,6vw,4rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
              A local-first memory for your AI agents.
            </h1>
            <p className="mt-6 max-w-[54ch] text-[clamp(1.05rem,1.7vw,1.28rem)] leading-relaxed text-ink-mute">
              Claude stays the orchestrator. Agentic OS serves context over MCP, learns from
              finished sessions, and runs agents that keep improving.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/download"
                className="flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-[14px] font-semibold text-accent-ink transition-colors duration-120 hover:bg-accent/85 active:translate-y-px"
              >
                Download for Mac & Windows
              </Link>
              <Link
                to="/console"
                className="flex h-11 items-center gap-2 rounded-md border border-line-strong px-5 text-[14px] font-medium text-ink transition-colors duration-120 hover:bg-raised active:translate-y-px"
              >
                Explore the console <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <Reveal delay={0.1} className="min-w-0">
            <RetrievalSim />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

/* --------------------------------------------------------------- the loop */

function TheLoop() {
  return (
    <section className="border-b border-line py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Reveal>
              <SectionTitle>
                Claude does the work.
                <br />
                Agentic OS remembers it.
              </SectionTitle>
              <Lead className="mt-5">
                Your memory lives on your machine, in one embedded graph store. Claude reads and
                retrieves live over MCP; its only write path is a staged correction a human approves.
                Nothing is a black box, and nothing is irreversible.
              </Lead>
              <div className="mt-8 flex flex-wrap gap-x-10 gap-y-6">
                <Stat value="38" label="MCP tools served" accent />
                <Stat value="1" label="write lane, provenance stamped" />
                <Stat value="100%" label="local memory & retrieval, offline-capable" />
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <ArchitectureStack />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

/* --------------------------------------------------------------- retrieval */

function Retrieval() {
  return (
    <section className="border-b border-line bg-void py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionTitle>Context, assembled on demand.</SectionTitle>
          <Lead className="mt-5">
            <span className="font-mono text-[0.95em] text-ink">get_context</span> runs a hybrid
            search inside a bounded, self-correcting loop: vector and full-text arms fuse with graph
            proximity, a cross-encoder reranks, and a local critic decides whether to answer or
            rewrite the query and try again. It returns a token-budgeted bundle with a confidence
            flag, and spends no cloud money doing it.
          </Lead>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 overflow-x-auto pb-2">
          <PipelineStrip />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: '30 + 30', l: 'vector top-k per label + full-text top-k, fused' },
            { v: '≤ 5', l: 'self-correcting loop iterations, then best-effort' },
            { v: '~570 MB', l: 'int8 ONNX reranker, downloaded once, checksum-verified' },
            { v: '8,192', l: 'token budget; global preferences ride first, always' },
          ].map((s) => (
            <Reveal key={s.l}>
              <div className="border-t border-line-strong pt-4">
                <div className="font-mono text-[clamp(1.3rem,2.2vw,1.7rem)] tracking-tight text-ink">
                  {s.v}
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-mute">{s.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------ capabilities */

function CapCard({
  icon: Icon,
  title,
  children,
  visual,
  span,
}: {
  icon: React.ComponentType<{ size?: number; weight?: 'regular' | 'bold' | 'fill' | 'duotone' }>
  title: string
  children: React.ReactNode
  visual?: React.ReactNode
  span?: boolean
}) {
  return (
    <div
      className={`flex flex-col rounded-lg border border-line bg-surface/50 p-5 ${
        span ? 'md:col-span-2' : ''
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-md bg-accent/12 text-accent">
          <Icon size={17} weight="bold" />
        </span>
        <h3 className="text-[15px] font-semibold">{title}</h3>
      </div>
      <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-ink-mute">{children}</p>
      {visual != null && <div className="mt-4">{visual}</div>}
    </div>
  )
}

function Capabilities() {
  return (
    <section className="border-b border-line py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionTitle>An operating system for agent memory.</SectionTitle>
          <Lead className="mt-5">
            Five jobs, all running quietly in the background while you and Claude work.
          </Lead>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <CapCard
            icon={MagnifyingGlass}
            title="Serves context over MCP"
            span
            visual={
              <div className="flex flex-wrap gap-1.5">
                {['get_context', 'search_memory', 'list_skills', 'get_skill', 'propose_correction', 'ingest_document', 'ingest_codebase'].map(
                  (t) => (
                    <span
                      key={t}
                      className="rounded bg-raised px-2 py-1 font-mono text-[11px] text-ink-mute"
                    >
                      {t}
                    </span>
                  ),
                )}
              </div>
            }
          >
            38 tools over a loopback HTTP server with bearer auth. Every call is logged to the
            server-side ledger. Reads open; writes land only as staged proposals a human approves.
          </CapCard>

          <CapCard
            icon={GraduationCap}
            title="Learns from finished sessions"
            visual={
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10.5px] text-ink-faint">
                <span className="text-ink-mute">collect</span>
                <span>→</span>
                <span className="text-ink-mute">extract</span>
                <span>→</span>
                <span className="text-ink-mute">verify</span>
                <span>→</span>
                <span className="text-warn">gate 0.6</span>
              </div>
            }
          >
            A session-end hook fires the extraction agent. Low-confidence items queue for review,
            never silently into memory.
          </CapCard>

          <CapCard
            icon={TrendUp}
            title="Improves its skills nightly"
            visual={
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-undo">0.62</span>
                <span className="h-px flex-1 bg-line-strong" />
                <ArrowRight size={12} className="text-ink-faint" />
                <span className="text-ok">0.91</span>
              </div>
            }
          >
            Skills that accrued corrections get a cloud-rewritten candidate, benchmarked on a
            held-out split. Verifiable wins auto-adopt with zero regressions; the rest wait for you.
          </CapCard>

          <CapCard
            icon={ShieldCheck}
            title="Runs automations safely"
            visual={
              <div className="flex flex-wrap gap-1.5 font-mono text-[10.5px]">
                <span className="rounded bg-raised px-2 py-1 text-ink-mute">deno --no-prompt</span>
                <span className="rounded bg-raised px-2 py-1 text-ink-mute">docker --network none</span>
              </div>
            }
          >
            User rules watch files, URLs, and schedules. Their code runs only in a deny-by-default
            sandbox, with side effects gated behind dashboard approvals.
          </CapCard>

          <CapCard
            icon={Gauge}
            title="Shows you everything"
            visual={
              <div className="flex flex-wrap gap-1.5 font-mono text-[10.5px] text-ink-faint">
                {['memory', 'review', 'audit', 'spend', 'tasks', 'traces', 'skills', 'ingest', 'settings'].map((p) => (
                  <span key={p} className="rounded bg-raised px-1.5 py-0.5">{p}</span>
                ))}
              </div>
            }
          >
            A nine-panel cockpit over real local stores: browse memory, decide any pending action,
            trace any reasoning, and undo any mistake in seconds.
          </CapCard>
        </div>
        <Reveal className="mt-6">
          <Link
            to="/console"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-accent hover:underline"
          >
            Open the interactive console <ArrowRight size={15} />
          </Link>
        </Reveal>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------- connect */

function Connect() {
  const steps = [
    {
      n: '01',
      title: 'Add the MCP server',
      body: 'The Settings panel shows the exact command with your token. Any MCP client works.',
      code: CLAUDE_MCP_ADD,
      label: 'terminal',
    },
    {
      n: '02',
      title: 'Install the session-end hook',
      body: 'One click deep-merges a SessionEnd entry into ~/.claude/settings.json. Existing hooks are preserved, a backup is written, the diff is shown.',
      code: '# Settings → session-end hook → install hook\n# offline? sessions spool to ~/.agentic-os/pending-sessions/\n# and drain on next launch, nothing is lost',
      label: 'what it does',
    },
    {
      n: '03',
      title: 'Add a cloud key (optional)',
      body: 'A bring-your-own key — or your Claude subscription (opt-in, off by default) — powers fuzzy-extraction escalation, independent verification, and skill rewrites. Retrieval, embeddings, and reranking always stay local.',
      code: '# Settings → provider + set key → restart\n# stored via the OS keychain (safeStorage), never plaintext\n# metered with a $0.50-per-task ceiling',
      label: 'what it does',
    },
  ]
  return (
    <section className="border-b border-line bg-void py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionTitle>Connect Claude Code in three steps.</SectionTitle>
          <Lead className="mt-5">
            The app generates the token, writes a sample <span className="font-mono text-[0.95em]">.mcp.json</span>, and
            walks you through Ollama setup on first launch.
          </Lead>
        </Reveal>
        <div className="mt-12 flex flex-col gap-5">
          {steps.map((s) => (
            <Reveal key={s.n}>
              <div className="grid gap-5 rounded-lg border border-line bg-surface/40 p-5 md:grid-cols-[0.8fr_1.2fr] md:p-6">
                <div className="flex gap-4">
                  <span className="font-mono text-[13px] text-accent">{s.n}</span>
                  <div>
                    <h3 className="text-[16px] font-semibold">{s.title}</h3>
                    <p className="mt-2 max-w-[42ch] text-[13.5px] leading-relaxed text-ink-mute">{s.body}</p>
                  </div>
                </div>
                <CodeBlock code={s.code} label={s.label} />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ---------------------------------------------------------------- cockpit */

function Cockpit() {
  return (
    <section className="border-b border-line py-20 sm:py-28">
      <Container size="wide">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <Reveal>
            <SectionTitle>The cockpit is the safety spine.</SectionTitle>
            <Lead className="mt-5">
              Review staged writes with a diff before commit. Approve or deny queued agent actions.
              Undo any graph write through its recorded inverse. Watch spend against a live ceiling.
              The dashboard is the only interface to the safety gates, so it never hides state.
            </Lead>
            <Callout tone="accent" title="Truth over polish" >
              Empty states say why they are empty. Errors surface verbatim backend messages. Nothing
              pretends to be loading when it is broken.
            </Callout>
          </Reveal>
          <Reveal delay={0.1} className="min-w-0">
            <WindowFrame title="agentic-os · review queue" meta="2 writes · 2 approvals">
              <img
                src="/shots/review-diff.png"
                alt="The review queue showing a staged extraction write with its diff, confidence meter, and approve and reject controls"
                className="block w-full"
                loading="lazy"
              />
            </WindowFrame>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------- safety */

function Safety() {
  return (
    <section className="border-b border-line bg-void py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionTitle>Yours, and reversible.</SectionTitle>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: 'local', l: 'Your memory graph, embeddings, and search index never leave your machine, and retrieval runs fully local. Reasoning is bring-your-own — an optional cloud key or your Claude subscription, off by default.' },
            { v: 'staged', l: "Claude's only write path is a proposed correction, validated and human-approved before it touches memory." },
            { v: 'sandboxed', l: 'Rule code runs in a Deno permission sandbox or a deny-by-default Docker container, never on the host.' },
            { v: 'undoable', l: 'Every agent write logs a reversible delta. The graph is backed up before any migration runs.' },
          ].map((s) => (
            <Reveal key={s.v}>
              <div>
                <div className="font-mono text-[clamp(1.5rem,2.6vw,2rem)] tracking-tight text-accent">
                  {s.v}
                </div>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-mute">{s.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ---------------------------------------------------------------------- cta */

function FinalCta() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="bg-halo absolute inset-0" />
      <Container className="relative text-center">
        <Reveal>
          <SectionTitle className="mx-auto max-w-[18ch]">
            Give your agents a memory that stays.
          </SectionTitle>
          <p className="mx-auto mt-5 max-w-[52ch] text-[16px] leading-relaxed text-ink-mute">
            Free, MIT-licensed, and built to run on the machine you already work on. Installers for
            macOS and Windows, or build it from source.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/download"
              className="flex h-11 items-center gap-2 rounded-md bg-accent px-6 text-[14px] font-semibold text-accent-ink transition-colors duration-120 hover:bg-accent/85 active:translate-y-px"
            >
              Download Agentic OS
            </Link>
            <Link
              to="/learn"
              className="flex h-11 items-center gap-2 rounded-md border border-line-strong px-6 text-[14px] font-medium text-ink transition-colors duration-120 hover:bg-raised active:translate-y-px"
            >
              Read the docs <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

export function Home() {
  return (
    <>
      <Hero />
      <TheLoop />
      <Retrieval />
      <Capabilities />
      <Connect />
      <Cockpit />
      <Safety />
      <FinalCta />
    </>
  )
}
