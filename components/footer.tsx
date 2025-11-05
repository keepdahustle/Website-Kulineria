export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card/50 mt-12 md:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-foreground mb-4">Tentang Kami</h3>
            <p className="text-sm text-muted-foreground">
              Kuliner Nusantara Indonesia adalah platform untuk menemukan dan mempromosikan kuliner tradisional autentik
              dari seluruh kepulauan Indonesia.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Tautan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tentang
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Kontak</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Email:{" "}
              <a href="mailto:info@kulinernusantara.id" className="hover:text-primary">
                info@kulinernusantara.id
              </a>
            </p>
            <p className="text-sm text-muted-foreground">
              Telepon:{" "}
              <a href="tel:+62" className="hover:text-primary">
                +62 (0) XX-XXXX-XXXX
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Kuliner Nusantara Indonesia. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}
