import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { getPatternBySlug, getAdjacentPatterns } from '../patterns/registry'
import type { PatternEntry } from '../shared/pattern.types'
import NotFound from './NotFound'
import PatternPager from '../components/PatternPager'

export default function PatternDetail(): ReactNode {
  const { slug } = useParams<{ slug: string }>()
  const pattern: PatternEntry | null = getPatternBySlug(slug ?? '')

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!pattern) return <NotFound />

  const { Component } = pattern
  const { prev, next } = getAdjacentPatterns(slug ?? '')

  return (
    <>
      <Component />
      <PatternPager prev={prev} next={next} />
    </>
  )
}
