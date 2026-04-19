"use client"

import { useState } from "react"
import LocationInput from "./LocationInput"
import DatePicker from "./DatePicker"

type SearchBarProps = {
  onSearch?: (query: string) => void
  compact?: boolean
}

const SearchBar = ({ onSearch, compact }: SearchBarProps) => {
  const [destination, setDestination] = useState("")

  const handleDestinationChange = (value: string) => {
    setDestination(value)
    onSearch?.(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(destination)
  }

  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guestCount, setGuestCount] = useState(2)

  const adjustGuests = (delta: number) => {
    setGuestCount((current) => Math.max(1, current + delta))
  }

  return (
    <div className="container mx-auto px-4">
      <div className={`mx-auto border border-blue-950/10 bg-white shadow-[0_18px_50px_-26px_rgba(30,64,175,0.25)] transition duration-300 hover:shadow-[0_20px_70px_-28px_rgba(30,64,175,0.2)] ${
        compact ? 'max-w-5xl rounded-xl p-3' : 'max-w-6xl rounded-[2rem] p-4'
      }`}>
        <form onSubmit={handleSubmit} className={`grid items-stretch ${
          compact ? 'gap-2 lg:grid-cols-[1.6fr_1fr_1fr_0.8fr_auto]' : 'gap-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr_auto]'
        }`}>
          <div className={`border border-blue-100 bg-white transition duration-300 hover:border-blue-500 focus-within:border-blue-600 focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.08)] ${
            compact ? 'rounded-lg px-3 py-2' : 'rounded-[1.5rem] px-3 py-3'
          }`}>
            <label className={`block uppercase tracking-[0.24em] text-blue-600 ${compact ? 'mb-1 text-[9px]' : 'mb-2 text-[10px]'}`}>Destination</label>
            <LocationInput
              value={destination}
              onChange={handleDestinationChange}
              placeholder="Where are you going?"
              className={`w-full border border-blue-100 bg-white text-sm text-blue-950 outline-none transition duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                compact ? 'h-9 rounded-lg px-3' : 'h-11 rounded-[1rem] px-4'
              }`}
            />
          </div>

          <div className={`border border-blue-100 bg-white transition duration-300 hover:border-blue-500 focus-within:border-blue-600 focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.08)] ${
            compact ? 'rounded-lg px-3 py-2' : 'rounded-[1.5rem] px-3 py-3'
          }`}>
            <label className={`block uppercase tracking-[0.24em] text-blue-600 ${compact ? 'mb-1 text-[9px]' : 'mb-2 text-[10px]'}`}>Check-in</label>
            <DatePicker
              value={checkIn}
              onChange={setCheckIn}
              className={`w-full border border-blue-100 bg-white text-sm text-blue-950 outline-none transition duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                compact ? 'h-9 rounded-lg px-3' : 'h-11 rounded-[1rem] px-4'
              }`}
            />
          </div>

          <div className={`border border-blue-100 bg-white transition duration-300 hover:border-blue-500 focus-within:border-blue-600 focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.08)] ${
            compact ? 'rounded-lg px-3 py-2' : 'rounded-[1.5rem] px-3 py-3'
          }`}>
            <label className={`block uppercase tracking-[0.24em] text-blue-600 ${compact ? 'mb-1 text-[9px]' : 'mb-2 text-[10px]'}`}>Check-out</label>
            <DatePicker
              value={checkOut}
              onChange={setCheckOut}
              className={`w-full border border-blue-100 bg-white text-sm text-blue-950 outline-none transition duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                compact ? 'h-9 rounded-lg px-3' : 'h-11 rounded-[1rem] px-4'
              }`}
            />
          </div>

          <div className={`border border-blue-100 bg-white transition duration-300 hover:border-blue-500 focus-within:border-blue-600 focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.08)] ${
            compact ? 'rounded-lg px-3 py-2' : 'rounded-[1.5rem] px-3 py-3'
          }`}>
            <p className={`uppercase tracking-[0.24em] text-blue-600 ${compact ? 'mb-1 text-[9px]' : 'mb-2 text-[10px]'}`}>Guests</p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-blue-950">{guestCount}</p>
              <div className={`flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 ${compact ? 'p-0.5' : 'p-1'}`}>
                <button
                  type="button"
                  onClick={() => adjustGuests(-1)}
                  className={`rounded-full bg-white font-semibold text-blue-950 transition duration-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 ${
                    compact ? 'h-7 w-7 text-sm' : 'h-9 w-9 text-lg'
                  }`}
                  disabled={guestCount <= 1}
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => adjustGuests(1)}
                  className={`rounded-full bg-white font-semibold text-blue-950 transition duration-300 hover:bg-blue-100 ${
                    compact ? 'h-7 w-7 text-sm' : 'h-9 w-9 text-lg'
                  }`}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            style={{ color: 'white' }}
            className={`bg-blue-950 font-semibold text-white shadow-xl shadow-blue-950/20 transition duration-300 hover:bg-blue-800 ${
              compact ? 'rounded-lg px-6 py-3 text-sm' : 'rounded-[1.5rem] px-8 py-4 text-sm'
            }`}
          >
            Search
          </button>
        </form>
      </div>
    </div>
  )
}

export default SearchBar
