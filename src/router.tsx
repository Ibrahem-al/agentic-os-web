import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { SiteLayout, ConsoleLayout } from './components/site/SiteLayout'
import { Home } from './pages/Home'

// Home is eager (the landing / LCP). Everything else is code-split.
const lazyNamed = <T extends Record<string, React.ComponentType>>(
  loader: () => Promise<T>,
  key: keyof T,
) => lazy(() => loader().then((m) => ({ default: m[key] as React.ComponentType })))

const ConsolePage = lazyNamed(() => import('./pages/ConsolePage'), 'ConsolePage')
const DownloadPage = lazyNamed(() => import('./pages/DownloadPage'), 'DownloadPage')
const LearnLayout = lazyNamed(() => import('./pages/learn/LearnLayout'), 'LearnLayout')
const LearnIndex = lazyNamed(() => import('./pages/learn/LearnIndex'), 'LearnIndex')
const Architecture = lazyNamed(() => import('./pages/learn/Architecture'), 'Architecture')
const Mcp = lazyNamed(() => import('./pages/learn/Mcp'), 'Mcp')
const Retrieval = lazyNamed(() => import('./pages/learn/Retrieval'), 'Retrieval')
const Memory = lazyNamed(() => import('./pages/learn/Memory'), 'Memory')
const Agents = lazyNamed(() => import('./pages/learn/Agents'), 'Agents')
const Security = lazyNamed(() => import('./pages/learn/Security'), 'Security')
const Stack = lazyNamed(() => import('./pages/learn/Stack'), 'Stack')
const Build = lazyNamed(() => import('./pages/learn/Build'), 'Build')
const NotFound = lazyNamed(() => import('./pages/NotFound'), 'NotFound')

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/download', element: <DownloadPage /> },
      {
        path: '/learn',
        element: <LearnLayout />,
        children: [
          { index: true, element: <LearnIndex /> },
          { path: 'architecture', element: <Architecture /> },
          { path: 'mcp', element: <Mcp /> },
          { path: 'retrieval', element: <Retrieval /> },
          { path: 'memory', element: <Memory /> },
          { path: 'agents', element: <Agents /> },
          { path: 'security', element: <Security /> },
          { path: 'stack', element: <Stack /> },
          { path: 'build', element: <Build /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    element: <ConsoleLayout />,
    children: [{ path: '/console', element: <ConsolePage /> }],
  },
])
