import type { ReactNode } from 'react'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

const pipeCode = `// pipe – left-to-right function composition
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)

const trim = (s) => s.trim()
const upper = (s) => s.toUpperCase()
const exclaim = (s) => s + '!'

const shout = pipe(trim, upper, exclaim)

shout('  hello  ') // 'HELLO!'
shout('  functional  ') // 'FUNCTIONAL!'`

const composeCode = `// compose – right-to-left (also easy to build from pipe)
const compose = (...fns) => pipe(...fns.reverse())

const addPrefix = (p) => (s) => p + s
const sanitize = (s) => s.replace(/[^a-zA-Z0-9]/g, '')

const makeUsername = compose(
  addPrefix('user_'),
  sanitize,
  (s) => s.toLowerCase()
)

makeUsername('  Alice! ') // 'user_alice'`

export default function Composition(): ReactNode {
  return (
    <>
      <StepHeader
        order={4}
        title="Function Composition"
        intro="Function composition is the act of combining two or more functions to produce a new function. Instead of nesting calls, you build a pipeline where the output of one function feeds into the next — making data flow explicit and code easier to reason about."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>When to use it</h2>
        <ul>
          <li>You have a chain of transformations on the same piece of data.</li>
          <li>You want to avoid deeply nested function calls.</li>
          <li>Each step is a small, pure function — easy to test in isolation.</li>
          <li>The data flows in one direction and no side-effects are involved.</li>
        </ul>

        <h2>
          <code>pipe</code> — left-to-right
        </h2>
        <p>
          A simple <code>pipe</code> is implemented with <code>reduce</code>.
          Functions are applied in the order you list them.
        </p>
        <CodeBlock code={pipeCode} />

        <h2>
          <code>compose</code> — right-to-left
        </h2>
        <p>
          Compose is the mathematical convention: the last function in the list
          runs first. It&rsquo;s easily built from <code>pipe</code> by reversing
          the argument order.
        </p>
        <CodeBlock code={composeCode} />

        <Callout tone="info" title="pipe vs compose">
          Use <code>pipe</code> when you want the code to read top-to-bottom (the
          JavaScript convention). Reach for <code>compose</code> when you&rsquo;re
          porting mathematical notation or prefer right-to-left evaluation.
        </Callout>
      </div>
    </>
  )
}
