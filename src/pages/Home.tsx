import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import StepHeader from '../components/StepHeader'

export default function Home(): ReactNode {
  return (
    <>
      <StepHeader
        order={1}
        title="Build something great"
        intro="A step-by-step guide to functional programming patterns in JavaScript. Clean typography, generous whitespace, and practical code examples."
      />
      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <p>
          Welcome to <strong>Programming Patterns</strong> — a modern guide to
          functional programming techniques you can apply in everyday JavaScript.
        </p>
        <p>
          Each step introduces a core pattern with clear explanations,
          when-to-use-it guidance, and syntax-highlighted code examples. Start
          from the beginning or jump to the pattern that interests you.
        </p>
        <div className="not-prose mt-6">
          <Link
            to="/docs"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            Read the docs
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </>
  )
}
