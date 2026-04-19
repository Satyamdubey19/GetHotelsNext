'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import Spinner from '@/components/ui/Spinner';
import FilterTabs from '@/components/ui/FilterTabs';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'USER' | 'HOST' | 'ADMIN';
  createdAt: string;
  isActive: boolean;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'USER' | 'HOST' | 'ADMIN'>('all');

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
      return;
    }
    fetchUsers();
  }, [isAdmin, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // This would call an API endpoint for admin users
      // For now, using mock data
      setUsers([
        {
          id: '1',
          email: 'john@example.com',
          name: 'John Doe',
          phone: '+91-9876543210',
          role: 'USER',
          createdAt: new Date(Date.now() - 30*24*60*60*1000).toISOString(),
          isActive: true,
        },
        {
          id: '2',
          email: 'hotel@example.com',
          name: 'Mumbai Hotels',
          phone: '+91-9876543211',
          role: 'HOST',
          createdAt: new Date(Date.now() - 60*24*60*60*1000).toISOString(),
          isActive: true,
        },
        {
          id: '3',
          email: 'admin@gethotels.com',
          name: 'Admin User',
          phone: '+91-9876543212',
          role: 'ADMIN',
          createdAt: new Date(Date.now() - 120*24*60*60*1000).toISOString(),
          isActive: true,
        },
      ]);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(u => u.role === filter);



  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'USER':
        return '👤';
      case 'HOST':
        return '🏢';
      case 'ADMIN':
        return '👨‍💼';
      default:
        return '❓';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">👥 User Management</h1>
          <p className="text-gray-600">Manage all platform users</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={users.filter(u => u.role === 'USER').length}
            icon="👤"
            color="blue"
          />
          <StatCard
            title="Total Hosts"
            value={users.filter(u => u.role === 'HOST').length}
            icon="🏢"
            color="green"
          />
          <StatCard
            title="Admins"
            value={users.filter(u => u.role === 'ADMIN').length}
            icon="👨‍💼"
            color="red"
          />
          <StatCard
            title="Active Users"
            value={users.filter(u => u.isActive).length}
            icon="✅"
            color="purple"
          />
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <FilterTabs
            tabs={['all', 'USER', 'HOST', 'ADMIN'] as const}
            active={filter}
            onChange={(tab) => setFilter(tab as typeof filter)}
            formatLabel={(tab) =>
              tab === 'all' ? 'All Users' : `${tab} (${users.filter(u => u.role === tab).length})`
            }
          />
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12">
            <Spinner message="Loading users..." />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-xl text-gray-600">No users found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">User</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Phone</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Joined</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getRoleIcon(user.role)}</span>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600">{user.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={user.role} />
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={user.isActive ? 'Active' : 'Inactive'} colorMap={{ Active: 'success', Inactive: 'default' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


