'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import Spinner from '@/components/ui/Spinner';
import FilterTabs from '@/components/ui/FilterTabs';

interface Host {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  city: string;
  isVerified: boolean;
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_SUBMITTED';
  totalProperties: number;
  totalBookings: number;
  revenue: number;
  joinedAt: string;
  lastActive: string;
}

export default function AdminHostsPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending-kyc' | 'rejected-kyc'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
      return;
    }
    fetchHosts();
  }, [isAdmin, router]);

  const fetchHosts = async () => {
    try {
      setLoading(true);
      // This would call an API endpoint for admin hosts
      // For now, using mock data
      setHosts([
        {
          id: '1',
          businessName: 'Mumbai Hotels Ltd',
          email: 'contact@mumbaihotels.com',
          phone: '+91-9876543210',
          city: 'Mumbai',
          isVerified: true,
          kycStatus: 'APPROVED',
          totalProperties: 5,
          totalBookings: 245,
          revenue: 1250000,
          joinedAt: new Date(Date.now() - 180*24*60*60*1000).toISOString(),
          lastActive: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
        },
        {
          id: '2',
          businessName: 'Goa Beach Resorts',
          email: 'contact@goabeach.com',
          phone: '+91-9876543211',
          city: 'Goa',
          isVerified: false,
          kycStatus: 'PENDING',
          totalProperties: 3,
          totalBookings: 89,
          revenue: 450000,
          joinedAt: new Date(Date.now() - 30*24*60*60*1000).toISOString(),
          lastActive: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Error fetching hosts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHosts = hosts
    .filter((host) => {
      if (filter === 'all') return true;
      if (filter === 'verified') return host.isVerified && host.kycStatus === 'APPROVED';
      if (filter === 'pending-kyc') return host.kycStatus === 'PENDING';
      if (filter === 'rejected-kyc') return host.kycStatus === 'REJECTED';
      return true;
    })
    .filter((host) =>
      host.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      host.email.toLowerCase().includes(searchTerm.toLowerCase())
    );



  const stats = {
    totalHosts: hosts.length,
    verifiedHosts: hosts.filter(h => h.isVerified).length,
    pendingKYC: hosts.filter(h => h.kycStatus === 'PENDING').length,
    totalRevenue: hosts.reduce((sum, h) => sum + h.revenue, 0),
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🏢 Host Management</h1>
          <p className="text-gray-600">Manage host accounts and verify KYC</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Hosts"
            value={stats.totalHosts}
            icon="🏢"
            color="blue"
          />
          <StatCard
            title="Verified Hosts"
            value={stats.verifiedHosts}
            icon="✅"
            color="green"
          />
          <StatCard
            title="Pending KYC"
            value={stats.pendingKYC}
            icon="⏳"
            color="yellow"
            highlight={stats.pendingKYC > 0}
          />
          <StatCard
            title="Total Revenue"
            value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
            icon="💰"
            color="purple"
          />
        </div>

        {/* Search & Filter */}
        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Search by business name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          <FilterTabs
            tabs={['all', 'verified', 'pending-kyc', 'rejected-kyc'] as const}
            active={filter}
            onChange={(tab) => setFilter(tab as typeof filter)}
            formatLabel={(tab) => {
              if (tab === 'all') return 'All Hosts';
              if (tab === 'verified') return `Verified (${stats.verifiedHosts})`;
              if (tab === 'pending-kyc') return `Pending KYC (${stats.pendingKYC})`;
              return `Rejected KYC (${hosts.filter(h => h.kycStatus === 'REJECTED').length})`;
            }}
          />
        </div>

        {/* Hosts Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12">
            <Spinner message="Loading hosts..." />
          </div>
        ) : filteredHosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-xl text-gray-600">No hosts found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Business</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Contact</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Location</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Properties</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Bookings</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Revenue</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">KYC Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredHosts.map((host) => (
                  <tr key={host.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{host.businessName}</p>
                      <p className="text-xs text-gray-500">{host.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {host.phone}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      📍 {host.city}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {host.totalProperties}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {host.totalBookings}
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600">
                      ₹{(host.revenue / 100000).toFixed(1)}L
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={host.kycStatus} />
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {new Date(host.lastActive).toLocaleDateString()}
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

