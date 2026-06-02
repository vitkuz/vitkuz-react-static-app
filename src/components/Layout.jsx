import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-700">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 px-6 py-10 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
