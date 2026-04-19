'use client'

import { useState } from 'react'
import { Star, RotateCcw, ChevronDown } from 'lucide-react'

type HotelFiltersProps = {
  onFilter: (filters: FilterOptions) => void
}

export type FilterOptions = {
  minPrice: number
  maxPrice: number
  rating: number
  amenities: string[]
  city: string
}

const amenitiesList = [
  'WiFi',
  'Parking',
  'Pool',
  'Gym',
  'Restaurant',
  'Spa',
  'Air Conditioning',
  'Room Service',
]

const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Goa', 'Dehradun', 'Kochi', 'Jaipur', 'Hyderabad', 'Mussoorie', 'Rishikesh']

type SectionProps = { title: string; children: React.ReactNode; defaultOpen?: boolean }

const FilterSection = ({ title, children, defaultOpen = true }: SectionProps) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-800 hover:text-blue-600 transition">
        {title}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  )
}

export const HotelFilters = ({ onFilter }: HotelFiltersProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    minPrice: 0,
    maxPrice: 50000,
    rating: 0,
    amenities: [],
    city: '',
  })

  const update = (partial: Partial<FilterOptions>) => {
    const updated = { ...filters, ...partial }
    setFilters(updated)
    onFilter(updated)
  }

  const handleAmenityToggle = (amenity: string) => {
    const updatedAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity]
    update({ amenities: updatedAmenities })
  }

  const resetFilters = () => {
    const resetState: FilterOptions = { minPrice: 0, maxPrice: 50000, rating: 0, amenities: [], city: '' }
    setFilters(resetState)
    onFilter(resetState)
  }

  const activeCount = (filters.city ? 1 : 0) + (filters.rating ? 1 : 0) + filters.amenities.length + (filters.minPrice > 0 || filters.maxPrice < 50000 ? 1 : 0)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-36">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-bold text-gray-900">Filters</h3>
        {activeCount > 0 && (
          <button onClick={resetFilters} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>
      {activeCount > 0 && (
        <p className="text-xs text-gray-400 mb-2">{activeCount} filter{activeCount > 1 ? 's' : ''} active</p>
      )}

      <FilterSection title="City">
        <select
          value={filters.city}
          onChange={(e) => update({ city: e.target.value })}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-gray-50 text-gray-700"
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-gray-600">₹{filters.minPrice.toLocaleString()}</span>
            <span className="font-medium text-gray-600">₹{filters.maxPrice.toLocaleString()}</span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={filters.minPrice}
              onChange={(e) => update({ minPrice: Number(e.target.value) })}
              className="w-full accent-blue-600 h-1.5"
            />
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={filters.maxPrice}
              onChange={(e) => update({ maxPrice: Number(e.target.value) })}
              className="w-full accent-blue-600 h-1.5"
            />
          </div>
          <div className="flex gap-2">
            {[
              { label: 'Under ₹10K', min: 0, max: 10000 },
              { label: '₹10K-20K', min: 10000, max: 20000 },
              { label: '₹20K+', min: 20000, max: 50000 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => update({ minPrice: preset.min, maxPrice: preset.max })}
                className={`flex-1 text-xs px-2 py-1.5 rounded-lg border transition ${
                  filters.minPrice === preset.min && filters.maxPrice === preset.max
                    ? 'bg-blue-50 border-blue-200 text-blue-600 font-medium'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        <div className="space-y-1.5">
          {[5, 4, 3, 2].map((rating) => (
            <button
              key={rating}
              onClick={() => update({ rating: filters.rating === rating ? 0 : rating })}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                filters.rating === rating
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                ))}
              </div>
              <span>{rating}+ Stars</span>
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Amenities" defaultOpen={false}>
        <div className="space-y-1.5">
          {amenitiesList.map((amenity) => (
            <label
              key={amenity}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition ${
                filters.amenities.includes(amenity) ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={`text-sm ${filters.amenities.includes(amenity) ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
                {amenity}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  )
}
