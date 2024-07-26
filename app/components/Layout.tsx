import { Link, useLocation, Form } from '@remix-run/react';
import { Home, BarChart, Upload, Settings, LogOut } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out">
        <nav>
          <Link to="/dashboard" className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${location.pathname === '/dashboard' ? 'bg-gray-700' : ''}`}>
            <Home size={16} className="inline mr-2" /> Home
          </Link>
          <Link to="/dashboard/analytics" className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${location.pathname.startsWith('/dashboard/analytics') ? 'bg-gray-700' : ''}`}>
            <BarChart size={16} className="inline mr-2" /> Analytics
          </Link>
          <Link to="/dashboard/uploads" className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${location.pathname.startsWith('/dashboard/uploads') ? 'bg-gray-700' : ''}`}>
            <Upload size={16} className="inline mr-2" /> Uploads
          </Link>
          <Link to="/dashboard/settings" className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${location.pathname.startsWith('/dashboard/settings') ? 'bg-gray-700' : ''}`}>
            <Settings size={16} className="inline mr-2" /> Settings
          </Link>
          <Link to="/dashboard/buckets" className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${location.pathname.startsWith('/dashboard/buckets') ? 'bg-gray-700' : ''}`}>
            <Settings size={16} className="inline mr-2" /> Budget Buckets
          </Link>
        </nav>
        <div className="absolute bottom-0 w-full">
          <Form method="post" action="/logout">
            <button type="submit" className="block w-full py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white">
              <LogOut size={16} className="inline mr-2" /> Logout
            </button>
          </Form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-lg h-16 flex items-center justify-between">
          <div className="flex items-center px-4">
            <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}