import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export default function NotFound(): ReactNode {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center text-center">
      <p className="text-sm font-medium text-slate-400">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-slate-600">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has been
        moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
      >
        &larr; Back home
      </Link>
    </div>
  )
}
