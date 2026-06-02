import { useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

export const meta: PatternMeta = {
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

/* ------------------------------------------------------------------ */
/*  Shared logic — same pure functions shown in the code example      */
/* ------------------------------------------------------------------ */

interface Message {
  sender: string
  text: string
}

function createMediator() {
  const handlers: Record<string, Array<(payload: unknown) => void>> = {}
  return {
    on: (event: string, fn: (payload: unknown) => void): void => {
      (handlers[event] ??= []).push(fn)
    },
    emit: (event: string, payload: unknown): void => {
      (handlers[event] ?? []).forEach((fn) => fn(payload))
    },
  }
}

function MediatorWidget(): ReactNode {
  const [log, setLog] = useState<Message[]>([])
  const [aliceInput, setAliceInput] = useState('')
  const [bobInput, setBobInput] = useState('')

  const mediator = useMemo(() => {
    const m = createMediator()
    m.on('message', (payload: unknown) => {
      const msg = payload as Message
      setLog((prev) => [...prev, msg])
    })
    return m
  }, [])

  const handleSend = (sender: string, text: string) => {
    if (!text.trim()) return
    mediator.emit('message', { sender, text })
  }

  return (
    <div className="space-y-4">
      {/* Sender: Alice */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700 w-14">Alice</span>
        <input
          type="text"
          value={aliceInput}
          onChange={(e) => setAliceInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSend('Alice', aliceInput)
              setAliceInput('')
            }
          }}
          placeholder="Type a message…"
          className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-sm"
        />
        <button
          type="button"
          onClick={() => {
            handleSend('Alice', aliceInput)
            setAliceInput('')
          }}
          className="rounded-md border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
        >
          Send
        </button>
      </div>

      {/* Sender: Bob */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700 w-14">Bob</span>
        <input
          type="text"
          value={bobInput}
          onChange={(e) => setBobInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSend('Bob', bobInput)
              setBobInput('')
            }
          }}
          placeholder="Type a message…"
          className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-sm"
        />
        <button
          type="button"
          onClick={() => {
            handleSend('Bob', bobInput)
            setBobInput('')
          }}
          className="rounded-md border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
        >
          Send
        </button>
      </div>

      {/* Notification log */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Notifications via mediator
        </p>
        {log.length === 0 ? (
          <p className="text-sm italic text-slate-400">
            No messages yet. Send one!
          </p>
        ) : (
          <div className="space-y-0.5 max-h-48 overflow-y-auto">
            {log.map((msg, i) => (
              <div
                key={i}
                className="rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm"
              >
                <span className="font-medium text-slate-700">{msg.sender}</span>
                <span className="text-slate-400">{' → '}</span>
                <span className="text-slate-600">{msg.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MediatorPattern(): ReactNode {
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

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={['Mediator «interface»', 'ConcreteMediator', 'ColleagueA', 'ColleagueB']}
            fp={['createMediator()', 'on / emit', 'callback A', 'callback B']}
          />
        </Diagram>

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

        <Widget title="Try the mediator hub">
          <MediatorWidget />
        </Widget>

        <Diagram caption="Messages flow through the mediator — components never touch each other">
          <FlowDiagram steps={['Alice', 'mediator.emit', 'handlers["message"]', 'Bob notified']} />
        </Diagram>
      </div>
    </>
  )
}
