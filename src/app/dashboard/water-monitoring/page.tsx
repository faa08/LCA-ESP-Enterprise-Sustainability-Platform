"use client"

import { useState, useEffect, useCallback } from "react"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Droplets, ArrowDownToLine, ArrowUpFromLine, Recycle, Loader2 } from "lucide-react"
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, AreaChart, Area, LineChart, Line } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { ProperStrip } from "@/components/layout/proper-strip"
import { useIndustryId } from "@/lib/use-industry-id"
import { useSiteId } from "@/lib/use-site-id"
import { getHubEntries, type WaterEntry, type LabEntry } from "@/lib/supabase/data-service"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

function fmt(n: number | null, unit = " m³"): string {
  if (n === null || n === 0 || Number.isNaN(n)) return "—"
  return `${n.toLocaleString("id-ID")}${unit}`
}

export default function WaterMonitoring() {
  const locale = getLocaleClient()
  const dict = dicts[locale]
  const industryId = useIndustryId()
  const siteId = useSiteId()

  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([])
  const [labEntries, setLabEntries] = useState<LabEntry[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!siteId) return
    setLoading(true)
    const wData = await getHubEntries<WaterEntry>("water", siteId, industryId)
    const lData = await getHubEntries<LabEntry>("laboratory", siteId, industryId)
    setWaterEntries(wData)
    setLabEntries(lData)
    setLoading(false)
  }, [siteId, industryId])

  useEffect(() => { refresh() }, [refresh])

  const totalRawWater = waterEntries.reduce((s, e) => s + (e.rawWater || 0), 0)
  const totalGroundwater = waterEntries.reduce((s, e) => s + (e.groundwater || 0), 0)
  const totalProcessWater = waterEntries.reduce((s, e) => s + (e.processWater || 0), 0)
  const totalWastewater = waterEntries.reduce((s, e) => s + (e.wastewater || 0), 0)

  const areaChartData = waterEntries.map((e) => ({
    date: e.date,
    AirBaku: e.rawWater,
    AirTanah: e.groundwater,
    LimbahCair: e.wastewater,
  })).reverse()

  const latestLab = labEntries[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">{t(dict, "water.page_title")}</h1>
        <p className="text-sm text-neutral-500">Pemantauan penggunaan air &amp; kualitas air limbah dari Data Hub.</p>
      </div>

      <ProperStrip category="air_limbah" titleKey="proper.air_limbah" />

      {loading ? (
        <div className="flex items-center justify-center py-12 text-sm text-neutral-400 gap-2">
          <Loader2 className="h-5 w-5 animate-spin" /> Memuat data pemantauan air...
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Air Baku (PDAM/Sungai)" value={fmt(totalRawWater)} description="Pengambilan Air Baku" icon={ArrowDownToLine} />
            <StatCard title="Air Tanah" value={fmt(totalGroundwater)} description="Sumur Dalam / Air Tanah" icon={Droplets} />
            <StatCard title="Air Proses Operasional" value={fmt(totalProcessWater)} description="Konsumsi Unit Proses" icon={Recycle} />
            <StatCard title="Air Limbah Keluar (Outlet)" value={fmt(totalWastewater)} description="Debit Limbah Cair" icon={ArrowUpFromLine} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Grafik Penggunaan &amp; Limbah Air (m³)</CardTitle>
              </CardHeader>
              {areaChartData.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                      <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Area type="monotone" dataKey="AirBaku" stroke="#0284c7" fill="#0284c7" fillOpacity={0.3} name="Air Baku" />
                      <Area type="monotone" dataKey="AirTanah" stroke="#059669" fill="#059669" fillOpacity={0.3} name="Air Tanah" />
                      <Area type="monotone" dataKey="LimbahCair" stroke="#d97706" fill="#d97706" fillOpacity={0.3} name="Limbah Cair" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-72 items-center justify-center text-sm text-neutral-400">Belum ada data pemantauan air di Data Hub</div>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Parameter Kualitas Air Limbah Terbaru (Uji Lab)</CardTitle>
              </CardHeader>
              <div className="space-y-3 p-4">
                {latestLab ? (
                  [
                    { label: "Titik Sampling", val: latestLab.samplePoint },
                    { label: "Tanggal Pengujian", val: latestLab.date },
                    { label: "pH", val: latestLab.ph },
                    { label: "COD", val: `${latestLab.cod} mg/L` },
                    { label: "BOD", val: `${latestLab.bod} mg/L` },
                    { label: "TSS", val: `${latestLab.tss} mg/L` },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-100 p-2.5 text-sm">
                      <span className="text-neutral-600">{row.label}</span>
                      <span className="font-semibold text-neutral-900">{String(row.val ?? "—")}</span>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-neutral-400">Belum ada hasil uji lab di Data Hub</p>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
