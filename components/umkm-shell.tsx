"use client"

import { useTheme } from "@/lib/use-theme"
import { 
  Moon, 
  Sun, 
  Plus, 
  LogOut, 
  LayoutDashboard, 
  Utensils, 
  UserCircle // Icon untuk Profil
} from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"

interface UmkmShellProps {
  children: ReactNode
  title: string
  showAddButton?: boolean
}

export function UmkmShell({ children, title, showAddButton = false }: UmkmShellProps) {
  const { theme, toggleTheme, mounted } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [userName, setUserName] = useState("Mitra")

  useEffect(() => {
    const info = localStorage.getItem("user_info")
    if (info) {
      const parsed = JSON.parse(info)
      setUserName(parsed.nama_usaha || parsed.name || "Mitra")
    }
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    router.push("/umkm/auth")
    window.location.reload()
  }

  // Active state helper
  const isActive = (path: string) => pathname === path

  return (
    <div className="flex min-h-screen bg-[#f4e8d1]/30 font-sans text-[#3b2f2f]">
      {/* Sidebar UMKM */}
      <aside className="w-64 bg-[#3b2f2f] p-6 flex flex-col sticky top-0 h-screen shadow-2xl z-50">
        <Link href="/" className="flex items-center gap-3 mb-10 group no-underline">
          <div className="w-12 h-12 bg-[#a64029] rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 shadow-lg shadow-[#a64029]/20">
            <Utensils className="text-white" size={24} />
          </div>
          <div className="text-white">
            <div className="font-black text-lg leading-tight tracking-tighter uppercase">Mitra</div>
            <div className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-bold">Nusantara</div>
          </div>
        </Link>

        {/* Navigation - POSISI PROFIL DI ATAS DASHBOARD UTAMA */}
        <nav className="flex-1 space-y-3">
          
          {/* 1. Menu Profil Usaha (Sesuai Permintaan) */}
          <Link
            href="/umkm/profile"
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all no-underline ${
              isActive("/umkm/profile") 
              ? "bg-[#dfaf2b] text-[#3b2f2f] shadow-lg shadow-[#dfaf2b]/20" 
              : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <UserCircle size={20} className={isActive("/umkm/profile") ? "text-[#3b2f2f]" : "text-white/40"} />
            <span className="font-bold text-sm">Profil Usaha</span>
          </Link>

          {/* 2. Dashboard Utama */}
          <Link
            href="/umkm"
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all no-underline ${
              isActive("/umkm") 
              ? "bg-[#a64029] text-white shadow-lg shadow-[#a64029]/20" 
              : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <LayoutDashboard size={20} className={isActive("/umkm") ? "text-white" : "text-white/40"} />
            <span className="font-bold text-sm">Dashboard Utama</span>
          </Link>
          
          {/* 3. Tambah Menu */}
          <Link
            href="/umkm/tambah"
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all no-underline ${
              isActive("/umkm/tambah") 
              ? "bg-[#a64029] text-white shadow-lg shadow-[#a64029]/20" 
              : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Plus size={20} className={isActive("/umkm/tambah") ? "text-white" : "text-white/40"} />
            <span className="font-bold text-sm">Tambah Menu</span>
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white/50 hover:text-white transition-all border border-white/5"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              <span className="text-xs font-black uppercase tracking-widest">{theme === "light" ? "Mode Gelap" : "Mode Terang"}</span>
            </button>
          )}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-black text-xs uppercase tracking-widest"
          >
            <LogOut size={18} />
            <span>Keluar Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header Dashboard */}
        <header className="bg-white border-b border-gray-200 px-10 py-6 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-[#3b2f2f] uppercase tracking-tighter italic">{title}</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sistem Manajemen Konten Hidangan</p>
          </div>
          
          <div className="flex items-center gap-6">
            {showAddButton && (
              <Link
                href="/umkm/tambah"
                className="flex items-center gap-2 bg-[#4e5b31] text-white px-6 py-3 rounded-2xl hover:bg-[#3a4323] transition-all font-bold shadow-lg shadow-[#4e5b31]/20 no-underline text-sm"
              >
                <Plus size={20} />
                Hidangan Baru
              </Link>
            )}
            <div className="h-10 w-px bg-gray-100 hidden md:block"></div>
            <div className="hidden md:flex items-center gap-3">
               <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Log-in sebagai</p>
                  <p className="text-xs font-bold text-[#3b2f2f] leading-none">{userName}</p>
               </div>
               <div className="w-10 h-10 bg-[#dfaf2b] rounded-xl flex items-center justify-center font-bold text-[#3b2f2f] shadow-sm uppercase">
                  {userName[0]}
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#f4e8d1]/20">
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                {children}
            </div>
        </div>
      </main>
    </div>
  )
}