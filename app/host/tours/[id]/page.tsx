"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

interface ItineraryDay {
  day: number
  title: string
  description: string
  activities: string[]
  accommodation: string
  meals: string[]
}

interface TourFormData {
  name: string
  description: string
  location: string
  duration: number
  maxGroupSize: number
  pricePerPerson: number
  difficulty: string
  itinerary: ItineraryDay[]
  images: string[]
  highlights: string[]
  inclusionsExclusions: {
    included: string[]
    excluded: string[]
  }
}

export default function HostTourForm() {
  const router = useRouter()
  const params = useParams()
  const tourId = params?.id as string
  const isEdit = !!tourId && tourId !== "new"

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<TourFormData>({
    name: "",
    description: "",
    location: "",
    duration: 3,
    maxGroupSize: 20,
    pricePerPerson: 0,
    difficulty: "moderate",
    itinerary: Array.from({ length: 3 }, (_, i) => ({
      day: i + 1,
      title: "",
      description: "",
      activities: [],
      accommodation: "",
      meals: ["breakfast", "lunch", "dinner"],
    })),
    images: [],
    highlights: [""],
    inclusionsExclusions: {
      included: ["Accommodation", "Meals", "Local Transportation", "Guide"],
      excluded: ["International Flights", "Travel Insurance"],
    },
  })

  useEffect(() => {
    if (isEdit) {
      fetchTour()
    }
  }, [isEdit, tourId])

  const fetchTour = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/host/tours/${tourId}`)
      if (response.ok) {
        const { data } = await response.json()
        setFormData({
          name: data.name,
          description: data.description,
          location: data.location,
          duration: data.duration,
          maxGroupSize: data.maxGroupSize,
          pricePerPerson: data.pricePerPerson,
          difficulty: data.difficulty,
          itinerary: data.itinerary || formData.itinerary,
          images: data.images || [],
          highlights: data.highlights || [""],
          inclusionsExclusions: data.inclusionsExclusions || formData.inclusionsExclusions,
        })
      }
    } catch (error) {
      console.error("Error fetching tour:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === "duration" || name === "maxGroupSize" || name === "pricePerPerson" ? parseFloat(value) : value,
    }))
  }

  const updateItineraryDay = (dayIndex: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, idx) =>
        idx === dayIndex ? { ...day, [field]: value } : day
      ),
    }))
  }

  const handleItineraryActivityChange = (dayIndex: number, activityIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, idx) =>
        idx === dayIndex
          ? {
              ...day,
              activities: day.activities.map((act, aIdx) => (aIdx === activityIndex ? value : act)),
            }
          : day
      ),
    }))
  }

  const addItineraryActivity = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, idx) =>
        idx === dayIndex ? { ...day, activities: [...day.activities, ""] } : day
      ),
    }))
  }

  const removeItineraryActivity = (dayIndex: number, activityIndex: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, idx) =>
        idx === dayIndex
          ? { ...day, activities: day.activities.filter((_, aIdx) => aIdx !== activityIndex) }
          : day
      ),
    }))
  }

  const handleHighlightChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((h, idx) => (idx === index ? value : h)),
    }))
  }

  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, ""],
    }))
  }

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, idx) => idx !== index),
    }))
  }

  const handleInclusionChange = (type: "included" | "excluded", index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      inclusionsExclusions: {
        ...prev.inclusionsExclusions,
        [type]: prev.inclusionsExclusions[type].map((item, idx) => (idx === index ? value : item)),
      },
    }))
  }

  const addInclusion = (type: "included" | "excluded") => {
    setFormData(prev => ({
      ...prev,
      inclusionsExclusions: {
        ...prev.inclusionsExclusions,
        [type]: [...prev.inclusionsExclusions[type], ""],
      },
    }))
  }

  const removeInclusion = (type: "included" | "excluded", index: number) => {
    setFormData(prev => ({
      ...prev,
      inclusionsExclusions: {
        ...prev.inclusionsExclusions,
        [type]: prev.inclusionsExclusions[type].filter((_, idx) => idx !== index),
      },
    }))
  }

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        duration: formData.duration,
        maxGroupSize: formData.maxGroupSize,
        pricePerPerson: formData.pricePerPerson,
        difficulty: formData.difficulty,
        itinerary: formData.itinerary,
        images: formData.images.filter(i => i),
        highlights: formData.highlights.filter(h => h),
        inclusionsExclusions: formData.inclusionsExclusions,
      }

      const method = isEdit ? "PUT" : "POST"
      const url = isEdit ? `/api/host/tours/${tourId}` : "/api/host/tours"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to save tour")

      router.push("/host")
    } catch (error) {
      console.error("Error saving tour:", error)
      alert("Error saving tour. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/host" className="text-green-600 hover:underline mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold text-slate-900 mb-8">{isEdit ? "Edit Tour Package" : "Create Tour Package"}</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Tour Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter tour name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Tour destination"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Describe your tour package..."
              />
            </div>
          </div>

          {/* Tour Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Tour Details</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (Days)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Max Group Size</label>
                <input
                  type="number"
                  name="maxGroupSize"
                  value={formData.maxGroupSize}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Price per Person ($)</label>
                <input
                  type="number"
                  name="pricePerPerson"
                  value={formData.pricePerPerson}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Tour Highlights</h2>

            <div className="space-y-3 mb-4">
              {formData.highlights.map((highlight, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={highlight}
                    onChange={e => handleHighlightChange(idx, e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={`Highlight ${idx + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeHighlight(idx)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addHighlight}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              + Add Highlight
            </button>
          </div>

          {/* Itinerary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Day-by-Day Itinerary</h2>

            <div className="space-y-8">
              {formData.itinerary.map((day, dayIdx) => (
                <div key={dayIdx} className="border-l-4 border-green-500 pl-6 py-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Day {day.day}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Day Title</label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={e => updateItineraryDay(dayIdx, "title", e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., Arrival & City Tour"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Accommodation</label>
                      <input
                        type="text"
                        value={day.accommodation}
                        onChange={e => updateItineraryDay(dayIdx, "accommodation", e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Hotel name or type"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Day Description</label>
                    <textarea
                      value={day.description}
                      onChange={e => updateItineraryDay(dayIdx, "description", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="What happens on this day..."
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Activities</label>
                    <div className="space-y-2 mb-3">
                      {day.activities.map((activity, actIdx) => (
                        <div key={actIdx} className="flex gap-2">
                          <input
                            type="text"
                            value={activity}
                            onChange={e => handleItineraryActivityChange(dayIdx, actIdx, e.target.value)}
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Activity name"
                          />
                          <button
                            type="button"
                            onClick={() => removeItineraryActivity(dayIdx, actIdx)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addItineraryActivity(dayIdx)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-semibold transition"
                    >
                      + Add Activity
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Inclusions & Exclusions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 text-green-700">✓ Included</h3>
                <div className="space-y-2 mb-4">
                  {formData.inclusionsExclusions.included.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={e => handleInclusionChange("included", idx, e.target.value)}
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Included item"
                      />
                      <button
                        type="button"
                        onClick={() => removeInclusion("included", idx)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addInclusion("included")}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-semibold transition"
                >
                  + Add
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 text-red-700">✗ Excluded</h3>
                <div className="space-y-2 mb-4">
                  {formData.inclusionsExclusions.excluded.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={e => handleInclusionChange("excluded", idx, e.target.value)}
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Excluded item"
                      />
                      <button
                        type="button"
                        onClick={() => removeInclusion("excluded", idx)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addInclusion("excluded")}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-semibold transition"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Tour Images</h2>

            <div className="mb-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageAdd}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== idx),
                      }))}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              {submitting ? "Saving..." : isEdit ? "Update Tour" : "Create Tour"}
            </button>
            <Link
              href="/host"
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 px-6 py-3 rounded-lg font-semibold transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
