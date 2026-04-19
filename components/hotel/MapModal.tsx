"use client"

import { useState } from "react"

type HotelMarker = {
  id: string
  title: string
  price: number
  lat: number
  lng: number
  location: string
  distanceKm: number
  eta: string
  vibe: string
  address: string
  featured?: boolean
}

type PlaceHighlight = {
  id: string
  label: string
  type: string
  eta: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  hotels: HotelMarker[]
  currentHotelId: string
  city: string
  location: string
  highlights: PlaceHighlight[]
}

const markerPositions = [
  { x: 23, y: 61 },
  { x: 61, y: 29 },
  { x: 74, y: 63 },
  { x: 35, y: 26 },
  { x: 50, y: 76 },
]

export default function MapModal({ isOpen, onClose, hotels, currentHotelId, city, location, highlights }: Props) {
  const [selectedHotel, setSelectedHotel] = useState<string>(currentHotelId)
  const currentHotel = hotels.find((h) => h.id === selectedHotel)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm px-4 py-6">
      <button
        onClick={onClose}
        className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
        aria-label="Close map"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="w-full max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-[0_36px_100px_rgba(15,23,42,0.28)]">
        <div className="grid h-[88vh] grid-cols-1 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#edf4ff_100%)]">
            <div className="absolute inset-0">
              <div className="absolute left-8 top-8 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 shadow-sm">
                Neighborhood map
              </div>
              <div className="absolute right-8 top-8 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Destination</p>
                <p className="mt-2 text-lg font-bold text-slate-900">{location}</p>
                <p className="text-sm text-slate-600">{city}, India</p>
              </div>

              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                <defs>
                  <pattern id="road-grid" width="14" height="14" patternUnits="userSpaceOnUse">
                    <path d="M14 0H0V14" fill="none" stroke="#e2e8f0" strokeWidth="0.3" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#road-grid)" opacity="0.8" />
                <path d="M5 20 C20 26, 34 22, 47 33 S76 51, 95 42" stroke="#cbd5e1" strokeWidth="2.1" fill="none" strokeLinecap="round" />
                <path d="M14 75 C29 61, 45 66, 58 56 S80 31, 95 37" stroke="#dbeafe" strokeWidth="1.7" fill="none" strokeLinecap="round" />
                <path d="M11 88 C26 76, 49 82, 83 72" stroke="#e2e8f0" strokeWidth="1.7" fill="none" strokeLinecap="round" />
                <path d="M35 18 C46 30, 51 43, 56 66" stroke="#0f172a" strokeWidth="1.3" fill="none" strokeDasharray="4 4" strokeLinecap="round" opacity="0.5" />

                <rect x="69" y="13" width="18" height="11" rx="4" fill="#dcfce7" opacity="0.95" />
                <rect x="12" y="62" width="22" height="15" rx="5" fill="#e0f2fe" opacity="0.95" />
                <rect x="71" y="69" width="15" height="9" rx="4" fill="#ffedd5" opacity="0.95" />

                {hotels.map((hotel, index) => {
                  const position = markerPositions[index] ?? markerPositions[markerPositions.length - 1]
                  const isSelected = hotel.id === selectedHotel

                  return (
                    <g key={hotel.id} onClick={() => setSelectedHotel(hotel.id)} className="cursor-pointer">
                      <circle cx={position.x} cy={position.y} r={isSelected ? "4.8" : "3.7"} fill={isSelected ? "#0f172a" : hotel.featured ? "#0ea5e9" : "#ffffff"} opacity="0.18" />
                      <rect x={position.x - 6.8} y={position.y - 8} width="13.6" height="6.6" rx="3.3" fill={isSelected ? "#0f172a" : hotel.featured ? "#0284c7" : "#ffffff"} stroke={isSelected ? "#0f172a" : "#cbd5e1"} strokeWidth="0.45" />
                      <text x={position.x} y={position.y - 3.6} textAnchor="middle" fontSize="2.3" fontWeight="700" fill={isSelected || hotel.featured ? "#ffffff" : "#334155"}>
                        ₹{Math.round(hotel.price / 1000)}k
                      </text>
                      <circle cx={position.x} cy={position.y + 0.9} r={isSelected ? "3.2" : "2.4"} fill={isSelected ? "#0f172a" : hotel.featured ? "#0ea5e9" : "#ffffff"} stroke={isSelected ? "#ffffff" : "#94a3b8"} strokeWidth="0.45" />
                    </g>
                  )
                })}
              </svg>

              <div className="absolute bottom-6 left-6 max-w-lg rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Selected stay</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">{currentHotel?.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{currentHotel?.address}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/60">From</p>
                    <p className="text-lg font-bold">₹{currentHotel?.price.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Travel time</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{currentHotel?.eta}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Distance</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{currentHotel?.distanceKm.toFixed(1)} km radius</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Area feel</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{currentHotel?.vibe}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden border-l border-slate-200 bg-slate-50/80">
            <div className="border-b border-slate-200 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Location guide</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">Stay in the heart of {city}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">See nearby options, compare distances, and understand the area around this property at a glance.</p>

              <div className="mt-5 grid gap-3">
                {highlights.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.type}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">{item.eta}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {hotels.map((hotel) => (
                <button
                  key={hotel.id}
                  onClick={() => setSelectedHotel(hotel.id)}
                  className={`w-full rounded-[1.25rem] p-4 text-left transition-all ${
                    hotel.id === selectedHotel
                      ? "border border-slate-900 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
                      : "border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-base font-semibold text-slate-900">{hotel.title}</p>
                        {hotel.featured ? (
                          <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white">Featured</span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{hotel.location}</p>
                      <p className="mt-2 text-xs text-slate-500">{hotel.vibe}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">From</p>
                      <p className="text-base font-bold text-slate-900">₹{hotel.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{hotel.eta}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{hotel.distanceKm.toFixed(1)} km away</span>
                  </div>
                </button>
              ))}
            </div>

            {currentHotel && (
              <div className="border-t border-slate-200 bg-white p-5">
                <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">Current selection</p>
                  <p className="mt-2 text-xl font-bold">{currentHotel.title}</p>
                  <p className="mt-1 text-sm text-white/70">{currentHotel.address}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-white/50">Price</p>
                      <p className="text-2xl font-bold">₹{currentHotel.price.toLocaleString()}</p>
                    </div>
                    <button className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                      View stay
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
