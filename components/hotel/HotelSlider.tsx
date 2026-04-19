"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { hotels } from "@/lib/hotels"

const HotelSlider = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  const scrollToIndex = (index: number) => {
    const container = scrollRef.current
    if (!container) return

    const child = container.children[index] as HTMLElement | undefined
    if (!child) return

    container.scrollTo({ left: child.offsetLeft - 16, behavior: "smooth" })
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (isPaused) return

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % hotels.length
        scrollToIndex(next)
        return next
      })
    }, 4000)

    return () => window.clearInterval(interval)
  }, [isPaused])

  return (
    <section
      className="relative mt-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="container relative overflow-hidden rounded-[2rem]">
        <div
          ref={scrollRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scroll-smooth"
          tabIndex={0}
        >
          {hotels.map((hotel, idx) => (
            <Link
              key={hotel.slug}
              href={`/hotels/${hotel.slug}`}
              className="snap-start relative min-w-full lg:min-w-[90%] xl:min-w-[80%] transition duration-500 ease-out focus:outline-none"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(idx)}
              onBlur={() => setHoveredIndex(null)}
              aria-label={`View details for ${hotel.title}`}
            >
              <img
                src={hotel.image}
                alt={hotel.title}
                className="h-[55vh] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
              <button
                type="button"
                className="absolute left-6 bottom-6 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                {hotel.title}
              </button>

              <div
                className={`absolute right-6 top-6 w-80 rounded-[1.75rem] border border-white/20 bg-white/95 p-5 text-slate-950 backdrop-blur-xl transition duration-300 ${
                  hoveredIndex === idx ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-4"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.35em] text-primary">{hotel.location}</p>
                <h3 className="mt-3 text-2xl font-bold">{hotel.title}</h3>
                <p className="mt-3 text-sm text-slate-600">
                  Experience premium rooms, curated service, and a peaceful mountain retreat.
                </p>
                <div className="mt-4 flex items-center justify-between rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-950">
                  <span>{hotel.rating.toFixed(1)} ★</span>
                  <span>₹{hotel.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-950/60 px-3 py-2 backdrop-blur-sm">
          {hotels.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToIndex(idx)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                currentIndex === idx ? "bg-white" : "bg-slate-500/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HotelSlider
