"use client"

import { useState } from "react"
import MapPreview from "@/components/hotel/MapPreview"
import MapModal from "@/components/hotel/MapModal"

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
  hotelId: string
  title: string
  price: number
  location: string
  city: string
}

export default function MapSection({ hotelId, title, price, location, city }: Props) {
  const [isMapOpen, setIsMapOpen] = useState(false)

  const cityCoordinates: Record<string, { lat: number; lng: number }> = {
    Dehradun: { lat: 30.3165, lng: 78.0322 },
    Mussoorie: { lat: 30.4598, lng: 78.0664 },
    Rishikesh: { lat: 30.0869, lng: 78.2676 },
    Goa: { lat: 15.4909, lng: 73.8278 },
    Jaipur: { lat: 26.9124, lng: 75.7873 },
  }

  const anchor = cityCoordinates[city] ?? { lat: 28.6139, lng: 77.209 }

  const nearbyHotels: HotelMarker[] = [
    {
      id: hotelId,
      title: title,
      price: price,
      lat: anchor.lat,
      lng: anchor.lng,
      location,
      distanceKm: 0.2,
      eta: "3 min walk",
      vibe: "Best for views and easy access",
      address: `${location} · Prime district`,
      featured: true,
    },
    {
      id: "hotel-2",
      title: `${city} Grand Plaza`,
      price: Math.round(price * 0.9),
      lat: anchor.lat + 0.008,
      lng: anchor.lng + 0.01,
      location: `${city} Market Quarter`,
      distanceKm: 0.7,
      eta: "8 min drive",
      vibe: "Near dining and shopping",
      address: `${city} Market Quarter`,
    },
    {
      id: "hotel-3",
      title: `${city} Skyline Suites`,
      price: Math.round(price * 1.2),
      lat: anchor.lat - 0.009,
      lng: anchor.lng + 0.006,
      location: `${city} Ridge View`,
      distanceKm: 1.1,
      eta: "11 min drive",
      vibe: "Quiet residential pocket",
      address: `${city} Ridge View`,
    },
    {
      id: "hotel-4",
      title: `${city} Urban Stay`,
      price: Math.round(price * 0.7),
      lat: anchor.lat + 0.012,
      lng: anchor.lng - 0.008,
      location: `${city} Transit Hub`,
      distanceKm: 1.4,
      eta: "14 min drive",
      vibe: "Smart pick for short stays",
      address: `${city} Transit Hub`,
    },
    {
      id: "hotel-5",
      title: `${city} Park View Suites`,
      price: Math.round(price * 1.1),
      lat: anchor.lat - 0.011,
      lng: anchor.lng - 0.01,
      location: `${city} Garden District`,
      distanceKm: 1.8,
      eta: "17 min drive",
      vibe: "Leafy, slower-paced surroundings",
      address: `${city} Garden District`,
    },
  ]

  const highlights: PlaceHighlight[] = [
    { id: "h1", label: `${city} city center`, type: "Landmark", eta: "10 min" },
    { id: "h2", label: "Top cafes and dining", type: "Lifestyle", eta: "6 min" },
    { id: "h3", label: "Airport transfer point", type: "Transit", eta: "18 min" },
  ]

  return (
    <>
      <MapPreview
        city={city}
        location={location}
        title={title}
        hotels={nearbyHotels}
        highlights={highlights}
        onOpen={() => setIsMapOpen(true)}
      />
      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        hotels={nearbyHotels}
        currentHotelId={hotelId}
        city={city}
        location={location}
        highlights={highlights}
      />
    </>
  )
}
