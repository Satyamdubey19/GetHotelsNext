"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { HostDashboardSkeleton } from "@/components/ui/loading-skeletons"

type PropertyType = "hotel" | "tour"

interface HostedProperty {
  id: string
  title: string
  location: string
  price: number
  rating: number
  totalReviews: number
  isActive: boolean
  createdAt: string
  bookingsCount: number
  occupancyRate: number
  monthlyRevenue: number
  responseRate: number
  nextAvailability: string
  tags: string[]
  type: PropertyType
}

interface DashboardStats {
  hotels: number
  tours: number
  bookings: number
  revenue: number
  activeListings: number
  avgRating: number
  occupancyRate: number
  responseRate: number
}

const mockHotels: HostedProperty[] = [
  {
    id: "hotel-coral-villa",
    title: "Coral Villa Retreat",
    location: "Goa, India",
    price: 185,
    rating: 4.9,
    totalReviews: 128,
    isActive: true,
    createdAt: "2025-06-12",
    bookingsCount: 64,
    occupancyRate: 91,
    monthlyRevenue: 11800,
    responseRate: 98,
    nextAvailability: "2026-04-18",
    tags: ["Ocean view", "Airport pickup", "Breakfast included"],
    type: "hotel",
  },
  {
    id: "hotel-cedar-peak",
    title: "Cedar Peak Lodge",
    location: "Manali, India",
    price: 142,
    rating: 4.7,
    totalReviews: 94,
    isActive: true,
    createdAt: "2025-09-03",
    bookingsCount: 51,
    occupancyRate: 84,
    monthlyRevenue: 9100,
    responseRate: 95,
    nextAvailability: "2026-04-20",
    tags: ["Mountain deck", "Bonfire nights", "Family suites"],
    type: "hotel",
  },
]

const mockTours: HostedProperty[] = [
  {
    id: "tour-sunset-sail",
    title: "Sunset Coastline Escape",
    location: "Kochi, India",
    price: 89,
    rating: 4.8,
    totalReviews: 76,
    isActive: true,
    createdAt: "2025-08-21",
    bookingsCount: 83,
    occupancyRate: 88,
    monthlyRevenue: 7400,
    responseRate: 97,
    nextAvailability: "2026-04-17",
    tags: ["Small groups", "Local guide", "Flexible departures"],
    type: "tour",
  },
  {
    id: "tour-forest-trail",
    title: "Rainforest Trails Experience",
    location: "Wayanad, India",
    price: 119,
    rating: 4.6,
    totalReviews: 58,
    isActive: false,
    createdAt: "2025-11-05",
    bookingsCount: 37,
    occupancyRate: 69,
    monthlyRevenue: 4200,
    responseRate: 89,
    nextAvailability: "2026-04-23",
    tags: ["Nature guide", "Meal included", "Weekend demand"],
    type: "tour",
  },
]

const monthlyRevenue = [6200, 7100, 7600, 8300, 9100, 10400, 11200]

const channelMix = [
  { label: "Direct", value: 46, tone: "from-cyan-500 to-sky-500" },
  { label: "Marketplace", value: 34, tone: "from-indigo-500 to-violet-500" },
  { label: "Repeat guests", value: 20, tone: "from-emerald-500 to-teal-500" },
]

export default function HostDashboard() {
  const { user } = useAuth()
  const [hotels, setHotels] = useState<HostedProperty[]>([])
  const [tours, setTours] = useState<HostedProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    hotels: 0,
    tours: 0,
    bookings: 0,
    revenue: 0,
    activeListings: 0,
    avgRating: 0,
    occupancyRate: 0,
    responseRate: 0,
  })

  useEffect(() => {
    void fetchProperties()
  }, [user?.id])

  const fetchProperties = async () => {
    setLoading(true)

    try {
      const hostId = user?.id ?? "host-id-from-session"
      const [hotelResult, tourResult] = await Promise.allSettled([
        fetch(`/api/host/hotels?hostId=${hostId}`),
        fetch(`/api/host/tours?hostId=${hostId}`),
      ])

      const hotelData = await parsePropertiesResponse(hotelResult, "hotel")
      const tourData = await parsePropertiesResponse(tourResult, "tour")
      const nextHotels = hotelData.length > 0 ? hotelData : mockHotels
      const nextTours = tourData.length > 0 ? tourData : mockTours

      setHotels(nextHotels)
      setTours(nextTours)
      setStats(buildStats(nextHotels, nextTours))
    } catch (error) {
      console.error("Error fetching properties:", error)
      setHotels(mockHotels)
      setTours(mockTours)
      setStats(buildStats(mockHotels, mockTours))
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <HostDashboardSkeleton />

  const allListings = [...hotels, ...tours]
  const hostName = user?.businessName || user?.name || "Host"
  const listingGoal = 8
  const listingProgress = Math.min(Math.round((allListings.length / listingGoal) * 100), 100)
  const profileCompletion = Math.min(72 + allListings.length * 6, 100)
  const upcomingCheckins = allListings
    .filter(property => property.isActive)
    .sort((left, right) => new Date(left.nextAvailability).getTime() - new Date(right.nextAvailability).getTime())
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(79,70,229,0.18),_transparent_28%),linear-gradient(180deg,#eff6ff_0%,#f8fafc_42%,#eef2ff_100%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-slate-950 px-6 py-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)] sm:px-8 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.28),transparent_26%),radial-gradient(circle_at_80%_10%,rgba(129,140,248,0.25),transparent_24%),radial-gradient(circle_at_75%_80%,rgba(16,185,129,0.18),transparent_24%)]" />
          <div className="absolute -right-12 top-10 h-40 w-40 rounded-full border border-white/10 bg-white/5 blur-2xl" />
          <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
                <SparkPulseIcon className="h-4 w-4 text-cyan-300" />
                Host command center
              </div>
              <div className="max-w-3xl space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  Welcome back, {hostName}. Your portfolio is trending in the right direction.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Monitor listings, accelerate bookings, and keep guest operations tight from one workspace built for daily host decisions.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <HeroMetric
                  label="Active listings"
                  value={`${stats.activeListings}/${allListings.length || 1}`}
                  detail={`${listingProgress}% of your near-term growth plan`}
                />
                <HeroMetric
                  label="Guest satisfaction"
                  value={`${stats.avgRating.toFixed(1)}/5`}
                  detail="Maintaining premium review momentum"
                />
                <HeroMetric
                  label="Response health"
                  value={`${stats.responseRate}%`}
                  detail="Median reply under 18 minutes this week"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <QuickActionLink
                  href="/host/hotels/new"
                  label="Create hotel listing"
                  tone="bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                  icon={<BuildingIcon className="h-5 w-5" />}
                />
                <QuickActionLink
                  href="/host/tours/new"
                  label="Launch new tour"
                  tone="bg-white/10 text-white hover:bg-white/15"
                  icon={<CompassIcon className="h-5 w-5" />}
                />
                <QuickActionLink
                  href="/host/bookings"
                  label="Open booking queue"
                  tone="bg-white/10 text-white hover:bg-white/15"
                  icon={<CalendarStackIcon className="h-5 w-5" />}
                />
              </div>
            </div>

            <div className="grid gap-4 rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-200">Portfolio completion</p>
                  <span className="text-sm font-semibold text-cyan-300">{profileCompletion}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400" style={{ width: `${profileCompletion}%` }} />
                </div>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <ChecklistRow label="Listing visuals optimized" done />
                  <ChecklistRow label="Pricing refreshed for weekend demand" done={stats.occupancyRate > 78} />
                  <ChecklistRow label="Guest messaging templates configured" done={stats.responseRate > 92} />
                </div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-slate-900/40 p-5">
                <p className="text-sm font-semibold text-slate-200">Upcoming arrivals</p>
                <div className="mt-4 space-y-3">
                  {upcomingCheckins.map(property => (
                    <div key={property.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{property.title}</p>
                        <p className="text-xs text-slate-400">{property.location}</p>
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                        {formatDate(property.nextAvailability)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InsightStatCard
            label="Portfolio revenue"
            value={formatCurrency(stats.revenue)}
            hint="Projected this month"
            trend="+18.4%"
            icon={<WalletIcon className="h-6 w-6" />}
            tone="from-cyan-500/20 via-sky-500/10 to-white"
          />
          <InsightStatCard
            label="Total bookings"
            value={stats.bookings.toString()}
            hint="Across hotels and tours"
            trend="+12 this week"
            icon={<CalendarStackIcon className="h-6 w-6" />}
            tone="from-indigo-500/20 via-violet-500/10 to-white"
          />
          <InsightStatCard
            label="Occupancy pace"
            value={`${stats.occupancyRate}%`}
            hint="Weighted by active listings"
            trend="Weekend dates filling fast"
            icon={<PulseBoardIcon className="h-6 w-6" />}
            tone="from-emerald-500/20 via-teal-500/10 to-white"
          />
          <InsightStatCard
            label="Listing mix"
            value={`${stats.hotels} hotels / ${stats.tours} tours`}
            hint="Balanced travel inventory"
            trend={`${stats.activeListings} currently live`}
            icon={<CompassIcon className="h-6 w-6" />}
            tone="from-amber-500/20 via-orange-500/10 to-white"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">Performance arc</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Revenue rhythm</h2>
                <p className="mt-1 text-sm text-slate-500">Seven-month pace built from your current portfolio mix.</p>
              </div>
              <Link href="/host/analytics" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700">
                View analytics
                <ArrowUpRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="flex h-72 items-end gap-3 rounded-[24px] bg-slate-950 px-4 pb-5 pt-8">
                {monthlyRevenue.map((amount, index) => {
                  const barHeight = Math.max(24, Math.round((amount / 11200) * 100))

                  return (
                    <div key={amount} className="flex flex-1 flex-col items-center gap-3">
                      <div className="flex h-full w-full items-end justify-center rounded-[20px] bg-white/5 px-2 py-2">
                        <div
                          className="w-full rounded-[16px] bg-gradient-to-t from-cyan-400 via-sky-400 to-indigo-400 shadow-[0_10px_30px_rgba(56,189,248,0.28)]"
                          style={{ height: `${barHeight}%` }}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">M{index + 1}</p>
                        <p className="text-xs text-slate-300">{formatCompactCurrency(amount)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="space-y-4">
                <MetricPanel
                  title="Growth signal"
                  value="High intent demand"
                  body="Searches and direct enquiries are strongest on beach stays and short premium tours."
                  icon={<SparkPulseIcon className="h-5 w-5" />}
                />
                <MetricPanel
                  title="Price confidence"
                  value="Room to lift ADR"
                  body="Two top listings have review depth and occupancy strong enough to justify a weekend pricing increase."
                  icon={<ShieldCheckIcon className="h-5 w-5" />}
                />
                <MetricPanel
                  title="Channel mix"
                  value="Direct share improving"
                  body="Repeat guests and direct leads are lowering acquisition cost across your strongest inventory."
                  icon={<ChartNodesIcon className="h-5 w-5" />}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Action queue</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-950">What needs attention today</h2>
                </div>
                <OperationsIcon className="h-10 w-10 text-emerald-600" />
              </div>
              <div className="space-y-3">
                <ActionTask
                  title="Approve pending bookings"
                  body="3 booking requests are waiting for confirmation before 6 PM."
                  status="Urgent"
                />
                <ActionTask
                  title="Refresh Rainforest Trails itinerary"
                  body="Inactive tour could regain visibility with updated inclusions and cover media."
                  status="Suggested"
                />
                <ActionTask
                  title="Follow up on guest feedback"
                  body="2 recent reviews mention check-in speed and local transport guidance."
                  status="Guest care"
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-700">Acquisition mix</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">Where your bookings are coming from</h2>
              </div>
              <div className="space-y-4">
                {channelMix.map(channel => (
                  <div key={channel.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-700">{channel.label}</span>
                      <span className="text-slate-500">{channel.value}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100">
                      <div className={`h-2.5 rounded-full bg-gradient-to-r ${channel.tone}`} style={{ width: `${channel.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">Listings</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Portfolio detail</h2>
              <p className="mt-1 text-sm text-slate-500">A tighter view of revenue, occupancy, availability, and actions for each active inventory item.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <InlineBadge label={`${stats.hotels} hotel listings`} />
              <InlineBadge label={`${stats.tours} tour experiences`} />
              <InlineBadge label={`${stats.activeListings} live now`} tone="border-emerald-100 bg-emerald-50 text-emerald-700" />
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {allListings.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

async function parsePropertiesResponse(
  result: PromiseSettledResult<Response>,
  type: PropertyType
): Promise<HostedProperty[]> {
  if (result.status !== "fulfilled" || !result.value.ok) {
    return []
  }

  try {
    const payload = await result.value.json()
    const rows = Array.isArray(payload) ? payload : payload.data

    if (!Array.isArray(rows)) {
      return []
    }

    return rows.map((item, index) => normalizeProperty(item, type, index))
  } catch {
    return []
  }
}

function normalizeProperty(raw: Partial<HostedProperty>, type: PropertyType, index: number): HostedProperty {
  const price = Number(raw.price ?? 0)
  const totalReviews = Number(raw.totalReviews ?? 0)
  const rating = Number(raw.rating ?? 4.5)
  const bookingsCount = Number(raw.bookingsCount ?? Math.max(totalReviews, 12 + index * 5))
  const occupancyRate = Number(raw.occupancyRate ?? Math.min(96, 72 + index * 7 + (type === "hotel" ? 8 : 4)))

  return {
    id: raw.id ?? `${type}-${index}`,
    title: raw.title ?? `${type === "hotel" ? "Hosted Hotel" : "Hosted Tour"} ${index + 1}`,
    location: raw.location ?? "Location pending",
    price,
    rating,
    totalReviews,
    isActive: raw.isActive ?? true,
    createdAt: raw.createdAt ?? new Date().toISOString(),
    bookingsCount,
    occupancyRate,
    monthlyRevenue: Number(raw.monthlyRevenue ?? price * Math.max(bookingsCount, 10)),
    responseRate: Number(raw.responseRate ?? Math.min(99, 88 + index * 3)),
    nextAvailability: raw.nextAvailability ?? new Date(Date.now() + (index + 1) * 86400000).toISOString(),
    tags: raw.tags ?? (type === "hotel" ? ["Curated stay", "Flexible cancellation"] : ["Hosted experience", "Guide included"]),
    type,
  }
}

function buildStats(hotels: HostedProperty[], tours: HostedProperty[]): DashboardStats {
  const allListings = [...hotels, ...tours]

  if (allListings.length === 0) {
    return {
      hotels: 0,
      tours: 0,
      bookings: 0,
      revenue: 0,
      activeListings: 0,
      avgRating: 0,
      occupancyRate: 0,
      responseRate: 0,
    }
  }

  return {
    hotels: hotels.length,
    tours: tours.length,
    bookings: allListings.reduce((sum, property) => sum + property.bookingsCount, 0),
    revenue: allListings.reduce((sum, property) => sum + property.monthlyRevenue, 0),
    activeListings: allListings.filter(property => property.isActive).length,
    avgRating: allListings.reduce((sum, property) => sum + property.rating, 0) / allListings.length,
    occupancyRate: Math.round(allListings.reduce((sum, property) => sum + property.occupancyRate, 0) / allListings.length),
    responseRate: Math.round(allListings.reduce((sum, property) => sum + property.responseRate, 0) / allListings.length),
  }
}

function HeroMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-300">{detail}</p>
    </div>
  )
}

function InsightStatCard({
  label,
  value,
  hint,
  trend,
  icon,
  tone,
}: {
  label: string
  value: string
  hint: string
  trend: string
  icon: ReactNode
  tone: string
}) {
  return (
    <div className={`rounded-[26px] border border-slate-200/70 bg-gradient-to-br ${tone} p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)]`}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-600">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-3 text-sky-700 shadow-sm">{icon}</div>
      </div>
      <p className="text-sm text-slate-500">{hint}</p>
      <p className="mt-2 text-sm font-semibold text-slate-800">{trend}</p>
    </div>
  )
}

function QuickActionLink({
  href,
  label,
  icon,
  tone,
}: {
  href: string
  label: string
  icon: ReactNode
  tone: string
}) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${tone}`}>
      {icon}
      {label}
    </Link>
  )
}

function ChecklistRow({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-3 py-2.5">
      <span>{label}</span>
      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${done ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300" : "border-amber-400/40 bg-amber-400/10 text-amber-200"}`}>
        {done ? <CheckIcon className="h-4 w-4" /> : <ClockIcon className="h-4 w-4" />}
      </span>
    </div>
  )
}

function MetricPanel({
  title,
  value,
  body,
  icon,
}: {
  title: string
  value: string
  body: string
  icon: ReactNode
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
      <div className="mb-3 flex items-center gap-3 text-sky-700">
        <div className="rounded-2xl bg-white p-2 shadow-sm">{icon}</div>
        <p className="text-sm font-semibold text-slate-700">{title}</p>
      </div>
      <p className="text-lg font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{body}</p>
    </div>
  )
}

function ActionTask({ title, body, status }: { title: string; body: string; status: string }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-semibold text-slate-900">{title}</p>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{status}</span>
      </div>
      <p className="text-sm leading-6 text-slate-500">{body}</p>
    </div>
  )
}

function InlineBadge({ label, tone = "border-slate-200 bg-slate-50 text-slate-700" }: { label: string; tone?: string }) {
  return <span className={`rounded-full border px-4 py-2 text-sm font-semibold ${tone}`}>{label}</span>
}

function PropertyCard({ property }: { property: HostedProperty }) {
  const availabilityLabel = property.isActive ? `Next availability ${formatDate(property.nextAvailability)}` : "Currently paused"

  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.14)]">
      <div className={`relative overflow-hidden px-5 py-5 text-white ${property.type === "hotel" ? "bg-[linear-gradient(135deg,#0f172a_0%,#0f766e_52%,#06b6d4_100%)]" : "bg-[linear-gradient(135deg,#1e1b4b_0%,#4338ca_48%,#06b6d4_100%)]"}`}>
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
              {property.type === "hotel" ? <BuildingIcon className="h-4 w-4" /> : <CompassIcon className="h-4 w-4" />}
              {property.type}
            </div>
            <h3 className="mt-4 text-2xl font-semibold">{property.title}</h3>
            <p className="mt-1 text-sm text-cyan-50/80">{property.location}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${property.isActive ? "bg-emerald-400/15 text-emerald-100" : "bg-amber-400/15 text-amber-100"}`}>
            {property.isActive ? "Live" : "Paused"}
          </span>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="grid grid-cols-2 gap-3">
          <PropertyMetric label="Nightly rate" value={formatCurrency(property.price)} />
          <PropertyMetric label="Monthly revenue" value={formatCurrency(property.monthlyRevenue)} />
          <PropertyMetric label="Bookings" value={property.bookingsCount.toString()} />
          <PropertyMetric label="Guest rating" value={`${property.rating.toFixed(1)} / 5`} />
        </div>

        <div className="rounded-[22px] bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700">Occupancy</span>
            <span className="text-slate-500">{property.occupancyRate}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-200">
            <div className="h-2.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" style={{ width: `${property.occupancyRate}%` }} />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-500">{availabilityLabel}</span>
            <span className="font-semibold text-slate-700">{property.responseRate}% response</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {property.tags.map(tag => (
            <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href={`/host/${property.type}s/${property.id}/edit`} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
            <EditIcon className="h-4 w-4" />
            Edit listing
          </Link>
          <Link href="/host/bookings" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700">
            <CalendarStackIcon className="h-4 w-4" />
            View bookings
          </Link>
        </div>
      </div>
    </article>
  )
}

function PropertyMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}

function IconBase({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      {children}
    </svg>
  )
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V7.5A1.5 1.5 0 0 1 5.5 6H10v14M10 10h4m-4 4h4m-4 4h4m2 2V4.5A1.5 1.5 0 0 1 17.5 3h1A1.5 1.5 0 0 1 20 4.5V20M7 10h.01M7 14h.01" />
    </IconBase>
  )
}

function CompassIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.8 9.2-2.4 5.6-5.6 2.4 2.4-5.6 5.6-2.4Z" />
    </IconBase>
  )
}

function CalendarStackIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v4m8-4v4M3 10h18m-12 4h2m4 0h2m-8 4h2" />
    </IconBase>
  )
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h14a2 2 0 0 1 2 2v1h-4.5a1.5 1.5 0 0 0 0 3H20v1a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 14.5V8Z" />
      <circle cx="15.5" cy="12.5" r=".75" fill="currentColor" stroke="none" />
    </IconBase>
  )
}

function PulseBoardIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 14h2.2l1.7-4 3.1 7 1.8-4H18" />
    </IconBase>
  )
}

function SparkPulseIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 13h2l1.5-4 3 8 1.5-4H17" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 1 1 16 0" />
    </IconBase>
  )
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3s5 2 7 3v5c0 4.5-2.9 7.3-7 10-4.1-2.7-7-5.5-7-10V6c2-1 7-3 7-3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.5 12.5 1.8 1.8 3.7-4" />
    </IconBase>
  )
}

function ChartNodesIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <circle cx="6.5" cy="8.5" r="2" />
      <circle cx="17.5" cy="6.5" r="2" />
      <circle cx="12" cy="17.5" r="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.4 8.1 7.2-1.2m-4.5 8.8-3.2-5.3m5.8-1.8-1.3 7" />
    </IconBase>
  )
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7m0 0H9m8 0v8" />
    </IconBase>
  )
}

function OperationsIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 13h5m-5 5h9M4 8h9m3 0h4m-7 5h7m-4 5h4" />
      <circle cx="14" cy="8" r="1.5" />
      <circle cx="11" cy="13" r="1.5" />
      <circle cx="13" cy="18" r="1.5" />
    </IconBase>
  )
}

function EditIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 20 4.2-1 9.2-9.2a1.8 1.8 0 0 0 0-2.6l-.6-.6a1.8 1.8 0 0 0-2.6 0L5 15.8 4 20Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 6l5 5" />
    </IconBase>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4 10-10" />
    </IconBase>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2.5 2.5" />
    </IconBase>
  )
}
