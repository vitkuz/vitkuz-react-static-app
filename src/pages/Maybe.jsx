import CodeBlock from '../components/CodeBlock'

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
    <article className="prose prose-gray mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-black">
        Either / Maybe Pattern
      </h1>
      <p className="mt-4 leading-relaxed text-gray-500">
        The Either (or Maybe) pattern wraps a value that may be absent. A{' '}
        <code>Right</code> holds a valid value; a <code>Left</code> signals
        nothing. Operations are chained via <code>map</code> and{' '}
        <code>chain</code>, so you never need to scatter{' '}
        <code>if (x != null)</code> guards throughout your code.
      </p>

      <h2 className="mt-10 text-xl font-medium text-black">
        When to use it
      </h2>
      <ul className="mt-3 space-y-2 text-gray-500">
        <li>You have optional or nullable values (missing user, failed lookup).</li>
        <li>You want to chain operations on a value that might not exist.</li>
        <li>You want the &ldquo;happy path&rdquo; to read cleanly, without null checks.</li>
        <li>You need to handle the absence explicitly at the boundary.</li>
      </ul>

      <h2 className="mt-10 text-xl font-medium text-black">
        Lightweight Either implementation
      </h2>
      <p className="mt-3 leading-relaxed text-gray-500">
        No library needed — a plain object with a few static methods.
      </p>
      <div className="mt-4">
        <CodeBlock code={eitherCode} />
      </div>

      <h2 className="mt-10 text-xl font-medium text-black">
        Safe lookup with Either
      </h2>
      <p className="mt-3 leading-relaxed text-gray-500">
        Using the Either wrapper, every step in the pipeline is safe —{' '}
        <code>map</code> and <code>chain</code> are no-ops when the value is
        absent.
      </p>
      <div className="mt-4">
        <CodeBlock code={safeLookupCode} />
      </div>

      <h2 className="mt-10 text-xl font-medium text-black">
        Composing with pipe
      </h2>
      <p className="mt-3 leading-relaxed text-gray-500">
        Combine Either with <code>pipe</code> (from the Composition page) for
        a clean, readable pipeline.
      </p>
      <div className="mt-4">
        <CodeBlock code={pipeComposeCode} />
      </div>
    </article>
  )
}
