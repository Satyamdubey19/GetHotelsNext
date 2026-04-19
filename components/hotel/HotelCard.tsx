'use client'

import { useState } from 'react'
import { useWishlist } from '@/contexts/WishlistContext'

interface Props {
  title: string
  location: string
  price: number
  rating: number
  image: string
  slug?: string
  city?: string
}

const HotelCard = ({ title, location, price, rating, image, slug = '' }: Props) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [isAnimating, setIsAnimating] = useState(false)
  
  const inWishlist = isInWishlist(slug, 'hotel')

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAnimating(true)
    
    if (inWishlist) {
      removeFromWishlist(slug, 'hotel')
    } else {
      addToWishlist({
        id: slug,
        slug,
        title,
        image,
        price,
        type: 'hotel',
      })
    }
    
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <div className="group w-full overflow-hidden rounded-[2rem] bg-slate-950 text-left shadow-2xl shadow-slate-900/10 transition hover:-translate-y-1">
      <div className="relative h-72 overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute right-4 top-4 z-10 h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg ${
            inWishlist
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-white/90 backdrop-blur-sm hover:bg-white'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className={`w-6 h-6 transition-all duration-300 ${
              inWishlist ? 'fill-white text-white' : 'text-slate-400'
            } ${isAnimating ? 'scale-125' : 'scale-100'}`}
            fill={inWishlist ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={inWishlist ? 0 : 2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-sm uppercase tracking-[0.2em] text-white font-bold drop-shadow-lg" style={{textShadow: '0 1px 4px rgba(0,0,0,0.8)'}}>{location}</p>
          <h2 className="mt-2 text-2xl font-bold text-white drop-shadow-lg" style={{textShadow: '0 2px 8px rgba(0,0,0,0.8)'}}>{title}</h2>
        </div>
      </div>
      <div className="space-y-2 p-5 bg-white">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-900 font-semibold flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            {rating.toFixed(1)}
          </span>
          <span className="font-bold text-slate-900">₹{price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

export default HotelCard