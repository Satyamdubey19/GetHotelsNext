"use client"

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
  title: string
  location: string
  city: string
  hotels: HotelMarker[]
  highlights: PlaceHighlight[]
  onOpen: () => void
}

const markerPositions = [
  { left: "18%", top: "58%" },
  { left: "60%", top: "28%" },
  { left: "73%", top: "63%" },
  { left: "32%", top: "24%" },
  { left: "47%", top: "72%" },
]

export default function MapPreview({ title, location, city, hotels, highlights, onOpen }: Props) {
  const featured = hotels[0]

  return (
    <button
      onClick={onOpen}
      className="group relative h-[23rem] w-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)] text-left shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(15,23,42,0.12)]"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(14,165,233,0.16),transparent_24%),radial-gradient(circle_at_82%_72%,rgba(251,191,36,0.14),transparent_22%)]" />

        <svg className="absolute inset-0 h-full w-full opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M6 22 C22 28, 36 22, 52 32 S78 48, 94 41" stroke="#cbd5e1" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M14 74 C30 61, 47 66, 63 55 S82 37, 94 43" stroke="#dbeafe" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M16 86 C33 76, 55 82, 78 74" stroke="#e2e8f0" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M37 18 C43 28, 49 42, 55 64" stroke="#93c5fd" strokeWidth="1.2" fill="none" strokeDasharray="4 4" strokeLinecap="round" />
        </svg>

        {hotels.map((hotel, index) => {
          const position = markerPositions[index] ?? markerPositions[markerPositions.length - 1]
          const isFeatured = hotel.featured

          return (
            <div
              key={hotel.id}
              className="absolute transition-transform duration-300 group-hover:scale-105"
              style={{ left: position.left, top: position.top }}
            >
              <div
                className={`relative flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold shadow-lg ${
                  isFeatured
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-white bg-white text-slate-700"
                }`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${isFeatured ? "bg-emerald-300" : "bg-sky-500"}`} />
                <span>₹{Math.round(hotel.price / 1000)}k</span>
              </div>
            </div>
          )
        })}

        <div className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm">
          Location overview
        </div>

        <div className="absolute right-5 top-5 rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-lg">
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/60">Area vibe</p>
          <p className="mt-1 text-sm font-semibold">Walkable and lively</p>
          <p className="text-xs text-white/70">Dining, transit, views</p>
        </div>

        <div className="absolute inset-x-5 bottom-5">
          <div className="grid gap-4 rounded-[1.5rem] border border-white/70 bg-white p-5 shadow-[0_22px_54px_rgba(15,23,42,0.12)] lg:grid-cols-[1.4fr_0.85fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Stay nearby</p>
              <h4 className="mt-2 text-xl font-bold text-slate-900">{title}</h4>
              <p className="mt-1 text-sm text-slate-600">{featured.address}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{featured.eta}</span>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">{city} highlights close by</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{featured.vibe}</span>
              </div>
            </div>

            <div className="rounded-[1.25rem] bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Quick access</p>
              <div className="mt-3 space-y-2.5">
                {highlights.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl bg-white px-3 py-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.type}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-600">{item.eta}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-slate-950/0 transition group-hover:bg-slate-950/[0.03]" />
    </button>
  )
}
