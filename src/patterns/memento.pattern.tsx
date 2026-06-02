import { useState } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { CompareDiagram, Diagram, FlowDiagram } from '../components/Diagram'

export const meta: PatternMeta = {
  slug: 'memento',
  title: 'Memento',
  navLabel: 'Memento',
  category: 'Behavioral',
  order: 17,
}

const mementoCode = `// --- A history that stores immutable snapshots ---

const createHistory = (initial) => {
  let past = []             // stack of previous states
  let present = initial     // current snapshot

  const set = (next) => {
    past = [...past, present]
    present = next
  }

  const undo = () => {
    if (past.length === 0) return
    present = past[past.length - 1]
    past = past.slice(0, -1)
  }

  const redo = () => {
    // redo would need a "future" array — left as an exercise
  }

  const snapshot = () => present

  return { set, undo, redo, snapshot }
}

// --- Usage: a simple text editor state ---

const editor = createHistory('')

editor.set('Hello')       // past: [],          present: 'Hello'
editor.set('Hello FP')    // past: ['Hello'],   present: 'Hello FP'
editor.undo()             // past: [],          present: 'Hello'

editor.snapshot() // 'Hello'`

const structuralSharingCode = `// --- Structural sharing keeps snapshots cheap ---

const updateState = (state, key, value) => ({
  ...state,
  [key]: value,
})

const pushToHistory = (history, newState) =>
  ({ ...history, past: [...history.past, history.present], present: newState })

const undoHistory = (history) => {
  if (history.past.length === 0) return history
  const last = history.past[history.past.length - 1]
  return { past: history.past.slice(0, -1), present: last }
}

// Pure, no mutation — every operation produces a new history object
let history = { past: [], present: { text: '', count: 0 } }
history = pushToHistory(history, updateState(history.present, 'text', 'Hi'))
// history.past: [{text:'',count:0}],  history.present: {text:'Hi',count:0}`

/* ------------------------------------------------------------------ */
/*  Shared logic — pure immutable snapshot history                     */
/* ------------------------------------------------------------------ */

type Snapshot = string

interface EditorHistory {
  past: Snapshot[]
  present: Snapshot
  future: Snapshot[]
}

const createHistory = (initial: Snapshot): EditorHistory => ({
  past: [],
  present: initial,
  future: [],
})

const save = (history: EditorHistory, next: Snapshot): EditorHistory => ({
  past: [...history.past, history.present],
  present: next,
  future: [],
})

const undo = (history: EditorHistory): EditorHistory => {
  if (history.past.length === 0) return history
  const prev = history.past[history.past.length - 1]
  return {
    past: history.past.slice(0, -1),
    present: prev,
    future: [history.present, ...history.future],
  }
}

const redo = (history: EditorHistory): EditorHistory => {
  if (history.future.length === 0) return history
  const next = history.future[0]
  return {
    past: [...history.past, history.present],
    present: next,
    future: history.future.slice(1),
  }
}

function MementoWidget(): ReactNode {
  const [history, setHistory] = useState<EditorHistory>(() => createHistory(''))
  const [draft, setDraft] = useState<Snapshot>('')

  const handleSave = () => {
    setHistory((h) => save(h, draft))
    setDraft('')
  }

  const handleUndo = () => setHistory((h) => undo(h))
  const handleRedo = () => setHistory((h) => redo(h))

  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type something…"
          className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-sm"
        />
        <button
          onClick={handleSave}
          disabled={draft.length === 0}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm hover:bg-slate-100 disabled:opacity-50"
        >
          Save
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm hover:bg-slate-100 disabled:opacity-50"
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm hover:bg-slate-100 disabled:opacity-50"
        >
          Redo
        </button>
      </div>

      <div className="space-y-1">
        <div className="text-sm text-slate-600">
          Current snapshot:{' '}
          <span className="font-mono">
            {history.present === '' ? '(empty)' : `"${history.present}"`}
          </span>
        </div>
        <div className="text-sm text-slate-600">
          Past snapshots:{' '}
          <span className="font-mono">
            {history.past.length === 0
              ? 'none'
              : history.past.map((s) => `"${s}"`).join(' → ')}
          </span>
        </div>
        {history.future.length > 0 && (
          <div className="text-sm text-slate-500">
            Future (redo):{' '}
            <span className="font-mono">
              {history.future.map((s) => `"${s}"`).join(' → ')}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MementoPattern(): ReactNode {
  return (
    <>
      <StepHeader
        order={17}
        title="Memento"
        intro="Capture and restore an object's state without exposing its internal structure. The Memento pattern provides undo capability by externalizing snapshots."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Memento pattern captures and externalizes an object's internal
          state so it can be restored later — all without violating
          encapsulation. It's the classic foundation for undo/redo systems.
        </p>

        <h2>OO vs functional</h2>
        <p>
          In classic OO, the Originator creates a Memento snapshot, and the
          Caretaker stores it — three separate classes with controlled access.
          In functional programming,{' '}
          <strong>a memento is simply an immutable value</strong>. The history
          is an array (or two stacks) of immutable snapshots. Structural
          sharing via <code>...spread</code> keeps copies cheap, so storing
          past states has minimal overhead.
        </p>

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={['Originator', 'Memento', 'Caretaker']}
            fp={['createHistory(initial)', 'past[] + present', 'undo() / redo()']}
          />
        </Diagram>

        <h2>Functional example</h2>
        <p>
          The <code>createHistory</code> function wraps the current state in a
          closure alongside a <code>past</code> stack. Every call to{' '}
          <code>set</code> pushes the current state onto the stack before
          replacing it. <code>undo</code> pops the top of the stack back into
          the present. No classes, no Originator/Caretaker ceremony — just a
          closure and an array.
        </p>
        <CodeBlock code={mementoCode} />

        <h2>Structural sharing</h2>
        <p>
          When state is large, copying the entire snapshot on every change can
          be wasteful. Structural sharing solves this: each snapshot reuses
          the parts of the previous state that haven't changed, via the spread
          operator. The example below shows fully pure functions — no mutation
          anywhere.
        </p>
        <CodeBlock code={structuralSharingCode} />

        <Callout tone="tip">
          In FP, the Memento pattern is just <strong>immutable state with a
          history list</strong>. Closures hold the current snapshot, and every
          operation produces a new snapshot rather than mutating the old one.
          No separate Memento class — values are snapshots by nature.
        </Callout>

        <Widget title="Try undo / redo with snapshots">
          <MementoWidget />
        </Widget>

        <Diagram caption="Snapshot flow: draft → save → history → undo/redo → restored">
          <FlowDiagram steps={['draft', 'save', 'past[]', 'undo/redo', 'present']} />
        </Diagram>
      </div>
    </>
  )
}
