import type { ReactNode } from 'react'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

const immutableUpdatesCode = `// ❌ Mutation – avoids
const items = [1, 2, 3]
items.push(4)          // mutates original
items[0] = 99          // mutates original

// ✅ Immutable updates with spread
const prepended = [0, ...items]
const appended = [...items, 5]
const updated = items.map((n, i) => i === 0 ? 99 : n)

// Objects — spread to create new copies
const user = { name: 'Alice', age: 30 }
const older = { ...user, age: 31 }
const withEmail = { ...user, email: 'alice@example.com' }

// Nested updates — spread at every level you change
const state = {
  user: { name: 'Bob', settings: { theme: 'dark' } }
}
const newState = {
  ...state,
  user: {
    ...state.user,
    settings: {
      ...state.user.settings,
      theme: 'light'
    }
  }
}

// Original untouched
state.user.settings.theme === 'dark'  // true
newState.user.settings.theme === 'light' // true`

const arrayOpsCode = `// Adding, removing, updating without mutation
const list = [10, 20, 30, 40]

const inserted = [...list.slice(0, 2), 25, ...list.slice(2)]
// [10, 20, 25, 30, 40]

const removed = list.filter((n) => n !== 30)
// [10, 20, 40]

const replaced = list.map((n) => (n === 30 ? 99 : n))
// [10, 20, 99, 40]

// Sort — slice first, then sort the copy
const sorted = [...list].sort((a, b) => b - a)
// [40, 30, 20, 10]`

const deepFreezeCode = `// Simple deep-freeze helper for development
const deepFreeze = (obj) => {
  Object.freeze(obj)
  Object.keys(obj).forEach((key) => {
    const val = obj[key]
    if (val && typeof val === 'object' && !Object.isFrozen(val)) {
      deepFreeze(val)
    }
  })
  return obj
}

const frozen = deepFreeze({ a: { b: 2 } })
// Any attempt to mutate throws in strict mode`

export default function Immutability(): ReactNode {
  return (
    <>
      <StepHeader
        order={7}
        title="Immutability"
        intro="Immutability means data, once created, is never changed. Instead of mutating an existing value, you create a new one. This eliminates a whole class of bugs caused by shared mutable state and makes your program easier to reason about."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>When to use it</h2>
        <ul>
          <li>Predictable state management: no surprise mutations from elsewhere.</li>
          <li>Change detection is trivial — reference equality checks.</li>
          <li>Undo/redo and time-travel debugging become straightforward.</li>
          <li>Concurrent or async code: no shared mutable state to worry about.</li>
        </ul>

        <h2>Immutable updates</h2>
        <p>
          Use spread syntax, <code>map</code>, <code>filter</code>, and{' '}
          <code>slice</code> to produce new values instead of mutating.
        </p>
        <CodeBlock code={immutableUpdatesCode} />

        <h2>Array operations without mutation</h2>
        <p>
          Insert, remove, and replace are all expressible as transforms that
          return new arrays.
        </p>
        <CodeBlock code={arrayOpsCode} />

        <h2>Defence in depth</h2>
        <p>
          <code>Object.freeze</code> and shallow/deep freeze helpers can catch
          accidental mutations during development.
        </p>
        <CodeBlock code={deepFreezeCode} />

        <Callout tone="info" title="Immutability in React">
          React relies on immutable state updates for efficient re-rendering.
          When state references change, React knows exactly which components
          need updating — no deep comparisons required.
        </Callout>
      </div>
    </>
  )
}
