import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getPatternBySlug, getAdjacentPatterns } from '../patterns/registry'
import NotFound from './NotFound'
import PatternPager from '../components/PatternPager'

export default function PatternDetail() {
  const { slug } = useParams()
  const pattern = getPatternBySlug(slug)

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!pattern) return <NotFound />

  const { Component } = pattern
  const { prev, next } = getAdjacentPatterns(slug)

  return (
    <>
      <Component />
      <PatternPager prev={prev} next={next} />
    </>
  )
}
