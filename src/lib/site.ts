// Canonical links + facts for the site. The app publishes installers to the
// GitHub releases feed declared in electron-builder.yml
// (owner: Ibrahem-al, repo: agentic-os).

export const APP_NAME = 'Agentic OS'
// Pinned FALLBACK version — the download page fetches the real latest release
// from the GitHub API at runtime (fetchLatestRelease), so this only shows when
// that fetch fails. Keep it roughly current, but it no longer gates downloads.
export const APP_VERSION = '0.1.4'

export const APP_REPO = 'https://github.com/Ibrahem-al/agentic-os'
export const SITE_REPO = 'https://github.com/Ibrahem-al/agentic-os-web'

// The app repo is public; the Windows installer ships as a GitHub release there
// (its canonical home, and the feed the app's auto-updater checks).
export const RELEASES = 'https://github.com/Ibrahem-al/agentic-os/releases'
// Derived from APP_VERSION so a release only needs APP_VERSION bumped — no drift
// between the shown version, the artifact names, and this download URL.
export const WIN_INSTALLER_URL = `${APP_REPO}/releases/download/v${APP_VERSION}/agentic-os-${APP_VERSION}-win-x64.exe`

// The MCP surface — 127.0.0.1:4517, bearer auth (config.ts defaults).
export const MCP_URL = 'http://127.0.0.1:4517/mcp'
export const MCP_PORT = 4517

export const CLAUDE_MCP_ADD =
  'claude mcp add --transport http agentic-os http://127.0.0.1:4517/mcp --header "Authorization: Bearer <token>"'

// Installer artifact names (electron-builder artifactName pattern).
export const ARTIFACT = {
  win: `agentic-os-${APP_VERSION}-win-x64.exe`,
  macArm: `agentic-os-${APP_VERSION}-mac-arm64.dmg`,
  macX64: `agentic-os-${APP_VERSION}-mac-x64.dmg`,
  linuxAppImage: `agentic-os-${APP_VERSION}-linux-x86_64.AppImage`,
  linuxDeb: `agentic-os-${APP_VERSION}-linux-amd64.deb`,
} as const

/** The latest published release, resolved live from the GitHub API. */
export interface LatestRelease {
  /** e.g. '0.1.4' (tag with the leading v stripped). */
  version: string
  /** Direct download URL of the Windows installer asset. */
  winUrl: string
  /** Asset filename, e.g. 'agentic-os-0.1.4-win-x64.exe'. */
  winName: string
  /** Human-readable size, e.g. '152 MB'. */
  winSize: string
}

/**
 * Resolve the latest release + its Windows installer from the public GitHub
 * API (CORS-enabled, no auth for public repos). Returns null on ANY failure —
 * callers fall back to the pinned APP_VERSION constants, so the download
 * button always works even if the API is rate-limited or unreachable.
 */
export async function fetchLatestRelease(): Promise<LatestRelease | null> {
  try {
    const res = await fetch('https://api.github.com/repos/Ibrahem-al/agentic-os/releases/latest', {
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) return null
    const release = (await res.json()) as {
      tag_name?: string
      assets?: { name: string; browser_download_url: string; size: number }[]
    }
    const tag = release.tag_name
    const win = release.assets?.find((a) => a.name.endsWith('-win-x64.exe'))
    if (!tag || !win) return null
    return {
      version: tag.replace(/^v/, ''),
      winUrl: win.browser_download_url,
      winName: win.name,
      winSize: `${Math.round(win.size / 1_000_000)} MB`,
    }
  } catch {
    return null
  }
}

export type Platform = 'mac' | 'windows' | 'linux' | 'unknown'

export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'unknown'
  const p = `${navigator.platform} ${navigator.userAgent}`.toLowerCase()
  if (p.includes('mac')) return 'mac'
  if (p.includes('win')) return 'windows'
  if (p.includes('linux') || p.includes('x11')) return 'linux'
  return 'unknown'
}
