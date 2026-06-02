import { useState } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

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

/* ------------------------------------------------------------------ */
/*  Shared logic — same pure functions shown in the code example      */
/* ------------------------------------------------------------------ */

interface CommandState {
  count: number
  name: string
  previousName?: string
}

interface Command {
  do: (state: CommandState) => CommandState
  undo: (state: CommandState) => CommandState
}

const applyCommand = (state: CommandState, command: Command): CommandState =>
  command.do(state)

const undoCommand = (state: CommandState, command: Command): CommandState =>
  command.undo(state)

const increment: Command = {
  do: (state: CommandState): CommandState => ({
    ...state,
    count: state.count + 1,
  }),
  undo: (state: CommandState): CommandState => ({
    ...state,
    count: state.count - 1,
  }),
}

const setName = (name: string): Command => ({
  do: (state: CommandState): CommandState => ({
    ...state,
    name,
    previousName: state.name,
  }),
  undo: (state: CommandState): CommandState => ({
    ...state,
    name: state.previousName!,
  }),
})

/* ------------------------------------------------------------------ */
/*  Interactive widget                                                 */
/* ------------------------------------------------------------------ */

interface TrackedCommand {
  label: string
  command: Command
}

function CommandWidget(): ReactNode {
  const [state, setState] = useState<CommandState>({
    count: 0,
    name: 'Alice',
  })
  const [history, setHistory] = useState<TrackedCommand[]>([])
  const [future, setFuture] = useState<TrackedCommand[]>([])
  const [nameInput, setNameInput] = useState<string>('Bob')

  function dispatch(cmd: Command, label: string): void {
    setState((prev) => applyCommand(prev, cmd))
    setHistory((prev) => [...prev, { label, command: cmd }])
    setFuture([])
  }

  function undo(): void {
    if (history.length === 0) return
    const last = history[history.length - 1]!
    setState((prev) => undoCommand(prev, last.command))
    setHistory((prev) => prev.slice(0, -1))
    setFuture((prev) => [last, ...prev])
  }

  function redo(): void {
    if (future.length === 0) return
    const next = future[0]!
    setState((prev) => applyCommand(prev, next.command))
    setFuture((prev) => prev.slice(1))
    setHistory((prev) => [...prev, next])
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => dispatch(increment, 'increment')}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm hover:bg-slate-100"
        >
          +1 Increment
        </button>
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm"
          size={10}
        />
        <button
          onClick={() => dispatch(setName(nameInput), `setName('${nameInput}')`)}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm hover:bg-slate-100"
        >
          Set Name
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          disabled={history.length === 0}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm hover:bg-slate-100 disabled:opacity-40"
        >
          ↩ Undo
        </button>
        <button
          onClick={redo}
          disabled={future.length === 0}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm hover:bg-slate-100 disabled:opacity-40"
        >
          ↪ Redo
        </button>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex gap-2">
          <span className="text-slate-500">Count:</span>
          <span className="font-mono font-semibold text-slate-900">
            {state.count}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-slate-500">Name:</span>
          <span className="font-mono font-semibold text-slate-900">
            {state.name}
          </span>
        </div>
      </div>

      {history.length > 0 && (
        <div className="space-y-1 border-t border-slate-200 pt-2">
          <span className="text-xs font-medium text-slate-400">HISTORY</span>
          <ol className="list-decimal pl-4 space-y-0.5 text-xs text-slate-600">
            {history.map((entry, i) => (
              <li key={i}>
                <span className="font-mono">{entry.label}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

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

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={[
              'Invoker',
              'Command «interface»',
              'ConcreteCommand',
              'Receiver',
            ]}
            fp={[
              'applyCommand(state, cmd)',
              '{ do, undo }',
              'increment',
              'setName(name)',
            ]}
          />
        </Diagram>

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

        <Widget title="Try the command pattern">
          <CommandWidget />
        </Widget>

        <Diagram caption="Command dispatch and undo flow">
          <FlowDiagram
            steps={['state', 'command.do(state)', 'next state']}
          />
        </Diagram>
      </div>
    </>
  )
}
