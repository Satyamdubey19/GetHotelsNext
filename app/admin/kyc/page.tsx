"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Clock3, ShieldCheck } from 'lucide-react'
import BackLink from "@/components/ui/BackLink"
import StatusBadge from "@/components/ui/StatusBadge"
import Spinner from "@/components/ui/Spinner"
import Modal from "@/components/ui/Modal"

interface KYCApplication {
  id: string
  status: string
  firstName: string
  lastName: string
  dateOfBirth: string
  nationality: string
  idType: string
  idNumber: string
  idFrontImage: string
  idBackImage: string
  addressProof: string
  businessLicense: string
  taxCertificate: string
  submittedAt: string
  rejectionReason?: string
  host: {
    id: string
    businessName: string
    phone: string
    user: {
      email: string
      name: string
    }
  }
}

export default function AdminKYCPage() {
  const [applications, setApplications] = useState<KYCApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("PENDING")
  const [selectedApp, setSelectedApp] = useState<KYCApplication | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [filterStatus])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/kyc?status=${filterStatus}`)
      if (response.ok) {
        const data = await response.json()
        setApplications(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (kycId: string) => {
    if (!confirm("Are you sure you want to approve this KYC?")) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/kyc/${kycId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      })

      if (response.ok) {
        alert("KYC approved successfully!")
        fetchApplications()
        setSelectedApp(null)
      }
    } catch (error) {
      console.error("Error approving KYC:", error)
      alert("Failed to approve KYC")
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async (kycId: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason")
      return
    }

    if (!confirm("Are you sure you want to reject this KYC?")) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/admin/kyc/${kycId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", rejectionReason }),
      })

      if (response.ok) {
        alert("KYC rejected successfully!")
        fetchApplications()
        setSelectedApp(null)
        setRejectionReason("")
      }
    } catch (error) {
      console.error("Error rejecting KYC:", error)
      alert("Failed to reject KYC")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <Spinner minimal />

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <BackLink href="/admin" label="Back to Admin" className="text-sky-700" />

        <div className="mb-8 mt-4 rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-sky-100 text-sky-700">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Compliance review</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">KYC management</h1>
                <p className="mt-2 text-sm text-slate-600">Review host documents, approve clean records, and resolve exceptions quickly.</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
              <Clock3 className="h-4 w-4" />
              {applications.length} applications
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-8 rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="rounded-2xl border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <p className="text-slate-600 mt-2">{applications.length} applications found</p>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="rounded-[32px] border border-white/70 bg-white/80 p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <p className="text-slate-500">No {filterStatus.toLowerCase()} applications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app.id} className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {app.firstName} {app.lastName}
                    </h3>
                    <p className="text-slate-600">{app.host.user.email}</p>
                    <p className="text-sm text-slate-500">{app.host.businessName}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500">ID Type</p>
                    <p className="font-semibold">{app.idType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">ID Number</p>
                    <p className="font-semibold">{app.idNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Nationality</p>
                    <p className="font-semibold">{app.nationality}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Submitted</p>
                    <p className="font-semibold">{new Date(app.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {app.rejectionReason && (
                  <div className="mb-4 rounded border border-sky-200 bg-sky-50 p-3">
                    <p className="text-sm text-sky-900"><strong>Rejection Reason:</strong> {app.rejectionReason}</p>
                  </div>
                )}

                <button
                  onClick={() => setSelectedApp(app)}
                  className="font-semibold text-sky-700 hover:underline"
                >
                  View Details & Documents
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <Modal
          open={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title="KYC Details"
          maxWidth="max-w-2xl"
        >
          {selectedApp && (
            <>

              {selectedApp.idFrontImage && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">ID Front</h3>
                  <img src={selectedApp.idFrontImage} alt="ID Front" className="w-full max-h-64 object-contain rounded-lg" />
                </div>
              )}

              {selectedApp.idBackImage && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">ID Back</h3>
                  <img src={selectedApp.idBackImage} alt="ID Back" className="w-full max-h-64 object-contain rounded-lg" />
                </div>
              )}

              {selectedApp.status === "PENDING" && (
                <div className="space-y-4 mt-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Rejection Reason (if rejecting)</label>
                    <textarea
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Enter rejection reason..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleApprove(selectedApp.id)}
                      disabled={processing}
                      className="flex-1 rounded-lg bg-sky-600 py-2 font-semibold text-white hover:bg-sky-700 disabled:bg-slate-400"
                    >
                      {processing ? "Processing..." : "✓ Approve"}
                    </button>
                    <button
                      onClick={() => handleReject(selectedApp.id)}
                      disabled={processing || !rejectionReason.trim()}
                      className="flex-1 rounded-lg bg-slate-800 py-2 font-semibold text-white hover:bg-slate-900 disabled:bg-slate-400"
                    >
                      {processing ? "Processing..." : "✗ Reject"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </Modal>
      </div>
    </div>
  )
}
