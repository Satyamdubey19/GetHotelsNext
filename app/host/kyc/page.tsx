"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import BackLink from "@/components/ui/BackLink"
import Spinner from "@/components/ui/Spinner"

interface KYCData {
  id: string
  status: string
  firstName: string
  lastName: string
  idType: string
  rejectionReason?: string
  submittedAt: string
  reviewedAt?: string
}

export default function KYCPage() {
  const [kyc, setKyc] = useState<KYCData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    idType: "passport",
    idNumber: "",
    idFrontImage: "",
    idBackImage: "",
    addressProof: "",
    businessLicense: "",
    taxCertificate: "",
  })

  useEffect(() => {
    fetchKYC()
  }, [])

  const fetchKYC = async () => {
    try {
      const response = await fetch("/api/host/kyc")
      if (response.ok) {
        const data = await response.json()
        setKyc(data.kyc)
        if (data.kyc) {
          setFormData(prev => ({
            ...prev,
            firstName: data.kyc.firstName,
            lastName: data.kyc.lastName,
            idType: data.kyc.idType,
            idNumber: data.kyc.idNumber,
          }))
        }
      }
    } catch (error) {
      console.error("Error fetching KYC:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files?.[0]) {
      const reader = new FileReader()
      reader.onload = () => {
        setFormData(prev => ({ ...prev, [name]: reader.result as string }))
      }
      reader.readAsDataURL(files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/host/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("KYC submitted successfully!")
        fetchKYC()
      } else {
        alert("Failed to submit KYC")
      }
    } catch (error) {
      console.error("Error submitting KYC:", error)
      alert("Error submitting KYC")
    } finally {
      setSubmitting(false)
    }
  }



  if (loading) return <Spinner minimal />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <BackLink href="/host" label="Back to Dashboard" className="text-blue-600" />

        <h1 className="text-4xl font-bold text-slate-900 mb-2">KYC Verification</h1>
        <p className="text-slate-600 mb-8">Complete your Know Your Customer verification to unlock all features</p>

        {kyc && (
          <div className={`rounded-lg p-6 mb-8 ${getStatusColor(kyc.status)}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold mb-2">Application Status</h2>
                <p className="text-sm mb-2">
                  <strong>Status:</strong> {kyc.status}
                </p>
                <p className="text-sm">
                  <strong>Submitted:</strong> {new Date(kyc.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {kyc.status === "REJECTED" && kyc.rejectionReason && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                <p className="font-semibold mb-2">Rejection Reason:</p>
                <p>{kyc.rejectionReason}</p>
              </div>
            )}

            {kyc.status === "APPROVED" && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                <p className="font-semibold">✓ Your KYC is verified! You can now receive bookings and payouts.</p>
              </div>
            )}

            {kyc.status === "PENDING" && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="font-semibold">Your KYC is under review. Please wait for admin approval.</p>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nationality *</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Identity Verification</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ID Type *</label>
              <select
                name="idType"
                value={formData.idType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="passport">Passport</option>
                <option value="driver_license">Driver License</option>
                <option value="national_id">National ID</option>
                <option value="visa">Visa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ID Number *</label>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ID Front Image *</label>
              <input
                type="file"
                name="idFrontImage"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ID Back Image *</label>
              <input
                type="file"
                name="idBackImage"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Address Proof</label>
            <input
              type="file"
              name="addressProof"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
            />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6 mt-8">Business Documents</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Business License</label>
              <input
                type="file"
                name="businessLicense"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tax Certificate</label>
              <input
                type="file"
                name="taxCertificate"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || (kyc?.status === "APPROVED")}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {submitting ? "Submitting..." : kyc?.status === "APPROVED" ? "KYC Verified ✓" : "Submit KYC"}
          </button>
        </form>
      </div>
    </div>
  )
}
