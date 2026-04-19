"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Booking {
  id: string
  numberOfGuests: number
  totalPrice: number
  status: string
  checkInDate: string
  checkOutDate: string
  startDate: string
  endDate: string
  specialRequests: string
  notes: string
  isOverridden: boolean
  overriddenBy: string
  overrideReason: string
  cancellationReason: string
  guest: {
    id: string
    email: string
    name: string
    phone: string
  }
  hotel?: {
    id: string
    name: string
  }
  tour?: {
    id: string
    name: string
  }
}

export default function BookingDetailPage() {
  const params = useParams()
  const bookingId = params?.bookingId as string
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showCancelForm, setShowCancelForm] = useState(false)
  const [cancelReason, setCancelReason] = useState("")

  useEffect(() => {
    fetchBooking()
  }, [bookingId])

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/host/bookings/${bookingId}`)
      if (response.ok) {
        const data = await response.json()
        setBooking(data.data)
      }
    } catch (error) {
      console.error("Error fetching booking:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a cancellation reason")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/host/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cancel",
          reason: cancelReason,
        }),
      })

      if (response.ok) {
        alert("Booking cancelled successfully!")
        fetchBooking()
        setShowCancelForm(false)
        setCancelReason("")
      } else {
        alert("Failed to cancel booking")
      }
    } catch (error) {
      console.error("Error cancelling booking:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    try {
      const response = await fetch(`/api/host/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "confirm",
        }),
      })

      if (response.ok) {
        alert("Booking confirmed successfully!")
        fetchBooking()
      }
    } catch (error) {
      console.error("Error confirming booking:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (!booking) return <div className="text-center py-12">Booking not found</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/host/bookings" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Bookings
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Booking Details</h1>
              <p className="text-slate-600">Booking ID: {bookingId}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
              booking.status === "confirmed" ? "bg-green-100 text-green-800" :
              booking.status === "cancelled" ? "bg-red-100 text-red-800" :
              booking.status === "completed" ? "bg-blue-100 text-blue-800" :
              "bg-yellow-100 text-yellow-800"
            }`}>
              {booking.status.toUpperCase()}
            </span>
          </div>

          {booking.isOverridden && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm font-semibold text-purple-900">
                ⚠️ This booking was overridden by admin
              </p>
              {booking.overrideReason && <p className="text-sm text-purple-800 mt-1">{booking.overrideReason}</p>}
            </div>
          )}

          {booking.status === "cancelled" && booking.cancellationReason && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-semibold text-red-900">Cancellation Reason:</p>
              <p className="text-sm text-red-800">{booking.cancellationReason}</p>
            </div>
          )}

          {/* Guest Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Guest Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600">Guest Name</p>
                <p className="text-lg font-semibold text-slate-900">{booking.guest.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="text-lg font-semibold text-slate-900">{booking.guest.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Phone</p>
                <p className="text-lg font-semibold text-slate-900">{booking.guest.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Number of Guests</p>
                <p className="text-lg font-semibold text-slate-900">{booking.numberOfGuests}</p>
              </div>
            </div>
          </div>

          {/* Property Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Property Information</h2>
            {booking.hotel && (
              <div>
                <p className="text-sm text-slate-600">Hotel</p>
                <p className="text-lg font-semibold text-slate-900">{booking.hotel.name}</p>
              </div>
            )}
            {booking.tour && (
              <div>
                <p className="text-sm text-slate-600">Tour Package</p>
                <p className="text-lg font-semibold text-slate-900">{booking.tour.name}</p>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Booking Dates</h2>
            <div className="grid grid-cols-2 gap-6">
              {booking.checkInDate && (
                <>
                  <div>
                    <p className="text-sm text-slate-600">Check-in</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Check-out</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                  </div>
                </>
              )}
              {booking.startDate && (
                <>
                  <div>
                    <p className="text-sm text-slate-600">Start Date</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {new Date(booking.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">End Date</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-8 p-6 bg-slate-100 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-slate-900">Total Price</p>
              <p className="text-3xl font-bold text-blue-600">${booking.totalPrice}</p>
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Special Requests</h2>
              <p className="text-slate-700 p-4 bg-slate-50 rounded-lg">{booking.specialRequests}</p>
            </div>
          )}

          {/* Notes */}
          {booking.notes && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Notes</h2>
              <p className="text-slate-700 p-4 bg-slate-50 rounded-lg">{booking.notes}</p>
            </div>
          )}

          {/* Actions */}
          {booking.status === "pending" && (
            <div className="flex gap-4">
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white py-3 rounded-lg font-semibold"
              >
                {submitting ? "Confirming..." : "✓ Confirm Booking"}
              </button>
              <button
                onClick={() => setShowCancelForm(!showCancelForm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
              >
                ✗ Cancel Booking
              </button>
            </div>
          )}

          {booking.status !== "cancelled" && booking.status !== "completed" && (
            <>
              {!showCancelForm && (
                <button
                  onClick={() => setShowCancelForm(true)}
                  className="w-full mt-4 text-red-600 hover:text-red-700 font-semibold"
                >
                  Need to cancel this booking?
                </button>
              )}

              {showCancelForm && (
                <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="text-lg font-bold text-red-900 mb-4">Cancel Booking</h3>
                  <textarea
                    value={cancelReason}
                    onChange={e => setCancelReason(e.target.value)}
                    placeholder="Please provide a reason for cancellation..."
                    rows={4}
                    className="w-full px-4 py-2 border border-red-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleCancel}
                      disabled={submitting || !cancelReason.trim()}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white py-2 rounded-lg font-semibold"
                    >
                      {submitting ? "Cancelling..." : "Confirm Cancellation"}
                    </button>
                    <button
                      onClick={() => {
                        setShowCancelForm(false)
                        setCancelReason("")
                      }}
                      className="flex-1 bg-slate-400 hover:bg-slate-500 text-white py-2 rounded-lg font-semibold"
                    >
                      Keep Booking
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
