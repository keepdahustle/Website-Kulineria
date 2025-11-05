"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, Star } from "lucide-react"

interface KulinerCardProps {
  id: string
  title: string
  kategori: string
  provinsi: string
  kota: string
  hargaMin?: number
  hargaMax?: number
  rating: number
  images: string[]
}

export function KulinerCard({
  id,
  title,
  kategori,
  provinsi,
  kota,
  hargaMin,
  hargaMax,
  rating,
  images,
}: KulinerCardProps) {
  const [isSaved, setIsSaved] = useState(false)

  const formatPrice = (price?: number) => {
    if (!price) return ""
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const priceRange = hargaMin && hargaMax ? `${formatPrice(hargaMin)} - ${formatPrice(hargaMax)}` : "Harga bervariasi"

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/50">
      <div className="relative w-full h-48 overflow-hidden bg-muted/10">
        <Image
          src={images[0] || "/placeholder.svg?height=300&width=400&query=kuliner indonesia"}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="font-bold text-foreground line-clamp-2 flex-1">{title}</h3>
          <Badge variant="outline" className="whitespace-nowrap text-xs bg-muted/20 text-muted border-muted/30">
            {kategori}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground mb-3">
          {kota}, {provinsi}
        </p>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.round(rating) ? "fill-accent text-accent" : "text-muted/30"}`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-foreground">{rating.toFixed(1)}</span>
        </div>

        <p className="text-sm font-semibold text-primary mb-4">{priceRange}</p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
          >
            Detail
          </Button>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-2 rounded-lg transition-colors ${
              isSaved ? "bg-muted/30 text-muted" : "text-muted-foreground hover:text-muted"
            }`}
            aria-label={isSaved ? "Remove from saved" : "Add to saved"}
          >
            <Bookmark className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  )
}
