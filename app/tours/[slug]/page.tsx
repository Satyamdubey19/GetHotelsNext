'use client'

import { useState, useEffect } from 'react'
import { tours } from '@/lib/tours'
import { hotels } from '@/lib/hotels'
import { ItineraryCard } from '@/components/tour/ItineraryCard'
import { BudgetPlanner } from '@/components/tour/BudgetPlanner'
import { NearbyHotels } from '@/components/tour/NearbyHotels'
import { GroupBooking } from '@/components/tour/GroupBooking'
import HotelGallery from '@/components/hotel/HotelGallery'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Header from '@/components/layout/Header/Header'
import Footer from '@/components/layout/Footer/Footer'

/* ── SVG Icon Components ─────────────────────────────────── */
const CalendarIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
)
const UsersIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
)
const StarIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" /></svg>
)
const MapPinIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
)
const HeartIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
)
const ShareIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
)
const CheckCircleIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
)
const XCircleIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
)
const SparklesIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
)
const SunIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
)
const ShieldIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
)
const PhoneIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
)
const CreditCardIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
)
const TruckIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
)
const WifiIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg>
)
const HospitalIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
)
const CameraIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
)
const ClockIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
)
const GlobeIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
)

/* ── Tab config ───────────────────────────────────────────── */
const tabs = [
  { key: 'overview' as const, label: 'Overview', icon: GlobeIcon },
  { key: 'itinerary' as const, label: 'Itinerary', icon: CalendarIcon },
  { key: 'budget' as const, label: 'Budget', icon: CreditCardIcon },
  { key: 'hotels' as const, label: 'Hotels', icon: MapPinIcon },
  { key: 'essentials' as const, label: 'Essentials', icon: ShieldIcon },
]

export default function TourDetailPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : ''
  const tour = tours.find((t) => t.slug === slug)
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'budget' | 'hotels' | 'essentials'>('overview')
  const [bookingModal, setBookingModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showStickyNav, setShowStickyNav] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowStickyNav(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!tour) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center space-y-4 animate-fade-in-up">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
              <MapPinIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Tour Not Found</h1>
            <p className="text-slate-500">The tour you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/tours" className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:underline">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Browse all tours
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const includedHotels = hotels.filter((h) => tour.includedHotels.includes(h.slug))

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: tour.title, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50/50">

        {/* ── Hero Section ─────────────────────────────────── */}
        <section className="relative h-[50vh] min-h-[380px] max-h-[520px] overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
            style={{ backgroundImage: `url(${tour.gallery[0]})` }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

          {/* Top bar */}
          <div className="absolute top-0 inset-x-0 z-10">
            <div className="container mx-auto px-4 max-w-7xl py-5 flex items-center justify-between">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm">
                <Link href="/" className="text-white/70 hover:text-white transition">Home</Link>
                <span className="text-white/40">/</span>
                <Link href="/tours" className="text-white/70 hover:text-white transition">Tours</Link>
                <span className="text-white/40">/</span>
                <span className="text-white font-medium truncate max-w-[180px]">{tour.title.split(' - ')[0]}</span>
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLiked(!liked)}
                  className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 duration-200"
                >
                  <HeartIcon className={`w-5 h-5 transition-colors ${liked ? 'text-red-400 fill-red-400' : 'text-white'}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 duration-200 relative"
                >
                  <ShareIcon className="w-5 h-5 text-white" />
                  {copied && (
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded whitespace-nowrap">
                      Link copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Hero content */}
          <div className="absolute bottom-0 inset-x-0">
            <div className="container mx-auto px-4 max-w-7xl pb-8">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="space-y-3 animate-fade-in-up">
                  {/* Category badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/20">
                    <SparklesIcon className="w-3.5 h-3.5" />
                    {tour.category}
                  </span>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                    {tour.title}
                  </h1>

                  <div className="flex items-center gap-4 flex-wrap text-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(tour.rating) ? 'text-amber-400' : 'text-white/30'}`}
                          />
                        ))}
                      </div>
                      <span className="text-white font-semibold">{tour.rating}</span>
                      <span className="text-white/60">({tour.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/80">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{tour.location.city}, {tour.location.country}</span>
                    </div>
                  </div>
                </div>

                {/* Price card */}
                <div className="glass-white rounded-2xl px-6 py-4 shadow-xl min-w-[180px] text-center animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Starting from</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">₹{tour.price.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mt-0.5">per person</p>
                  <button
                    onClick={() => setBookingModal(true)}
                    className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 text-white text-sm font-semibold hover:shadow-lg transition-shadow"
                  >
                    Book This Tour
                  </button>
                </div>
              </div>

              {/* Gallery badge */}
              <button className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/20 hover:bg-white/25 transition">
                <CameraIcon className="w-4 h-4" />
                {tour.gallery.length} Photos
              </button>
            </div>
          </div>
        </section>

        {/* ── Sticky Nav ───────────────────────────────────── */}
        <div className={`sticky top-[72px] z-40 transition-all duration-300 ${showStickyNav ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
          <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <MapPinIcon className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900 truncate max-w-[200px] md:max-w-none">{tour.title}</h2>
                    <p className="text-xs text-slate-500">{tour.duration} days · ₹{tour.price.toLocaleString()} per person</p>
                  </div>
                </div>
                <button
                  onClick={() => setBookingModal(true)}
                  className="px-5 py-2 bg-gradient-to-r from-slate-900 to-slate-700 text-white font-semibold rounded-xl text-xs hover:shadow-lg transition-shadow"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick Stats ──────────────────────────────────── */}
        <section className="bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
              {[
                { icon: CalendarIcon, label: 'Duration', value: `${tour.duration} Days`, color: 'text-blue-600 bg-blue-50' },
                { icon: UsersIcon, label: 'Group Size', value: tour.groupSize, color: 'text-emerald-600 bg-emerald-50' },
                { icon: StarIcon, label: 'Rating', value: `${tour.rating}/5`, color: 'text-amber-600 bg-amber-50' },
                { icon: MapPinIcon, label: 'Location', value: tour.location.city, color: 'text-rose-600 bg-rose-50' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3 py-6 px-4 first:pl-0 last:pr-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-sm font-semibold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tab Navigation ───────────────────────────────── */}
        <section className="sticky top-[72px] z-30 bg-white border-b border-slate-200 shadow-sm">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-5 py-3 font-medium text-xs uppercase tracking-wider transition-all rounded-lg my-1 whitespace-nowrap ${
                    activeTab === key
                      ? 'text-slate-900 bg-slate-100 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Content Section ──────────────────────────────── */}
        <section className="container mx-auto px-4 py-10 md:py-14 max-w-7xl">

          {/* ─── Overview Tab ────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
              <div className="lg:col-span-2 space-y-12">
                {/* Gallery */}
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <HotelGallery gallery={tour.gallery} title={tour.title} />
                </div>

                {/* Description */}
                <div className="space-y-4 animate-fade-in-up">
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">About This Tour</h2>
                  <div className="w-16 h-1 rounded-full bg-gradient-to-r from-slate-900 to-slate-500" />
                  <p className="text-base text-slate-600 leading-relaxed">{tour.description}</p>
                </div>

                {/* Highlights */}
                <div className="animate-fade-in-up">
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Tour Highlights</h3>
                  <div className="w-16 h-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 mb-8" />
                  <div className="grid md:grid-cols-2 gap-4">
                    {tour.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="group p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                            <SparklesIcon className="w-4 h-4 text-amber-600" />
                          </div>
                          <span className="font-medium text-slate-800 text-sm leading-snug pt-1">{highlight}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best Time to Visit */}
                <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50/50 border border-sky-100 p-7 animate-fade-in-up">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                      <SunIcon className="w-5 h-5 text-sky-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">Best Time to Visit</h3>
                  </div>
                  <p className="text-base text-slate-600 leading-relaxed">{tour.bestTimeToVisit}</p>
                </div>

                {/* Why Book With Us */}
                <div className="rounded-2xl bg-white border border-slate-200 p-7 animate-fade-in-up">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Why Book With Us</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[
                      { icon: ShieldIcon, title: 'Secure Booking', desc: 'SSL encrypted payments with full refund guarantee', color: 'text-emerald-600 bg-emerald-50' },
                      { icon: ClockIcon, title: '24/7 Support', desc: 'Round-the-clock assistance during your trip', color: 'text-blue-600 bg-blue-50' },
                      { icon: UsersIcon, title: 'Expert Guides', desc: 'Certified local guides with years of experience', color: 'text-purple-600 bg-purple-50' },
                      { icon: CheckCircleIcon, title: 'Best Price', desc: 'Price match guarantee for all tour packages', color: 'text-amber-600 bg-amber-50' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ─── Sidebar ─────────────────────────────── */}
              <div className="lg:sticky lg:top-36 space-y-6 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto scrollbar-thin">
                {/* Booking Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg shadow-slate-200/50">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-900">Book This Tour</h3>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                      Available
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-5 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Per Person</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-slate-900">₹{tour.budget.perPersonBase.toLocaleString()}</p>
                      <span className="text-sm text-slate-400 line-through">₹{Math.round(tour.budget.perPersonBase * 1.2).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                      <p className="text-xs text-emerald-600 font-medium">Best Price Guaranteed</p>
                    </div>
                  </div>

                  {/* Date Picker */}
                  <div className="mb-5">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Travel Date</p>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition"
                      />
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div className="mb-5 pb-5 border-b border-slate-100">
                    <h4 className="font-semibold text-slate-900 mb-3 text-sm flex items-center gap-1.5">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                      What&apos;s Included
                    </h4>
                    <ul className="space-y-2">
                      {tour.budget.inclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm">
                          <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          <span className="text-slate-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exclusions */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 mb-3 text-sm flex items-center gap-1.5">
                      <XCircleIcon className="w-4 h-4 text-slate-400" />
                      Not Included
                    </h4>
                    <ul className="space-y-2">
                      {tour.budget.exclusions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm">
                          <svg className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          <span className="text-slate-500">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => setBookingModal(true)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 text-white font-semibold text-sm hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    Reserve Your Spot
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-3">Free cancellation up to 48 hours before</p>
                </div>

                {/* Quick Info Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                    Quick Info
                  </h4>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: 'Group Size', value: `${tour.groupSize} people`, icon: UsersIcon },
                      { label: 'Difficulty', value: 'Moderate', icon: ShieldIcon },
                      { label: 'Best Season', value: tour.bestTimeToVisit, icon: SunIcon },
                      { label: 'Tour Type', value: 'Guided Experience', icon: GlobeIcon },
                    ].map((info, i) => (
                      <div key={i} className={`flex items-center gap-3 ${i < 3 ? 'pb-3 border-b border-slate-100' : ''}`}>
                        <info.icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{info.label}</p>
                          <p className="font-medium text-slate-900 text-sm">{info.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews Summary */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-900">Guest Reviews</h4>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50">
                      <StarIcon className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-bold text-amber-700">{tour.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Based on {tour.reviews} verified reviews</p>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct = star === 5 ? 65 : star === 4 ? 22 : star === 3 ? 8 : star === 2 ? 3 : 2
                      return (
                        <div key={star} className="flex items-center gap-2.5 text-xs">
                          <div className="flex items-center gap-0.5 w-10">
                            <span className="text-slate-600 font-medium">{star}</span>
                            <StarIcon className="w-3 h-3 text-amber-400" />
                          </div>
                          <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-slate-400 w-8 text-right font-medium">{pct}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Itinerary Tab ───────────────────────────── */}
          {activeTab === 'itinerary' && (
            <div className="max-w-4xl animate-fade-in-up">
              <div className="mb-10">
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Day-by-Day Itinerary</h2>
                <div className="w-16 h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 mt-3" />
                <p className="text-slate-500 mt-3">Your complete {tour.duration}-day journey at a glance</p>
              </div>
              <ItineraryCard itinerary={tour.itinerary} />
            </div>
          )}

          {/* ─── Budget Tab ──────────────────────────────── */}
          {activeTab === 'budget' && (
            <div className="max-w-4xl animate-fade-in-up">
              <div className="mb-10">
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Budget Breakdown</h2>
                <div className="w-16 h-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mt-3" />
                <p className="text-slate-500 mt-3">Transparent pricing with no hidden costs</p>
              </div>
              <BudgetPlanner basePrice={tour.price} groupSize={4} />
            </div>
          )}

          {/* ─── Hotels Tab ──────────────────────────────── */}
          {activeTab === 'hotels' && (
            <div className="animate-fade-in-up">
              <div className="mb-10">
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Handpicked Stays</h2>
                <div className="w-16 h-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 mt-3" />
                <p className="text-slate-500 mt-3">Curated accommodations included in your tour package</p>
              </div>
              {includedHotels.length > 0 ? (
                <NearbyHotels hotels={includedHotels} />
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                  <MapPinIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">No hotels found for this tour.</p>
                </div>
              )}
            </div>
          )}

          {/* ─── Essentials Tab ──────────────────────────── */}
          {activeTab === 'essentials' && (
            <div className="max-w-4xl space-y-10 animate-fade-in-up">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Travel Essentials</h2>
                <div className="w-16 h-1 rounded-full bg-gradient-to-r from-purple-500 to-violet-500 mt-3" />
                <p className="text-slate-500 mt-3">Everything you need to prepare for a great trip</p>
              </div>

              {/* Packing Checklist */}
              <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Packing Checklist</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { title: 'Clothing', icon: '👕', items: ['Comfortable walking shoes', 'Light layers / warm jacket', 'Rain gear / umbrella', 'Sunhat & sunglasses'] },
                    { title: 'Essentials', icon: '🎒', items: ['Valid ID / Passport', 'Travel insurance docs', 'Medications & first aid', 'Power bank & charger'] },
                    { title: 'Extras', icon: '📷', items: ['Camera & memory cards', 'Reusable water bottle', 'Snacks for transit', 'Cash & cards'] },
                  ].map((cat, i) => (
                    <div key={i}>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{cat.title}</p>
                      <ul className="space-y-2.5">
                        {cat.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-2.5 text-sm text-slate-700 group">
                            <span className="w-5 h-5 border-2 border-slate-200 rounded-md flex-shrink-0 flex items-center justify-center group-hover:border-emerald-400 transition-colors cursor-pointer">
                              <svg className="w-3 h-3 text-transparent group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather & Climate */}
              <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center">
                    <SunIcon className="w-4 h-4 text-sky-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Weather & Climate</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 p-5 border border-sky-100">
                    <p className="text-[11px] font-bold text-sky-600 uppercase tracking-wider mb-2">Best Season</p>
                    <p className="text-sm font-semibold text-slate-900">{tour.bestTimeToVisit}</p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">Plan your visit during these months for the most pleasant weather and optimal conditions.</p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-5 border border-amber-100">
                    <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-3">Expected Temperature</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { temp: '18°', label: 'Morning', icon: '🌅' },
                        { temp: '28°', label: 'Afternoon', icon: '☀️' },
                        { temp: '15°', label: 'Evening', icon: '🌙' },
                      ].map((t, i) => (
                        <div key={i} className="text-center bg-white/70 rounded-lg py-2.5 px-2">
                          <p className="text-xl font-bold text-slate-900">{t.temp}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{t.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Important Notes</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: HospitalIcon, title: 'Health', desc: 'Consult your doctor before high-altitude treks. Carry basic medications and any prescriptions.', color: 'text-red-600 bg-red-50' },
                    { icon: WifiIcon, title: 'Connectivity', desc: 'Mobile coverage may be limited in remote areas. Download offline maps before departure.', color: 'text-blue-600 bg-blue-50' },
                    { icon: CreditCardIcon, title: 'Money', desc: 'ATMs may be scarce. Carry sufficient cash in small denominations for local purchases.', color: 'text-emerald-600 bg-emerald-50' },
                    { icon: TruckIcon, title: 'Transport', desc: 'Road conditions may vary. Comfortable clothing and motion sickness medication recommended.', color: 'text-purple-600 bg-purple-50' },
                  ].map((note, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50/80 hover:bg-slate-50 transition-colors">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${note.color}`}>
                        <note.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{note.title}</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{note.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                    <PhoneIcon className="w-4 h-4 text-red-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Emergency Contacts</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: 'Tour Helpline', value: '+91 1800-XXX-XXXX', icon: PhoneIcon },
                    { label: 'Local Emergency', value: '112', icon: ShieldIcon },
                    { label: 'Nearest Hospital', value: 'Will be shared on Day 1', icon: HospitalIcon },
                  ].map((contact, i) => (
                    <div key={i} className="bg-white/70 rounded-xl p-4 backdrop-blur-sm">
                      <contact.icon className="w-4 h-4 text-red-400 mb-2" />
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{contact.label}</p>
                      <p className="font-semibold text-slate-900 text-sm mt-1">{contact.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── Floating CTA ─────────────────────────────────── */}
        <button
          onClick={() => setBookingModal(true)}
          className="fixed bottom-6 right-6 z-50 group"
        >
          <div className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-slate-900 to-slate-700 text-white font-semibold rounded-2xl shadow-2xl shadow-slate-900/25 hover:shadow-slate-900/40 transition-all duration-300 hover:scale-105 active:scale-95 text-sm">
            <CalendarIcon className="w-4 h-4" />
            Book Now · ₹{tour.price.toLocaleString()}
          </div>
        </button>

        {/* Booking Modal */}
        {bookingModal && <GroupBooking tour={tour} onClose={() => setBookingModal(false)} />}
      </main>
      <Footer />
    </>
  )
}