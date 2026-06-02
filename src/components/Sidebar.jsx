import { NavLink } from 'react-router-dom'

const links = [
  { to: '/docs', label: 'Introduction', end: true },
  { to: '/docs/getting-started', label: 'Getting Started' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 px-4 py-8 lg:block hidden">
      <nav className="flex flex-col gap-0.5">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `rounded-md px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? 'bg-gray-100 font-medium text-black'
                  : 'text-gray-500 hover:text-black hover:bg-gray-50'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
