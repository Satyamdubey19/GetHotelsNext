'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import Spinner from '@/components/ui/Spinner';

interface DashboardStats {
  totalUsers: number;
  totalHosts: number;
  totalBookings: number;
  pendingKYC: number;
  approvedKYC: number;
  rejectedKYC: number;
  totalRevenue: number;
  totalPayouts: number;
  pendingPayouts: number;
  confirmedBookings: number;
  cancelledBookings: number;
}

interface RecentActivity {
  id: string;
  type: 'booking' | 'kyc' | 'payout' | 'user';
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'rejected';
}

export default function AdminDashboard() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
      return;
    }
    fetchStats();
  }, [isAdmin, router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // This would call an admin stats API
      // For now, we'll use mock data
      setStats({
        totalUsers: 1250,
        totalHosts: 145,
        totalBookings: 2847,
        pendingKYC: 23,
        approvedKYC: 142,
        rejectedKYC: 5,
        totalRevenue: 1254780,
        totalPayouts: 980420,
        pendingPayouts: 47500,
        confirmedBookings: 2156,
        cancelledBookings: 311,
      });

      setRecentActivity([
        {
          id: '1',
          type: 'kyc',
          description: 'New KYC application from John Hotel',
          timestamp: new Date().toISOString(),
          status: 'pending',
        },
        {
          id: '2',
          type: 'booking',
          description: 'Booking #1234 confirmed',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'completed',
        },
        {
          id: '3',
          type: 'payout',
          description: 'Payout request from Mumbai Hotels Ltd',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          status: 'pending',
        },
      ]);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'kyc':
        return '✅';
      case 'booking':
        return '📋';
      case 'payout':
        return '💸';
      case 'user':
        return '👤';
      default:
        return '📊';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <Spinner message="Loading dashboard..." fullPage />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📊 Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening on your platform today.</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon="👥"
            color="blue"
            href="/admin/users"
          />
          <StatCard
            title="Total Hosts"
            value={stats?.totalHosts || 0}
            icon="👤"
            color="purple"
            href="/admin/hosts"
          />
          <StatCard
            title="Pending KYC"
            value={stats?.pendingKYC || 0}
            icon="✅"
            color="yellow"
            href="/admin/kyc"
            highlight={true}
          />
          <StatCard
            title="Total Bookings"
            value={stats?.totalBookings || 0}
            icon="📋"
            color="green"
            href="/admin/bookings"
          />
        </div>

        {/* Revenue & Payouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <RevenueCard
            title="Total Revenue"
            amount={stats?.totalRevenue || 0}
            icon="💰"
            color="green"
          />
          <RevenueCard
            title="Total Payouts"
            amount={stats?.totalPayouts || 0}
            icon="💸"
            color="blue"
          />
          <RevenueCard
            title="Pending Payouts"
            amount={stats?.pendingPayouts || 0}
            icon="⏳"
            color="orange"
            href="/admin/payouts"
            highlight={true}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved</span>
                <span className="text-2xl font-bold text-green-600">{stats?.approvedKYC || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Review</span>
                <span className="text-2xl font-bold text-yellow-600">{stats?.pendingKYC || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rejected</span>
                <span className="text-2xl font-bold text-red-600">{stats?.rejectedKYC || 0}</span>
              </div>
            </div>
            <Link href="/admin/kyc">
              <button className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                Review KYC Applications →
              </button>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Confirmed</span>
                <span className="text-2xl font-bold text-blue-600">{stats?.confirmedBookings || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Bookings</span>
                <span className="text-2xl font-bold text-green-600">{stats?.totalBookings || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cancelled</span>
                <span className="text-2xl font-bold text-red-600">{stats?.cancelledBookings || 0}</span>
              </div>
            </div>
            <Link href="/admin/bookings">
              <button className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                View All Bookings →
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <StatusBadge status={activity.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">⚡ Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link href="/admin/kyc">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                Review KYC (23)
              </button>
            </Link>
            <Link href="/admin/payouts">
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
                Process Payouts (47)
              </button>
            </Link>
            <Link href="/admin/bookings">
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm">
                View Bookings
              </button>
            </Link>
            <Link href="/admin/hosts">
              <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm">
                Manage Hosts
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



function RevenueCard({
  title,
  amount,
  icon,
  color,
  href,
  highlight,
}: {
  title: string;
  amount: number;
  icon: string;
  color: string;
  href?: string;
  highlight?: boolean;
}) {
  const colors = {
    green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
    orange: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200',
  };

  const content = (
    <div
      className={`${colors[color as keyof typeof colors]} ${
        highlight ? 'ring-2 ring-offset-2 ring-red-400' : ''
      } border rounded-lg p-6 transition-all hover:shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-700 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹{(amount / 100000).toFixed(1)}L</p>
          <p className="text-xs text-gray-600 mt-1">₹{amount.toLocaleString('en-IN')}</p>
        </div>
        <span className="text-4xl opacity-60">{icon}</span>
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
