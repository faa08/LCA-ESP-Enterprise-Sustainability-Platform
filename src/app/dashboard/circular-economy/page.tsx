"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCcw, CheckCircle2, Info, TrendingUp, Loader2, Trash2, Plus } from "lucide-react"
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts"
import { useIndustryId } from "@/lib/use-industry-id"
import { useSiteId } from "@/lib/use-site-id"
import {
  getCircularFlows, upsertCircularFlow, deleteCircularFlow,
  type CircularFlowRecord,
} from "@/lib/supabase/data-service"
import { ModuleGate } from "@/components/dashboard/module-gate"

interface MaterialFlow {
  id: string
  name: string
  totalKgYear: string
  recycledPct: string
  reusedPct: string
  recoveredPct: string
  landfillPct: string
}

function genId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === "x" ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function calcCI(f: MaterialFlow): number {
  const r = parseFloat(f.recycledPct) || 0
  const u = parseFloat(f.reusedPct) || 0
  const rec = parseFloat(f.recoveredPct) || 0
  return Math.min(100, r * 1.0 + u * 1.2 + rec * 0.5)
}

export default function CircularEconomyPage() {
  const industryId = useIndustryId()
  const siteId = useSiteId()

  const [flows, setFlows] = useState<MaterialFlow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const refresh = useCallback(async () => {
    if (!siteId) return
    setLoading(true)
    const records = await getCircularFlows(siteId, industryId)
    setFlows(
      records.map((r) => ({
        id: r.id,
        name: r.name,
        totalKgYear: String(r.totalKgYear),
        recycledPct: String(r.recycledPct),
        reusedPct: String(r.reusedPct),
        recoveredPct: String(r.recoveredPct),
        landfillPct: String(r.landfillPct),
      }))
    )
    setLoading(false)
  }, [siteId, industryId])

  useEffect(() => { refresh() }, [refresh])

  const update = (id: string, field: keyof Omit<MaterialFlow, "id">, value: string) => {
    setFlows((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)))
    setSaved(false)
  }

  const add = () => {
    setFlows((prev) => [
      ...prev,
      { id: genId(), name: "Material Baru", totalKgYear: "0", recycledPct: "0", reusedPct: "0", recoveredPct: "0", landfillPct: "100" },
    ])
    setSaved(false)
  }

  const remove = async (id: string) => {
    await deleteCircularFlow(id)
    setFlows((prev) => prev.filter((f) => f.id !== id))
  }

  const handleSave = async () => {
    setSaving(true)
    for (const f of flows) {
      await upsertCircularFlow(siteId, industryId, {
        id: f.id,
        name: f.name,
        totalKgYear: parseFloat(f.totalKgYear) || 0,
        recycledPct: parseFloat(f.recycledPct) || 0,
        reusedPct: parseFloat(f.reusedPct) || 0,
        recoveredPct: parseFloat(f.recoveredPct) || 0,
        landfillPct: parseFloat(f.landfillPct) || 0,
      })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const weightedCI = (() => {
    const totalMass = flows.reduce((s, f) => s + (parseFloat(f.totalKgYear) || 0), 0)
    if (totalMass === 0) return 0
    return flows.reduce((s, f) => s + calcCI(f) * (parseFloat(f.totalKgYear) || 0), 0) / totalMass
  })()

  const radarData = flows.map((f) => ({
    name: f.name || "Material",
    "Indeks Sirkularitas": Math.round(calcCI(f)),
  }))

  const ciLevel = weightedCI >= 75 ? { label: "Tinggi", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" }
    : weightedCI >= 40 ? { label: "Menengah", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" }
    : { label: "Rendah", color: "text-red-700", bg: "bg-red-50 border-red-200" }

  return (
    <ModuleGate moduleName="M8 · Circular Economy">
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" className="text-[10px]">Modul 8</Badge>
            <Badge variant="neutral" className="text-[10px] font-bold">Ellen MacArthur Circularity Indicators</Badge>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Circular Economy</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Mengukur seberapa sirkular material yang digunakan — dari daur ulang, penggunaan kembali, hingga pemulihan energi.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" /> : null}
          {saving ? "Menyimpan..." : saved ? "Tersimpan!" : "Simpan Data"}
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className={`rounded-xl border p-5 ${ciLevel.bg}`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Indeks Sirkularitas Tertimbang</p>
          <p className={`text-4xl font-black mt-1 ${ciLevel.color}`}>{weightedCI.toFixed(1)}<span className="text-lg font-normal">/100</span></p>
          <p className={`text-sm font-semibold mt-1 ${ciLevel.color}`}>Sirkularitas {ciLevel.label}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Material Terkelola</CardTitle>
            <p className="text-2xl font-bold text-neutral-900 mt-1">
              {(flows.reduce((s, f) => s + (parseFloat(f.totalKgYear) || 0), 0) / 1000).toFixed(1)} ton/thn
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Aliran Material</CardTitle>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{flows.length} jenis material</p>
          </CardHeader>
        </Card>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 py-14 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-300 mb-3" />
          <p className="text-sm text-neutral-400">Memuat data...</p>
        </div>
      ) : flows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 py-14 text-center">
          <RefreshCcw className="h-10 w-10 text-neutral-200 mb-3" />
          <p className="text-sm font-medium text-neutral-500">Belum ada data aliran material</p>
          <p className="text-xs text-neutral-400 mt-1">Tambahkan material pertama melalui tombol <b>+ Tambah Material</b> di bawah.</p>
        </div>
      ) : null}

      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
        <p className="text-xs text-blue-700">
          <b>Indeks Sirkularitas (CI)</b> dihitung berdasarkan bobot: Daur Ulang (1.0×) + Penggunaan Kembali (1.2×) + Pemulihan Energi (0.5×).
          Target ideal: CI ≥ 75 (Sirkularitas Tinggi).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar Chart */}
        <Card>
          <CardHeader><CardTitle>Profil Sirkularitas per Material</CardTitle></CardHeader>
          {flows.some(f => f.name) ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <Radar name="CI" dataKey="Indeks Sirkularitas" stroke="#059669" fill="#059669" fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center text-sm text-neutral-400">Isi data material untuk melihat grafik</div>
          )}
        </Card>

        {/* Material List */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle>Aliran Material</CardTitle>
              <Button variant="secondary" size="sm" onClick={add}>+ Tambah Material</Button>
            </div>
          </CardHeader>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {flows.map((f) => (
              <div key={f.id} className="rounded-lg border border-neutral-100 p-3">
                <div className="flex items-center justify-between mb-2">
                  <input type="text" value={f.name} onChange={e => update(f.id, "name", e.target.value)}
                    placeholder="Nama material"
                    className="flex-1 rounded border border-neutral-200 px-2 py-1 text-sm font-medium focus:border-emerald-400 focus:outline-none" />
                  <div className="ml-2 flex items-center gap-2">
                    <span className={`text-sm font-bold ${calcCI(f) >= 75 ? "text-emerald-700" : calcCI(f) >= 40 ? "text-amber-600" : "text-red-600"}`}>
                      CI: {calcCI(f).toFixed(0)}
                    </span>
                    <button onClick={() => remove(f.id)} className="text-neutral-300 hover:text-red-500 p-1"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { field: "totalKgYear", label: "Total (kg/thn)" },
                    { field: "recycledPct", label: "% Daur Ulang" },
                    { field: "reusedPct", label: "% Digunakan Ulang" },
                    { field: "recoveredPct", label: "% Pemulihan Energi" },
                  ].map(({ field, label }) => (
                    <div key={field}>
                      <label className="text-neutral-500 font-medium">{label}</label>
                      <input type="number" value={(f as unknown as Record<string, string>)[field]}
                        onChange={e => update(f.id, field as keyof Omit<MaterialFlow, "id">, e.target.value)}
                        className="w-full mt-0.5 rounded border border-neutral-200 px-2 py-1 focus:border-emerald-400 focus:outline-none" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {weightedCI > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-emerald-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Rekomendasi Peningkatan
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">
              {weightedCI < 75 ? `Tingkatkan persentase daur ulang dan penggunaan kembali untuk mencapai CI ≥ 75. Gap saat ini: ${(75 - weightedCI).toFixed(1)} poin.` : "Sirkularitas material sudah baik. Pertahankan dan dokumentasikan untuk laporan ESG."}
            </p>
          </div>
          <Badge variant={weightedCI >= 75 ? "success" : "warning"}>{ciLevel.label}</Badge>
        </div>
      )}
    </div>
    </ModuleGate>
  )
}
