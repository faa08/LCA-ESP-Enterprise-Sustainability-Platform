"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, Beaker, Package, BarChart3, Zap, TrendingDown, ArrowRight, Loader2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { useIndustryId } from "@/lib/use-industry-id"
import { useSiteId } from "@/lib/use-site-id"
import { calcEngineAsync, type CalculatedKPIs } from "@/lib/calc-engine"
import { getGoalScope, type GoalScopeRecord } from "@/lib/supabase/data-service"
import { LCA_PARAMS, EMISSION_PROFILES } from "@/lib/proper"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const fmt = (v: number | null, unit = "", dec = 2) => (v === null || v === 0 ? "—" : `${v.toLocaleString("id-ID", { maximumFractionDigits: dec })}${unit}`)

const FUEL_CO2_FACTOR: Record<string, number> = {
  batubara: 94.6,
  biomassa: 0,
  gas: 56.1,
  minyak: 74.1,
}

const CARBON_PRICE_IDR = 70000

export default function LCAPage() {
  const [locale, setLocale] = useState<Locale>("id")
  useEffect(() => {
    setLocale(getLocaleClient())
  }, [])
  const dict = dicts[locale]
  const industryId = useIndustryId()
  const siteId = useSiteId()

  const [kpis, setKpis] = useState<CalculatedKPIs | null>(null)
  const [goalScope, setGoalScope] = useState<GoalScopeRecord | null>(null)
  const [loading, setLoading] = useState(true)

  const [coalPct, setCoalPct] = useState(100)
  const [simCoalPct, setSimCoalPct] = useState(60)
  const fuelMix = simCoalPct < 100 ? "biomassa" : "batubara"

  const refresh = useCallback(async () => {
    if (!siteId) return
    setLoading(true)
    const kpiData = await calcEngineAsync(siteId, industryId)
    setKpis(kpiData)
    const scopeData = await getGoalScope(siteId, industryId)
    setGoalScope(scopeData)
    setLoading(false)
  }, [siteId, industryId])

  useEffect(() => { refresh() }, [refresh])

  const gwp = kpis?.gwp_kgCO2e ?? 0
  const water = kpis?.wud_m3 ?? 0

  const currentCO2Factor = FUEL_CO2_FACTOR.batubara * (coalPct / 100)
  const simCO2Factor = FUEL_CO2_FACTOR.batubara * (simCoalPct / 100) + FUEL_CO2_FACTOR.biomassa * ((100 - simCoalPct) / 100)
  const reductionPct = currentCO2Factor > 0 ? Math.round(((currentCO2Factor - simCO2Factor) / currentCO2Factor) * 100) : 0
  const baselineEmission = kpis?.total_ghg_tCO2e ?? 0
  const savedTons = Math.round(baselineEmission * reductionPct / 100)
  const carbonCreditIdr = savedTons * CARBON_PRICE_IDR

  const simRank = simCoalPct <= 60 ? "Hijau" : "Biru"
  const simEmissionProfile = EMISSION_PROFILES[fuelMix]

  const impactData = [
    { name: "GWP (Klimat)", value: kpis?.gwp_kgCO2e ?? 0 },
    { name: "AP (Asam)", value: kpis?.ap_kgSO2e ?? 0 },
    { name: "EP (Eutro)", value: kpis?.ep_kgPO4e ?? 0 },
    { name: "PM (Debu)", value: kpis?.pm_kgPM25e ?? 0 },
    { name: "Air (m³)", value: kpis?.wud_m3 ?? 0 },
    { name: "Fosil (MJ)", value: kpis?.adpf_MJ ?? 0 },
  ]

  const hasLcaData = kpis?.hasData ?? false
  const lcaFilledCount = hasLcaData ? impactData.filter(d => d.value > 0).length : 0

  return (
    <div className="space-y-6">
      {/* Prasyarat: Goal & Scope Status */}
      <div className="flex items-center justify-between gap-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-blue-900">Modul 6 — LCIA Multi-Impact</p>
            {goalScope?.isLocked ? (
              <Badge variant="success">Goal &amp; Scope Terkunci (ISO 14040/44 Valid)</Badge>
            ) : (
              <Badge variant="warning">Goal &amp; Scope Belum Dikunci</Badge>
            )}
          </div>
          <p className="text-xs text-blue-700 mt-0.5">
            {goalScope?.isLocked
              ? `Batas Sistem: ${goalScope.boundary} · Alokasi: ${goalScope.allocation} · Unit: ${goalScope.functionalUnit || "—"}`
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
            <StatCard title="GWP (Global Warming)" value={fmt(gwp, " kg CO₂e")} description="Total Potensi Pemanasan Global" icon={BarChart3} />
            <StatCard title="Water Depletion" value={fmt(water, " m³")} description="Penggunaan Air Terkalkulasi" icon={Beaker} />
            <StatCard title="Indikator LCIA Terisi" value={`${lcaFilledCount}/11`} description="Kategori Dampak Lingkungan" icon={Package} />
            <StatCard title="Status PROPER LCA" value={lcaFilledCount >= 6 ? "EMAS" : lcaFilledCount >= 3 ? "HIJAU" : "BIRU"} description={lcaFilledCount >= 6 ? "LCIA Terpenuhi" : `Butuh ${Math.max(0, 3 - lcaFilledCount)} data lagi → Hijau`} icon={Cpu} />
          </div>

          {/* What-If Decision Simulator */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle>What-If Decision Simulator</CardTitle>
                  <p className="mt-0.5 text-sm text-neutral-500">Simulasikan dampak penggantian bahan bakar boiler terhadap emisi riil {fmt(baselineEmission, " tCO₂e")}, PROPER rank, dan karbon kredit</p>
                </div>
              </div>
            </CardHeader>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <label className="font-medium text-neutral-700">Kondisi Saat Ini — % Batubara</label>
                    <span className="font-bold text-neutral-900">{coalPct}%</span>
                  </div>
                  <input type="range" min={0} max={100} value={coalPct} onChange={(e) => setCoalPct(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-orange-500" />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <label className="font-medium text-neutral-700">Setelah Retrofit — % Batubara</label>
                    <span className="font-bold text-emerald-700">{simCoalPct}%</span>
                  </div>
                  <input type="range" min={0} max={100} value={simCoalPct} onChange={(e) => setSimCoalPct(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-emerald-500" />
                </div>
                <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Batas Emisi Proyeksi — {simEmissionProfile.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(simEmissionProfile.limits).map(([code, lim]) => (
                      <div key={code} className="rounded border border-neutral-200 bg-white px-2 py-1 text-center">
                        <p className="text-[10px] font-semibold uppercase text-neutral-400">{code === "opacity" ? "Opasitas" : code.toUpperCase()}</p>
                        <p className="text-xs font-bold text-neutral-800">{lim}<span className="ml-0.5 text-[10px] font-normal text-neutral-400">{code === "opacity" ? "%" : " mg/Nm³"}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-center">
                    <TrendingDown className="mx-auto h-5 w-5 text-emerald-600" />
                    <p className="mt-1 text-2xl font-bold text-emerald-700">↓{reductionPct}%</p>
                    <p className="text-xs text-emerald-600">Penurunan Emisi CO₂</p>
                  </div>
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-center">
                    <p className="text-lg font-bold text-blue-700">{simRank}</p>
                    <p className="mt-0.5 text-xs text-blue-600">Proyeksi Peringkat PROPER</p>
                  </div>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-800">POTENSI REVENUE KARBON KREDIT (IDXCARBON)</p>
                    <Badge variant="warning">Rp 70.000 / tCO₂e</Badge>
                  </div>
                  <p className="mt-1 text-2xl font-black text-amber-900">{savedTons.toLocaleString("id-ID")} tCO₂e/tahun</p>
                  <p className="mt-0.5 text-sm font-extrabold text-amber-700">
                    ≈ Rp {carbonCreditIdr.toLocaleString("id-ID")} <span className="text-xs font-normal text-amber-600">/ tahun</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>

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
                      <span className="font-bold text-neutral-800">{filled ? val.toLocaleString("id-ID") : "—"}</span>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
