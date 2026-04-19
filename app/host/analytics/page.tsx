"use client"

import Link from "next/link"
import BackLink from "@/components/ui/BackLink"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <BackLink href="/host" label="Back to Dashboard" className="text-indigo-600" />
          <h1 className="text-4xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-600 mt-2">Track your performance and insights</p>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <AnalyticsCard
            title="Total Revenue"
            value="$12,500"
            change="+12%"
            icon="💰"
          />
          <AnalyticsCard
            title="Occupancy Rate"
            value="75%"
            change="+5%"
            icon="📊"
          />
          <AnalyticsCard
            title="Total Guests"
            value="245"
            change="+22%"
            icon="👥"
          />
          <AnalyticsCard
            title="Avg Rating"
            value="4.8 ⭐"
            change="+0.3"
            icon="⭐"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Monthly Revenue</h2>
            <div className="h-64 bg-gradient-to-b from-indigo-100 to-indigo-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-slate-600 mb-2">📈 Revenue Trend</p>
                <p className="text-sm text-slate-500">Chart visualization would go here</p>
              </div>
            </div>
          </div>

          {/* Booking Trends */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Booking Trends</h2>
            <div className="h-64 bg-gradient-to-b from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-slate-600 mb-2">📅 Bookings by Month</p>
                <p className="text-sm text-slate-500">Chart visualization would go here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Performance */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Property Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Property</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Bookings</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Revenue</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Occupancy</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">Grand Hotel</td>
                  <td className="px-6 py-4">45</td>
                  <td className="px-6 py-4 font-semibold">$8,500</td>
                  <td className="px-6 py-4">85%</td>
                  <td className="px-6 py-4">4.9 ⭐</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">Beach Resort</td>
                  <td className="px-6 py-4">32</td>
                  <td className="px-6 py-4 font-semibold">$6,400</td>
                  <td className="px-6 py-4">72%</td>
                  <td className="px-6 py-4">4.7 ⭐</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">Mountain Adventure</td>
                  <td className="px-6 py-4">18</td>
                  <td className="px-6 py-4 font-semibold">$3,600</td>
                  <td className="px-6 py-4">65%</td>
                  <td className="px-6 py-4">4.6 ⭐</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightCard
            title="🎯 Top Performer"
            description="Grand Hotel is your best performing property with 85% occupancy"
          />
          <InsightCard
            title="📈 Growth Opportunity"
            description="Consider promotional pricing for Mountain Adventure tour"
          />
          <InsightCard
            title="⭐ Guest Satisfaction"
            description="Your avg rating of 4.8 is excellent! Keep up the good work"
          />
        </div>
      </div>
    </div>
  )
}

function AnalyticsCard({
  title,
  value,
  change,
  icon,
}: {
  title: string
  value: string
  change: string
  icon: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-600 text-sm font-semibold">{title}</p>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
      <p className="text-green-600 text-sm font-semibold">{change} from last month</p>
    </div>
  )
}

function InsightCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  )
}
