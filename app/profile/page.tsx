"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ProfileRedirectPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Cek login dan role user
    const token = localStorage.getItem("auth_token")
    const userRole = localStorage.getItem("user_role")

    if (!token) {
      // Tidak login, redirect ke login page
      router.replace("/login")
      return
    }

    // Redirect berdasarkan role
    if (userRole === "umkm") {
      router.replace("/umkm")
    } else if (userRole === "admin") {
      router.replace("/admin")
    } else {
      // Default: visitor / member
      router.replace("/profile/visitor")
    }
  }, [router])

  // Loading state
  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f4e8d1]">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-[#a64029] border-t-transparent mx-auto"></div>
          <p className="font-serif text-[#a64029] text-xl animate-pulse">Memproses Profil...</p>
        </div>
      </div>
    )
  }

  return null
}
