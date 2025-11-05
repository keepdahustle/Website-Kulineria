"use client"

import type React from "react"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, Users, Star, UtensilsCrossed, Award } from "lucide-react"

interface Dashboard {
  kpis: Array<{
    id: number
    title: string
    value: number | string
    change: number
    trend: "up" | "down"
    icon: string
  }>
  chartData: Array<{
    month: string
    restoran: number
    ulasan: number
    pengguna: number
  }>
}

const iconMap: Record<string, React.ReactNode> = {
  utensils: <UtensilsCrossed className="w-6 h-6" />,
  star: <Star className="w-6 h-6" />,
  award: <Award className="w-6 h-6" />,
  users: <Users className="w-6 h-6" />,
}

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/mock-data.json")
        const json = await response.json()
        setData(json.dashboard)
      } catch (error) {
        console.error("Error loading mock data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang di Admin Panel Kuliner Nusantara</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.kpis.map((kpi) => (
          <div key={kpi.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-muted-foreground text-sm font-medium">{kpi.title}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{kpi.value}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center text-secondary">
                {iconMap[kpi.icon]}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {kpi.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {kpi.trend === "up" ? "+" : ""}
                {kpi.change}%
              </span>
              <span className="text-muted-foreground text-sm">bulan lalu</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Tren 6 Bulan Terakhir</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: `1px solid var(--color-border)`,
                  borderRadius: "8px",
                  color: "var(--color-foreground)",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="restoran" stroke="var(--color-primary)" name="Restoran" strokeWidth={2} />
              <Line type="monotone" dataKey="ulasan" stroke="var(--color-secondary)" name="Ulasan" strokeWidth={2} />
              <Line type="monotone" dataKey="pengguna" stroke="var(--color-accent)" name="Pengguna" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Perbandingan Per Bulan</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: `1px solid var(--color-border)`,
                  borderRadius: "8px",
                  color: "var(--color-foreground)",
                }}
              />
              <Legend />
              <Bar dataKey="restoran" fill="var(--color-primary)" name="Restoran" />
              <Bar dataKey="ulasan" fill="var(--color-secondary)" name="Ulasan" />
              <Bar dataKey="pengguna" fill="var(--color-accent)" name="Pengguna" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-primary mb-2">Status Sistem</h3>
          <p className="text-2xl font-bold text-foreground">Optimal</p>
          <p className="text-xs text-muted-foreground mt-2">Semua sistem berjalan normal</p>
        </div>
        <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-secondary mb-2">Ulasan Pending</h3>
          <p className="text-2xl font-bold text-foreground">24</p>
          <p className="text-xs text-muted-foreground mt-2">Menunggu untuk di-review</p>
        </div>
        <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-accent mb-2">Aktivitas Hari Ini</h3>
          <p className="text-2xl font-bold text-foreground">128</p>
          <p className="text-xs text-muted-foreground mt-2">Interaksi pengguna terdeteksi</p>
        </div>
      </div>
    </div>
  )
}
