"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AreaSelector } from "@/components/area-selector"
import { FilterBar } from "@/components/filter-bar"
import { KulinerGrid } from "@/components/kuliner-grid"
import { CarouselBaru } from "@/components/carousel-baru"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { loadAll, filterKuliner, getKulinerById } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const { toast } = useToast()
  const [data, setData] = useState<any>(null)
  const [selectedArea, setSelectedArea] = useState<{ provinsi: string; kota: string } | null>(null)
  const [filters, setFilters] = useState({
    kategori: [] as string[],
    maxPrice: undefined as number | undefined,
    sort: "populer" as "populer" | "terbaru",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedData = await loadAll()
        setData(loadedData)
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "Gagal memuat data. Silakan refresh halaman.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [toast])

  useEffect(() => {
    const saved = localStorage.getItem("userArea")
    if (saved) {
      setSelectedArea(JSON.parse(saved))
    }
  }, [])

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-border border-t-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat kuliner nusantara...</p>
        </div>
      </div>
    )
  }

  const baruItems = data.baru.map((id: string) => getKulinerById(id, data.kuliner)).filter(Boolean)

  let kulinerList = [...data.kuliner]
  if (searchQuery) {
    kulinerList = filterKuliner(kulinerList, { searchQuery })
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    toast({
      title: "Pencarian",
      description: `Mencari: ${query}`,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection kategori={data.kategori} kota={Object.values(data.provKota).flat()} onSearch={handleSearch} />

        <AreaSelector provinsiKota={data.provKota} onAreaChange={setSelectedArea} />

        <FilterBar kategori={data.kategori} onFilterChange={setFilters} />

        <KulinerGrid kuliner={kulinerList} area={selectedArea} popular={data.popular} filters={filters} />

        {baruItems.length > 0 && <CarouselBaru baru={baruItems} />}

        <FAQSection />
      </main>

      <Footer />
    </div>
  )
}
