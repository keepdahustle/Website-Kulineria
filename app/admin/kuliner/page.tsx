"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AdminLayout } from "@/components/admin/admin-layout"
import { loadJSON, type Kuliner, getPageSize } from "@/lib/admin-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function KulinerListPage() {
  const [kuliner, setKuliner] = useState<Kuliner[]>([])
  const [filtered, setFiltered] = useState<Kuliner[]>([])
  const [kategoriFilter, setKategoriFilter] = useState("All")
  const [provinsiFilter, setProvinsiFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [page, setPage] = useState(1)
  const pageSize = getPageSize()

  useEffect(() => {
    const load = async () => {
      try {
        const data = await loadJSON<Kuliner[]>("/mock/admin/kuliner.json")
        setKuliner(data)
        setFiltered(data)
      } catch (err) {
        console.error("[v0] Load kuliner error:", err)
      }
    }
    load()
  }, [])

  useEffect(() => {
    let result = kuliner

    if (kategoriFilter !== "All") {
      result = result.filter((k) => k.kategori === kategoriFilter)
    }

    if (provinsiFilter !== "All") {
      result = result.filter((k) => k.provinsi === provinsiFilter)
    }

    if (statusFilter !== "All") {
      result = result.filter((k) => k.status === statusFilter)
    }

    setFiltered(result)
    setPage(1)
  }, [kategoriFilter, provinsiFilter, statusFilter, kuliner])

  const categories = [...new Set(kuliner.map((k) => k.kategori))]
  const provinsi = [...new Set(kuliner.map((k) => k.provinsi))]
  const statuses = [...new Set(kuliner.map((k) => k.status))]

  const paginatedData = filtered.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(filtered.length / pageSize)

  const handleExportCSV = () => {
    const headers = ["Title", "Kategori", "Provinsi", "Kota", "Status"]
    const rows = filtered.map((k) => [k.title, k.kategori, k.provinsi, k.kota, k.status])
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "kuliner-list.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Kuliner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Kategori</label>
                <select
                  value={kategoriFilter}
                  onChange={(e) => setKategoriFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>All</option>
                  {categories.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Provinsi</label>
                <select
                  value={provinsiFilter}
                  onChange={(e) => setProvinsiFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>All</option>
                  {provinsi.map((prov) => (
                    <option key={prov}>{prov}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>All</option>
                  {statuses.map((st) => (
                    <option key={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleExportCSV}
                  className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium text-sm"
                >
                  📥 Export CSV
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kuliner List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Kuliner ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-5xl mb-4">🍽️</div>
                <p className="text-muted-foreground">Tidak ada kuliner</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Kategori</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Provinsi/Kota</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((k) => (
                        <tr key={k.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 font-medium text-foreground">{k.title}</td>
                          <td className="py-3 px-4 text-muted-foreground">{k.kategori}</td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {k.provinsi} / {k.kota}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                                k.status === "Published"
                                  ? "bg-[#4E5B3122] text-[#4E5B31]"
                                  : "bg-[#E2903A22] text-[#E2903A]"
                              }`}
                            >
                              {k.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Link
                              href={`/kuliner/${k.slug}`}
                              className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors font-medium inline-block"
                            >
                              Lihat
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    Halaman {page} dari {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-medium text-sm"
                    >
                      ← Sebelumnya
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-medium text-sm"
                    >
                      Selanjutnya →
                    </button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
