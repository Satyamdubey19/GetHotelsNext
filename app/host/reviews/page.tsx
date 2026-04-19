"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import StatCard from "@/components/ui/StatCard"
import Spinner from "@/components/ui/Spinner"
import BackLink from "@/components/ui/BackLink"

interface Review {
  id: string
  rating: number
  comment: string
  guestName: string
  propertyName: string
  createdAt: string
  verified: boolean
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    positive: 0,
    neutral: 0,
    negative: 0,
  })

  const hostId = "host-id-from-session"

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      // This would connect to an API endpoint
      // For now, we'll show placeholder data
      setStats({
        averageRating: 4.5,
        totalReviews: 24,
        positive: 20,
        neutral: 3,
        negative: 1,
      })
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600"
    if (rating >= 3) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) return <Spinner minimal />

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <BackLink href="/host" label="Back to Dashboard" className="text-amber-600" />
          <h1 className="text-4xl font-bold text-slate-900">Guest Reviews</h1>
          <p className="text-slate-600 mt-2">Manage and respond to guest feedback</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Average Rating"
            value={`${stats.averageRating} ⭐`}
            icon="⭐"
            variant="host"
          />
          <StatCard
            title="Total Reviews"
            value={stats.totalReviews}
            icon="📝"
            variant="host"
          />
          <StatCard
            title="Positive"
            value={stats.positive}
            icon="👍"
            variant="host"
          />
          <StatCard
            title="Negative"
            value={stats.negative}
            icon="👎"
            variant="host"
          />
        </div>

        {/* Review Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Rating Distribution</h2>
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center gap-4">
                <span className="w-12 font-semibold">{rating} ⭐</span>
                <div className="flex-1 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${Math.random() * 100}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm text-slate-600">23%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Reviews</h2>
          {[1, 2, 3].map(review => (
            <div key={review} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-slate-900">Guest Review</p>
                  <p className="text-sm text-slate-500">Property: Sample Hotel</p>
                </div>
                <span className={`text-2xl font-bold ${getRatingColor(5)}`}>5.0</span>
              </div>
              <p className="text-slate-700 mb-4">
                "Great hotel with amazing service and beautiful rooms. The staff was very helpful and friendly."
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">2 days ago • Verified Booking</p>
                <button className="text-blue-600 hover:underline text-sm font-semibold">Reply</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

