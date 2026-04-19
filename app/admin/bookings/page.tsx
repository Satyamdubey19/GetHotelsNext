'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import StatusBadge from '@/components/ui/StatusBadge';
import Spinner from '@/components/ui/Spinner';
import FilterTabs from '@/components/ui/FilterTabs';
import Modal from '@/components/ui/Modal';

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate?: string;
  checkOutDate?: string;
  startDate?: string;
  endDate?: string;
  hotelName?: string;
  tourName?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  guestCount: number;
  hostId: string;
  hostName: string;
  createdAt: string;
  isOverridden?: boolean;
  overriddenBy?: string;
  overrideReason?: string;
  cancellationReason?: string;
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [overriding, setOverriding] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
      return;
    }
    fetchBookings();
  }, [isAdmin, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/bookings');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);



  const handleOverrideClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setOverrideReason('');
    setShowOverrideModal(true);
  };

  const handleSubmitOverride = async () => {
    if (!selectedBooking || !newStatus || !overrideReason.trim()) {
      alert('Please fill all fields');
      return;
    }

    setOverriding(true);
    try {
      const response = await fetch(`/api/host/bookings/${selectedBooking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'override',
          status: newStatus,
          overrideReason: overrideReason.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to override booking');
      }

      alert('Booking overridden successfully!');
      setShowOverrideModal(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      console.error('Error overriding booking:', error);
      alert('Failed to override booking');
    } finally {
      setOverriding(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📋 All Bookings</h1>
          <p className="text-gray-600">Manage and override all platform bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <FilterTabs
            tabs={['all', 'pending', 'confirmed', 'cancelled', 'completed'] as const}
            active={filter}
            onChange={(tab) => setFilter(tab as typeof filter)}
            formatLabel={(tab) =>
              tab === 'all'
                ? 'All'
                : `${tab.charAt(0).toUpperCase() + tab.slice(1)} (${bookings.filter(b => b.status === tab).length})`
            }
          />
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12">
            <Spinner message="Loading bookings..." />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-xl text-gray-600">No bookings found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Guest</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Property</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Host</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Dates</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{booking.guestName}</p>
                        <p className="text-xs text-gray-500">{booking.guestEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {booking.hotelName || booking.tourName || '-'}
                        </p>
                        {booking.isOverridden && (
                          <p className="text-xs text-red-600 font-medium">⚠️ Overridden by admin</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{booking.hostName}</p>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {booking.checkInDate && booking.checkOutDate ? (
                        <div>
                          <p>{new Date(booking.checkInDate).toLocaleDateString()}</p>
                          <p className="text-gray-500">to {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                        </div>
                      ) : booking.startDate && booking.endDate ? (
                        <div>
                          <p>{new Date(booking.startDate).toLocaleDateString()}</p>
                          <p className="text-gray-500">to {new Date(booking.endDate).toLocaleDateString()}</p>
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ₹{booking.totalPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status.toUpperCase()} colorMap={{
                        PENDING: 'warning',
                        CONFIRMED: 'info',
                        CANCELLED: 'error',
                        COMPLETED: 'success',
                      }} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleOverrideClick(booking)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors"
                      >
                        Override
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Override Modal */}
        <Modal
          open={showOverrideModal && !!selectedBooking}
          onClose={() => setShowOverrideModal(false)}
          title="Override Booking"
          maxWidth="max-w-md"
        >
          {selectedBooking && (
            <>

              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 text-sm">
                <p className="text-blue-900">
                  <strong>Guest:</strong> {selectedBooking.guestName}
                </p>
                <p className="text-blue-900">
                  <strong>Property:</strong> {selectedBooking.hotelName || selectedBooking.tourName}
                </p>
                <p className="text-blue-900">
                  <strong>Current Status:</strong> {selectedBooking.status.toUpperCase()}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Override Reason (Required)
                  </label>
                  <textarea
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="Explain why you're overriding this booking..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowOverrideModal(false)}
                  disabled={overriding}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitOverride}
                  disabled={overriding || !newStatus || !overrideReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {overriding ? 'Overriding...' : 'Override Booking'}
                </button>
              </div>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
}
