import Link from "next/link"
import HotelCard from "./HotelCard"
import { hotels } from "@/lib/hotels"

const HotelList = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100 to-indigo-100 rounded-full opacity-20 blur-3xl translate-x-1/3 -translate-y-1/4" />

      <div className="container mx-auto px-6 relative">
        {/* Section header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4">
              Featured Hotels
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              Popular <span className="gradient-text">Hotels</span>
            </h2>
            <p className="mt-4 text-slate-500 leading-relaxed">
              Hand-picked stays for your next getaway — curated for comfort and experience.
            </p>
          </div>
          <Link
            href="/hotels"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold text-sm rounded-full border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md group"
          >
            View all hotels
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
          {hotels.map((hotel, idx) => (
            <div
              key={hotel.slug}
              className={`relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up animation-delay-${(idx + 1) * 100}`}
            >
              <Link href={`/hotels/${hotel.slug}`} className="group block focus:outline-none focus:ring-2 focus:ring-blue-400/40">
                <HotelCard {...hotel} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HotelList