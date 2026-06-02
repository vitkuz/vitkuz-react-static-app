import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

const eitherCode = `// Either pattern – wrap a value that may be null/undefined
const Either = {
  of: (value) =>
    value != null
      ? { tag: 'Right', value }
      : { tag: 'Left', value: null },

  map: (fn) => (either) =>
    either.tag === 'Right'
      ? Either.of(fn(either.value))
      : either,

  chain: (fn) => (either) =>
    either.tag === 'Right'
      ? fn(either.value)
      : either,

  getOrElse: (defaultVal) => (either) =>
    either.tag === 'Right' ? either.value : defaultVal,

  fold: (onLeft, onRight) => (either) =>
    either.tag === 'Right' ? onRight(either.value) : onLeft(either.value),
}`

const safeLookupCode = `// A lookup that might not find anything
const users = {
  1: { name: 'Alice', email: 'alice@example.com' },
  3: { name: 'Bob', email: 'bob@example.com' },
}

const findUser = (id) => Either.of(users[id])

// Chain safe operations without null checks
const getEmail = (user) => Either.of(user.email)
const format = (email) => email.toUpperCase().replace('@', ' [at] ')

const displayEmail = (id) =>
  Either.chain(getEmail)(
    Either.map(format)(findUser(id))
  )

Either.fold(
  () => 'User not found',
  (e) => e
)(displayEmail(1))
// 'ALICE [at] EXAMPLE.COM'

Either.getOrElse('No email')(displayEmail(99))
// 'No email'`

const pipeComposeCode = `// Fluent pipeline with a helper pipe (see Composition page)
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)

const safeEmail = (id) =>
  pipe(
    findUser,
    Either.chain((u) => Either.of(u.email)),
    Either.map((e) => e.toUpperCase()),
    Either.fold(
      () => 'No email found',
      (e) => e
    )
  )(id)

safeEmail(3) // 'BOB@EXAMPLE.COM'
safeEmail(42) // 'No email found'`

export default function Maybe() {
  return (
    <>
      <StepHeader
        order={9}
        title="Either / Maybe Pattern"
        intro='The Either (or Maybe) pattern wraps a value that may be absent. A Right holds a valid value; a Left signals nothing. Operations are chained via map and chain, so you never need to scatter if (x != null) guards throughout your code.'
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>When to use it</h2>
        <ul>
          <li>You have optional or nullable values (missing user, failed lookup).</li>
          <li>You want to chain operations on a value that might not exist.</li>
          <li>You want the &ldquo;happy path&rdquo; to read cleanly, without null checks.</li>
          <li>You need to handle the absence explicitly at the boundary.</li>
        </ul>

        <h2>Lightweight Either implementation</h2>
        <p>
          No library needed — a plain object with a few static methods.
        </p>
        <CodeBlock code={eitherCode} />

        <h2>Safe lookup with Either</h2>
        <p>
          Using the Either wrapper, every step in the pipeline is safe —{' '}
          <code>map</code> and <code>chain</code> are no-ops when the value is
          absent.
        </p>
        <CodeBlock code={safeLookupCode} />

        <h2>Composing with pipe</h2>
        <p>
          Combine Either with <code>pipe</code> (from the Composition page) for
          a clean, readable pipeline.
        </p>
        <CodeBlock code={pipeComposeCode} />

        <Callout tone="tip" title="Beyond Either">
          This pattern scales to other types like <code>Result</code> (Ok/Err
          for error handling), <code>AsyncResult</code>, or <code>Validation</code>.
          Once you&rsquo;re comfortable with Either, these follow the same
          map/chain/fold structure.
        </Callout>
      </div>
    </>
  )
}
