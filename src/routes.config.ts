export interface PageEntry {
  path: string
  label: string
  step: number
  section: string
}

const pages: PageEntry[] = [
  { path: '/', label: 'Home', step: 1, section: 'Getting Started' },
  { path: '/docs', label: 'Introduction', step: 2, section: 'Getting Started' },
  { path: '/docs/getting-started', label: 'Getting Started', step: 3, section: 'Getting Started' },
  { path: '/docs/patterns/composition', label: 'Composition', step: 4, section: 'Patterns' },
  { path: '/docs/patterns/currying', label: 'Currying', step: 5, section: 'Patterns' },
  { path: '/docs/patterns/higher-order-functions', label: 'Higher-Order Functions', step: 6, section: 'Patterns' },
  { path: '/docs/patterns/immutability', label: 'Immutability', step: 7, section: 'Patterns' },
  { path: '/docs/patterns/memoization', label: 'Memoization', step: 8, section: 'Patterns' },
  { path: '/docs/patterns/maybe', label: 'Either / Maybe', step: 9, section: 'Patterns' },
]

export function getPageIndex(pathname: string): number {
  return pages.findIndex((p) => p.path === pathname)
}

export interface PrevNext {
  prev: PageEntry | null
  next: PageEntry | null
}

export function getPrevNext(pathname: string): PrevNext {
  const idx: number = getPageIndex(pathname)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? pages[idx - 1] : null,
    next: idx < pages.length - 1 ? pages[idx + 1] : null,
  }
}

export function getSections(): Array<[string, PageEntry[]]> {
  const map: Map<string, PageEntry[]> = new Map()
  for (const p of pages) {
    if (!map.has(p.section)) map.set(p.section, [])
    map.get(p.section)?.push(p)
  }
  return Array.from(map.entries())
}

export default pages
