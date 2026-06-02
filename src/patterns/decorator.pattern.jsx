import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta = {
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

export default function DecoratorPattern() {
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
      </div>
    </>
  )
}
