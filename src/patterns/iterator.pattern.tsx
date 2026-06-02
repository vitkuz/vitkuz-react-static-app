import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

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
      </div>
    </>
  )
}
