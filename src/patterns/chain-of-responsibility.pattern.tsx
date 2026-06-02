import { useState } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

/* ------------------------------------------------------------------ */
/*  Shared logic — same pure functions shown in the code example      */
/* ------------------------------------------------------------------ */

interface Request {
  type: string
  amount?: number
  reason?: string
  payload?: Record<string, unknown>
}

interface Result {
  action: string
  amount?: number
  reason?: string
  rating?: number
  message?: string
}

type Handler = (req: Request) => Result | null

const refundHandler: Handler = (req) =>
  req.type === 'refund'
    ? { action: 'REFUND', amount: req.amount }
    : null

const escalateHandler: Handler = (req) =>
  req.type === 'escalate'
    ? { action: 'ESCALATE', reason: req.reason }
    : null

const checkType =
  (type: string, action: string): Handler =>
  (req) =>
    req.type === type ? { action, ...req.payload } : null

const fallbackHandler: Handler = () => ({ action: 'NOTIFY', message: 'Unhandled request' })

const chainHandlers: Handler[] = [
  refundHandler,
  escalateHandler,
  checkType('feedback', 'REVIEW'),
  fallbackHandler,
]

export const meta: PatternMeta = {
  slug: 'chain-of-responsibility',
  title: 'Chain of Responsibility',
  navLabel: 'Chain of Responsibility',
  category: 'Behavioral',
  order: 13,
}

const chainCode = `// --- A handler is just a function: (req) => result | null ---
// Returning null signals "pass to the next handler"

const refundHandler = (req) =>
  req.type === 'refund'
    ? { action: 'REFUND', amount: req.amount }
    : null

const escalateHandler = (req) =>
  req.type === 'escalate'
    ? { action: 'ESCALATE', reason: req.reason }
    : null

// Curried sentinel-aware handler factory
const checkType =
  (type, action) =>
  (req) =>
    req.type === type ? { action, ...req.payload } : null

// --- The chain folds over handlers with reduce ---
const runChain =
  (handlers) =>
  (req) =>
    handlers.reduce(
      (result, handler) => result ?? handler(req),
      null
    )

// --- Compose a concrete chain ---
const supportChain = runChain([
  refundHandler,
  escalateHandler,
  checkType('feedback', 'REVIEW'),
  () => ({ action: 'NOTIFY', message: 'Unhandled request' }),
])

supportChain({ type: 'refund', amount: 49.99 })
// → { action: 'REFUND', amount: 49.99 }

supportChain({ type: 'escalate', reason: 'login-failure' })
// → { action: 'ESCALATE', reason: 'login-failure' }

supportChain({ type: 'feedback', payload: { rating: 5 } })
// → { action: 'REVIEW', rating: 5 }

supportChain({ type: 'billing' })
// → { action: 'NOTIFY', message: 'Unhandled request' }`

/* ------------------------------------------------------------------ */
/*  Interactive widget                                                 */
/* ------------------------------------------------------------------ */

const REQUEST_TYPES = ['refund', 'escalate', 'feedback', 'billing'] as const

type RequestType = (typeof REQUEST_TYPES)[number]

const HANDLER_NAMES = [
  'refundHandler',
  'escalateHandler',
  `checkType('feedback','REVIEW')`,
  'fallback',
]

function ChainofResponsibilityWidget(): ReactNode {
  const [reqType, setReqType] = useState<RequestType>('refund')
  const [amount, setAmount] = useState<number>(49.99)
  const [reason, setReason] = useState<string>('login-failure')
  const [rating, setRating] = useState<number>(5)
  const [result, setResult] = useState<Result | null>(null)
  const [handledBy, setHandledBy] = useState<number>(-1)

  const buildRequest = (): Request => {
    switch (reqType) {
      case 'refund':
        return { type: 'refund', amount }
      case 'escalate':
        return { type: 'escalate', reason }
      case 'feedback':
        return { type: 'feedback', payload: { rating } }
      default:
        return { type: reqType }
    }
  }

  const handleRun = () => {
    const req = buildRequest()
    for (let i = 0; i < chainHandlers.length; i++) {
      const r = chainHandlers[i]!(req)
      if (r !== null) {
        setResult(r)
        setHandledBy(i)
        return
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Request builder */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="cor-req-type" className="text-xs font-medium text-slate-500">
            Type
          </label>
          <select
            id="cor-req-type"
            value={reqType}
            onChange={(e) => setReqType(e.target.value as RequestType)}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm"
          >
            {REQUEST_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {reqType === 'refund' && (
          <div className="flex flex-col gap-1">
            <label htmlFor="cor-amount" className="text-xs font-medium text-slate-500">
              Amount
            </label>
            <input
              id="cor-amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm font-mono w-24"
            />
          </div>
        )}

        {reqType === 'escalate' && (
          <div className="flex flex-col gap-1">
            <label htmlFor="cor-reason" className="text-xs font-medium text-slate-500">
              Reason
            </label>
            <input
              id="cor-reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm w-40"
            />
          </div>
        )}

        {reqType === 'feedback' && (
          <div className="flex flex-col gap-1">
            <label htmlFor="cor-rating" className="text-xs font-medium text-slate-500">
              Rating
            </label>
            <input
              id="cor-rating"
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value, 10) || 1)}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm font-mono w-20"
            />
          </div>
        )}

        <button
          onClick={handleRun}
          className="rounded-md border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
        >
          Run
        </button>
      </div>

      {/* Chain visualization */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-slate-500">Handler chain:</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {HANDLER_NAMES.map((name, i) => {
            const isHandler = i < HANDLER_NAMES.length - 1
            const bg =
              handledBy === i
                ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            return (
              <span key={name} className="flex items-center gap-1.5">
                <span
                  className={`rounded-md border px-2 py-1 text-xs font-mono ${bg}`}
                >
                  {name}
                </span>
                {isHandler && <span className="text-slate-300">→</span>}
              </span>
            )
          })}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-xs font-medium text-slate-500 mb-1">Result:</p>
          <div className="text-sm font-mono text-slate-800 whitespace-pre">
            {JSON.stringify(result, null, 2)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Handled by:{' '}
            <span className="font-semibold text-emerald-700">
              {handledBy >= 0 && handledBy < HANDLER_NAMES.length
                ? HANDLER_NAMES[handledBy]
                : '—'}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

export default function ChainofResponsibilityPattern(): ReactNode {
  return (
    <>
      <StepHeader
        order={13}
        title="Chain of Responsibility"
        intro="Pass a request along a chain of handlers. Each handler decides whether to process the request or pass it to the next handler in the chain."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Chain of Responsibility pattern avoids coupling the sender of a
          request to its receiver by giving more than one object a chance to
          handle it. Handlers are linked into a chain, and the request travels
          along the chain until a handler processes it.
        </p>

        <h2>OO vs functional</h2>
        <p>
          In classic object-oriented design, you define an abstract{' '}
          <code>Handler</code> class with a successor reference and a{' '}
          <code>handleRequest()</code> method, then subclass for each concrete
          handler. In functional programming,{' '}
          <strong>a handler is just a function</strong>, and the chain is simply
          a list of functions. You fold over the list with{' '}
          <code>reduce</code>, passing the request to the next handler only when
          the current one returns a sentinel value (like <code>null</code>).
        </p>

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={[
              'Handler «abstract»',
              'ConcreteHandler (refund)',
              'ConcreteHandler (escalate)',
              'ConcreteHandler (feedback)',
              'Client',
            ]}
            fp={[
              'Handler = Request → Result | null',
              'refundHandler',
              'escalateHandler',
              "checkType('feedback', 'REVIEW')",
              'runChain(handlers)',
            ]}
          />
        </Diagram>

        <h2>Functional example</h2>
        <p>
          Below, <code>runChain</code> accepts a list of handler functions and
          returns a function that processes a request. Each handler returns
          either a result or <code>null</code> to signal "I can't handle this."
          The <code>reduce</code> loop short-circuits on the first non-null
          result thanks to the <code>??</code> operator. The final handler acts
          as a catch-all fallback.
        </p>
        <CodeBlock code={chainCode} />

        <Callout tone="tip">
          In FP, Chain of Responsibility reduces to <strong>folding over a
          list of functions</strong>. Each handler is a pure function that
          returns a result or a sentinel. No base classes, no successor
          wiring — just an ordered array and <code>reduce</code>.
        </Callout>

        <Widget title="Try the handler chain">
          <ChainofResponsibilityWidget />
        </Widget>

        <Diagram caption="Request flows through handlers until one returns a result">
          <FlowDiagram
            steps={['request', 'refundHandler', 'escalateHandler', 'checkType', 'fallback → result']}
          />
        </Diagram>
      </div>
    </>
  )
}
