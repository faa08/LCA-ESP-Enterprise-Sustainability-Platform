"use client"

import { useState, useEffect, useCallback } from "react"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wind, Droplets, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { ProperStrip } from "@/components/layout/proper-strip"
import { useIndustryId } from "@/lib/use-industry-id"
import { useSiteId } from "@/lib/use-site-id"
import { getHubEntries, type LabEntry, type StackEntry } from "@/lib/supabase/data-service"

function fmt(n: number): string {
  return n.toLocaleString("id-ID", { maximumFractionDigits: 2 })
}

export default function EnvironmentalMonitoring() {
  const industryId = useIndustryId()
  const siteId = useSiteId()

  const [labs, setLabs] = useState<LabEntry[]>([])
  const [stacks, setStacks] = useState<StackEntry[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!siteId) return
    setLoading(true)
    const [labData, stackData] = await Promise.all([
      getHubEntries<LabEntry>("laboratory", siteId, industryId),
      getHubEntries<StackEntry>("stack", siteId, industryId),
    ])
    setLabs(labData)
    setStacks(stackData)
    setLoading(false)
  }, [siteId, industryId])

  useEffect(() => { refresh() }, [refresh])

  const latestLab = labs[0] ?? null
  const latestStack = stacks[0] ?? null
  const noData = labs.length === 0 && stacks.length === 0

  // Check compliance status
  const labCompliant = latestLab ? latestLab.ph >= 6 && latestLab.ph <= 9 && latestLab.cod <= 100 && latestLab.bod <= 50 : true
  const stackCompliant = latestStack ? latestStack.tsp <= 230 && latestStack.so2 <= 750 && latestStack.nox <= 825 : true

  const stackChartData = stacks.map((s) => ({
    date: s.date,
    TSP: s.tsp,
    SO2: s.so2,
    NOx: s.nox,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Pemantauan Kualitas Lingkungan & Telemetri</h1>
        <p className="text-sm text-neutral-500">Pemantauan Baku Mutu Emisi Udara Cerobong & Kualitas Air Limbah IPAL dari Data Hub.</p>
      </div>

      <ProperStrip category="emisi" titleKey="proper.emisi" />

      {loading ? (
        <div className="flex items-center justify-center py-12 text-sm text-neutral-400 gap-2">
          <Loader2 className="h-5 w-5 animate-spin" /> Memuat data telemetri lingkungan...
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Sampel Lab Air Limbah" value={noData ? "—" : `${labs.length} Pengujian`} description={latestLab ? `pH: ${latestLab.ph} · COD: ${latestLab.cod} mg/L` : "Belum ada data IPAL"} icon={Droplets} />
            <StatCard title="Sampling Emisi Cerobong" value={noData ? "—" : `${stacks.length} Pengujian`} description={latestStack ? `NOx: ${latestStack.nox} mg/Nm³` : "Belum ada data Cerobong"} icon={Wind} />
            <StatCard title="Status Mutu Cerobong" value={noData ? "—" : stackCompliant ? "MEMENUHI" : "MELEBIHI"} description="Baku Mutu Permen LHK" icon={ShieldCheck} />
            <StatCard title="Status Mutu IPAL" value={noData ? "—" : labCompliant ? "MEMENUHI" : "MELEBIHI"} description="Baku Mutu Air Limbah" icon={AlertTriangle} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Hasil Uji Emisi Cerobong (mg/Nm³)</CardTitle>
              </CardHeader>
              {stacks.length === 0 ? (
                <div className="flex h-72 items-center justify-center text-sm text-neutral-400">
                  Belum ada data emisi cerobong di Data Hub
                </div>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stackChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                      <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                      <Bar dataKey="TSP" fill="#64748b" radius={[4, 4, 0, 0]} name="Partikulat (TSP)" />
                      <Bar dataKey="SO2" fill="#d97706" radius={[4, 4, 0, 0]} name="SO₂" />
                      <Bar dataKey="NOx" fill="#059669" radius={[4, 4, 0, 0]} name="NOₓ" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hasil Uji Lab Air Limbah IPAL Terbaru</CardTitle>
              </CardHeader>
              {!latestLab ? (
                <div className="flex h-72 items-center justify-center text-sm text-neutral-400">
                  Belum ada data uji lab IPAL di Data Hub
                </div>
              ) : (
                <div className="space-y-3 p-2">
                  <div className="flex items-center justify-between rounded-lg border border-neutral-100 p-3">
                    <span className="text-sm font-medium text-neutral-700">Derajat Keasaman (pH)</span>
                    <span className="text-sm font-bold text-neutral-900">{latestLab.ph} <Badge variant={latestLab.ph >= 6 && latestLab.ph <= 9 ? "success" : "danger"} className="ml-2">Baku Mutu: 6.0 – 9.0</Badge></span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-neutral-100 p-3">
                    <span className="text-sm font-medium text-neutral-700">Chemical Oxygen Demand (COD)</span>
                    <span className="text-sm font-bold text-neutral-900">{fmt(latestLab.cod)} mg/L <Badge variant={latestLab.cod <= 100 ? "success" : "danger"} className="ml-2">Maks 100 mg/L</Badge></span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-neutral-100 p-3">
                    <span className="text-sm font-medium text-neutral-700">Biological Oxygen Demand (BOD)</span>
                    <span className="text-sm font-bold text-neutral-900">{fmt(latestLab.bod)} mg/L <Badge variant={latestLab.bod <= 50 ? "success" : "danger"} className="ml-2">Maks 50 mg/L</Badge></span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-neutral-100 p-3">
                    <span className="text-sm font-medium text-neutral-700">Total Suspended Solids (TSS)</span>
                    <span className="text-sm font-bold text-neutral-900">{fmt(latestLab.tss)} mg/L <Badge variant={latestLab.tss <= 100 ? "success" : "danger"} className="ml-2">Maks 100 mg/L</Badge></span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-neutral-100 p-3">
                    <span className="text-sm font-medium text-neutral-700">Amonia (NH₃-N)</span>
                    <span className="text-sm font-bold text-neutral-900">{fmt(latestLab.nh3)} mg/L <Badge variant={latestLab.nh3 <= 5 ? "success" : "danger"} className="ml-2">Maks 5 mg/L</Badge></span>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
