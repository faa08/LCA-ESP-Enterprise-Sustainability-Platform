"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe2, CheckCircle2, Info, Target, Loader2, AlertCircle } from "lucide-react"
import { useIndustryId } from "@/lib/use-industry-id"
import { useSiteId } from "@/lib/use-site-id"
import {
  getSDGProgress, saveSDGProgress,
} from "@/lib/supabase/data-service"

interface SDGTemplate {
  id: number
  title: string
  color: string
  relevantModules: string[]
  indicatorTexts: string[]
}

const ALL_SDGS: SDGTemplate[] = [
  { id: 3, title: "Kehidupan Sehat & Sejahtera", color: "#4C9F38", relevantModules: ["Waste", "Air Limbah"], indicatorTexts: ["Penurunan limbah B3 berbahaya ≥ 10% YoY", "Baku mutu air limbah terpenuhi 100%"] },
  { id: 6, title: "Air Bersih & Sanitasi", color: "#26BDE2", relevantModules: ["Water Monitoring", "Waste Assessment"], indicatorTexts: ["Efisiensi penggunaan air ≥ 5% per tahun", "Zero discharge limbah cair tanpa pengolahan"] },
  { id: 7, title: "Energi Bersih & Terjangkau", color: "#FCC30B", relevantModules: ["Energy Assessment", "Carbon Accounting"], indicatorTexts: ["Bauran energi terbarukan ≥ 10%", "Intensitas energi turun ≥ 3% per tahun"] },
  { id: 8, title: "Pekerjaan Layak & Pertumbuhan", color: "#A21942", relevantModules: ["ESG Dashboard", "Company Profile"], indicatorTexts: ["Tingkat kecelakaan kerja (LTIFR) < 0.5", "Pelatihan K3 ≥ 20 jam/karyawan/tahun"] },
  { id: 9, title: "Industri, Inovasi & Infrastruktur", color: "#FD6925", relevantModules: ["LCA", "Circular Economy"], indicatorTexts: ["Investasi R&D lingkungan ≥ 1% pendapatan", "Sertifikasi ISO 14001 aktif"] },
  { id: 11, title: "Kota & Komunitas Berkelanjutan", color: "#FD9D24", relevantModules: ["Transportation", "ESG Dashboard"], indicatorTexts: ["Program CSR lingkungan di komunitas sekitar", "Emisi kendaraan dinas sesuai standar Euro 4"] },
  { id: 12, title: "Konsumsi & Produksi Bertanggung Jawab", color: "#BF8B2E", relevantModules: ["Circular Economy", "Waste Assessment", "Product Assessment"], indicatorTexts: ["Limbah produksi ke TPA ≤ 20% total limbah", "Produk dengan eco-label ≥ 1 sertifikasi"] },
  { id: 13, title: "Penanganan Perubahan Iklim", color: "#3F7E44", relevantModules: ["Carbon Accounting", "LCA", "Goal & Scope"], indicatorTexts: ["Target reduksi emisi GRK ≥ 30% di 2030", "Laporan iklim sesuai TCFD / ISSB IFRS S2"] },
  { id: 14, title: "Ekosistem Lautan", color: "#0A97D9", relevantModules: ["Waste Assessment", "Transportation"], indicatorTexts: ["Zero plastic waste ke badan air terbuka", "Program adopsi/rehabilitasi ekosistem pesisir"] },
  { id: 15, title: "Ekosistem Daratan", color: "#56C02B", relevantModules: ["LCA", "Circular Economy"], indicatorTexts: ["Zero deforestasi dalam rantai pasok", "Program revegetasi ≥ 1 Ha/tahun"] },
  { id: 16, title: "Perdamaian, Keadilan & Institusi", color: "#00689D", relevantModules: ["Audit Trail", "Compliance"], indicatorTexts: ["Zero kasus korupsi / suap lingkungan", "Mekanisme pengaduan lingkungan tersedia"] },
  { id: 17, title: "Kemitraan untuk Tujuan", color: "#19486A", relevantModules: ["ESG Reporting", "Audit Trail"], indicatorTexts: ["Laporan keberlanjutan terverifikasi pihak ketiga", "Kemitraan dengan lembaga lingkungan ≥ 1"] },
]

interface SDGItem {
  id: number
  title: string
  color: string
  relevantModules: string[]
  indicators: { text: string; achieved: boolean }[]
}

function buildSDGs(progressMap: Record<number, boolean[]>): SDGItem[] {
  return ALL_SDGS.map(s => ({
    id: s.id,
    title: s.title,
    color: s.color,
    relevantModules: s.relevantModules,
    indicators: s.indicatorTexts.map((text, i) => ({
      text,
      achieved: progressMap[s.id]?.[i] ?? false,
    })),
  }))
}

export default function SDGsPage() {
  const industryId = useIndustryId()
  const siteId = useSiteId()

  const [sdgs, setSdgs] = useState<SDGItem[]>(buildSDGs({}))
  const [activeSDG, setActiveSDG] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!siteId) return
    setLoading(true)
    const progressMap = await getSDGProgress(siteId, industryId)
    setSdgs(buildSDGs(progressMap))
    setLoading(false)
  }, [siteId, industryId])

  useEffect(() => { refresh() }, [refresh])

  const toggleIndicator = (sdgId: number, idx: number) => {
    setSdgs(prev => prev.map(s => s.id === sdgId ? {
      ...s,
      indicators: s.indicators.map((ind, i) => i === idx ? { ...ind, achieved: !ind.achieved } : ind),
    } : s))
    setSaved(false)
  }

  const handleSave = async () => {
    if (!siteId) return
    setSaving(true)
    setError(null)
    const progress = sdgs.map(s => ({
      sdgId: s.id,
      indicatorStates: s.indicators.map(i => i.achieved),
    }))
    const result = await saveSDGProgress(siteId, industryId, progress)
    if (result.error) {
      setError(result.error)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
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
            Kontribusi perusahaan terhadap 17 Tujuan Pembangunan Berkelanjutan (SDGs) — dipetakan dari data lintas modul. Progress tersimpan di database.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving || loading}>
          {saving
            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</>
            : saved
              ? <><CheckCircle2 className="mr-2 h-4 w-4" />Tersimpan</>
              : "Simpan Progress"}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Gagal menyimpan: {error}. Pastikan tabel <code>sdg_progress</code> sudah dibuat di Supabase.</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-sm text-neutral-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Memuat progress SDGs dari database...
        </div>
      ) : (
        <>
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
              Klik SDG card untuk melihat dan mengupdate indikator kontribusi. Data ini diselaraskan dengan pelaporan TPB (Tujuan Pembangunan Berkelanjutan) nasional dan GRI Standards. Progress disimpan secara permanen di database.
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
        </>
      )}
    </div>
  )
}
