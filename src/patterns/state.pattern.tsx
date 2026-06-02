import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta: PatternMeta = {
  slug: 'state',
  title: 'State',
  navLabel: 'State',
  category: 'Behavioral',
  order: 19,
}

const stateCode = `// --- State is data, transitions are a pure function ---

// A traffic light modelled as a finite-state machine
const transitions = {
  green:  'yellow',
  yellow: 'red',
  red:    'green',
}

// The transition function is just a lookup
const next = (current) => transitions[current]

next('green')  // 'yellow'
next('red')    // 'green'

// --- Generalised: (state, event) → state ---

const fsm = (states) => (current, event) => states[current]?.[event] ?? current

const light = fsm({
  green:  { tick: 'yellow' },
  yellow: { tick: 'red' },
  red:    { tick: 'green' },
})

light('red', 'tick')    // 'green'
light('green', 'tick')  // 'yellow'`

export default function StatePattern(): ReactNode {
  return (
    <>
      <StepHeader
        order={19}
        title="State"
        intro="Allow an object to alter its behaviour when its internal state changes. The object appears to change its class — without conditionals sprawled across every method."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The State pattern keeps state-dependent logic out of sprawling{' '}
          <code>if</code>/<code>switch</code> chains. Each state is
          encapsulated so that transitioning to a new state replaces the
          behaviour cleanly — no flags, no nested conditionals.
        </p>

        <h2>OO vs functional</h2>
        <p>
          In classic OO you create a <code>State</code> interface,
          concrete state classes per variant, and a context that delegates
          to the current state object. In functional programming the state
          pattern is simply a <strong>finite-state machine</strong>:{' '}
          state is a plain value, and transitions are a pure function{' '}
          <code>(state, event) =&gt; state</code> — the same idea as a
          reducer. A transition map replaces the class hierarchy.
        </p>

        <h2>Functional example</h2>
        <p>
          A traffic light modelled with a transitions map and a lookup
          function. The generalised version accepts an event so you can
          drive the machine from the outside — exactly how{' '}
          <code>useReducer</code> works in React.
        </p>
        <CodeBlock code={stateCode} />

        <Callout tone="tip">
          In FP, the State pattern is a <strong>reducer</strong>:{' '}
          state is data, transitions are a map or switch over{' '}
          <code>(state, event)</code>, and you always get the next state
          back. No mutation, no classes — just pure functions over plain
          values.
        </Callout>
      </div>
    </>
  )
}
