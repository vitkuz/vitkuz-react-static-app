import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center text-center">
      <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-black lg:text-6xl">
        Build something great
      </h1>
      <p className="mt-4 max-w-lg text-lg text-gray-500">
        A modern, minimal documentation site. Clean typography, generous
        whitespace, and nothing but black &amp; white.
      </p>
      <Link
        to="/docs"
        className="mt-8 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-gray-50"
      >
        Read the docs
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  )
}
