"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Truck, Info, Loader2, ArrowRight, Database,
  TrendingUp, AlertCircle,
} from "lucide-react"
import { useIndustryId } from "@/lib/use-industry-id"
import { useSiteId } from "@/lib/use-site-id"
import { getHubEntries, type TransportEntry as SbTransportEntry } from "@/lib/supabase/data-service"
import { useBoundary, isScopeActive, getBoundaryLabel } from "@/lib/boundary-context"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts"

// ─── Constants ───

const DIRECTIONS: {
  value: "upstream" | "downstream" | "internal"
  label: string
  badge: string
  scope: string
  badgeStyle: string
  color: string
}[] = [
  { value: "upstream",   label: "Hulu (Upstream)",   badge: "Scope 3 Cat. 4", scope: "Transportasi Supplier (Hulu)",       badgeStyle: "bg-blue-50 text-blue-700 border-blue-200",   color: "#3b82f6" },
  { value: "downstream", label: "Hilir (Downstream)", badge: "Scope 3 Cat. 9", scope: "Transportasi Distribusi (Hilir)",    badgeStyle: "bg-amber-50 text-amber-700 border-amber-200", color: "#f59e0b" },
  { value: "internal",   label: "Internal",           badge: "Scope 1",        scope: "Armada Perusahaan Sendiri",          badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200", color: "#10b981" },
]

const EF_MAP: Record<string, number> = {
  "Truk Darat": 0.062, "Kereta Api": 0.028, "Kapal Laut": 0.011,
  "Pesawat Udara": 0.602, "Motor / Kendaraan Ringan": 0.089, "Pipa": 0.005,
}

function calcEmission(e: SbTransportEntry): number {
  const ef = EF_MAP[e.vehicleType] ?? 0.062
  return (ef * (e.distance || 0) * (e.frequencyPerYear || 1) * (e.cargoWeight || 0)) / 1000
}

// ─── Page ───

export default function TransportationPage() {
  const industryId = useIndustryId()
  const siteId = useSiteId()
  const { boundary } = useBoundary()

  const [entries, setEntries] = useState<SbTransportEntry[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!siteId) return
    setLoading(true)
    const data = await getHubEntries<SbTransportEntry>("transport", siteId, industryId)
    setEntries(data)
    setLoading(false)
  }, [siteId, industryId])

  useEffect(() => { refresh() }, [refresh])

  // ── Derived stats ──
  const totalByScope = DIRECTIONS.map((dir) => ({
    ...dir,
    total: entries
      .filter((e) => (e.direction ?? "upstream") === dir.value)
      .reduce((s, e) => s + calcEmission(e), 0),
    count: entries.filter((e) => (e.direction ?? "upstream") === dir.value).length,
  }))

  const grandTotal = entries.reduce((s, e) => s + calcEmission(e), 0)

  // ── Chart data ──
  const barData = totalByScope.map((d) => ({
    name: d.label.split(" ")[0],
    emisi: +d.total.toFixed(3),
    fill: d.color,
  }))

  const pieData = totalByScope
    .filter((d) => d.total > 0)
    .map((d) => ({ name: d.badge, value: +d.total.toFixed(3), fill: d.color }))

  const scope3Active = isScopeActive(boundary, "scope3")

  return (
    <div className="space-y-6">

      {/* Boundary Warning */}
      {!scope3Active && (
        <div className="flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs text-orange-900">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
          <div>
            <p className="font-bold">Batas Sistem Aktif: {getBoundaryLabel(boundary)}</p>
            <p className="mt-0.5 text-orange-700">
              Scope 3 (Transportasi Rantai Pasok Hulu &amp; Hilir) berada di luar batas sistem saat ini.
              Data di bawah tetap tersimpan namun <b>tidak dihitung</b> dalam total emisi karbon dan laporan LCA.
            </p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" className="text-[10px]">Modul 5</Badge>
            <Badge variant="neutral" className="text-[10px] font-bold">GHG Protocol Scope 3 Cat. 4 &amp; 9</Badge>
            <Badge variant="neutral" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">Read-Only Analytics</Badge>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Transportation Assessment</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Analisis emisi transportasi rantai nilai berdasarkan data yang diinput di Data Hub.
          </p>
        </div>
        <Link href="/dashboard/data-hub">
          <Button variant="secondary" className="gap-2">
            <Database className="h-4 w-4" />
            Input Data di Data Hub
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Single Source of Truth Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
        <div className="text-xs text-blue-800 leading-relaxed">
          <b>Single Source of Truth:</b> Semua input data transportasi dilakukan di <Link href="/dashboard/data-hub" className="underline font-semibold">Data Hub → Tab Transportasi</Link>.
          Halaman ini menampilkan analitik dan ringkasan emisi secara otomatis dari data tersebut.
          Faktor emisi mengacu pada standar <b>IPCC 2006 &amp; KLHK</b> untuk moda transportasi domestik Indonesia.
        </div>
      </div>

      {/* Summary KPI Cards */}
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
                {s.total > 0 ? s.total.toFixed(2) : "—"}
                {s.total > 0 && <span className="text-xs font-normal text-neutral-500"> tCO₂e/thn</span>}
              </p>
            </div>
            <p className="mt-2 text-[11px] text-neutral-400 truncate" title={s.scope}>{s.scope}</p>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 py-14 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-neutral-300 mb-2" />
          <p className="text-sm text-neutral-400">Memuat data transportasi dari Data Hub...</p>
        </div>
      ) : entries.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50 py-16 text-center">
          <Truck className="h-10 w-10 text-neutral-300 mb-3" />
          <p className="text-sm font-semibold text-neutral-600">Belum Ada Data Transportasi</p>
          <p className="mt-1 text-xs text-neutral-400 max-w-sm">
            Tambahkan data rute transportasi melalui Data Hub untuk melihat analisis emisi Scope 3.
          </p>
          <Link href="/dashboard/data-hub" className="mt-4">
            <Button className="gap-2" size="sm">
              <Database className="h-4 w-4" />
              Buka Data Hub
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Charts Row */}
          {grandTotal > 0 && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Bar Chart */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-neutral-500" />
                  <h3 className="text-sm font-bold text-neutral-800">Emisi per Kategori (tCO₂e/thn)</h3>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData} margin={{ top: 0, right: 8, left: -16, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(v: number) => [`${v.toFixed(3)} tCO₂e/thn`, "Emisi"]}
                      contentStyle={{ fontSize: 11, borderRadius: 8 }}
                    />
                    <Bar dataKey="emisi" radius={[4, 4, 0, 0]}>
                      {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Pie Chart */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="h-4 w-4 text-neutral-500" />
                  <h3 className="text-sm font-bold text-neutral-800">Komposisi Emisi per Scope</h3>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v.toFixed(3)} tCO₂e/thn`]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {/* Per-Route Table */}
          <Card className="overflow-hidden">
            <div className="border-b border-neutral-200 px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-800">Detail Rute ({entries.length} entri)</h3>
              <Link href="/dashboard/data-hub">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <Database className="h-3.5 w-3.5" /> Kelola di Data Hub
                </Button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="border-b border-neutral-100 bg-neutral-50">
                  <tr>
                    {["#", "Moda / Kendaraan", "Bahan Bakar", "Arah", "Jarak (km)", "Muatan (ton)", "Frekuensi/thn", "Emisi (tCO₂e/thn)", "Scope"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left font-semibold text-neutral-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {entries.map((e, idx) => {
                    const dir = DIRECTIONS.find((d) => d.value === (e.direction ?? "upstream")) ?? DIRECTIONS[0]
                    const emisi = calcEmission(e)
                    return (
                      <tr key={e.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-4 py-2.5 text-neutral-400 font-mono">{idx + 1}</td>
                        <td className="px-4 py-2.5 font-medium text-neutral-800 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Truck className="h-3.5 w-3.5 text-neutral-400" />
                            {e.vehicleType || "—"}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-neutral-600">{e.fuelType || "—"}</td>
                        <td className="px-4 py-2.5">
                          <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${dir.badgeStyle}`}>{dir.label}</span>
                        </td>
                        <td className="px-4 py-2.5 text-neutral-700 tabular-nums text-right">{(e.distance || 0).toLocaleString("id-ID")}</td>
                        <td className="px-4 py-2.5 text-neutral-700 tabular-nums text-right">{(e.cargoWeight || 0).toLocaleString("id-ID")}</td>
                        <td className="px-4 py-2.5 text-neutral-700 tabular-nums text-right">{(e.frequencyPerYear || 1).toLocaleString("id-ID")}</td>
                        <td className="px-4 py-2.5 font-bold text-right">
                          <span className={emisi > 0 ? "text-emerald-700" : "text-neutral-300"}>
                            {emisi > 0 ? emisi.toFixed(3) : "—"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${dir.badgeStyle}`}>{dir.badge}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Total Banner */}
          {grandTotal > 0 && (
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-4 shadow-2xs">
              <div>
                <p className="text-sm font-bold text-emerald-900">Total Emisi Transportasi (Rantai Nilai)</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  {scope3Active
                    ? "Otomatis terhubung ke kalkulasi Carbon Accounting Scope 1 / Scope 3 & Modul LCIA."
                    : `⚠️ Scope 3 tidak aktif pada batas sistem ${getBoundaryLabel(boundary)} — tidak dihitung dalam total GHG.`}
                </p>
              </div>
              <p className="text-2xl font-black text-emerald-800">
                {grandTotal.toFixed(2)} <span className="text-sm font-normal">tCO₂e/thn</span>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
