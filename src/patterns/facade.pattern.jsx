import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta = {
  slug: 'facade',
  title: 'Facade',
  navLabel: 'Facade',
  category: 'Structural',
  order: 10,
}

const facadeCode = `// --- Subsystem: lower-level functions ---

const reserveStock = (cart) =>
  cart.map((item) => ({ ...item, reserved: true }))

const calculateTotal = (cart) =>
  cart.reduce((sum, item) => sum + item.price * item.qty, 0)

const charge = (cart) => {
  const total = calculateTotal(cart)
  return { success: true, total, transactionId: 'txn_42' }
}

const ship = (cart) =>
  cart.map((item) => ({ ...item, shipped: true }))

// --- Facade: a single function that orchestrates the subsystem ---

const placeOrder = (cart) => {
  const reserved = reserveStock(cart)
  const payment = charge(reserved)
  if (!payment.success) return { error: 'Payment failed' }
  const shipped = ship(reserved)
  return { ...payment, items: shipped }
}

// --- The caller only needs to know one function ---

const cart = [
  { name: 'FP in JS', price: 40, qty: 1 },
  { name: 'T-shirt',  price: 25, qty: 2 },
]

placeOrder(cart)
// { success: true, total: 90, transactionId: 'txn_42',
//   items: [{ ...reserved, shipped: true }, { ... }] }`

export default function FacadePattern() {
  return (
    <>
      <StepHeader
        order={10}
        title="Facade"
        intro="Provide a unified, simplified interface to a complex subsystem. The Facade pattern hides internal complexity behind a single entry point, making the subsystem easier to use."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Facade pattern shields clients from the complexity of a subsystem
          by exposing a high-level API. Instead of forcing every caller to
          understand and coordinate multiple low-level objects, a facade
          provides a single, clean entry point that does the orchestration
          internally.
        </p>

        <h2>OO vs functional</h2>
        <p>
          In classic object-oriented design, you create a <code>Facade</code>{' '}
          class that wraps and delegates to subsystem objects, exposing only
          the methods callers need. In functional programming,{' '}
          <strong>a facade is a single function</strong> that composes and
          orchestrates several lower-level functions behind a simple call
          signature — no wrapping classes, no injected dependencies.
        </p>

        <h2>Functional example</h2>
        <p>
          Below, <code>placeOrder</code> is the facade. It calls{' '}
          <code>reserveStock</code>, <code>charge</code>, and{' '}
          <code>ship</code> in the right order, handling the plumbing so
          callers only need to pass a cart and get back a result. The
          subsystem functions (<code>reserveStock</code>,{' '}
          <code>calculateTotal</code>, etc.) remain independently testable and
          reusable, but most consumers never touch them directly.
        </p>
        <CodeBlock code={facadeCode} />

        <Callout tone="tip">
          In FP, the Facade pattern reduces to a{' '}
          <strong>composing function</strong>: wrap a sequence of granular
          function calls behind a single entry point. No classes, no
          delegation — just functions calling other functions and returning a
          clean result.
        </Callout>
      </div>
    </>
  )
}
