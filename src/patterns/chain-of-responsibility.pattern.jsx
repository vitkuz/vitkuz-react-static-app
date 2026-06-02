import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta = {
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

export default function ChainofResponsibilityPattern() {
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
      </div>
    </>
  )
}
