import { useState } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

export const meta: PatternMeta = {
  slug: 'iterator',
  title: 'Iterator',
  navLabel: 'Iterator',
  category: 'Behavioral',
  order: 15,
}

const rangeCode = `// --- A generator function produces a lazy sequence ---

function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i
  }
}

// Consume the iterator on demand
const evens = range(0, 10, 2)

evens.next() // { value: 0, done: false }
evens.next() // { value: 2, done: false }

// Or collect all at once
[...range(0, 10, 2)] // [0, 2, 4, 6, 8]`

const pipelineCode = `// --- map/filter/find are the everyday iterators ---

const numbers = [1, 2, 3, 4, 5, 6]

const result = numbers
  .filter((n) => n % 2 === 0)   // select evens
  .map((n) => n * 10)           // scale up
  .filter((n) => n > 25)        // keep large enough

// result = [40, 60]
// No iterator class — just composed higher-order functions`

/* ------------------------------------------------------------------ */
/*  Shared logic — the generator from the example, lifted for the widget */
/* ------------------------------------------------------------------ */

function* range(
  start: number,
  end: number,
  step: number = 1
): Generator<number, void, unknown> {
  for (let i = start; i < end; i += step) {
    yield i
  }
}

function* fibonacci(): Generator<number, void, unknown> {
  let a = 0
  let b = 1
  while (true) {
    yield a
    ;[a, b] = [b, a + b]
  }
}

type SequenceKind = 'range' | 'fibonacci'

function IteratorWidget(): ReactNode {
  const [kind, setKind] = useState<SequenceKind>('range')
  const [values, setValues] = useState<number[]>([])

  const handleNext = () => {
    const gen: Generator<number, void, unknown> =
      kind === 'range' ? range(0, 50, 2) : fibonacci()
    // skip already-pulled values
    let next: number | undefined
    for (let i = 0; i <= values.length; i++) {
      const r = gen.next()
      if (!r.done) next = r.value as number
    }
    if (next !== undefined) {
      setValues((prev) => [...prev, next])
    }
  }

  const handleReset = () => setValues([])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label
          htmlFor="iter-seq-select"
          className="text-sm font-medium text-slate-700"
        >
          Sequence:
        </label>
        <select
          id="iter-seq-select"
          value={kind}
          onChange={(e) => {
            setKind(e.target.value as SequenceKind)
            setValues([])
          }}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm"
        >
          <option value="range">range(0, 50, 2)</option>
          <option value="fibonacci">fibonacci()</option>
        </select>

        <button
          type="button"
          onClick={handleNext}
          className="rounded-md border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
        >
          Next
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="rounded-md border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {values.length === 0 && (
          <span className="text-sm text-slate-400">
            Press <span className="font-mono">Next</span> to pull values…
          </span>
        )}
        {values.map((v, i) => (
          <span
            key={i}
            className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-sm text-blue-700"
          >
            {v}
          </span>
        ))}
      </div>

      {values.length > 0 && (
        <p className="text-xs text-slate-400">
          Last call: <code className="font-mono">next()</code> →{' '}
          <code className="font-mono">{`{ value: ${values[values.length - 1]}, done: false }`}</code>
        </p>
      )}
    </div>
  )
}

export default function IteratorPattern(): ReactNode {
  return (
    <>
      <StepHeader
        order={15}
        title="Iterator"
        intro="Traverse elements of a collection without exposing its underlying representation. The Iterator pattern decouples traversal algorithms from the data structures they operate on."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Iterator pattern provides a way to access the elements of an
          aggregate object sequentially without exposing its underlying
          representation. It lets you traverse different collections through a
          common interface, so the client code doesn&apos;t need to know whether
          it&apos;s walking a list, a tree, or a generated sequence.
        </p>

        <h2>OO vs functional</h2>
        <p>
          In classic object-oriented design, you define an{' '}
          <code>Iterator</code> interface with <code>hasNext()</code> and{' '}
          <code>next()</code> methods, then implement concrete iterator classes
          for each collection type. In JavaScript,{' '}
          <strong>the iterator protocol is built into the language</strong>.
          Generator functions (<code>function*</code>) and the{' '}
          <code>Symbol.iterator</code> protocol produce lazy sequences without
          any iterator class. Everyday array methods like{' '}
          <code>map</code>, <code>filter</code>, and <code>reduce</code> are the
          functional form of the pattern — you compose transformations, not
          stateful cursor objects.
        </p>

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={[
              'Iterator «interface»',
              'hasNext() : boolean',
              'next() : T',
              'ConcreteIterator',
              'Aggregate «interface»',
              'createIterator()',
            ]}
            fp={[
              'function* range()',
              'Symbol.iterator',
              'yield',
              'next() → {value, done}',
              'map / filter / reduce',
              '[...iterable]',
            ]}
          />
        </Diagram>

        <h2>Functional example — generators</h2>
        <p>
          A generator function that yields values one at a time is a lazy
          iterator. It pauses execution at each <code>yield</code> and resumes
          when the consumer asks for the next value. No class, no mutable
          cursor — just a function that returns an iterable.
        </p>
        <CodeBlock code={rangeCode} />

        <h2>Functional example — pipelines</h2>
        <p>
          Most iteration in functional JavaScript happens through{' '}
          <code>map</code>, <code>filter</code>, and <code>reduce</code>.
          Chaining these creates a declarative pipeline — you say{' '}
          <em>what</em> you want, not <em>how</em> to walk the data.
        </p>
        <CodeBlock code={pipelineCode} />

        <Callout tone="tip">
          In FP, the Iterator pattern disappears into the language itself:
          generators produce lazy iterables, and <strong>map/filter/reduce</strong>{' '}
          compose transformations over any iterable. No <code>Iterator</code>{' '}
          class — just functions that transform data through the iterator
          protocol.
        </Callout>

        <Widget title="Try the iterator protocol">
          <IteratorWidget />
        </Widget>

        <Diagram caption="Data flow through a generator iterator">
          <FlowDiagram
            steps={['function*', 'yield', 'next()', '{value, done}', 'result']}
          />
        </Diagram>
      </div>
    </>
  )
}
