import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta: PatternMeta = {
  slug: 'command',
  title: 'Command',
  navLabel: 'Command',
  category: 'Behavioral',
  order: 14,
}

const commandCode = `// --- A command is a plain { do, undo } pair of pure functions ---

// State reducer: apply a command's do function
const applyCommand = (state, command) => command.do(state)

// State reducer: apply a command's undo function
const undoCommand = (state, command) => command.undo(state)

// --- Command factories are plain functions, not classes ---

const increment = {
  do: (state) => ({ ...state, count: state.count + 1 }),
  undo: (state) => ({ ...state, count: state.count - 1 }),
}

const setName = (name) => ({
  do: (state) => ({ ...state, name, previousName: state.name }),
  undo: (state) => ({ ...state, name: state.previousName }),
})

// --- Dispatch commands, track history for undo ---
let history = []
let state = { count: 0, name: 'Alice' }

state = applyCommand(state, increment)       // { count: 1, name: 'Alice' }
history.push(increment)

state = applyCommand(state, setName('Bob'))  // { count: 1, name: 'Bob', previousName: 'Alice' }
history.push(setName('Bob'))

state = undoCommand(state, history.pop())    // undo setName  → { count: 1, name: 'Alice' }
state = undoCommand(state, history.pop())    // undo increment → { count: 0, name: 'Alice' }
`

export default function CommandPattern(): ReactNode {
  return (
    <>
      <StepHeader
        order={14}
        title="Command"
        intro="Encapsulate a request as an object, letting you parameterize clients with different requests, queue or log requests, and support undoable operations."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Command pattern turns a request into a stand-alone object that
          contains all the information needed to execute an action — or undo
          it. This lets you decouple the sender from the receiver, queue
          commands, log them, and implement reversible operations.
        </p>

        <h2>OO vs functional</h2>
        <p>
          In classic OO, you define a <code>Command</code> interface with{' '}
          <code>execute()</code> and <code>undo()</code> methods, then
          subclass it for each concrete action. In functional programming,{' '}
          <strong>a command is simply a plain data object with{' '}
          <code>do</code> and <code>undo</code> functions</strong>. Creating a
          command is a function call that returns this pair. Undo falls out
          naturally as an inverse function paired with each command — no
          classes, no interface declarations.
        </p>

        <h2>Functional example</h2>
        <p>
          Below, each command is a simple object with two pure functions:{' '}
          <code>do</code> and <code>undo</code>. <code>applyCommand</code>{' '}
          and <code>undoCommand</code> are generic reducers that dispatch a
          command over state. The <code>setName</code> command factory uses a
          closure to capture the new name and stores the previous name on the
          state itself so <code>undo</code> can restore it.
        </p>
        <CodeBlock code={commandCode} />

        <Callout tone="tip">
          In FP, the Command pattern reduces to <strong>pure functions paired
          with their inverses</strong>. A command is just{' '}
          <code>{'{ do, undo }'}</code> — a data object you can serialize,
          queue, or replay. Undo is simply calling <code>undo</code> on the
          last command in the history stack.
        </Callout>
      </div>
    </>
  )
}
