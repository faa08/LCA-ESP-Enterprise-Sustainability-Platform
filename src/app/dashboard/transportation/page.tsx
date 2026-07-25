"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, Plus, Trash2, CheckCircle2, Info } from "lucide-react"

interface TransportEntry {
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
const DIRECTIONS: { value: TransportEntry["direction"]; label: string; scope: string; color: string }[] = [
  { value: "upstream", label: "Hulu (Upstream)", scope: "Scope 3 Cat. 4 — Transportasi Supplier", color: "bg-blue-100 text-blue-700" },
  { value: "downstream", label: "Hilir (Downstream)", scope: "Scope 3 Cat. 9 — Transportasi Distribusi", color: "bg-orange-100 text-orange-700" },
  { value: "internal", label: "Internal", scope: "Scope 1 — Armada Perusahaan Sendiri", color: "bg-emerald-100 text-emerald-700" },
]

const EF_MAP: Record<string, number> = {
  "Truk Darat": 0.062, "Kereta Api": 0.028, "Kapal Laut": 0.011,
  "Pesawat Udara": 0.602, "Motor / Kendaraan Ringan": 0.089, "Pipa": 0.005,
}

function genId() { return Math.random().toString(36).slice(2, 9) }
const emptyEntry = (): TransportEntry => ({
  id: genId(), mode: "Truk Darat", vehicleType: "", fuelType: "Solar (B30)",
  distanceKm: "", frequencyPerYear: "", cargoTon: "", direction: "upstream",
})

export default function TransportationPage() {
  const [entries, setEntries] = useState<TransportEntry[]>([emptyEntry()])
  const [saved, setSaved] = useState(false)

  const add = () => setEntries(prev => [...prev, emptyEntry()])
  const remove = (id: string) => setEntries(prev => prev.filter(e => e.id !== id))
  const update = (id: string, field: keyof Omit<TransportEntry, "id">, value: string) =>
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))

  const calcEmission = (e: TransportEntry): number => {
    const ef = EF_MAP[e.mode] ?? 0.062
    const d = parseFloat(e.distanceKm) || 0
    const f = parseFloat(e.frequencyPerYear) || 0
    const c = parseFloat(e.cargoTon) || 0
    return ef * d * f * c / 1000
  }

  const totalByScope = DIRECTIONS.map(dir => ({
    ...dir,
    total: entries.filter(e => e.direction === dir.value).reduce((s, e) => s + calcEmission(e), 0),
    count: entries.filter(e => e.direction === dir.value).length,
  }))

  const grandTotal = entries.reduce((s, e) => s + calcEmission(e), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" className="text-[10px]">Modul 5</Badge>
            <Badge variant="neutral" className="text-[10px] font-bold">GHG Protocol Scope 3 Cat. 4 & 9</Badge>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Transportation Assessment</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Emisi dari aktivitas distribusi dan mobilitas terkait rantai pasok (upstream & downstream).
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={add}><Plus className="mr-1.5 h-4 w-4" />Tambah Rute</Button>
          <Button onClick={() => setSaved(true)}>
            {saved ? <><CheckCircle2 className="mr-2 h-4 w-4" />Tersimpan</> : "Simpan Data"}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {totalByScope.map(s => (
          <Card key={s.value}>
            <CardHeader>
              <span className={`inline-flex w-fit rounded-md px-2 py-0.5 text-[10px] font-bold mb-2 ${s.color}`}>{s.scope}</span>
              <CardTitle className="text-sm">{s.label}</CardTitle>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{s.total.toFixed(2)} <span className="text-sm font-normal text-neutral-400">tCO₂e/thn</span></p>
              <p className="text-xs text-neutral-400">{s.count} rute terdaftar</p>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <div className="text-xs text-amber-700">
          <b>Faktor emisi</b> menggunakan referensi IPCC 2006 & KLHK untuk moda transportasi domestik Indonesia.
          Emisi dihitung sebagai: Faktor Emisi × Jarak × Frekuensi × Muatan / 1000 (tCO₂e/tahun).
        </div>
      </div>

      {/* Entry Forms */}
      <div className="space-y-4">
        {entries.map((e, idx) => (
          <Card key={e.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-neutral-500" />
                  <CardTitle className="text-sm">Rute #{idx + 1}</CardTitle>
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${DIRECTIONS.find(d => d.value === e.direction)?.color}`}>
                    {DIRECTIONS.find(d => d.value === e.direction)?.scope}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-emerald-700">{calcEmission(e).toFixed(3)} tCO₂e/thn</span>
                  {entries.length > 1 && (
                    <button onClick={() => remove(e.id)} className="text-neutral-300 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </CardHeader>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Arah Transportasi</label>
                <select value={e.direction} onChange={ev => update(e.id, "direction", ev.target.value as TransportEntry["direction"])}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm bg-white focus:border-emerald-400 focus:outline-none">
                  {DIRECTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Moda Transportasi</label>
                <select value={e.mode} onChange={ev => update(e.id, "mode", ev.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm bg-white focus:border-emerald-400 focus:outline-none">
                  {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Jenis Bahan Bakar</label>
                <select value={e.fuelType} onChange={ev => update(e.id, "fuelType", ev.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm bg-white focus:border-emerald-400 focus:outline-none">
                  {FUELS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Jarak Rata-rata (km)</label>
                <input type="number" value={e.distanceKm} onChange={ev => update(e.id, "distanceKm", ev.target.value)}
                  placeholder="0" className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Frekuensi (trip/tahun)</label>
                <input type="number" value={e.frequencyPerYear} onChange={ev => update(e.id, "frequencyPerYear", ev.target.value)}
                  placeholder="0" className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Muatan (ton/trip)</label>
                <input type="number" value={e.cargoTon} onChange={ev => update(e.id, "cargoTon", ev.target.value)}
                  placeholder="0" className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {entries.some(e => calcEmission(e) > 0) && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-emerald-900">Total Emisi Transportasi</p>
            <p className="text-xs text-emerald-700 mt-0.5">Akan dimasukkan ke laporan Carbon Accounting (Scope 3) & Modul LCIA</p>
          </div>
          <p className="text-2xl font-bold text-emerald-800">{grandTotal.toFixed(2)} <span className="text-sm font-normal">tCO₂e/thn</span></p>
        </div>
      )}
    </div>
  )
}
