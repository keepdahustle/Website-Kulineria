import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl">
          <span className="text-3xl font-bold text-primary-foreground">KN</span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Kuliner Nusantara Admin</h1>
          <p className="text-lg text-muted-foreground">
            Platform manajemen restoran dan moderasi ulasan untuk Kuliner Nusantara
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Ke Admin Dashboard
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium"
          >
            Pelajari Lebih Lanjut
          </a>
        </div>

        {/* Features */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-foreground mb-2">Dashboard</h3>
            <p className="text-sm text-muted-foreground">
              Pantau KPI dan tren terbaru dengan visualisasi data real-time
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-3xl mb-3">✓</div>
            <h3 className="font-semibold text-foreground mb-2">Moderasi</h3>
            <p className="text-sm text-muted-foreground">
              Kelola dan review ulasan dari pengguna dengan sistem approval
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-3xl mb-3">🍽️</div>
            <h3 className="font-semibold text-foreground mb-2">Daftar Kuliner</h3>
            <p className="text-sm text-muted-foreground">Kelola database lengkap restoran dan informasi kuliner</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-16 border-t border-border text-sm text-muted-foreground">
          <p>© 2025 Kuliner Nusantara. Admin Panel v1.0</p>
        </div>
      </div>
    </div>
  )
}
