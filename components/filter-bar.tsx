"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterBarProps {
  kategori: string[]
  onFilterChange: (filters: {
    kategori: string[]
    maxPrice?: number
    sort: "populer" | "terbaru"
  }) => void
}

export function FilterBar({ kategori, onFilterChange }: FilterBarProps) {
  const [selectedKategori, setSelectedKategori] = useState<string[]>([])
  const [priceFilter, setPriceFilter] = useState(false)
  const [sortBy, setSortBy] = useState<"populer" | "terbaru">("populer")

  useEffect(() => {
    const saved = localStorage.getItem("discoveryFilters")
    if (saved) {
      const filters = JSON.parse(saved)
      setSelectedKategori(filters.kategori || [])
      setPriceFilter(filters.friendlyPrice || false)
      setSortBy(filters.sort || "populer")
    }
  }, [])

  useEffect(() => {
    const filters = {
      kategori: selectedKategori,
      friendlyPrice: priceFilter,
      sort: sortBy,
    }
    localStorage.setItem("discoveryFilters", JSON.stringify(filters))
    onFilterChange({
      kategori: selectedKategori,
      maxPrice: priceFilter ? 20000 : undefined,
      sort: sortBy,
    })
  }, [selectedKategori, priceFilter, sortBy, onFilterChange])

  const toggleKategori = (kat: string) => {
    setSelectedKategori((prev) => (prev.includes(kat) ? prev.filter((k) => k !== kat) : [...prev, kat]))
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex flex-wrap gap-2">
          {kategori.map((kat) => (
            <button
              key={kat}
              onClick={() => toggleKategori(kat)}
              className={`px-4 py-2 rounded-full font-medium transition-all focus:ring-2 focus:ring-ring focus:outline-none ${
                selectedKategori.includes(kat)
                  ? "bg-muted/50 text-muted border-2 border-muted ring-2 ring-ring"
                  : "bg-muted/20 text-muted border border-muted/30 hover:bg-muted/30"
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 md:ml-auto">
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              className={`w-6 h-6 rounded border-2 transition-all ${
                priceFilter ? "bg-accent border-accent" : "border-border bg-card"
              }`}
            >
              {priceFilter && (
                <svg className="w-full h-full text-accent-foreground" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium text-foreground">Harga Ramah</span>
          </label>

          <Select value={sortBy} onValueChange={(val) => setSortBy(val as "populer" | "terbaru")}>
            <SelectTrigger className="w-40 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="populer">Populer</SelectItem>
              <SelectItem value="terbaru">Terbaru</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  )
}
