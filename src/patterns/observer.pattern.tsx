import { useState, useRef } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

export const meta: PatternMeta = {
  slug: 'observer',
  title: 'Observer',
  navLabel: 'Observer',
  category: 'Behavioral',
  order: 18,
}

const subjectCode = `// --- A subject is a closure over a set of subscribers ---

const createSubject = () => {
  const subs = new Set()
  return {
    subscribe: (fn) => (subs.add(fn), () => subs.delete(fn)),
    notify: (value) => subs.forEach((fn) => fn(value)),
  }
}

// --- Usage ---

const counter = createSubject()

// Subscribe returns an unsubscribe function
const unsub1 = counter.subscribe((v) =>
  console.log(\`Logger A: \${v}\`),
)
const unsub2 = counter.subscribe((v) =>
  console.log(\`Logger B: \${v}\`),
)

counter.notify({ count: 1 }) // both loggers fire
counter.notify({ count: 2 })

unsub1() // Logger A stops listening
counter.notify({ count: 3 }) // only Logger B fires`

const hookCode = `// --- Observer as a React hook ---

import { useState, useEffect } from 'react'

const createSubject = () => {
  const subs = new Set()
  return {
    subscribe: (fn) => (subs.add(fn), () => subs.delete(fn)),
    notify: (value) => subs.forEach((fn) => fn(value)),
  }
}

// Shared subject (singleton via module scope)
const authSubject = createSubject()

// Login action — notify all subscribers
const login = (user) => authSubject.notify(user)

// Hook to listen for auth changes
const useAuth = () => {
  const [user, setUser] = useState(null)
  useEffect(() => authSubject.subscribe(setUser), [])
  return user
}`

/* ------------------------------------------------------------------ */
/*  Shared logic — same pure functions shown in the code example      */
/* ------------------------------------------------------------------ */

type ObserverFn<T> = (value: T) => void
type UnsubscribeFn = () => void

interface Subject<T> {
  subscribe: (fn: ObserverFn<T>) => UnsubscribeFn
  notify: (value: T) => void
}

const createSubject = <T,>(): Subject<T> => {
  const subs = new Set<ObserverFn<T>>()
  return {
    subscribe: (fn) => (subs.add(fn), () => {
      subs.delete(fn)
    }),
    notify: (value) => subs.forEach((fn) => fn(value)),
  }
}

const OBSERVER_NAMES = ['Logger A', 'Logger B', 'Logger C'] as const

function ObserverWidget(): ReactNode {
  const [subject] = useState(() => createSubject<{ count: number }>())
  const unsubsRef = useRef<Record<string, UnsubscribeFn | undefined>>({})
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    'Logger A': false,
    'Logger B': false,
    'Logger C': false,
  })
  const [values, setValues] = useState<Record<string, string>>({
    'Logger A': '\u2014',
    'Logger B': '\u2014',
    'Logger C': '\u2014',
  })
  const [count, setCount] = useState(0)

  const toggle = (name: string) => {
    setToggles((prev) => {
      const active = !prev[name]
      if (active) {
        unsubsRef.current[name] = subject.subscribe((v) => {
          setValues((prev) => ({ ...prev, [name]: JSON.stringify(v) }))
        })
      } else {
        unsubsRef.current[name]?.()
        delete unsubsRef.current[name]
        setValues((prev) => ({ ...prev, [name]: '\u2014' }))
      }
      return { ...prev, [name]: active }
    })
  }

  const emit = () => {
    const next = count + 1
    setCount(next)
    subject.notify({ count: next })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {OBSERVER_NAMES.map((name) => (
          <div key={name} className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={toggles[name]}
                onChange={() => toggle(name)}
                className="rounded border-slate-300"
              />
              {name}
            </label>
            <span className="font-mono text-sm text-slate-600">
              {values[name]}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={emit}
        className="rounded-md border border-slate-300 px-2 py-1 text-sm hover:bg-slate-100"
      >
        Emit
      </button>
    </div>
  )
}

export default function ObserverPattern(): ReactNode {
  return (
    <>
      <StepHeader
        order={18}
        title="Observer"
        intro="Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Observer pattern solves the problem of keeping multiple parts of a
          system in sync when a shared piece of state changes. Instead of
          polling or tightly coupling observers to the subject, the subject
          maintains a list of dependents and broadcasts updates to all of them
          when its state changes.
        </p>

        <h2>OO vs functional</h2>
        <p>
          In classic object-oriented design, you define an{' '}
          <code>Observer</code> interface with an <code>update</code> method,
          plus a concrete <code>Subject</code> class that manages a list of
          observers. In functional programming,{' '}
          <strong>
            a subject is a closure holding a set of subscriber functions
          </strong>
          . <code>subscribe(fn)</code> adds a function to the set and returns an
          unsubscribe function, while <code>notify(value)</code> calls every
          registered function. No <code>Observer</code> interface, no{' '}
          <code>Subject</code> class — just closures and higher-order functions.
        </p>

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={['Subject', 'Observer «interface»', 'ConcreteSubject', 'ConcreteObserver']}
            fp={['createSubject()', 'subscribe(fn) → unsub', 'notify(value)', 'Listener functions']}
          />
        </Diagram>

        <h2>Functional example</h2>
        <p>
          Below, <code>createSubject</code> returns an object with two methods
          — both closures over the same <code>subs</code> set.{' '}
          <code>subscribe</code> adds a listener and returns a cleanup function
          (using the comma operator for a compact expression body).{' '}
          <code>notify</code> iterates the set and calls every subscriber with
          the new value.
        </p>
        <CodeBlock code={subjectCode} />

        <Widget title="Try the observer pattern">
          <ObserverWidget />
        </Widget>

        <h2>Observer as a React hook</h2>
        <p>
          This pattern composes naturally with React. A subject held in module
          scope acts as an event bus, and a custom hook wraps{' '}
          <code>useEffect</code> to subscribe and unsubscribe automatically.
        </p>
        <CodeBlock code={hookCode} />

        <Callout tone="tip">
          In FP, the Observer pattern is simply <strong>a closure over a set of
          functions</strong>. <code>subscribe</code> returns an unsubscribe
          function instead of requiring a separate <code>removeObserver</code>{' '}
          method. No classes, no inheritance — just functions, closures, and
          composable cleanup.
        </Callout>

        <Diagram caption="Notification flow through the Observer pattern">
          <FlowDiagram steps={['createSubject()', 'subscribe(fn)', 'notify(value)', 'fn(value)']} />
        </Diagram>
      </div>
    </>
  )
}
