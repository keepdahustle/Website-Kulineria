// lib/data.ts
// lib/data.ts
export async function loadJSON<T>(path: string): Promise<T> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? "" : "http://localhost:3000");

  const url = path.startsWith("http")
    ? path
    : `${base}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.json();
}

export async function loadAll() {
  try {
    const [provKota, kategori, kuliner, popular, baru] = await Promise.all([
      loadJSON<Record<string, string[]>>("/mock/home/provinsi_kota.json"),
      loadJSON<string[]>("/mock/home/kategori.json"),
      loadJSON<any[]>("/mock/home/kuliner.json"),
      loadJSON<string[]>("/mock/home/popular.json"),
      loadJSON<string[]>("/mock/home/baru.json"),
    ])
    return { provKota, kategori, kuliner, popular, baru }
  } catch (error) {
    console.error("Error loading mock data:", error)
    return { provKota: {}, kategori: [], kuliner: [], popular: [], baru: [] }
  }
}

export function getKulinerById(id: string, kuliniarList: any[]) {
  return kuliniarList.find((item) => item.id === id)
}

export function filterKuliner(
  kuliniarList: any[],
  filters: {
    kategori?: string[]
    maxPrice?: number
    minRating?: number
    kota?: string
    provinsi?: string
    searchQuery?: string
  },
) {
  return kuliniarList.filter((item) => {
    if (filters.kategori?.length && !filters.kategori.includes(item.kategori)) return false
    if (filters.maxPrice && item.hargaMin && item.hargaMin > filters.maxPrice) return false
    if (filters.minRating && item.rating < filters.minRating) return false
    if (filters.kota && item.kota !== filters.kota) return false
    if (filters.provinsi && item.provinsi !== filters.provinsi) return false
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      return (
        item.title.toLowerCase().includes(q) ||
        item.kota.toLowerCase().includes(q) ||
        item.provinsi.toLowerCase().includes(q)
      )
    }
    return true
  })
}
