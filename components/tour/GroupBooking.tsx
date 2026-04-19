'use client'

import { useState } from 'react'
import { Tour } from '@/lib/tours'

type GroupBookingProps = {
  tour: Tour
  onClose: () => void
}

type BookedTraveler = {
  id: string
  name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  location: string
  bookedOn: string
  avatar: string
  bio: string
  interests: string[]
  tripsCompleted: number
  languages: string[]
  joinedDate: string
}

const BOOKED_TRAVELERS: BookedTraveler[] = [
  { id: '1', name: 'Raj Kumar', age: 28, gender: 'Male', location: 'Delhi, India', bookedOn: '2 days ago', avatar: 'R', bio: 'Adventure seeker & mountain lover. Always up for spontaneous trips and meeting new people.', interests: ['Trekking', 'Photography', 'Camping'], tripsCompleted: 12, languages: ['Hindi', 'English'], joinedDate: 'Jan 2024' },
  { id: '2', name: 'Priya Singh', age: 24, gender: 'Female', location: 'Mumbai, India', bookedOn: '3 days ago', avatar: 'P', bio: 'Travel blogger exploring one city at a time. Love street food, sunsets, and local cultures.', interests: ['Blogging', 'Food', 'Culture'], tripsCompleted: 8, languages: ['Hindi', 'English', 'Marathi'], joinedDate: 'Mar 2024' },
  { id: '3', name: 'Amit Verma', age: 32, gender: 'Male', location: 'Bangalore, India', bookedOn: '5 days ago', avatar: 'A', bio: 'Software engineer by day, traveler by weekend. Looking for travel buddies for upcoming trips.', interests: ['Tech', 'Hiking', 'Wildlife'], tripsCompleted: 15, languages: ['Hindi', 'English', 'Kannada'], joinedDate: 'Nov 2023' },
  { id: '4', name: 'Sneha Reddy', age: 26, gender: 'Female', location: 'Hyderabad, India', bookedOn: '1 week ago', avatar: 'S', bio: 'Yoga instructor who travels to find inner peace. Love beaches, temples, and quiet places.', interests: ['Yoga', 'Wellness', 'Beaches'], tripsCompleted: 6, languages: ['Telugu', 'Hindi', 'English'], joinedDate: 'Jun 2024' },
  { id: '5', name: 'Vikram Joshi', age: 30, gender: 'Male', location: 'Pune, India', bookedOn: '1 week ago', avatar: 'V', bio: 'Cyclist and road trip enthusiast. Covered 20,000+ km across India on two wheels.', interests: ['Cycling', 'Road Trips', 'Music'], tripsCompleted: 22, languages: ['Hindi', 'English'], joinedDate: 'Aug 2023' },
]

export const GroupBooking = ({ tour, onClose }: GroupBookingProps) => {
  const [step, setStep] = useState(1)
  const [travelers, setTravelers] = useState(1)
  const [travelDate, setTravelDate] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialRequests: '',
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [selectedTraveler, setSelectedTraveler] = useState<BookedTraveler | null>(null)

  const pricePerPerson = tour.price
  const subtotal = pricePerPerson * travelers
  const taxes = Math.round(subtotal * 0.05)
  const serviceFee = Math.round(subtotal * 0.02)
  const total = subtotal + taxes + serviceFee

  const isStep1Valid = travelers > 0 && travelDate !== ''
  const isStep3Valid = formData.fullName.trim() !== '' && formData.email.trim() !== '' && formData.phone.trim() !== ''

  const totalSteps = 4
  const stepLabels = ['Details', 'Travelers', 'Your Info', 'Review']

  const genderColor = (g: string) =>
    g === 'Male' ? 'bg-blue-50 text-blue-700' : g === 'Female' ? 'bg-pink-50 text-pink-700' : 'bg-slate-100 text-slate-600'

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="min-w-0 pr-4">
            <h2 className="text-base font-semibold text-slate-900 truncate">Book This Tour</h2>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{tour.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition flex-shrink-0"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-3 border-b border-slate-50 flex-shrink-0">
          <div className="flex items-center">
            {stepLabels.map((label, i) => {
              const num = i + 1
              return (
                <div key={num} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                      step > num ? 'bg-emerald-500 text-white' : step === num ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {step > num ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : num}
                    </div>
                    <span className={`text-[10px] font-medium hidden sm:block ${step >= num ? 'text-slate-900' : 'text-slate-400'}`}>
                      {label}
                    </span>
                  </div>
                  {i < totalSteps - 1 && (
                    <div className={`flex-1 h-px mx-2 ${step > num ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* Step 1: Tour Details */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Tour Card */}
              <div className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                <div
                  className="w-16 h-14 rounded-lg bg-slate-200 bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${tour.gallery[0]})` }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 truncate">{tour.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{tour.duration} days · {tour.location.city}, {tour.location.country}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500 text-[10px]">★</span>
                    <span className="text-[10px] text-slate-600">{tour.rating} ({tour.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Travel Date */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">Travel Date</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition bg-white"
                />
              </div>

              {/* Travelers */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">Travelers</label>
                <div className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-2.5">
                  <span className="text-sm text-slate-600">Adults</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      disabled={travelers <= 1}
                      className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition text-sm disabled:opacity-30"
                    >−</button>
                    <span className="text-sm font-semibold text-slate-900 w-5 text-center">{travelers}</span>
                    <button
                      onClick={() => setTravelers(Math.min(10, travelers + 1))}
                      disabled={travelers >= 10}
                      className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition text-sm disabled:opacity-30"
                    >+</button>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">Max group size: {tour.groupSize}</p>
              </div>

              {/* Price */}
              <div className="space-y-1.5 pt-4 border-t border-slate-100 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">₹{pricePerPerson.toLocaleString()} × {travelers}</span>
                  <span className="text-slate-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Taxes & service fee</span>
                  <span className="text-slate-900">₹{(taxes + serviceFee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 font-semibold">
                  <span className="text-slate-900">Total</span>
                  <span className="text-slate-900">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Already Booked Travelers */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Fellow Travelers</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {BOOKED_TRAVELERS.length} people have already booked this tour
                </p>
              </div>

              {/* Traveler Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-semibold text-slate-900">{BOOKED_TRAVELERS.length}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Booked</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-semibold text-slate-900">{Math.round(BOOKED_TRAVELERS.reduce((s, t) => s + t.age, 0) / BOOKED_TRAVELERS.length)}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Avg Age</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-semibold text-slate-900">
                    {BOOKED_TRAVELERS.filter(t => t.gender === 'Male').length}M / {BOOKED_TRAVELERS.filter(t => t.gender === 'Female').length}F
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Ratio</p>
                </div>
              </div>

              {/* Traveler List */}
              <div className="space-y-2">
                {BOOKED_TRAVELERS.map((traveler) => (
                  <button
                    key={traveler.id}
                    onClick={() => setSelectedTraveler(traveler)}
                    className="w-full flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 hover:border-slate-200 transition text-left cursor-pointer group"
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0 group-hover:bg-slate-800 transition">
                      {traveler.avatar}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 truncate group-hover:underline">{traveler.name}</p>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${genderColor(traveler.gender)}`}>
                          {traveler.gender}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">{traveler.age} yrs</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500 truncate">{traveler.location}</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Spots left */}
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-amber-800">
                  <span className="font-semibold">Limited spots!</span> Only {10 - BOOKED_TRAVELERS.length} spots remaining for this departure.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Contact Info */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g., Rahul Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition"
                />
                <p className="text-[10px] text-slate-400 mt-1">Confirmation will be sent to this email</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">Phone Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-slate-200 rounded-l-lg bg-slate-50 text-sm text-slate-500">+91</span>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="flex-1 px-3 py-2.5 border border-slate-200 rounded-r-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">
                  Special Requests <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  placeholder="Dietary needs, accessibility requirements, etc."
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 4: Review & Confirm */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Booking */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Booking Details</h4>
                  <button onClick={() => setStep(1)} className="text-[10px] text-slate-500 hover:text-slate-900 underline">Edit</button>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <p className="text-[10px] text-slate-400">Tour</p>
                    <p className="text-xs font-medium text-slate-900 mt-0.5 truncate">{tour.title}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Date</p>
                    <p className="text-xs font-medium text-slate-900 mt-0.5">{travelDate || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Travelers</p>
                    <p className="text-xs font-medium text-slate-900 mt-0.5">{travelers} adult{travelers > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Duration</p>
                    <p className="text-xs font-medium text-slate-900 mt-0.5">{tour.duration} days</p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact</h4>
                  <button onClick={() => setStep(3)} className="text-[10px] text-slate-500 hover:text-slate-900 underline">Edit</button>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-slate-900 font-medium">{formData.fullName}</p>
                  <p className="text-slate-500">{formData.email} · +91 {formData.phone}</p>
                  {formData.specialRequests && (
                    <p className="text-slate-400 pt-1 border-t border-slate-200 mt-2 italic">&quot;{formData.specialRequests}&quot;</p>
                  )}
                </div>
              </div>

              {/* Joining with */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">You&apos;re joining</h4>
                <div className="flex items-center -space-x-2">
                  {BOOKED_TRAVELERS.slice(0, 4).map((t) => (
                    <div key={t.id} className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-semibold border-2 border-white" title={t.name}>
                      {t.avatar}
                    </div>
                  ))}
                  {BOOKED_TRAVELERS.length > 4 && (
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-semibold border-2 border-white">
                      +{BOOKED_TRAVELERS.length - 4}
                    </div>
                  )}
                  <span className="text-xs text-slate-500 pl-4">{BOOKED_TRAVELERS.length} travelers already booked</span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">₹{pricePerPerson.toLocaleString()} × {travelers}</span>
                  <span className="text-slate-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Taxes (5%)</span>
                  <span className="text-slate-900">₹{taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service fee</span>
                  <span className="text-slate-900">₹{serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold">
                  <span className="text-slate-900">Total</span>
                  <span className="text-slate-900">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
                />
                <span className="text-[11px] text-slate-600 leading-relaxed">
                  I agree to the <a href="/terms" className="underline text-slate-900">Terms & Conditions</a> and <a href="/terms" className="underline text-slate-900">Cancellation Policy</a>. Free cancellation up to 48 hrs before departure.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-white transition"
              >Back</button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-white transition"
              >Cancel</button>
            )}
            <div className="flex-1" />
            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 ? !isStep1Valid : step === 3 ? !isStep3Valid : false}
                className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >Continue</button>
            ) : (
              <button
                onClick={() => alert('Booking confirmed! Check your email for details.')}
                disabled={!agreedToTerms}
                className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Pay ₹{total.toLocaleString()}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Preview Popup */}
      {selectedTraveler && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onClick={() => setSelectedTraveler(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-sm shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Profile Header */}
            <div className="bg-slate-900 px-6 pt-6 pb-10 relative">
              <button
                onClick={() => setSelectedTraveler(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Traveler Profile</p>
            </div>

            {/* Avatar overlapping header */}
            <div className="relative px-6">
              <div className="absolute -top-8 left-6 w-16 h-16 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <div className={`w-full h-full rounded-full flex items-center justify-center text-xl font-bold ${
                  selectedTraveler.gender === 'Male' ? 'bg-blue-100 text-blue-700' : selectedTraveler.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {selectedTraveler.avatar}
                </div>
              </div>
            </div>

            {/* Profile Body */}
            <div className="px-6 pt-10 pb-6 space-y-5">
              {/* Name & Basic Info */}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">{selectedTraveler.name}</h3>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${genderColor(selectedTraveler.gender)}`}>
                    {selectedTraveler.gender}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span>{selectedTraveler.age} years old</span>
                  <span className="text-slate-300">·</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {selectedTraveler.location}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-slate-600 leading-relaxed">{selectedTraveler.bio}</p>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-semibold text-slate-900">{selectedTraveler.tripsCompleted}</p>
                  <p className="text-[10px] text-slate-500">Trips</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-semibold text-slate-900">{selectedTraveler.languages.length}</p>
                  <p className="text-[10px] text-slate-500">Languages</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <p className="text-[10px] font-semibold text-slate-900 leading-tight mt-1">{selectedTraveler.joinedDate}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Member since</p>
                </div>
              </div>

              {/* Interests */}
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Interests</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTraveler.interests.map((interest, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Speaks</p>
                <p className="text-sm text-slate-700">{selectedTraveler.languages.join(', ')}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setSelectedTraveler(null)}
                  className="flex-1 px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Send Message
                </button>
                <button
                  onClick={() => setSelectedTraveler(null)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
