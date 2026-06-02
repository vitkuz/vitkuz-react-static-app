import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta = {
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

export default function MementoPattern() {
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
      </div>
    </>
  )
}
