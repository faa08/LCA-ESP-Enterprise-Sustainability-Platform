"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, Beaker, Package, BarChart3, Zap, TrendingDown, ArrowRight, Loader2 } from "lucide-react"
import { CalcTraceModal, TraceCalcButton, type TraceGroup } from "@/components/dashboard/calc-trace-modal"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { useIndustryId } from "@/lib/use-industry-id"
import { useSiteId } from "@/lib/use-site-id"
import { calcEngineAsync, type CalculatedKPIs } from "@/lib/calc-engine"
import { getGoalScope, type GoalScopeRecord } from "@/lib/supabase/data-service"
import { LCA_PARAMS } from "@/lib/proper"
import { useBoundary, getBoundaryLabel } from "@/lib/boundary-context"
import { ModuleGate } from "@/components/dashboard/module-gate"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const fmt = (v: number | null, unit = "", dec = 2) => (v === null || v === 0 ? "â€”" : `${v.toLocaleString("id-ID", { maximumFractionDigits: dec })}${unit}`)

function buildLcaTraceGroups(kpis: CalculatedKPIs | null): TraceGroup[] {
  const gwp    = kpis?.gwp_kgCO2e ?? 0
  const ap     = kpis?.ap_kgSO2e  ?? 0
  const ep     = kpis?.ep_kgPO4e  ?? 0
  const wud    = kpis?.wud_m3     ?? 0
  const adpf   = kpis?.adpf_MJ    ?? 0
  const pm     = kpis?.pm_kgPM25e ?? 0

  return [
    {
      title: "Kategori Dampak Lingkungan â€” Inventori Energi",
      description: "Sumber: Data Hub â€º Konsumsi Energi Bulanan. Setiap jenis energi mengandung beberapa faktor karakterisasi LCIA.",
      icon: <Zap className="h-3.5 w-3.5" />,
      steps: [
        {
          source: "Listrik + Gas + Diesel",
          sourceValue: "Semua entri energi bulanan",
          sourceColor: "blue",
          formula: "Ã— Faktor GWP (Global Warming Potential) â€” ISO 14044 / IPCC AR6",
          result: gwp > 0 ? `${gwp.toLocaleString("id-ID", { maximumFractionDigits: 2 })} kg COâ‚‚e` : "Belum ada data",
          status: gwp > 0 ? "ok" : "empty",
        },
        {
          source: "Gas Bumi + Batubara",
          sourceValue: "Emisi SOâ‚‚ dari pembakaran",
          sourceColor: "orange",
          formula: "Ã— Faktor Karakterisasi AP (Acidification) kg SOâ‚‚e/unit",
          result: ap > 0 ? `${ap.toLocaleString("id-ID", { maximumFractionDigits: 4 })} kg SOâ‚‚e` : "Belum ada data",
          status: ap > 0 ? "ok" : "empty",
        },
        {
          source: "Gas Bumi + Diesel",
          sourceValue: "Emisi NOx & Fosfor",
          sourceColor: "purple",
          formula: "Ã— Faktor Eutrophication Potential (EP) kg POâ‚„e/unit",
          result: ep > 0 ? `${ep.toLocaleString("id-ID", { maximumFractionDigits: 4 })} kg POâ‚„e` : "Belum ada data",
          status: ep > 0 ? "ok" : "empty",
        },
        {
          source: "Diesel (partikulat halus)",
          sourceValue: "PM2.5 dari exhaust",
          sourceColor: "orange",
          formula: "Ã— Faktor PM (Particulate Matter) kg PM2.5e/unit",
          result: pm > 0 ? `${pm.toLocaleString("id-ID", { maximumFractionDigits: 4 })} kg PM2.5e` : "Belum ada data",
          status: pm > 0 ? "ok" : "empty",
        },
      ],
    },
    {
      title: "Kategori Dampak â€” Sumber Daya Alam",
      description: "Sumber: Data Hub â€º Konsumsi Air & Energi. Jejak penggunaan sumber daya terbatas.",
      icon: <Beaker className="h-3.5 w-3.5" />,
      steps: [
        {
          source: "Pemakaian Air Proses",
          sourceValue: "Dari Data Hub â€º Air",
          sourceColor: "teal",
          formula: "Volume air proses yang diambil (mÂ³) dikurangi volume yang di-recycle / reuse",
          result: wud > 0 ? `${wud.toLocaleString("id-ID", { maximumFractionDigits: 2 })} mÂ³` : "Belum ada data",
          status: wud > 0 ? "ok" : "empty",
        },
        {
          source: "Bahan Bakar Fosil",
          sourceValue: "Gas + Diesel + Batubara",
          sourceColor: "orange",
          formula: "Konversi energi ke MJ (Megajoule) Ã— Faktor ADP-Fosil (Abiotic Depletion)",
          result: adpf > 0 ? `${adpf.toLocaleString("id-ID", { maximumFractionDigits: 2 })} MJ` : "Belum ada data",
          status: adpf > 0 ? "ok" : "empty",
        },
      ],
    },
  ]
}

export default function LCAPage() {
  const [locale, setLocale] = useState<Locale>("id")
  useEffect(() => {
    setLocale(getLocaleClient())
  }, [])
  const dict = dicts[locale]
  const industryId = useIndustryId()
  const siteId = useSiteId()
  const { boundary } = useBoundary()

  const [kpis, setKpis] = useState<CalculatedKPIs | null>(null)
  const [goalScope, setGoalScope] = useState<GoalScopeRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [traceOpen, setTraceOpen] = useState(false)

  const refresh = useCallback(async () => {
    if (!siteId) return
    setLoading(true)
    const kpiData = await calcEngineAsync(siteId, industryId, boundary)
    setKpis(kpiData)
    const scopeData = await getGoalScope(siteId, industryId)
    setGoalScope(scopeData)
    setLoading(false)
  }, [siteId, industryId, boundary])

  useEffect(() => { refresh() }, [refresh])

  const gwp = kpis?.gwp_kgCO2e ?? 0
  const water = kpis?.wud_m3 ?? 0

  const impactData = [
    { name: "GWP (Klimat)", value: kpis?.gwp_kgCO2e ?? 0 },
    { name: "AP (Asam)", value: kpis?.ap_kgSO2e ?? 0 },
    { name: "EP (Eutro)", value: kpis?.ep_kgPO4e ?? 0 },
    { name: "PM (Debu)", value: kpis?.pm_kgPM25e ?? 0 },
    { name: "Air (mÂ³)", value: kpis?.wud_m3 ?? 0 },
    { name: "Fosil (MJ)", value: kpis?.adpf_MJ ?? 0 },
  ]

  const hasLcaData = kpis?.hasData ?? false
  const lcaFilledCount = hasLcaData ? impactData.filter(d => d.value > 0).length : 0

  return (
  <ModuleGate moduleName="M6 · LCIA Multi-Impact">
    <div className="space-y-6">
      {/* Prasyarat: Goal & Scope Status */}
      <div className="flex items-center justify-between gap-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-blue-900">Modul 6 â€” LCIA Multi-Impact</p>
            {goalScope?.isLocked ? (
              <Badge variant="success">Goal &amp; Scope Terkunci (ISO 14040/44 Valid)</Badge>
            ) : (
              <Badge variant="warning">Goal &amp; Scope Belum Dikunci</Badge>
            )}
            <TraceCalcButton onClick={() => setTraceOpen(true)} />
          </div>
          <p className="text-xs text-blue-700 mt-0.5">
            {goalScope?.isLocked
              ? `Batas Sistem: ${goalScope.boundary} Â· Alokasi: ${goalScope.allocation} Â· Unit: ${goalScope.functionalUnit || "â€”"}`
              : "Prasyarat: Modul 0 (Goal & Scope) harus dikunci di database sebelum hasil LCIA dapat diklaim sebagai studi LCA yang sah."}
          </p>
        </div>
        <Link href="/dashboard/goal-scope"
          className="flex shrink-0 items-center gap-2 rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors">
          Buka Goal &amp; Scope <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-sm text-neutral-400 gap-2">
          <Loader2 className="h-5 w-5 animate-spin" /> Mengkalkulasi LCIA...
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="GWP (Global Warming)" value={fmt(gwp, " kg COâ‚‚e")} description="Total Potensi Pemanasan Global" icon={BarChart3} />
            <StatCard title="Water Depletion" value={fmt(water, " mÂ³")} description="Penggunaan Air Terkalkulasi" icon={Beaker} />
            <StatCard title="Indikator LCIA Terisi" value={`${lcaFilledCount}/11`} description="Kategori Dampak Lingkungan" icon={Package} />
            <StatCard title="Status PROPER LCA" value={lcaFilledCount >= 6 ? "EMAS" : lcaFilledCount >= 3 ? "HIJAU" : "BIRU"} description={lcaFilledCount >= 6 ? "LCIA Terpenuhi" : `Butuh ${Math.max(0, 3 - lcaFilledCount)} data lagi â†’ Hijau`} icon={Cpu} />
          </div>

          {/* 11 Indikator LCA */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Profil Hasil LCIA Terhitung</CardTitle>
              </CardHeader>
              {impactData.some((d) => d.value > 0) ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={impactData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#a3a3a3" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                      <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                      <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} name="Nilai Impact" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="px-4 py-12 text-center text-sm text-neutral-400">Belum ada data operasional energi/emisi di Data Hub untuk menghitung LCIA.</p>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daftar 11 Indikator LCIA (ISO 14040/14044)</CardTitle>
              </CardHeader>
              <div className="space-y-1.5 p-4 max-h-72 overflow-y-auto">
                {LCA_PARAMS.map((p) => {
                  const val = p.code === "gwp" ? kpis?.gwp_kgCO2e
                    : p.code === "ap" ? kpis?.ap_kgSO2e
                    : p.code === "ep" ? kpis?.ep_kgPO4e
                    : p.code === "wud" ? kpis?.wud_m3
                    : p.code === "adpf" ? kpis?.adpf_MJ
                    : p.code === "pm" ? kpis?.pm_kgPM25e
                    : 0
                  const filled = val !== undefined && val !== null && val > 0
                  return (
                    <div key={p.code} className="flex items-center gap-3 rounded-lg border border-neutral-100 px-3 py-2 text-xs">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${filled ? "bg-emerald-500" : "bg-neutral-200"}`} />
                      <p className="min-w-0 flex-1 truncate font-medium text-neutral-700">{p.name}</p>
                      <span className="font-bold text-neutral-800">{filled ? val.toLocaleString("id-ID") : "â€”"}</span>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </>
      )}
      <CalcTraceModal
        isOpen={traceOpen}
        onClose={() => setTraceOpen(false)}
        title="Rincian Kalkulasi LCIA Multi-Impact (ISO 14044)"
        subtitle="Modul 6 â€” LCIA Â· 11 Kategori Dampak Lingkungan"
        groups={buildLcaTraceGroups(kpis)}
      />
    </div>
    </ModuleGate>
  )
}
