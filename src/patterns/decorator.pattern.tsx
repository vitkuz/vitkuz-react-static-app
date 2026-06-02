import { useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

export const meta: PatternMeta = {
  slug: 'decorator',
  title: 'Decorator',
  navLabel: 'Decorator',
  category: 'Structural',
  order: 9,
}

const decoratorCode = `// ---- Decorator = higher-order function ----

// A decorator is a function that takes a function and returns a function.
// It wraps the original, adding behavior before, after, or around the call —
// all while preserving the original signature.

const withLogging =
  (fn) =>
  (...args) => {
    console.log('Calling with', args)
    const result = fn(...args)
    console.log('Returned', result)
    return result
  }

const withRetry =
  ({ attempts = 3 } = {}) =>
  (fn) =>
  async (...args) => {
    for (let i = 0; i <= attempts; i++) {
      try {
        return await fn(...args)
      } catch (err) {
        if (i === attempts) throw err
        console.warn('Retry', i + 1, err.message)
      }
    }
  }

// ---- Compose decorators with pipe ----

const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x)

// A plain base function to decorate
const baseFetch = (url) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error('Fetch failed')
    return r.json()
  })

// Stack decorators: retry wraps logging wraps the base function
const fetchX = pipe(withLogging, withRetry({ attempts: 2 }))(baseFetch)

// fetchX('/api/data').then(console.log)`

/* ------------------------------------------------------------------ */
/*  Shared logic — same pure functions shown in the code example      */
/* ------------------------------------------------------------------ */

// A decorator is a HOF: fn → fn
type AnyFn = (...args: any[]) => any

const pipe =
  <T,>(...fns: Array<(x: T) => T>): ((x: T) => T) =>
  (x: T): T =>
    fns.reduce((v, f) => f(v), x)

const greet = (name: string): string => `Hello, ${name}!`

/* ------------------------------------------------------------------ */
/*  Interactive widget                                                */
/* ------------------------------------------------------------------ */

function DecoratorWidget(): ReactNode {
  const [name, setName] = useState('World')
  const [enableLogging, setEnableLogging] = useState(false)
  const [enableUpper, setEnableUpper] = useState(false)

  const { result, log } = useMemo(() => {
    const newLog: string[] = []

    const withLogEffect =
      <F extends AnyFn>(fn: F): F =>
      ((...args: Parameters<F>): ReturnType<F> => {
        newLog.push(`Calling with ${JSON.stringify(args)}`)
        const res = fn(...args)
        newLog.push(`Returned ${JSON.stringify(res)}`)
        return res
      }) as F

    const withUpper =
      <F extends AnyFn>(fn: F): F =>
      ((...args: Parameters<F>): ReturnType<F> => {
        const res = fn(...args)
        return (
          typeof res === 'string' ? (res as string).toUpperCase() : res
        ) as ReturnType<F>
      }) as F

    const decorators: Array<(x: AnyFn) => AnyFn> = []
    if (enableLogging) decorators.push(withLogEffect)
    if (enableUpper) decorators.push(withUpper)

    const composed = pipe(...decorators)(greet) as (n: string) => string
    return { result: composed(name), log: newLog }
  }, [name, enableLogging, enableUpper])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="deco-name"
            className="text-sm font-medium text-slate-700"
          >
            Name:
          </label>
          <input
            id="deco-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm font-mono"
          />
        </div>
        <label className="flex items-center gap-1.5 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={enableLogging}
            onChange={(e) => setEnableLogging(e.target.checked)}
            className="rounded border-slate-300"
          />
          Logging
        </label>
        <label className="flex items-center gap-1.5 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={enableUpper}
            onChange={(e) => setEnableUpper(e.target.checked)}
            className="rounded border-slate-300"
          />
          Uppercase
        </label>
      </div>

      <div className="border-t border-slate-200 pt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-slate-500">Output:</span>
          <span className="font-mono text-lg font-semibold text-slate-900">
            {result}
          </span>
        </div>
      </div>

      {enableLogging && log.length > 0 && (
        <div className="border-t border-slate-200 pt-3">
          <span className="text-sm font-medium text-slate-700">
            Effect log:
          </span>
          <div className="mt-1 space-y-0.5 rounded-md bg-slate-50 p-2 font-mono text-xs text-slate-600">
            {log.map((entry, i) => (
              <div key={i}>{entry}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function DecoratorPattern(): ReactNode {
  return (
    <>
      <StepHeader
        order={9}
        title="Decorator"
        intro="Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Decorator pattern lets you layer new behavior onto an object at
          runtime without modifying its existing code or creating a deep class
          hierarchy. Each decorator wraps the original and adds a single
          concern, keeping responsibilities separated and composable.
        </p>

        <h2>OO vs functional</h2>
        <p>
          In object-oriented design, decorators are wrapper classes that
          implement the same interface as the component they wrap, delegating
          calls while adding extra work before or after. In functional
          programming, <strong>a decorator is a higher-order function</strong>:
          it takes a function and returns a new function with the same
          signature, wrapping the original call. You stack decorators with{' '}
          <code>pipe</code> or <code>compose</code> instead of nesting wrapper
          objects — no interfaces, no delegation boilerplate.
        </p>

        <Diagram title="Classic vs functional participants">
          <CompareDiagram
            oo={[
              'Component «interface»',
              'ConcreteComponent',
              'Decorator «abstract»',
              'ConcreteDecoratorA',
              'ConcreteDecoratorB',
            ]}
            fp={[
              'baseFetch',
              'withLogging(fn)',
              'withRetry({attempts})(fn)',
              'pipe(...decorators)',
              'fetchX',
            ]}
          />
        </Diagram>

        <h2>Functional example</h2>
        <p>
          Below, <code>withLogging</code> wraps any function to log its
          arguments and return value. <code>withRetry</code> is a curried
          decorator factory that re-attempts failed async calls. A simple{' '}
          <code>pipe</code> composes them so that logging wraps the base
          function first, then retry wraps logging — all without mutating the
          original <code>baseFetch</code>.
        </p>
        <CodeBlock code={decoratorCode} />

        <Callout tone="tip">
          In FP, decoration is just <strong>function composition</strong>:
          write small, single-purpose higher-order functions and stack them
          with <code>pipe</code> or <code>compose</code>. The result is a new
          function with the original signature but enriched behavior — no
          classes, no wrapper objects, no shared state.
        </Callout>

        <Widget title="Try the decorators">
          <DecoratorWidget />
        </Widget>

        <Diagram caption="Composition flow through decorators">
          <FlowDiagram steps={['greet', 'withLogging', 'withUpper', 'result']} />
        </Diagram>
      </div>
    </>
  )
}
