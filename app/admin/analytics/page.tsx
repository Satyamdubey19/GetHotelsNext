'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
    }
  }, [isAdmin, router]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📈 Platform Analytics</h1>
          <p className="text-gray-600">Track platform performance and metrics</p>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <span className="text-6xl mb-4 block">🔧</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            Real-time platform analytics including:
          </p>
          <ul className="inline-block text-left text-gray-600 space-y-2">
            <li>✓ Daily/Weekly/Monthly revenue trends</li>
            <li>✓ Booking completion rates</li>
            <li>✓ Host verification statistics</li>
            <li>✓ User growth metrics</li>
            <li>✓ Top performing properties</li>
            <li>✓ Geographic distribution</li>
            <li>✓ Payment processing analytics</li>
            <li>✓ Customer satisfaction metrics</li>
          </ul>
          <p className="text-gray-500 mt-8 text-sm">
            Check back soon for comprehensive analytics dashboard
          </p>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <LinkCard
            title="KYC Reviews"
            description="Review and approve host KYC applications"
            icon="✅"
            href="/admin/kyc"
          />
          <LinkCard
            title="Bookings"
            description="Manage all platform bookings"
            icon="📋"
            href="/admin/bookings"
          />
          <LinkCard
            title="Payouts"
            description="Process and track host payouts"
            icon="💸"
            href="/admin/payouts"
          />
        </div>
      </div>
    </div>
  );
}

function LinkCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:scale-105"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      <div className="mt-4 text-indigo-600 font-medium text-sm hover:text-indigo-700">
        Go to {title} →
      </div>
    </a>
  );
}
