import type {
  PatternCategory,
  PatternEntry,
  PatternMeta,
} from '../shared/pattern.types'
import type { ComponentType } from 'react'

interface PatternModule {
  meta: PatternMeta
  default: ComponentType
}

const modules: Record<string, PatternModule> = import.meta.glob<PatternModule>(
  './*.pattern.tsx',
  { eager: true },
)

const patterns: PatternEntry[] = Object.values(modules).map(
  (mod): PatternEntry => ({
    ...mod.meta,
    Component: mod.default,
  }),
)

const ordered: PatternEntry[] = [...patterns].sort((a, b) => a.order - b.order)

export function getOrderedPatterns(): PatternEntry[] {
  return ordered
}

export function getPatternBySlug(slug: string): PatternEntry | null {
  return ordered.find((p) => p.slug === slug) ?? null
}

export interface AdjacentPatterns {
  prev: PatternEntry | null
  next: PatternEntry | null
}

export function getAdjacentPatterns(slug: string): AdjacentPatterns {
  const idx: number = ordered.findIndex((p) => p.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? ordered[idx - 1] : null,
    next: idx < ordered.length - 1 ? ordered[idx + 1] : null,
  }
}

const categoryOrder: PatternCategory[] = [
  'Creational',
  'Structural',
  'Behavioral',
]

export function groupPatternsByCategory(): Array<
  [PatternCategory, PatternEntry[]]
> {
  const map: Map<PatternCategory, PatternEntry[]> = new Map()
  for (const cat of categoryOrder) {
    map.set(cat, [])
  }
  for (const p of ordered) {
    map.get(p.category)?.push(p)
  }
  return Array.from(map.entries())
}
