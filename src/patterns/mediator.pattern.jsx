import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta = {
  slug: 'mediator',
  title: 'Mediator',
  navLabel: 'Mediator',
  category: 'Behavioral',
  order: 16,
}

const mediatorCode = `// --- A mediator is a closure that coordinates callbacks ---

const createMediator = () => {
  const handlers = {}

  return {
    on: (event, fn) => {
      (handlers[event] ??= []).push(fn)
    },
    emit: (event, payload) => {
      (handlers[event] ?? []).forEach(fn => fn(payload))
    },
  }
}

// --- Components only know about the mediator, never each other ---
const chat = createMediator()

// "Notification" component — reacts to messages
chat.on('message', (msg) => {
  console.log(\`🔔 New message from \${msg.sender}: \${msg.text}\`)
})

// "Logger" component — records every event
chat.on('message', (msg) => {
  console.log(\`[LOG] \${new Date().toISOString()} — \${msg.sender}\`)
})

// "Sender" component — emits without knowing who listens
const sendMessage = (sender, text) => {
  chat.emit('message', { sender, text })
}

sendMessage('Alice', 'Hey everyone!')
sendMessage('Bob',   'Hi Alice!')`

export default function MediatorPattern() {
  return (
    <>
      <StepHeader
        order={16}
        title="Mediator"
        intro="Define an object that encapsulates how a set of objects interact. The Mediator pattern promotes loose coupling by keeping objects from referring to each other explicitly."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Mediator pattern reduces chaotic many-to-many dependencies between
          components by introducing a central hub that routes all communication.
          Instead of every component knowing about every other, each one only
          talks to the mediator — and the mediator decides who receives what.
        </p>

        <h2>OO vs functional</h2>
        <p>
          In classic object-oriented design, you define a{' '}
          <code>Mediator</code> interface and concrete mediator classes, with
          colleague objects holding references to the mediator. In functional
          programming, <strong>a mediator is a closure</strong>: it owns a
          private registry of event handlers and exposes <code>on</code>/
          <code>emit</code> functions. Components register callbacks and emit
          events through the hub, never touching each other — no classes, no
          interfaces, no mutual references.
        </p>

        <h2>Functional example</h2>
        <p>
          Below, <code>createMediator</code> returns an object with two
          functions. The <code>on</code> method registers a callback for a named
          event, and <code>emit</code> invokes every handler registered for that
          event. The "sender" component calls <code>emit</code> without knowing
          whether zero or ten listeners are attached — total decoupling through
          higher-order functions.
        </p>
        <CodeBlock code={mediatorCode} />

        <Callout tone="tip">
          In FP, the Mediator pattern is just a <strong>closure-based event
          hub</strong>. Keep a private map of handlers, expose{' '}
          <code>on</code>/<code>emit</code> functions, and let components
          communicate through the hub instead of wiring up direct references.
          No classes, no coupling — just functions and callbacks.
        </Callout>
      </div>
    </>
  )
}
