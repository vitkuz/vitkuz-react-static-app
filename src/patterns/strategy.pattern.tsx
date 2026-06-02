import { useState } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

export const meta: PatternMeta = {
  slug: 'strategy',
  title: 'Strategy',
  navLabel: 'Strategy',
  category: 'Behavioral',
  order: 20,
}

const strategyCode = `// --- A strategy is just a function ---

// The checkout function receives a discount strategy as an argument
const makeCheckout =
  (discountStrategy) =>
  (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0)
    return discountStrategy(subtotal)
  }

// --- Concrete strategies are plain functions ---

const noDiscount = (total) => total

// Curried percentage-off strategy
const percentOff =
  (pct) =>
  (total) =>
    total * (1 - pct)

// --- Select a strategy at runtime ---
const strategies = {
  none: noDiscount,
  sale: percentOff(0.1),  // 10% off
  vip: percentOff(0.25),  // 25% off
}

const cart = [
  { name: 'FP in JS', price: 40 },
  { name: 'T-shirt', price: 25 },
]

const checkout = makeCheckout(strategies.sale)

checkout(cart) // 58.5  (65.0 * 0.9)`

/* ------------------------------------------------------------------ */
/*  Shared logic — same pure functions shown in the code example      */
/* ------------------------------------------------------------------ */

interface CartItem {
  name: string
  price: number
}

type DiscountFn = (total: number) => number

const makeCheckout =
  (discountStrategy: DiscountFn) =>
  (items: CartItem[]): number => {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0)
    return discountStrategy(subtotal)
  }

const noDiscount: DiscountFn = (total) => total

const percentOff =
  (pct: number): DiscountFn =>
  (total) =>
    total * (1 - pct)

const strategies: Record<string, DiscountFn> = {
  none: noDiscount,
  sale: percentOff(0.1),
  vip: percentOff(0.25),
}

const cart: CartItem[] = [
  { name: 'FP in JS', price: 40 },
  { name: 'T-shirt', price: 25 },
]

function StrategyWidget(): ReactNode {
  const [strategyKey, setStrategyKey] = useState<string>('none')
  const discountFn: DiscountFn = strategies[strategyKey]!
  const checkout = makeCheckout(discountFn)
  const total = checkout(cart)
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0)
  const discount = subtotal - total

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label
          htmlFor="strategy-select"
          className="text-sm font-medium text-slate-700"
        >
          Strategy:
        </label>
        <select
          id="strategy-select"
          value={strategyKey}
          onChange={(e) => setStrategyKey(e.target.value)}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm"
        >
          <option value="none">None</option>
          <option value="sale">10% off</option>
          <option value="vip">25% off</option>
        </select>
      </div>

      <div className="space-y-1">
        {cart.map((item) => (
          <div
            key={item.name}
            className="flex justify-between text-sm text-slate-600"
          >
            <span>{item.name}</span>
            <span className="font-mono">${item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1 border-t border-slate-200 pt-2 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-mono">${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount</span>
            <span className="font-mono">-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-slate-900">
          <span>Total</span>
          <span className="font-mono">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default function StrategyPattern(): ReactNode {
  return (
    <>
      <StepHeader
        order={20}
        title="Strategy"
        intro="Define a family of algorithms, encapsulate each one, and make them interchangeable. The Strategy pattern lets you vary behavior independently from the client that uses it."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Strategy pattern solves the problem of selecting a behavior at
          runtime from a family of algorithms. Instead of hard-coding
          conditional branches or subclassing, you encapsulate each variant
          behind a common interface and pass it to the context that needs it.
        </p>

        <h2>OO vs functional</h2>
        <p>
          In classic object-oriented design, you define a <code>Strategy</code>{' '}
          interface with a single method, then implement concrete strategy
          classes that conform to it. In functional programming,{' '}
          <strong>a strategy is just a function</strong>. The interface
          collapses to the function signature, and concrete strategies are
          simply functions you pass as arguments — no classes, no ceremony.
        </p>

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={['Context', 'Strategy «interface»', 'ConcreteStrategyA', 'ConcreteStrategyB']}
            fp={['makeCheckout(fn)', 'noDiscount', 'percentOff(0.1)', 'percentOff(0.25)']}
          />
        </Diagram>

        <h2>Functional example</h2>
        <p>
          Below, <code>makeCheckout</code> accepts a{' '}
          <code>discountStrategy</code> function. Choosing a strategy is as
          simple as selecting from a map of plain functions. The{' '}
          <code>percentOff</code> strategy is curried so you can pre-configure
          the discount rate without wrapping it in a class.
        </p>
        <CodeBlock code={strategyCode} />

        <Callout tone="tip">
          In FP, the Strategy pattern reduces to <strong>higher-order
          functions</strong>: accept a function as a parameter, and the caller
          decides the behavior. No interfaces, no subclasses — just functions
          passed around.
        </Callout>

        <Widget title="Try the discount strategies">
          <StrategyWidget />
        </Widget>

        <Diagram caption="Checkout flow with a pluggable discount step">
          <FlowDiagram steps={['cart', 'discountStrategy', 'total']} />
        </Diagram>
      </div>
    </>
  )
}
