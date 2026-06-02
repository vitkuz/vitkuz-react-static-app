import { useState } from 'react'
import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import StepPager from './StepPager'

export default function Layout(): ReactNode {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  return (
    <div className="md:flex">
      <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:hidden">
          <button
            className="rounded-md border border-slate-300 px-2 py-1 text-slate-600 hover:bg-slate-100"
            onClick={() => setDrawerOpen(true)}
          >
            ☰
          </button>
          <span className="text-sm font-semibold text-slate-800">
            Programming Patterns
          </span>
        </header>

        {/* Main content */}
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-8 sm:px-8">
          <Outlet />
          <StepPager />
        </main>
      </div>
    </div>
  )
}
