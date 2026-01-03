"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { 
  ArrowLeft,
  Bookmark,
  MapPin,
  Star,
  Trash2
} from "lucide-react"
import { fetchFromApi } from "@/lib/data"

export default function SavedKulinerPage() {
  const [mounted, setMounted] = useState(false)
  const [savedKuliner, setSavedKuliner] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    // Cek login
    const token = localStorage.getItem("auth_token")
    const userRole = localStorage.getItem("user_role")

    if (!token || userRole !== "visitor") {
      router.replace("/login")
      return
    }

    // Ambil ID kuliner yang disimpan dari localStorage
    const favorites = JSON.parse(localStorage.getItem("kulinerFavorites") || "[]")
    
    if (favorites.length === 0) {
      setLoading(false)
      return
    }

    // Fetch data kuliner yang disimpan
    loadSavedKuliner(favorites)
  }, [router])

  const loadSavedKuliner = async (favoriteIds: string[]) => {
    try {
      // Fetch semua kuliner dari API
      const response = await fetchFromApi<any>("/culinaries")
      
      if (response) {
        // Filter hanya kuliner yang ada di favorites
        const filtered = response.filter((item: any) => 
          favoriteIds.includes(item.id.toString())
        )
        setSavedKuliner(filtered)
      }
    } catch (error) {
      console.error("Error loading saved kuliner:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = (kulinerId: number) => {
    const favorites = JSON.parse(localStorage.getItem("kulinerFavorites") || "[]")
    const updated = favorites.filter((id: string) => id !== kulinerId.toString())
    localStorage.setItem("kulinerFavorites", JSON.stringify(updated))
    
    // Update state
    setSavedKuliner(prev => prev.filter(item => item.id !== kulinerId))
  }

  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f4e8d1]">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-[#a64029] border-t-transparent mx-auto"></div>
          <p className="font-serif text-[#a64029] text-xl animate-pulse">Memuat Kuliner Tersimpan...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="bg-[#f4e8d1] min-h-screen pb-20 font-sans">
        <div className="container mx-auto px-5 max-w-7xl">
          
          {/* Back Button */}
          <div className="py-6">
            <Link 
              href="/profile/visitor" 
              className="inline-flex items-center gap-2 text-sm text-[#6e5849] hover:text-[#a64029] transition-colors no-underline"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Profil
            </Link>
          </div>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-[#dfaf2b]/20 rounded-2xl text-[#dfaf2b]">
                <Bookmark size={28} fill="currentColor" />
              </div>
              <h1 className="text-4xl font-serif font-bold text-[#3b2f2f]">Kuliner Tersimpan</h1>
            </div>
            <p className="text-[#6e5849] text-lg">Koleksi kuliner favorit yang Anda simpan</p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-20 text-center animate-pulse">
              <div className="w-12 h-12 border-4 border-[#a64029] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Memproses Data...</p>
            </div>
          ) : savedKuliner.length === 0 ? (
            <div className="bg-white/40 p-24 rounded-[60px] text-center border border-dashed border-gray-300 shadow-inner">
              <Bookmark className="w-20 h-20 text-gray-300 mx-auto mb-6 opacity-50" />
              <h2 className="font-serif text-3xl text-gray-400 font-bold italic mb-3">Belum Ada Kuliner Tersimpan</h2>
              <p className="text-gray-400 text-sm mb-8 font-medium">Mulai jelajahi dan simpan kuliner favorit Anda</p>
              <Link 
                href="/" 
                className="inline-block px-8 py-4 bg-[#a64029] text-white rounded-2xl font-bold no-underline hover:bg-[#85311e] transition-all"
              >
                Jelajahi Kuliner
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedKuliner.map((item: any) => (
                <Card 
                  key={item.id} 
                  className="bg-white rounded-[40px] border-none shadow-sm hover:shadow-lg transition-all overflow-hidden group cursor-pointer"
                >
                  {/* Image */}
                  <Link href={`/kuliner/${item.id}`} className="no-underline block">
                    <div className="relative h-56 bg-gray-200 overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <img 
                          src={item.images[0]} 
                          alt={item.nama}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-gray-400">Tidak ada gambar</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <Link href={`/kuliner/${item.id}`} className="no-underline block">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-[#3b2f2f] text-lg line-clamp-2 flex-1">{item.nama}</h3>
                        <div className="flex items-center gap-1.5 bg-[#dfaf2b]/10 px-2 py-1 rounded-lg flex-shrink-0 ml-2">
                          <Star className="w-3.5 h-3.5 fill-[#dfaf2b] text-[#dfaf2b]" />
                          <span className="text-xs font-black text-[#3b2f2f]">
                            {item.rating > 0 ? item.rating.toFixed(1) : "0.0"}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#6e5849] mb-3 flex items-center gap-1.5 font-medium italic">
                        <MapPin size={14} className="opacity-70" /> {item.kota}, {item.provinsi}
                      </p>

                      <p className="text-sm text-[#6e5849] mb-4 line-clamp-2 italic">
                        "{item.deskripsi_ringkas}"
                      </p>

                      <div className="mt-auto">
                        <p className="text-2xl font-black text-[#a64029] mb-4">
                          {item.harga_min ? `Rp ${item.harga_min.toLocaleString('id-ID')}` : "Harga Bervariasi"}
                        </p>
                      </div>
                    </Link>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 border border-red-200"
                    >
                      <Trash2 size={18} /> Hapus dari Tersimpan
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
