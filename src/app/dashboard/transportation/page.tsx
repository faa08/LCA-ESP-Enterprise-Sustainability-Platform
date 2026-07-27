"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, Plus, Trash2, CheckCircle2, Info, Loader2 } from "lucide-react"
import { useIndustryId } from "@/lib/use-industry-id"
import { useSiteId } from "@/lib/use-site-id"
import { getHubEntries, saveHubEntry, deleteHubEntry, type TransportEntry as SbTransportEntry } from "@/lib/supabase/data-service"

interface LocalTransportEntry {
  id: string
  mode: string
  vehicleType: string
  fuelType: string
  distanceKm: string
  frequencyPerYear: string
  cargoTon: string
  direction: "upstream" | "downstream" | "internal"
}

const MODES = ["Truk Darat", "Kereta Api", "Kapal Laut", "Pesawat Udara", "Motor / Kendaraan Ringan", "Pipa"]
const FUELS = ["Solar (B30)", "Solar (B35)", "Bensin", "CNG", "LNG", "Listrik", "Bunker Fuel (HFO)"]
const DIRECTIONS: { value: LocalTransportEntry["direction"]; label: string; badge: string; scope: string; badgeStyle: string }[] = [
  { value: "upstream", label: "Hulu (Upstream)", badge: "Scope 3 Cat. 4", scope: "Transportasi Supplier (Hulu)", badgeStyle: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "downstream", label: "Hilir (Downstream)", badge: "Scope 3 Cat. 9", scope: "Transportasi Distribusi (Hilir)", badgeStyle: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "internal", label: "Internal", badge: "Scope 1", scope: "Armada Perusahaan Sendiri", badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200" },
]

const EF_MAP: Record<string, number> = {
  "Truk Darat": 0.062, "Kereta Api": 0.028, "Kapal Laut": 0.011,
  "Pesawat Udara": 0.602, "Motor / Kendaraan Ringan": 0.089, "Pipa": 0.005,
}

function genId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === "x" ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const emptyEntry = (): LocalTransportEntry => ({
  id: genId(), mode: "Truk Darat", vehicleType: "Truck", fuelType: "Solar (B30)",
  distanceKm: "", frequencyPerYear: "1", cargoTon: "", direction: "upstream",
})

export default function TransportationPage() {
  const industryId = useIndustryId()
  const siteId = useSiteId()

  const [entries, setEntries] = useState<LocalTransportEntry[]>([emptyEntry()])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const refresh = useCallback(async () => {
    if (!siteId) return
    setLoading(true)
    const sbData = await getHubEntries<SbTransportEntry>("transport", siteId, industryId)
    if (sbData.length > 0) {
      setEntries(
        sbData.map((e) => ({
          id: e.id,
          mode: e.vehicleType || "Truk Darat",
          vehicleType: e.vehicleType,
          fuelType: e.fuelType || "Solar (B30)",
          distanceKm: String(e.distance || ""),
          frequencyPerYear: "1",
          cargoTon: String(e.cargoWeight || ""),
          direction: "upstream",
        }))
      )
    } else {
      setEntries([emptyEntry()])
    }
    setLoading(false)
  }, [siteId, industryId])

  useEffect(() => { refresh() }, [refresh])

  const add = () => {
    setEntries((prev) => [...prev, emptyEntry()])
    setSaved(false)
  }

  const remove = async (id: string) => {
    await deleteHubEntry("transport", id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const update = (id: string, field: keyof Omit<LocalTransportEntry, "id">, value: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
    setSaved(false)
  }

  const calcEmission = (e: LocalTransportEntry): number => {
    const ef = EF_MAP[e.mode] ?? 0.062
    const d = parseFloat(e.distanceKm) || 0
    const f = parseFloat(e.frequencyPerYear) || 0
    const c = parseFloat(e.cargoTon) || 0
    return (ef * d * f * c) / 1000
  }

  const handleSave = async () => {
    setSaving(true)
    for (const e of entries) {
      const payload: SbTransportEntry = {
        id: e.id,
        date: new Date().toISOString().substring(0, 10),
        vehicleType: e.mode,
        fuelType: e.fuelType,
        distance: parseFloat(e.distanceKm) || 0,
        cargoWeight: parseFloat(e.cargoTon) || 0,
        direction: e.direction ?? "upstream",
        frequencyPerYear: parseFloat(e.frequencyPerYear) || 1,
      }
      await saveHubEntry("transport", siteId, industryId, payload)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const totalByScope = DIRECTIONS.map((dir) => ({
    ...dir,
    total: entries.filter((e) => e.direction === dir.value).reduce((s, e) => s + calcEmission(e), 0),
    count: entries.filter((e) => e.direction === dir.value).length,
  }))

  const grandTotal = entries.reduce((s, e) => s + calcEmission(e), 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" className="text-[10px]">Modul 5</Badge>
            <Badge variant="neutral" className="text-[10px] font-bold">GHG Protocol Scope 3 Cat. 4 &amp; 9</Badge>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Transportation Assessment</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Inventarisasi emisi dari aktivitas logistik dan distribusi rantai pasok (upstream &amp; downstream).
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={add}>
            <Plus className="mr-1.5 h-4 w-4" /> Tambah Rute
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" /> : null}
            {saving ? "Menyimpan..." : saved ? "Tersimpan!" : "Simpan Data"}
          </Button>
        </div>
      </div>

      {/* Structured Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {totalByScope.map((s) => (
          <div key={s.value} className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className={`rounded-md border px-2.5 py-1 text-[11px] font-bold ${s.badgeStyle}`}>
                {s.badge}
              </span>
              <span className="text-xs text-neutral-400 font-medium">{s.count} rute</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{s.label}</p>
              <p className="mt-1.5 text-2xl font-extrabold tracking-tight text-neutral-900">
                {s.total.toFixed(2)}{" "}
                <span className="text-xs font-normal text-neutral-500">tCO₂e/thn</span>
              </p>
            </div>
            <p className="mt-2 text-[11px] text-neutral-400 truncate" title={s.scope}>
              {s.scope}
            </p>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
        <div className="text-xs text-blue-800 leading-relaxed">
          <b>Faktor emisi:</b> Mengacu pada standar IPCC 2006 &amp; KLHK untuk moda transportasi domestik Indonesia.
          Emisi dihitung otomatis sebagai: <code className="font-mono bg-blue-100/70 px-1 py-0.5 rounded text-blue-900">Faktor Emisi × Jarak (km) × Frekuensi × Muatan (ton) / 1000</code>.
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 py-12 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-neutral-300 mb-2" />
          <p className="text-sm text-neutral-400">Memuat rute transportasi...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((e, idx) => (
            <Card key={e.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">Rute #{idx + 1}</h3>
                    <p className="text-xs text-neutral-500">
                      {DIRECTIONS.find((d) => d.value === e.direction)?.scope}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    {calcEmission(e).toFixed(3)} tCO₂e/thn
                  </span>
                  {entries.length > 1 && (
                    <button
                      onClick={() => remove(e.id)}
                      className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                      title="Hapus Rute"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Arah Transportasi</label>
                  <select
                    value={e.direction}
                    onChange={(ev) => update(e.id, "direction", ev.target.value as LocalTransportEntry["direction"])}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm bg-white text-neutral-900 focus:border-emerald-400 focus:outline-none"
                  >
                    {DIRECTIONS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label} ({d.badge})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Moda Transportasi</label>
                  <select
                    value={e.mode}
                    onChange={(ev) => update(e.id, "mode", ev.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm bg-white text-neutral-900 focus:border-emerald-400 focus:outline-none"
                  >
                    {MODES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Jenis Bahan Bakar</label>
                  <select
                    value={e.fuelType}
                    onChange={(ev) => update(e.id, "fuelType", ev.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm bg-white text-neutral-900 focus:border-emerald-400 focus:outline-none"
                  >
                    {FUELS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Jarak Rata-rata (km)</label>
                  <input
                    type="number"
                    value={e.distanceKm}
                    onChange={(ev) => update(e.id, "distanceKm", ev.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Frekuensi (trip/tahun)</label>
                  <input
                    type="number"
                    value={e.frequencyPerYear}
                    onChange={(ev) => update(e.id, "frequencyPerYear", ev.target.value)}
                    placeholder="1"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Muatan (ton/trip)</label>
                  <input
                    type="number"
                    value={e.cargoTon}
                    onChange={(ev) => update(e.id, "cargoTon", ev.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Total Banner */}
      {entries.some((e) => calcEmission(e) > 0) && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-4 shadow-2xs">
          <div>
            <p className="text-sm font-bold text-emerald-900">Total Emisi Transportasi (Rantai Nilai)</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Otomatis terhubung &amp; masuk ke kalkulasi Carbon Accounting Scope 1 / Scope 3 &amp; Modul LCIA.
            </p>
          </div>
          <p className="text-2xl font-black text-emerald-800">
            {grandTotal.toFixed(2)} <span className="text-sm font-normal">tCO₂e/thn</span>
          </p>
        </div>
      )}
    </div>
  )
}
