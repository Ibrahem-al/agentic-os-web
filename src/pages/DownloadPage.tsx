import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AppleLogo,
  WindowsLogo,
  LinuxLogo,
  DownloadSimple,
  Terminal,
  ArrowRight,
  Check,
} from '@phosphor-icons/react'
import { Container, Reveal, SectionTitle, Callout } from '../components/site/primitives'
import { CodeBlock } from '../components/site/CodeBlock'
import { detectPlatform, type Platform, APP_RELEASES_LATEST, APP_REPO, APP_VERSION, ARTIFACT } from '../lib/site'

type IconCmp = React.ComponentType<{
  size?: number
  weight?: 'regular' | 'bold' | 'fill' | 'duotone'
  className?: string
}>

const PLATFORMS: {
  key: Platform
  name: string
  icon: IconCmp
  artifact: string
  note: string
}[] = [
  { key: 'mac', name: 'macOS', icon: AppleLogo, artifact: `${ARTIFACT.macArm} · ${ARTIFACT.macX64}`, note: 'Apple Silicon and Intel. Unsigned: right-click → Open on first launch.' },
  { key: 'windows', name: 'Windows', icon: WindowsLogo, artifact: ARTIFACT.win, note: 'NSIS installer, per-user, no elevation prompt.' },
  { key: 'linux', name: 'Linux', icon: LinuxLogo, artifact: `${ARTIFACT.linuxAppImage} · ${ARTIFACT.linuxDeb}`, note: 'AppImage or Debian package.' },
]

function DownloadCard({ p, primary }: { p: (typeof PLATFORMS)[number]; primary: boolean }) {
  const Icon = p.icon
  return (
    <div
      className={`flex flex-col rounded-lg border p-5 ${
        primary ? 'border-accent/40 bg-accent/5' : 'border-line bg-surface/40'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={26} weight="fill" className={primary ? 'text-accent' : 'text-ink'} />
        <div>
          <div className="text-[16px] font-semibold">{p.name}</div>
          {primary && <div className="font-mono text-[11px] text-accent">detected</div>}
        </div>
      </div>
      <p className="mt-3 flex-1 text-[13px] leading-relaxed text-ink-mute">{p.note}</p>
      <div className="mt-2 font-mono text-[10.5px] break-all text-ink-faint">{p.artifact}</div>
      <a
        href={APP_RELEASES_LATEST}
        target="_blank"
        rel="noreferrer"
        className={`mt-4 flex h-10 items-center justify-center gap-2 rounded-md text-[13.5px] font-semibold transition-colors active:translate-y-px ${
          primary
            ? 'bg-accent text-accent-ink hover:bg-accent/85'
            : 'border border-line-strong text-ink hover:bg-raised'
        }`}
      >
        <DownloadSimple size={16} weight="bold" /> Download for {p.name}
      </a>
    </div>
  )
}

export function DownloadPage() {
  const [platform, setPlatform] = useState<Platform>('unknown')
  useEffect(() => setPlatform(detectPlatform()), [])

  const ordered = [...PLATFORMS].sort((a) => (a.key === platform ? -1 : 0))

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div className="bg-halo absolute inset-0" />
        <Container className="relative py-16 sm:py-20">
          <div className="max-w-[52ch]">
            <h1 className="text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[-0.03em]">
              Download Agentic OS
            </h1>
            <p className="mt-5 text-[clamp(1rem,1.6vw,1.2rem)] leading-relaxed text-ink-mute">
              Free and MIT-licensed. Installers for macOS and Windows, or build it from source in a
              few commands. Version {APP_VERSION}.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {ordered.map((p) => (
              <DownloadCard key={p.key} p={p} primary={p.key === platform} />
            ))}
          </div>

          <p className="mt-5 text-[12.5px] text-ink-faint">
            Installers are published to{' '}
            <a href={APP_RELEASES_LATEST} target="_blank" rel="noreferrer" className="text-accent hover:underline">
              GitHub Releases
            </a>
            . Each build produces Windows NSIS, macOS dmg and zip (arm64 + x64), and Linux AppImage and
            deb.
          </p>
        </Container>
      </section>

      {/* build from source */}
      <section className="border-b border-line py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="flex items-center gap-2 font-mono text-[11px] text-accent">
              <Terminal size={14} /> from source
            </div>
            <SectionTitle className="mt-2">Build it yourself</SectionTitle>
            <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-ink-mute">
              The same steps work on macOS, Windows, and Linux. The native rebuild is the one thing to
              get right: it makes the embedded graph engine and SQLite load under Electron.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <Reveal>
              <CodeBlock
                label="clone, install, run"
                code={`git clone ${APP_REPO.replace('https://', '')}
cd agentic-os

npm ci

# REQUIRED on Windows (RyuGraph Electron build, ~30-60 min first time);
# quick on macOS/Linux (better-sqlite3 dual-ABI stash)
npm run rebuild:native

npm run dev              # Electron app with HMR`}
              />
            </Reveal>
            <Reveal delay={0.05}>
              <CodeBlock
                label="package installers into dist/"
                code={`npm run build           # bundle main / preload / renderer
npm run package         # electron-builder → dist/

# Re-run rebuild:native after ANY later npm install: ryugraph's
# install script silently restores the prebuilt binding, which
# hard-crashes Electron. A warm rebuild is seconds.`}
              />
            </Reveal>
          </div>

          <div className="mt-6">
            <Callout tone="warn" title="Windows prerequisite">
              The source build of the graph engine needs Visual Studio 2022 Build Tools (C++). macOS
              and Linux resolve symbols at load time and need none of this.
            </Callout>
          </div>
        </Container>
      </section>

      {/* requirements */}
      <section className="border-b border-line bg-void py-16 sm:py-20">
        <Container>
          <Reveal>
            <SectionTitle>What you need</SectionTitle>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {[
              {
                title: 'Ollama with two models',
                body: 'bge-m3 for embeddings and qwen3:4b for the small local LLM. The app detects a missing daemon or models at launch and offers one-click pulls in Settings.',
                req: 'required',
              },
              {
                title: 'About 570 MB of disk',
                body: 'The int8 ONNX reranker downloads to the app data directory on first retrieval, checksum-verified and resumable.',
                req: 'required',
              },
              {
                title: 'A cloud API key',
                body: 'Anthropic, OpenAI, Gemini, or OpenRouter. Powers extraction escalation, verification, and skill rewrites. Everything else works fully offline. Stored in the OS keychain, metered with a $0.50-per-task ceiling.',
                req: 'optional',
              },
              {
                title: 'Docker',
                body: 'Only if you write automation rules in languages other than JS/TS. They run in a deny-by-default Linux container. The daemon must be in Linux-containers mode.',
                req: 'optional',
              },
            ].map((r) => (
              <Reveal key={r.title}>
                <div className="flex gap-3 rounded-lg border border-line bg-surface/40 p-5">
                  <Check
                    size={18}
                    weight="bold"
                    className={r.req === 'required' ? 'mt-0.5 shrink-0 text-ok' : 'mt-0.5 shrink-0 text-ink-faint'}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-semibold">{r.title}</h3>
                      <span
                        className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                          r.req === 'required' ? 'bg-ok/15 text-ok' : 'bg-raised text-ink-faint'
                        }`}
                      >
                        {r.req}
                      </span>
                    </div>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink-mute">{r.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* connect */}
      <section className="py-16 sm:py-20">
        <Container className="text-center">
          <Reveal>
            <SectionTitle className="mx-auto max-w-[20ch]">First launch sets everything up.</SectionTitle>
            <p className="mx-auto mt-5 max-w-[56ch] text-[15px] leading-relaxed text-ink-mute">
              The first run creates the graph store, generates your MCP bearer token, and walks you
              through Ollama setup in Settings. Then connect Claude Code in three steps.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/learn/mcp"
                className="flex h-11 items-center gap-2 rounded-md bg-accent px-5 text-[14px] font-semibold text-accent-ink hover:bg-accent/85 active:translate-y-px"
              >
                How to connect Claude <ArrowRight size={16} />
              </Link>
              <Link
                to="/console"
                className="flex h-11 items-center gap-2 rounded-md border border-line-strong px-5 text-[14px] font-medium text-ink hover:bg-raised active:translate-y-px"
              >
                See the console first
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  )
}
