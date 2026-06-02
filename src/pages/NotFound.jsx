import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center text-center">
      <p className="text-sm font-medium text-gray-400">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-gray-500">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has been
        moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-50"
      >
        &larr; Back home
      </Link>
    </div>
  )
}
