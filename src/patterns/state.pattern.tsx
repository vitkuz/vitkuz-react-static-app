import { useState } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

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

/* ------------------------------------------------------------------ */
/*  Typed module-scope functions — same logic as the example above     */
/* ------------------------------------------------------------------ */

type LightState = 'green' | 'yellow' | 'red'
type LightEvent = 'tick'

const lightTransitions: Record<LightState, Record<LightEvent, LightState>> = {
  green:  { tick: 'yellow' },
  yellow: { tick: 'red' },
  red:    { tick: 'green' },
}

const fsm = <S extends string, E extends string>(
  states: Record<S, Partial<Record<E, S>>>
) => (current: S, event: E): S => states[current]?.[event] ?? current

const nextLight = fsm(lightTransitions)

/* ------------------------------------------------------------------ */
/*  Interactive widget                                                 */
/* ------------------------------------------------------------------ */

const lightColors: Record<LightState, string> = {
  green: 'bg-emerald-500',
  yellow: 'bg-amber-400',
  red: 'bg-red-500',
}

function StateWidget(): ReactNode {
  const [state, setState] = useState<LightState>('green')

  const advance = () => setState((prev) => nextLight(prev, 'tick'))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700">Current state:</span>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1 text-sm font-mono">
          <span
            className={`inline-block h-3 w-3 rounded-full ${lightColors[state]}`}
          />
          {state}
        </span>
      </div>

      <div className="text-sm text-slate-600">
        Allowed events:{' '}
        <span className="font-mono">
          {Object.keys(lightTransitions[state]).join(', ')}
        </span>
      </div>

      <button
        onClick={advance}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
      >
        tick
      </button>

      <div className="text-sm text-slate-500">
        Next after tick:{' '}
        <span className="font-mono">{nextLight(state, 'tick')}</span>
      </div>
    </div>
  )
}

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

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={['Context', 'State «interface»', 'ConcreteStateA', 'ConcreteStateB', 'ConcreteStateC']}
            fp={['fsm(states)', '(state, event) → state', 'transitions map', 'green | yellow | red']}
          />
        </Diagram>

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

        <Widget title="Try the traffic-light state machine">
          <StateWidget />
        </Widget>

        <Diagram caption="Data flow through the state machine">
          <FlowDiagram steps={['current state', 'event (tick)', 'next state']} />
        </Diagram>
      </div>
    </>
  )
}
