"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import StatCard from "@/components/ui/StatCard"
import StatusBadge from "@/components/ui/StatusBadge"
import Spinner from "@/components/ui/Spinner"
import BackLink from "@/components/ui/BackLink"

interface Payment {
  id: string
  amount: number
  hostEarnings: number
  platformFee: number
  status: string
  transactionId: string
  paidAt: string
  booking: {
    id: string
    numberOfGuests: number
    hotel?: { name: string }
    tour?: { name: string }
  }
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalPayments: 0, completedPayments: 0, totalAmount: 0 })
  const [payoutAmount, setPayoutAmount] = useState(0)
  const [pendingBalance, setPendingBalance] = useState(0)
  const [showPayoutForm, setShowPayoutForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [payoutNotes, setPayoutNotes] = useState("")

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/payments")
      if (response.ok) {
        const data = await response.json()
        setPayments(data.data || [])
        setStats(data.stats)
        setPendingBalance(data.stats.totalAmount)
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestPayout = async () => {
    if (payoutAmount <= 0 || payoutAmount > pendingBalance) {
      alert("Invalid payout amount")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/host/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: payoutAmount,
          notes: payoutNotes,
        }),
      })

      if (response.ok) {
        alert("Payout request submitted successfully!")
        setPayoutAmount(0)
        setPayoutNotes("")
        setShowPayoutForm(false)
        fetchPayments()
      } else {
        alert("Failed to request payout")
      }
    } catch (error) {
      console.error("Error requesting payout:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner minimal />

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="max-w-7xl mx-auto">
        <BackLink href="/host" label="Back to Dashboard" className="text-emerald-600" />

        <h1 className="text-4xl font-bold text-slate-900 mb-8">Payments & Payouts</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard title="Total Payments" value={stats.totalPayments} icon="💳" variant="host" />
          <StatCard title="Completed Payments" value={stats.completedPayments} icon="✓" variant="host" />
          <StatCard title="Total Earnings" value={`$${stats.totalAmount.toFixed(2)}`} icon="💰" variant="host" />
        </div>

        {/* Payout Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Available for Payout</h2>
            <p className="text-3xl font-bold text-emerald-600">${pendingBalance.toFixed(2)}</p>
          </div>

          {!showPayoutForm ? (
            <button
              onClick={() => setShowPayoutForm(true)}
              disabled={pendingBalance <= 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white py-3 rounded-lg font-semibold transition"
            >
              Request Payout
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Payout Amount (Max: ${pendingBalance.toFixed(2)})
                </label>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={e => setPayoutAmount(parseFloat(e.target.value) || 0)}
                  max={pendingBalance}
                  min={0}
                  step={0.01}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={payoutNotes}
                  onChange={e => setPayoutNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Add any notes about this payout request..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleRequestPayout}
                  disabled={submitting || payoutAmount <= 0}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white py-2 rounded-lg font-semibold"
                >
                  {submitting ? "Requesting..." : "Submit Payout Request"}
                </button>
                <button
                  onClick={() => {
                    setShowPayoutForm(false)
                    setPayoutAmount(0)
                    setPayoutNotes("")
                  }}
                  className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-900 py-2 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Booking</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Amount</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Your Earnings</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Platform Fee</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Date</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {payments.map(payment => (
                <tr key={payment.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {payment.booking.hotel?.name || payment.booking.tour?.name}
                      </p>
                      <p className="text-xs text-slate-500">{payment.transactionId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold">${payment.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">${payment.hostEarnings.toFixed(2)}</td>
                  <td className="px-6 py-4 text-red-600">${payment.platformFee.toFixed(2)}</td>
                  <td className="px-6 py-4">{new Date(payment.paidAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={payment.status} colorMap={{
                      COMPLETED: 'success',
                      PENDING: 'warning',
                    }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

