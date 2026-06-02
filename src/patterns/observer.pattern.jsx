import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta = {
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

export default function ObserverPattern() {
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
      </div>
    </>
  )
}
