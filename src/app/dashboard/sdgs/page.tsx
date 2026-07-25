"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe2, CheckCircle2, Info, Target } from "lucide-react"

interface SDGItem {
  id: number
  title: string
  color: string
  relevantModules: string[]
  indicators: { text: string; achieved: boolean }[]
}

const ALL_SDGS: SDGItem[] = [
  { id: 3, title: "Kehidupan Sehat & Sejahtera", color: "#4C9F38", relevantModules: ["Waste", "Air Limbah"], indicators: [{ text: "Penurunan limbah B3 berbahaya ≥ 10% YoY", achieved: false }, { text: "Baku mutu air limbah terpenuhi 100%", achieved: false }] },
  { id: 6, title: "Air Bersih & Sanitasi", color: "#26BDE2", relevantModules: ["Water Monitoring", "Waste Assessment"], indicators: [{ text: "Efisiensi penggunaan air ≥ 5% per tahun", achieved: false }, { text: "Zero discharge limbah cair tanpa pengolahan", achieved: false }] },
  { id: 7, title: "Energi Bersih & Terjangkau", color: "#FCC30B", relevantModules: ["Energy Assessment", "Carbon Accounting"], indicators: [{ text: "Bauran energi terbarukan ≥ 10%", achieved: false }, { text: "Intensitas energi turun ≥ 3% per tahun", achieved: false }] },
  { id: 8, title: "Pekerjaan Layak & Pertumbuhan", color: "#A21942", relevantModules: ["ESG Dashboard", "Company Profile"], indicators: [{ text: "Tingkat kecelakaan kerja (LTIFR) < 0.5", achieved: false }, { text: "Pelatihan K3 ≥ 20 jam/karyawan/tahun", achieved: false }] },
  { id: 9, title: "Industri, Inovasi & Infrastruktur", color: "#FD6925", relevantModules: ["LCA", "Circular Economy"], indicators: [{ text: "Investasi R&D lingkungan ≥ 1% pendapatan", achieved: false }, { text: "Sertifikasi ISO 14001 aktif", achieved: false }] },
  { id: 11, title: "Kota & Komunitas Berkelanjutan", color: "#FD9D24", relevantModules: ["Transportation", "ESG Dashboard"], indicators: [{ text: "Program CSR lingkungan di komunitas sekitar", achieved: false }, { text: "Emisi kendaraan dinas sesuai standar Euro 4", achieved: false }] },
  { id: 12, title: "Konsumsi & Produksi Bertanggung Jawab", color: "#BF8B2E", relevantModules: ["Circular Economy", "Waste Assessment", "Product Assessment"], indicators: [{ text: "Limbah produksi ke TPA ≤ 20% total limbah", achieved: false }, { text: "Produk dengan eco-label ≥ 1 sertifikasi", achieved: false }] },
  { id: 13, title: "Penanganan Perubahan Iklim", color: "#3F7E44", relevantModules: ["Carbon Accounting", "LCA", "Goal & Scope"], indicators: [{ text: "Target reduksi emisi GRK ≥ 30% di 2030", achieved: false }, { text: "Laporan iklim sesuai TCFD / ISSB IFRS S2", achieved: false }] },
  { id: 14, title: "Ekosistem Lautan", color: "#0A97D9", relevantModules: ["Waste Assessment", "Transportation"], indicators: [{ text: "Zero plastic waste ke badan air terbuka", achieved: false }, { text: "Program adopsi/rehabilitasi ekosistem pesisir", achieved: false }] },
  { id: 15, title: "Ekosistem Daratan", color: "#56C02B", relevantModules: ["LCA", "Circular Economy"], indicators: [{ text: "Zero deforestasi dalam rantai pasok", achieved: false }, { text: "Program revegetasi ≥ 1 Ha/tahun", achieved: false }] },
  { id: 16, title: "Perdamaian, Keadilan & Institusi", color: "#00689D", relevantModules: ["Audit Trail", "Compliance"], indicators: [{ text: "Zero kasus korupsi / suap lingkungan", achieved: false }, { text: "Mekanisme pengaduan lingkungan tersedia", achieved: false }] },
  { id: 17, title: "Kemitraan untuk Tujuan", color: "#19486A", relevantModules: ["ESG Reporting", "Audit Trail"], indicators: [{ text: "Laporan keberlanjutan terverifikasi pihak ketiga", achieved: false }, { text: "Kemitraan dengan lembaga lingkungan ≥ 1", achieved: false }] },
]

const STORAGE_KEY = "enspr_sdgs_progress"

export default function SDGsPage() {
  const [sdgs, setSdgs] = useState<SDGItem[]>(ALL_SDGS)
  const [activeSDG, setActiveSDG] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)

  // Load progress from localStorage if saved by user
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Record<number, boolean[]>
          setSdgs(prev => prev.map(s => {
            const savedInds = parsed[s.id]
            if (!savedInds) return s
            return {
              ...s,
              indicators: s.indicators.map((ind, i) => ({ ...ind, achieved: Boolean(savedInds[i]) }))
            }
          }))
        } catch {
          // ignore error
        }
      }
    }
  }, [])

  const toggleIndicator = (sdgId: number, idx: number) => {
    setSdgs(prev => prev.map(s => s.id === sdgId ? {
      ...s,
      indicators: s.indicators.map((ind, i) => i === idx ? { ...ind, achieved: !ind.achieved } : ind)
    } : s))
    setSaved(false)
  }

  const handleSave = () => {
    if (typeof window !== "undefined") {
      const stateToSave: Record<number, boolean[]> = {}
      sdgs.forEach(s => {
        stateToSave[s.id] = s.indicators.map(i => i.achieved)
      })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const achieved = sdgs.reduce((s, g) => s + g.indicators.filter(i => i.achieved).length, 0)
  const total = sdgs.reduce((s, g) => s + g.indicators.length, 0)
  const sdgsWithAny = sdgs.filter(g => g.indicators.some(i => i.achieved)).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" className="text-[10px]">Modul 12</Badge>
            <Badge variant="neutral" className="text-[10px] font-bold">UN SDGs · TPB Nasional</Badge>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">SDGs Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Kontribusi perusahaan terhadap 17 Tujuan Pembangunan Berkelanjutan (SDGs) — dipetakan dari data lintas modul.
          </p>
        </div>
        <Button onClick={handleSave}>
          {saved ? <><CheckCircle2 className="mr-2 h-4 w-4" />Tersimpan</> : "Simpan Progress"}
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">SDGs Berkontribusi</CardTitle>
            <p className="text-3xl font-black text-emerald-700 mt-1">{sdgsWithAny}<span className="text-base font-normal text-neutral-400"> / 17</span></p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Indikator Tercapai</CardTitle>
            <p className="text-3xl font-black text-emerald-700 mt-1">{achieved}<span className="text-base font-normal text-neutral-400"> / {total}</span></p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Coverage Score</CardTitle>
            <p className="text-3xl font-black text-emerald-700 mt-1">{total > 0 ? Math.round(achieved / total * 100) : 0}<span className="text-base font-normal text-neutral-400">%</span></p>
          </CardHeader>
        </Card>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
        <p className="text-xs text-blue-700">
          Klik SDG card untuk melihat dan mengupdate indikator kontribusi. Data ini diselaraskan dengan pelaporan TPB (Tujuan Pembangunan Berkelanjutan) nasional dan GRI Standards.
        </p>
      </div>

      {/* SDG Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sdgs.map(g => {
          const achievedCount = g.indicators.filter(i => i.achieved).length
          const isActive = activeSDG === g.id
          return (
            <div key={g.id}>
              <button
                onClick={() => setActiveSDG(isActive ? null : g.id)}
                style={{ borderColor: achievedCount > 0 ? g.color : undefined }}
                className={`w-full rounded-xl border p-4 text-left transition-all hover:shadow-md ${achievedCount > 0 ? "shadow-sm" : "border-neutral-200"} ${isActive ? "ring-2 ring-offset-1" : ""}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <Globe2 className="h-5 w-5" style={{ color: g.color }} />
                  <span style={{ backgroundColor: g.color + "20", color: g.color }} className="rounded-md px-2 py-0.5 text-[10px] font-bold">
                    SDG {g.id}
                  </span>
                </div>
                <p className="text-sm font-semibold text-neutral-800 mb-1">{g.title}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-neutral-100">
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${(achievedCount / g.indicators.length) * 100}%`, backgroundColor: g.color }} />
                  </div>
                  <span className="text-[10px] font-medium text-neutral-500">{achievedCount}/{g.indicators.length}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {g.relevantModules.slice(0, 2).map(m => (
                    <span key={m} className="rounded bg-neutral-100 px-1.5 py-0.5 text-[9px] text-neutral-500">{m}</span>
                  ))}
                </div>
              </button>

              {isActive && (
                <div className="mt-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
                  <p className="text-xs font-semibold text-neutral-700 mb-2 flex items-center gap-1">
                    <Target className="h-3.5 w-3.5" /> Indikator SDG {g.id}
                  </p>
                  {g.indicators.map((ind, idx) => (
                    <label key={idx} className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${ind.achieved ? "border-emerald-200 bg-emerald-50" : "border-neutral-200 hover:bg-white"}`}>
                      <input type="checkbox" checked={ind.achieved} onChange={() => toggleIndicator(g.id, idx)} className="mt-0.5 h-4 w-4 accent-emerald-600" />
                      <span className={`text-xs ${ind.achieved ? "font-medium text-emerald-900" : "text-neutral-700"}`}>{ind.text}</span>
                      {ind.achieved && <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-emerald-600" />}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
