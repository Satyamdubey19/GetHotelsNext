'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout, isAdmin, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return null;
  }

  if (!isAdmin) {
    router.push('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'
        } fixed md:static inset-y-0 left-0 z-50 bg-gradient-to-b from-indigo-900 to-purple-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-indigo-800">
          <Link href="/admin" className={`font-bold text-lg transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            👨‍💼 Admin
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-indigo-800 rounded-lg"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 px-4 py-6 flex-1 overflow-y-auto">
          <NavLink href="/admin" icon="📊" label="Dashboard" open={sidebarOpen} />
          <NavLink href="/admin/kyc" icon="✅" label="KYC Reviews" open={sidebarOpen} />
          <NavLink href="/admin/bookings" icon="📋" label="All Bookings" open={sidebarOpen} />
          <NavLink href="/admin/payouts" icon="💸" label="Payouts" open={sidebarOpen} />
          <NavLink href="/admin/hosts" icon="👤" label="Hosts" open={sidebarOpen} />
          <NavLink href="/admin/users" icon="👥" label="Users" open={sidebarOpen} />
          <NavLink href="/admin/analytics" icon="📈" label="Analytics" open={sidebarOpen} />
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-indigo-800">
          <div className={`flex items-center gap-3 ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center">
              👨
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.email}</p>
                <p className="text-xs text-indigo-300">Admin</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`w-full mt-2 px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded transition-colors ${
              sidebarOpen ? '' : 'px-0'
            }`}
          >
            {sidebarOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">GetHotels Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

function NavLink({
  href,
  icon,
  label,
  open,
}: {
  href: string;
  icon: string;
  label: string;
  open: boolean;
}) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-indigo-800 transition-colors cursor-pointer group">
        <span className="text-xl">{icon}</span>
        <span className={`font-medium text-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0 hidden'}`}>
          {label}
        </span>
      </div>
    </Link>
  );
}
