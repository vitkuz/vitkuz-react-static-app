import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import StepHeader from '../components/StepHeader'
import { groupPatternsByCategory } from '../patterns/registry'

export default function Patterns(): ReactNode {
  const categories = groupPatternsByCategory()

  return (
    <>
      <StepHeader
        order={0}
        title="Design Patterns"
        intro="Classic software design patterns expressed in a functional style, using plain functions and composition instead of classes and interfaces."
      />
      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <p>
          Each pattern explains the original intent, contrasts the OO and
          functional approaches, and provides a pure-function implementation
          you can drop into any JavaScript project.
        </p>
      </div>

      {categories.map(([category, patterns]) =>
        patterns.length > 0 ? (
          <section key={category} className="not-prose mt-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              {category}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {patterns.map((p) => (
                <Link
                  key={p.slug}
                  to={`/patterns/${p.slug}`}
                  className="rounded-lg border border-slate-200 bg-white px-5 py-4 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <strong className="text-sm font-medium text-slate-900">
                    {p.order}. {p.title}
                  </strong>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {p.navLabel}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null
      )}
    </>
  )
}
