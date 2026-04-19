'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/layout/Header/Header'
import Footer from '@/components/layout/Footer/Footer'
import { hotels } from '@/lib/hotels'
import SearchBar from '@/components/search/SearchBar'
import { HotelFilters, FilterOptions } from '@/components/hotel/HotelFilters'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Building2, LayoutGrid, List, ChevronDown, Wifi, Car, Waves, Dumbbell, Utensils, Sparkles, Shield, Headphones, BadgePercent } from 'lucide-react'
import { useWishlist } from '@/contexts/WishlistContext'

type SortOption = 'relevance' | 'price-low' | 'price-high' | 'rating'
type ViewMode = 'grid' | 'list'

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-3 h-3" />,
  'High-speed Wi-Fi': <Wifi className="w-3 h-3" />,
  'Complimentary Wi-Fi': <Wifi className="w-3 h-3" />,
  'Parking': <Car className="w-3 h-3" />,
  'Free parking': <Car className="w-3 h-3" />,
  'Valet parking': <Car className="w-3 h-3" />,
  'Pool': <Waves className="w-3 h-3" />,
  'Rooftop pool': <Waves className="w-3 h-3" />,
  'Outdoor pool': <Waves className="w-3 h-3" />,
  'Gym': <Dumbbell className="w-3 h-3" />,
  'Fitness center': <Dumbbell className="w-3 h-3" />,
  'Restaurant': <Utensils className="w-3 h-3" />,
  'Fine dining restaurant': <Utensils className="w-3 h-3" />,
  'All-day dining': <Utensils className="w-3 h-3" />,
  'Spa': <Sparkles className="w-3 h-3" />,
  'Spa and wellness center': <Sparkles className="w-3 h-3" />,
  'Spa treatments': <Sparkles className="w-3 h-3" />,
}

const features = [
  { icon: Shield, title: 'Best Price Guarantee', desc: 'We match any lower price you find' },
  { icon: Headphones, title: '24/7 Support', desc: 'Round-the-clock customer assistance' },
  { icon: BadgePercent, title: 'Exclusive Deals', desc: 'Members-only discounts & offers' },
]

function HotelCardInline({ hotel, layout }: { hotel: typeof hotels[0]; layout: ViewMode }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [isAnimating, setIsAnimating] = useState(false)
  const inWishlist = isInWishlist(hotel.slug, 'hotel')

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAnimating(true)
    if (inWishlist) {
      removeFromWishlist(hotel.slug, 'hotel')
    } else {
      addToWishlist({ id: hotel.slug, slug: hotel.slug, title: hotel.title, image: hotel.image, price: hotel.price, type: 'hotel' })
    }
    setTimeout(() => setIsAnimating(false), 300)
  }

  const wishlistBtn = (
    <button
      onClick={handleWishlist}
      className={`absolute top-3 right-3 z-10 h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg ${
        inWishlist ? 'bg-red-500 hover:bg-red-600' : 'bg-white/90 backdrop-blur-sm hover:bg-white'
      }`}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        className={`w-4 h-4 transition-all duration-300 ${inWishlist ? 'fill-white text-white' : 'text-gray-400'} ${isAnimating ? 'scale-125' : 'scale-100'}`}
        fill={inWishlist ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={inWishlist ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  )

  const ratingStars = (
    <div className="flex items-center gap-1">
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-bold">{hotel.rating.toFixed(1)}</span>
      <span className="text-xs text-gray-400">({hotel.reviews.length} reviews)</span>
    </div>
  )

  if (layout === 'list') {
    return (
      <Link href={`/hotels/${hotel.slug}`}>
        <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row cursor-pointer border border-gray-100">
          <div className="relative w-full sm:w-80 h-56 sm:h-auto flex-shrink-0 overflow-hidden">
            <Image src={hotel.image} alt={hotel.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {wishlistBtn}
          </div>
          <div className="flex-1 p-5 flex flex-col">
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-1 flex-1">{hotel.title}</h3>
              <div className="ml-3 flex-shrink-0">{ratingStars}</div>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
              <MapPin className="w-3.5 h-3.5 text-blue-500" /> {hotel.location}
            </p>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{hotel.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {hotel.amenities.slice(0, 5).map((a, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                  {amenityIcons[a] || <Building2 className="w-3 h-3" />} {a}
                </span>
              ))}
              {hotel.amenities.length > 5 && (
                <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">+{hotel.amenities.length - 5}</span>
              )}
            </div>
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">From</p>
                <p className="text-xl font-bold text-blue-600">₹{hotel.price.toLocaleString()}<span className="text-xs text-gray-400 font-normal">/night</span></p>
              </div>
              <span className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all group-hover:shadow-lg">
                View Details
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/hotels/${hotel.slug}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 h-full flex flex-col transform hover:-translate-y-2 cursor-pointer border border-gray-100">
        <div className="relative h-56 w-full overflow-hidden">
          <Image src={hotel.image} alt={hotel.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-3 right-3 bg-yellow-400/95 backdrop-blur-sm text-gray-900 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3 fill-gray-900" /> {hotel.rating.toFixed(1)} <span className="text-gray-700 font-normal">({hotel.reviews.length})</span>
          </div>
          {wishlistBtn}
        </div>
        <div className="p-5 space-y-3 flex-1 flex flex-col">
          <div>
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
              {hotel.title}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" /> {hotel.location}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{hotel.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {hotel.amenities.slice(0, 3).map((a, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full font-medium">
                {amenityIcons[a] || <Building2 className="w-3 h-3" />} {a}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">+{hotel.amenities.length - 3}</span>
            )}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">From</p>
              <p className="text-xl font-bold text-blue-600">₹{hotel.price.toLocaleString()}<span className="text-xs text-gray-400 font-normal">/night</span></p>
            </div>
            <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md group-hover:shadow-lg group-hover:scale-105 duration-300">
              Book Now →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function StaysPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    minPrice: 0,
    maxPrice: 50000,
    rating: 0,
    amenities: [],
    city: '',
  })
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const filteredHotels = useMemo(() => {
    let result = hotels.filter((hotel) => {
      const matchesSearch =
        searchQuery === '' ||
        hotel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCity = filters.city === '' || hotel.city === filters.city
      const matchesPrice = hotel.price >= filters.minPrice && hotel.price <= filters.maxPrice
      const matchesRating = filters.rating === 0 || hotel.rating >= filters.rating
      const matchesAmenities =
        filters.amenities.length === 0 ||
        filters.amenities.every((amenity) => hotel.amenities.includes(amenity))
      return matchesSearch && matchesCity && matchesPrice && matchesRating && matchesAmenities
    })

    switch (sortBy) {
      case 'price-low':
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result = [...result].sort((a, b) => b.rating - a.rating)
        break
    }

    return result
  }, [searchQuery, filters, sortBy])

  const activeFiltersCount = (filters.city ? 1 : 0) + (filters.rating ? 1 : 0) + filters.amenities.length + (filters.minPrice > 0 || filters.maxPrice < 50000 ? 1 : 0)
  const totalCities = new Set(hotels.map(h => h.city)).size
  const avgRating = (hotels.reduce((sum, h) => sum + h.rating, 0) / hotels.length).toFixed(1)

  const resetAll = () => {
    setSearchQuery('')
    setFilters({ minPrice: 0, maxPrice: 50000, rating: 0, amenities: [], city: '' })
    setSortBy('relevance')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
          </div>
          <div className="relative container mx-auto px-4 sm:px-6 py-14 sm:py-20">
            <div className="max-w-3xl">
              <span style={{ color: '#bfdbfe' }} className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-200 mb-4">
                🏨 {hotels.length}+ Premium Properties
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
                Find Your Perfect
                <span style={{ color: 'transparent' }} className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Stay Anywhere
                </span>
              </h1>
              <p className="text-base sm:text-lg text-blue-200 max-w-xl mb-8">
                Explore handpicked hotels, resorts, and boutique stays. Filter by price, ratings, amenities and book at the best prices.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl">
              {[
                { value: `${hotels.length}+`, label: 'Properties' },
                { value: `${totalCities}`, label: 'Cities' },
                { value: avgRating, label: 'Avg Rating' },
                { value: '₹8K+', label: 'Starting From' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center">
                  <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-blue-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="-mt-8 relative z-10 mb-4">
          <SearchBar onSearch={setSearchQuery} compact />
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 sm:px-6 pb-16">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFiltersCount}</span>
                )}
              </button>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{filteredHotels.length}</span> {filteredHotels.length === 1 ? 'hotel' : 'hotels'}
                {searchQuery && <> for &quot;<span className="text-blue-600">{searchQuery}</span>&quot;</>}
                {filters.city && <> in <span className="text-blue-600">{filters.city}</span></>}
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 flex-1 sm:flex-initial"
              >
                <option value="relevance">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              {activeFiltersCount > 0 && (
                <button onClick={resetAll} className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap">
                  Clear all
                </button>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              <HotelFilters onFilter={setFilters} />
            </div>

            {/* Hotels */}
            <div className="lg:col-span-3">
              {filteredHotels.length > 0 ? (
                <div className={
                  viewMode === 'grid'
                    ? 'grid sm:grid-cols-2 gap-5'
                    : 'flex flex-col gap-4'
                }>
                  {filteredHotels.map((hotel) => (
                    <HotelCardInline key={hotel.slug} hotel={hotel} layout={viewMode} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Hotels Found</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    We couldn&apos;t find any hotels matching your criteria. Try adjusting your search or filters.
                  </p>
                  <button
                    onClick={resetAll}
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white border-t border-gray-100 py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Why Book With Us</h2>
            <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {features.map((feature) => (
                <div key={feature.title} className="text-center p-6 rounded-2xl hover:bg-blue-50 transition-colors duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-xl mb-4">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
