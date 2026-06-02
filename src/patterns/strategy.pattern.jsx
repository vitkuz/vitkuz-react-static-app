import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta = {
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

export default function StrategyPattern() {
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
      </div>
    </>
  )
}
