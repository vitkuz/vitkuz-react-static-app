const modules = import.meta.glob('./*.pattern.jsx', { eager: true })

const patterns = Object.entries(modules).map(([, mod]) => ({
  ...mod.meta,
  Component: mod.default,
}))

const ordered = [...patterns].sort((a, b) => a.order - b.order)

export function getOrderedPatterns() {
  return ordered
}

export function getPatternBySlug(slug) {
  return ordered.find((p) => p.slug === slug) || null
}

export function getAdjacentPatterns(slug) {
  const idx = ordered.findIndex((p) => p.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? ordered[idx - 1] : null,
    next: idx < ordered.length - 1 ? ordered[idx + 1] : null,
  }
}

const categoryOrder = ['Creational', 'Structural', 'Behavioral']

export function groupPatternsByCategory() {
  const map = new Map()
  for (const cat of categoryOrder) {
    map.set(cat, [])
  }
  for (const p of ordered) {
    if (map.has(p.category)) {
      map.get(p.category).push(p)
    }
  }
  return Array.from(map.entries())
}
