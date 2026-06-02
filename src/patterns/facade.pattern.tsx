import { useState } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

export const meta: PatternMeta = {
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

/* ------------------------------------------------------------------ */
/*  Shared logic — same pure functions shown in the code example      */
/* ------------------------------------------------------------------ */

interface CartItem {
  name: string
  price: number
  qty: number
}

interface ReservedItem extends CartItem {
  reserved: true
}

interface ShippedItem extends ReservedItem {
  shipped: true
}

interface PaymentSuccess {
  success: true
  total: number
  transactionId: string
}

type PaymentResult = PaymentSuccess | { success: false }

interface OrderSuccess {
  success: true
  total: number
  transactionId: string
  items: ShippedItem[]
}

type OrderResult = OrderSuccess | { error: string }

const reserveStock = (cart: CartItem[]): ReservedItem[] =>
  cart.map((item) => ({ ...item, reserved: true as const }))

const calculateTotal = (cart: CartItem[]): number =>
  cart.reduce((sum, item) => sum + item.price * item.qty, 0)

const charge = (cart: CartItem[]): PaymentResult => {
  const total = calculateTotal(cart)
  return { success: true, total, transactionId: 'txn_42' }
}

const ship = (cart: ReservedItem[]): ShippedItem[] =>
  cart.map((item) => ({ ...item, shipped: true as const }))

const placeOrder = (cart: CartItem[]): OrderResult => {
  const reserved = reserveStock(cart)
  const payment = charge(reserved)
  if (!payment.success) return { error: 'Payment failed' }
  const shipped = ship(reserved)
  return { success: true, total: payment.total, transactionId: payment.transactionId, items: shipped }
}

const demoCart: CartItem[] = [
  { name: 'FP in JS', price: 40, qty: 1 },
  { name: 'T-shirt', price: 25, qty: 2 },
]

/* ------------------------------------------------------------------ */
/*  Interactive widget                                                */
/* ------------------------------------------------------------------ */

interface LogEntry {
  step: string
  detail: string
}

function FacadeWidget(): ReactNode {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [result, setResult] = useState<OrderResult | null>(null)

  const handlePlaceOrder = () => {
    const outcome = placeOrder(demoCart)

    const steps: LogEntry[] = [
      {
        step: 'Reserve stock',
        detail: `${demoCart.length} item(s) reserved`,
      },
      ...('error' in outcome
        ? [{ step: 'Charge' as const, detail: 'Payment failed' }]
        : [
            {
              step: 'Charge' as const,
              detail: `Charged $${outcome.total.toFixed(2)} (${outcome.transactionId})`,
            },
          ]),
      ...('error' in outcome
        ? []
        : [
            {
              step: 'Ship' as const,
              detail: `${outcome.items.length} item(s) shipped`,
            },
          ]),
    ]

    setLogs(steps)
    setResult(outcome)
  }

  return (
    <div className="space-y-4">
      <div>
        <button
          type="button"
          onClick={handlePlaceOrder}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
        >
          Place order
        </button>
      </div>

      {logs.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Subsystem calls
          </p>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
            {logs.map((entry) => (
              <li key={entry.step}>
                <span className="font-medium">{entry.step}</span>
                <span className="text-slate-500"> — </span>
                <span className="font-mono text-slate-600">{entry.detail}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {result && 'error' in result && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2">
          <span className="font-mono text-sm text-red-700">{result.error}</span>
        </div>
      )}

      {result && 'success' in result && result.success && (
        <div className="space-y-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Result
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Total</span>
              <span className="font-mono text-slate-900">${result.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Transaction</span>
              <span className="font-mono text-slate-900">{result.transactionId}</span>
            </div>
            <div className="border-t border-emerald-200 pt-1">
              {result.items.map((item) => (
                <div key={item.name} className="flex justify-between text-slate-600">
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span className="font-mono">
                    {item.reserved && item.shipped ? '✓ shipped' : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function FacadePattern(): ReactNode {
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

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={['Facade', 'SubsystemA', 'SubsystemB', 'SubsystemC']}
            fp={['placeOrder(cart)', 'reserveStock', 'charge', 'ship']}
          />
        </Diagram>

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

        <Widget title="Place an order through the facade">
          <FacadeWidget />
        </Widget>

        <Diagram caption="Order flow through the facade">
          <FlowDiagram steps={['cart', 'reserveStock', 'charge', 'ship', 'result']} />
        </Diagram>
      </div>
    </>
  )
}
