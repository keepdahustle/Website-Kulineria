"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  User, 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Settings,
  LogOut,
  ArrowLeft,
  Phone
} from "lucide-react"
import { postToApi } from "@/lib/data"

export default function VisitorProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: ""
  })
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    // Cek login dengan auth_token
    const token = localStorage.getItem("auth_token")
    const userRole = localStorage.getItem("user_role")

    // Jika tidak login atau role bukan visitor, tendang balik
    if (!token || userRole !== "visitor") {
      router.replace("/login")
      return
    }

    // Ambil user info dari localStorage atau API
    const userInfo = localStorage.getItem("user_info")
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo)
        setUser(parsed)
        setFormData(prev => ({ 
          ...prev, 
          name: parsed.name || "", 
          email: parsed.email || "",
          phone: parsed.phone || ""
        }))
      } catch (e) {
        console.error("Session data corrupt")
        router.replace("/login")
      }
    }
  }, [router])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMsg({ type: "", text: "" })

    if (formData.password && formData.password !== formData.confirm_password) {
      setMsg({ type: "error", text: "Konfirmasi password tidak cocok!" })
      setIsLoading(false)
      return
    }

    const res = await postToApi("/user/update", formData)

    if (res.success) {
      setMsg({ type: "success", text: "Profil berhasil diperbarui!" })
      
      // Sinkronisasi data baru ke LocalStorage
      const updatedUser = { 
        ...user, 
        name: formData.name, 
        email: formData.email,
        phone: formData.phone
      }
      localStorage.setItem("user_info", JSON.stringify(updatedUser))
      setUser(updatedUser)
      setFormData(prev => ({ ...prev, password: "", confirm_password: "" }))
    } else {
      setMsg({ type: "error", text: res.message || "Gagal memperbarui profil." })
    }
    setIsLoading(false)
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
    window.location.reload()
  }

  // Mencegah flickering
  if (!mounted || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f4e8d1]">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-[#a64029] border-t-transparent mx-auto"></div>
          <p className="font-serif text-[#a64029] text-xl animate-pulse">Memuat Profil Anda...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="bg-[#f4e8d1] min-h-screen pb-20 font-sans">
        <div className="container mx-auto px-5 max-w-4xl">
          
          {/* Breadcrumb & Back Button */}
          <div className="py-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm text-[#6e5849] hover:text-[#a64029] transition-colors no-underline mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
            </Link>
          </div>

          <div className="space-y-8">
            
            {/* Header Profile */}
            <div className="bg-gradient-to-r from-[#a64029] to-[#c55a3a] p-10 rounded-[40px] text-white flex items-center justify-between shadow-2xl">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-yellow-200 font-black text-[10px] uppercase tracking-[0.3em]">
                  <CheckCircle2 size={14} /> Member Aktif
                </div>
                <h1 className="text-4xl font-serif font-bold">{user.name || "Member Kulineria"}</h1>
                <p className="text-white/80 text-sm font-medium">Akun Visitor / Member Regular</p>
              </div>
              <div className="hidden md:flex w-20 h-20 bg-white/10 rounded-3xl items-center justify-center border border-white/20 backdrop-blur-md">
                <User size={40} className="text-white" />
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Quick Stats */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="p-8 bg-white rounded-[40px] border-none shadow-sm space-y-6">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-3">Informasi Akun</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-2">Email</p>
                      <div className="flex items-center gap-2 text-[#3b2f2f] text-sm bg-gray-50 p-4 rounded-2xl border border-gray-100 font-mono break-all">
                        {user.email || "Email tidak ditetapkan"}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-2">Status</p>
                      <div className="flex items-center gap-2 text-[#4e5b31] font-bold bg-[#4e5b31]/10 p-4 rounded-2xl border border-[#4e5b31]/20">
                        <CheckCircle2 size={16} /> Member Aktif
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-2xl text-[9px] text-blue-600 font-bold uppercase leading-relaxed">
                      Data akun Anda aman dan terenkripsi di server kami.
                    </div>
                  </div>
                </Card>

                {/* Logout Button */}
                <Button 
                  onClick={handleLogout}
                  className="w-full py-8 bg-red-500 hover:bg-red-600 text-white font-black rounded-[32px] text-sm uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-3"
                >
                  <LogOut size={20} /> Keluar Akun
                </Button>
              </div>

              {/* Menu Navigation */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Saved Kuliner Card */}
                  <Link href="/profile/visitor/saved" className="block">
                    <Card className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-[40px] border-2 border-amber-200 shadow-sm hover:shadow-lg hover:border-amber-300 transition-all cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-[0.2em]">
                            <CheckCircle2 size={14} /> Menu Favorit
                          </div>
                          <h3 className="text-lg font-bold text-[#3b2f2f] group-hover:text-[#a64029] transition-colors">Kuliner Tersimpan</h3>
                          <p className="text-sm text-gray-600">Lihat semua kuliner yang telah Anda simpan</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-200 rounded-2xl items-center justify-center flex text-amber-600 group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                        </div>
                      </div>
                    </Card>
                  </Link>

                  {/* Edit Profile Form */}
                  <Card className="p-8 md:p-10 bg-white rounded-[40px] border-none shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-[#a64029]/10 rounded-2xl text-[#a64029]">
                        <Settings size={24} />
                      </div>
                      <h2 className="text-xl font-bold text-[#3b2f2f]">Edit Profil Saya</h2>
                    </div>

                  {msg.text && (
                    <div className={`mb-6 p-5 rounded-3xl flex items-center gap-3 border animate-in slide-in-from-top-2 ${msg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                      {msg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                      <p className="font-bold text-sm">{msg.text}</p>
                    </div>
                  )}

                  <form onSubmit={handleUpdate} className="space-y-6">
                    {/* Nama Lengkap */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                      <div className="relative">
                        <User className="absolute left-4 top-4 w-5 h-5 text-gray-300" />
                        <Input 
                          className="pl-12 py-8 border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white transition-all text-sm font-bold" 
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})} 
                          placeholder="Masukkan nama lengkap Anda"
                          required 
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-300" />
                        <Input 
                          className="pl-12 py-8 border-none bg-gray-100 rounded-2xl text-sm font-bold text-gray-400 cursor-not-allowed" 
                          value={formData.email} 
                          disabled 
                        />
                      </div>
                      <p className="text-[9px] text-gray-400 italic">Email tidak bisa diubah untuk keamanan akun</p>
                    </div>

                    {/* Nomor Telepon */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nomor Telepon (Opsional)</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-300" />
                        <Input 
                          className="pl-12 py-8 border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white transition-all text-sm font-bold" 
                          value={formData.phone} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                          placeholder="Contoh: 08123456789"
                          type="tel"
                        />
                      </div>
                    </div>

                    {/* Password Section */}
                    <div className="pt-6 border-t border-gray-100 space-y-4">
                      <h3 className="text-sm font-bold text-[#3b2f2f] flex items-center gap-2">
                        <Lock size={18} className="text-[#a64029]" /> Ubah Password
                      </h3>
                      <p className="text-[9px] text-gray-500 italic">Kosongkan kedua field jika tidak ingin mengubah password</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password Baru</label>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="py-8 border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white text-sm font-bold" 
                            value={formData.password} 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Konfirmasi Password</label>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="py-8 border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white text-sm font-bold" 
                            value={formData.confirm_password} 
                            onChange={(e) => setFormData({...formData, confirm_password: e.target.value})} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      disabled={isLoading} 
                      type="submit" 
                      className="w-full py-10 bg-[#a64029] hover:bg-[#85311e] text-white font-black rounded-[32px] text-sm uppercase tracking-[0.2em] shadow-xl shadow-[#a64029]/30 transition-all flex items-center justify-center gap-3"
                    >
                      {isLoading ? (
                        <>
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={20} /> Simpan Perubahan
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
