"use client"

import { useEffect, useState } from "react"
import { Check, X, Search, Filter } from "lucide-react"

interface Review {
  id: number
  restoran: string
  reviewer: string
  rating: number
  title: string
  content: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export default function ModerateReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch("/mock-data.json")
        const json = await response.json()
        setReviews(json.reviews)
      } catch (error) {
        console.error("Error loading reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    loadReviews()
  }, [])

  useEffect(() => {
    let result = reviews

    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter((review) => review.status === filterStatus)
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (review) =>
          review.restoran.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.reviewer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.content.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort
    result = result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortBy === "newest" ? dateB - dateA : dateA - dateB
    })

    setFilteredReviews(result)
  }, [reviews, filterStatus, searchTerm, sortBy])

  const handleApprove = (id: number) => {
    setReviews(reviews.map((review) => (review.id === id ? { ...review, status: "approved" } : review)))
  }

  const handleReject = (id: number) => {
    setReviews(reviews.map((review) => (review.id === id ? { ...review, status: "rejected" } : review)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-800 border border-yellow-200"
      case "approved":
        return "bg-green-50 text-green-800 border border-green-200"
      case "rejected":
        return "bg-red-50 text-red-800 border border-red-200"
      default:
        return ""
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "approved":
        return "Disetujui"
      case "rejected":
        return "Ditolak"
      default:
        return status
    }
  }

  const getRatingStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating)
  }

  const pendingCount = reviews.filter((r) => r.status === "pending").length
  const approvedCount = reviews.filter((r) => r.status === "approved").length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground">Memuat ulasan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Moderasi Ulasan</h1>
        <p className="text-muted-foreground">Kelola dan review ulasan restoran dari pengguna</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-600 text-sm font-medium">Total Ulasan</p>
          <p className="text-3xl font-bold text-blue-900">{reviews.length}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-600 text-sm font-medium">Pending Review</p>
          <p className="text-3xl font-bold text-yellow-900">{pendingCount}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm font-medium">Sudah Disetujui</p>
          <p className="text-3xl font-bold text-green-900">{approvedCount}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Cari Ulasan</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari restoran, nama pengguna, atau konten..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Urutkan</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-foreground font-medium mb-2">Tidak ada ulasan</p>
            <p className="text-muted-foreground">Coba ubah filter atau cari dengan kata kunci lain</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{review.restoran}</h3>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(review.status)}`}>
                      {getStatusLabel(review.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Oleh {review.reviewer}</span>
                    <span>•</span>
                    <span>{review.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-yellow-600">{getRatingStars(review.rating)}</span>
                  <span className="text-sm text-muted-foreground">{review.rating}/5</span>
                </div>
              </div>

              {/* Title */}
              <h4 className="font-medium text-foreground mb-2">{review.title}</h4>

              {/* Content */}
              <p className="text-foreground text-sm mb-6 leading-relaxed">{review.content}</p>

              {/* Actions */}
              {review.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#4E5B31] hover:bg-[#3a4323] text-white rounded-lg transition-colors font-medium shadow-sm hover:shadow-md"
                  >
                    <Check size={18} />
                    Setujui
                  </button>
                  <button
                    onClick={() => handleReject(review.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#A64029] hover:bg-[#8b3220] text-white rounded-lg transition-colors font-medium shadow-sm hover:shadow-md"
                  >
                    <X size={18} />
                    Tolak
                  </button>
                </div>
              )}

              {review.status === "approved" && (
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => handleReject(review.id)}
                    className="flex-1 px-4 py-2 bg-[#A6402922] hover:bg-[#A6402933] text-[#A64029] rounded-lg transition-colors font-medium border border-[#A6402944]"
                  >
                    Ubah ke Ditolak
                  </button>
                </div>
              )}

              {review.status === "rejected" && (
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="flex-1 px-4 py-2 bg-[#4E5B3122] hover:bg-[#4E5B3133] text-[#4E5B31] rounded-lg transition-colors font-medium border border-[#4E5B3144]"
                  >
                    Ubah ke Disetujui
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Menampilkan {filteredReviews.length} dari {reviews.length} ulasan
        </span>
      </div>
    </div>
  )
}
