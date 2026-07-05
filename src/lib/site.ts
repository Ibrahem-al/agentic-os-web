// Canonical links + facts for the site. The app publishes installers to the
// GitHub releases feed declared in electron-builder.yml
// (owner: Ibrahem-al, repo: agentic-os).

export const APP_NAME = 'Agentic OS'
export const APP_VERSION = '0.1.0'

export const APP_REPO = 'https://github.com/Ibrahem-al/agentic-os'
export const APP_RELEASES = 'https://github.com/Ibrahem-al/agentic-os/releases'
export const APP_RELEASES_LATEST =
  'https://github.com/Ibrahem-al/agentic-os/releases/latest'
export const SITE_REPO = 'https://github.com/Ibrahem-al/agentic-os-web'

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

export type Platform = 'mac' | 'windows' | 'linux' | 'unknown'

export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'unknown'
  const p = `${navigator.platform} ${navigator.userAgent}`.toLowerCase()
  if (p.includes('mac')) return 'mac'
  if (p.includes('win')) return 'windows'
  if (p.includes('linux') || p.includes('x11')) return 'linux'
  return 'unknown'
}
