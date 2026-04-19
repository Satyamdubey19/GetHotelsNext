"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import StatCard from "@/components/ui/StatCard"
import StatusBadge from "@/components/ui/StatusBadge"
import Spinner from "@/components/ui/Spinner"
import BackLink from "@/components/ui/BackLink"

interface Booking {
  id: string
  guestId: string
  hotelId?: string
  tourId?: string
  checkInDate?: string
  checkOutDate?: string
  startDate?: string
  endDate?: string
  numberOfGuests: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  createdAt: string
  guest: {
    id: string
    email: string
    name: string
    phone: string
  }
  hotel?: {
    id: string
    name: string
    basePrice: number
  }
  tour?: {
    id: string
    name: string
    pricePerPerson: number
  }
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
  })
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")

  const hostId = "host-id-from-session"

  useEffect(() => {
    fetchBookings()
  }, [filterStatus, filterType])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      let url = `/api/host/bookings?hostId=${hostId}`
      if (filterStatus !== "all") url += `&status=${filterStatus}`
      if (filterType !== "all") url += `&type=${filterType}`

      const response = await fetch(url)
      if (response.ok) {
        const { data, stats } = await response.json()
        setBookings(data || [])
        setStats(stats)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/host/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      })

      if (response.ok) {
        fetchBookings()
      }
    } catch (error) {
      console.error("Error updating booking:", error)
      alert("Failed to update booking")
    }
  }



  if (loading) return <Spinner minimal />

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <BackLink href="/host" label="Back to Dashboard" className="text-purple-600" />
          <h1 className="text-4xl font-bold text-slate-900">Booking Management</h1>
          <p className="text-slate-600 mt-2">Manage all your property bookings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Bookings" value={stats.totalBookings} icon="📋" variant="host" />
          <StatCard title="Confirmed" value={stats.confirmedBookings} icon="✅" variant="host" />
          <StatCard title="Pending" value={stats.pendingBookings} icon="⏳" variant="host" />
          <StatCard title="Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon="💰" variant="host" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Filter by Type</label>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="hotel">Hotels</option>
                <option value="tour">Tours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-slate-500">No bookings found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Guest</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Property</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Dates</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Guests</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Price</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">{booking.guest.name}</p>
                        <p className="text-xs text-slate-500">{booking.guest.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {booking.hotel ? (
                        <span className="text-slate-900">{booking.hotel.name}</span>
                      ) : booking.tour ? (
                        <span className="text-slate-900">{booking.tour.name}</span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {booking.checkInDate && booking.checkOutDate ? (
                        <div>
                          <p>{new Date(booking.checkInDate).toLocaleDateString()}</p>
                          <p className="text-slate-500">to {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                        </div>
                      ) : booking.startDate && booking.endDate ? (
                        <div>
                          <p>{new Date(booking.startDate).toLocaleDateString()}</p>
                          <p className="text-slate-500">to {new Date(booking.endDate).toLocaleDateString()}</p>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{booking.numberOfGuests}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">${booking.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)} colorMap={{
                        Confirmed: 'success',
                        Pending: 'warning',
                        Cancelled: 'error',
                        Completed: 'info',
                      }} />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        onChange={e => updateBookingStatus(booking.id, e.target.value)}
                        className="px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="completed">Complete</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

