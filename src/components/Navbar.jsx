import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="text-lg font-semibold tracking-tight text-black">
          Acme Docs
        </Link>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <Link to="/docs" className="transition-colors hover:text-black">
            Docs
          </Link>
          <a href="#" className="transition-colors hover:text-black">
            GitHub
          </a>
        </div>
      </div>
    </nav>
  )
}
