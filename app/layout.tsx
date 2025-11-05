import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kuliner Nusantara Indonesia | Discover Local Cuisine",
  description: "Jelajahi cita rasa autentik kuliner nusantara dari seluruh kepulauan Indonesia",
  generator: "v0.app",
  openGraph: {
    title: "Kuliner Nusantara Indonesia",
    description: "Jelajahi cita rasa autentik kuliner nusantara dari seluruh kepulauan Indonesia",
    type: "website",
    images: [
      {
        url: "/Logo-Kuliner Nusantara Indonesia.png",
        width: 1200,
        height: 630,
        alt: "Kuliner Nusantara Indonesia",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
