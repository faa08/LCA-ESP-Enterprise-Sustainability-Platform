"use client"

import { useState, useEffect, useCallback } from "react"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Recycle, AlertTriangle, ShieldCheck, Loader2, Info } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { ProperStrip } from "@/components/layout/proper-strip"
import { useIndustryId } from "@/lib/use-industry-id"
import { useSiteId } from "@/lib/use-site-id"
import { getHubEntries, type B3Entry } from "@/lib/supabase/data-service"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const COLORS = ["#059669", "#d97706", "#0284c7", "#a855f7", "#ef4444", "#64748b"]

function fmt(n: number): string {
  return n.toLocaleString("id-ID", { maximumFractionDigits: 2 })
}

export default function WasteManagement() {
  const locale = getLocaleClient()
  const dict = dicts[locale]
  const industryId = useIndustryId()
  const siteId = useSiteId()

  const [entries, setEntries] = useState<B3Entry[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!siteId) return
    setLoading(true)
    const data = await getHubEntries<B3Entry>("b3", siteId, industryId)
    setEntries(data)
    setLoading(false)
  }, [siteId, industryId])

  useEffect(() => { refresh() }, [refresh])

  const totalQtyKg = entries.reduce((sum, e) => sum + (e.qty || 0), 0)
  const totalQtyTon = totalQtyKg / 1000
  const over90Days = entries.filter((e) => (e.storageDuration || 0) > 90).length
  const noData = entries.length === 0

  // Composition data for PieChart
  const compMap: Record<string, number> = {}
  entries.forEach((e) => {
    const key = e.wasteType || "Lainnya"
    compMap[key] = (compMap[key] || 0) + (e.qty || 0)
  })
  const compData = Object.entries(compMap).map(([name, value]) => ({ name, value }))

  // Monthly trend data
  const monthMap: Record<string, number> = {}
  entries.forEach((e) => {
    const m = e.date ? e.date.substring(0, 7) : "Lainnya"
    monthMap[m] = (monthMap[m] || 0) + (e.qty || 0)
  })
  const trendData = Object.entries(monthMap).map(([month, qty]) => ({ month, total: qty }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">{t(dict, "waste.page_title")}</h1>
        <p className="text-sm text-neutral-500">Pemantauan limbah B3 & non-B3 terintegrasi langsung dengan Data Hub.</p>
      </div>

      <ProperStrip category="limbah_b3" titleKey="proper.limbah_b3" />

      {loading ? (
        <div className="flex items-center justify-center py-12 text-sm text-neutral-400 gap-2">
          <Loader2 className="h-5 w-5 animate-spin" /> Memuat data limbah B3...
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Limbah Terdaftar" value={noData ? "—" : `${fmt(totalQtyKg)} kg`} description={noData ? "Belum ada entri" : `${entries.length} catatan TPS B3`} icon={Trash2} />
            <StatCard title="Total Tonase" value={noData ? "—" : `${fmt(totalQtyTon)} Ton`} description="Terdaftar di Festronik" icon={Recycle} />
            <StatCard title="Peringatan Masa Simpan" value={noData ? "0" : String(over90Days)} description="Melebihi 90 hari izin TPS" icon={AlertTriangle} />
            <StatCard title="Kepatuhan TPS B3" value={noData ? "—" : over90Days === 0 ? "100%" : "Perlu Tindakan"} description="Permen LHK No. 6/2021" icon={ShieldCheck} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tren Kuantitas Limbah B3 per Bulan (kg)</CardTitle>
              </CardHeader>
              {noData ? (
                <div className="flex h-72 items-center justify-center text-sm text-neutral-400">
                  Belum ada data limbah B3 di Data Hub
                </div>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                      <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                      <Bar dataKey="total" fill="#059669" radius={[4, 4, 0, 0]} name="Total Limbah (kg)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Komposisi Limbah B3 berdasarkan Jenis</CardTitle>
              </CardHeader>
              {noData ? (
                <div className="flex h-72 items-center justify-center text-sm text-neutral-400">
                  Belum ada data limbah B3 di Data Hub
                </div>
              ) : (
                <div className="flex h-72 items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={compData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name" label={({ name, percent }: { name?: string; percent?: number }) => `${name || ""} (${((percent || 0) * 100).toFixed(0)}%)`}>
                        {compData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${fmt(Number(value) || 0)} kg`, "Jumlah"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Inventaris Limbah B3 (Data Hub)</CardTitle>
            </CardHeader>
            {noData ? (
              <div className="flex h-48 items-center justify-center text-sm text-neutral-400">
                Belum ada data limbah B3 di Data Hub
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Tanggal</th>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Jenis Limbah B3</th>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Kode</th>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Kuantitas</th>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Masa Simpan</th>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">No. Manifest (Festronik)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Pemusnah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((e) => (
                      <tr key={e.id} className="border-b border-neutral-100">
                        <td className="px-3 py-2.5 font-medium text-neutral-900">{e.date}</td>
                        <td className="px-3 py-2.5 text-neutral-800">{e.wasteType}</td>
                        <td className="px-3 py-2.5 font-mono text-xs text-neutral-600">{e.wasteCode || "—"}</td>
                        <td className="px-3 py-2.5 font-bold text-neutral-900">{fmt(e.qty)} kg</td>
                        <td className="px-3 py-2.5">
                          <Badge variant={e.storageDuration > 90 ? "danger" : "success"}>
                            {e.storageDuration} Hari
                          </Badge>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-xs text-emerald-700">{e.manifestNo || "—"}</td>
                        <td className="px-3 py-2.5 text-neutral-600">{e.disposalCompany || e.recycler || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
