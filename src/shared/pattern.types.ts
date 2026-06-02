import type { ComponentType } from 'react'

export type PatternCategory = 'Creational' | 'Structural' | 'Behavioral'

export interface PatternMeta {
  slug: string
  title: string
  navLabel: string
  category: PatternCategory
  order: number
}

export interface PatternEntry extends PatternMeta {
  Component: ComponentType
}
