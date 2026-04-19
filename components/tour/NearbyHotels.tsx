import { Hotel } from '@/lib/hotels'
import Image from 'next/image'

type NearbyHotelsProps = {
  hotels: Hotel[]
}

export const NearbyHotels = ({ hotels }: NearbyHotelsProps) => {
  if (hotels.length === 0) {
    return null
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {hotels.map((hotel) => (
        <a key={hotel.slug} href={`/hotels/${hotel.slug}`} className="group bg-white rounded-lg overflow-hidden border border-slate-200 hover:shadow-md transition-all">
          {/* Image */}
          <div className="relative h-40 w-full bg-slate-100">
            <Image src={hotel.image} alt={hotel.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-slate-900 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
              <span className="text-yellow-500 text-[10px]">★</span> {hotel.rating}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h4 className="font-semibold text-slate-900 text-sm">{hotel.title}</h4>
            <p className="text-xs text-slate-500 mt-1">{hotel.location}</p>

            <div className="flex flex-wrap gap-1 mt-3">
              {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{amenity}</span>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
              <div>
                <p className="text-[10px] text-slate-400 uppercase">From</p>
                <p className="text-sm font-semibold text-slate-900">₹{hotel.price.toLocaleString()}<span className="text-xs text-slate-400 font-normal">/night</span></p>
              </div>
              <span className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 transition">View</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}
