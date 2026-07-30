"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Flame, Zap, Truck, Coins, ArrowUpRight, Loader2 } from "lucide-react"
import { CalcTraceModal, TraceCalcButton, type TraceGroup } from "@/components/dashboard/calc-trace-modal"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { useIndustryId } from "@/lib/use-industry-id"
import { useSiteId } from "@/lib/use-site-id"
import { calcEngineAsync, type CalculatedKPIs } from "@/lib/calc-engine"
import { getHubEntries, type EnergyEntry, type TransportEntry } from "@/lib/supabase/data-service"
import { useBoundary, getBoundaryLabel, getActiveScopes, isScopeActive } from "@/lib/boundary-context"
import { ModuleGate } from "@/components/dashboard/module-gate"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const fmt = (v: number | null, unit = "", dec = 2) => (v === null || v === 0 ? "—" : `${v.toLocaleString("id-ID", { maximumFractionDigits: dec })}${unit}`)

function buildCarbonTraceGroups(kpis: CalculatedKPIs | null, energyEntries: EnergyEntry[], transportEntries: TransportEntry[]): TraceGroup[] {
  const totalElecKwh = energyEntries.reduce((s, e) => s + e.electricity, 0)
  const totalDieselL = energyEntries.reduce((s, e) => s + e.diesel, 0)
  const totalGasNm3  = energyEntries.reduce((s, e) => s + e.naturalGas, 0)
  const totalCoalTon = energyEntries.reduce((s, e) => s + e.coal, 0)
  const totalDistKm  = transportEntries.reduce((s, t) => s + t.distance * t.cargoWeight, 0)

  return [
    {
      title: "Scope 1 — Emisi Langsung (Pembakaran Bahan Bakar)",
      description: "Sumber: Data Hub â€º Konsumsi Energi Bulanan. Bahan bakar yang dibakar langsung di fasilitas pabrik.",
      icon: <Flame className="h-3.5 w-3.5" />,
      steps: [
        {
          source: "Diesel (Solar)",
          sourceValue: `${totalDieselL.toLocaleString("id-ID")} Liter`,
          sourceColor: "orange",
          formula: "× Faktor Emisi Diesel 2,68 kg CO₂e/L ÷ 1000",
          result: `${((totalDieselL * 2.68) / 1000).toLocaleString("id-ID", { maximumFractionDigits: 2 })} tCO₂e`,
          status: totalDieselL > 0 ? "ok" : "empty",
        },
        {
          source: "Gas Bumi (Boiler)",
          sourceValue: `${totalGasNm3.toLocaleString("id-ID")} Nm³`,
          sourceColor: "blue",
          formula: "× Faktor Emisi Gas 2,02 kg CO₂e/Nm³ ÷ 1000",
          result: `${((totalGasNm3 * 2.02) / 1000).toLocaleString("id-ID", { maximumFractionDigits: 2 })} tCO₂e`,
          status: totalGasNm3 > 0 ? "ok" : "empty",
        },
        {
          source: "Batubara",
          sourceValue: `${totalCoalTon.toLocaleString("id-ID")} Ton`,
          sourceColor: "purple",
          formula: "× Faktor Emisi Batubara 2.420 kg CO₂e/ton ÷ 1000",
          result: `${((totalCoalTon * 1000 * 2.42) / 1000).toLocaleString("id-ID", { maximumFractionDigits: 2 })} tCO₂e`,
          status: totalCoalTon > 0 ? "ok" : "empty",
        },
      ],
    },
    {
      title: "Scope 2 — Emisi Tidak Langsung (Listrik PLN)",
      description: "Sumber: Data Hub â€º Konsumsi Energi Bulanan â€º Kolom Listrik.",
      icon: <Zap className="h-3.5 w-3.5" />,
      steps: [
        {
          source: "Listrik PLN",
          sourceValue: `${totalElecKwh.toLocaleString("id-ID")} kWh`,
          sourceColor: "teal",
          formula: "× Faktor Emisi Grid Nasional KLHK 0,87 kg CO₂e/kWh ÷ 1000",
          result: `${((totalElecKwh * 0.87) / 1000).toLocaleString("id-ID", { maximumFractionDigits: 2 })} tCO₂e`,
          status: totalElecKwh > 0 ? "ok" : "empty",
        },
      ],
    },
    {
      title: "Scope 3 — Emisi Rantai Nilai (Transportasi Hilir)",
      description: "Sumber: Data Hub â€º Data Transportasi Bulanan â€º Jarak & Muatan.",
      icon: <Truck className="h-3.5 w-3.5" />,
      steps: [
        {
          source: "Distribusi Produk",
          sourceValue: `${totalDistKm.toLocaleString("id-ID")} Ton·km`,
          sourceColor: "orange",
          formula: "Jarak (km) × Muatan (Ton) × Faktor Emisi Truk Diesel 0,000096 tCO₂e/ton·km",
          result: `${(totalDistKm * 0.000096).toLocaleString("id-ID", { maximumFractionDigits: 4 })} tCO₂e`,
          status: totalDistKm > 0 ? "ok" : "empty",
        },
      ],
    },
  ]
}

export default function CarbonAccounting() {
  const [locale, setLocale] = useState<Locale>("id")
  useEffect(() => {
    setLocale(getLocaleClient())
  }, [])
  const dict = dicts[locale]
  const industryId = useIndustryId()
  const siteId = useSiteId()
  const { boundary } = useBoundary()

  const [kpis, setKpis] = useState<CalculatedKPIs | null>(null)
  const [energyEntries, setEnergyEntries] = useState<EnergyEntry[]>([])
  const [transportEntries, setTransportEntries] = useState<TransportEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [traceOpen, setTraceOpen] = useState(false)

  const refresh = useCallback(async () => {
    if (!siteId) return
    setLoading(true)
    const kpiData = await calcEngineAsync(siteId, industryId, boundary)
    setKpis(kpiData)
    const eData = await getHubEntries<EnergyEntry>("energy", siteId, industryId)
    const tData = await getHubEntries<TransportEntry>("transport", siteId, industryId)
    setEnergyEntries(eData)
    setTransportEntries(tData)
    setLoading(false)
  }, [siteId, industryId, boundary])

  useEffect(() => { refresh() }, [refresh])

  const scope1 = kpis?.scope1_tCO2e ?? 0
  const scope2 = kpis?.scope2_tCO2e ?? 0
  const scope3 = kpis?.scope3_tCO2e ?? 0
  const totalEmissions = kpis?.total_ghg_tCO2e ?? 0
  const hasData = kpis?.hasData ?? false

  // Dynamic monthly trend computed from hub entries
  const monthlyMap: Record<string, { scope1: number; scope2: number; scope3: number }> = {}

  energyEntries.forEach((e) => {
    const month = e.date ? e.date.substring(0, 7) : "Lainnya"
    if (!monthlyMap[month]) monthlyMap[month] = { scope1: 0, scope2: 0, scope3: 0 }
    monthlyMap[month].scope1 += ((e.diesel * 2.68) + (e.naturalGas * 2.02) + (e.coal * 1000 * 2.42) + (e.lpg * 2.98)) / 1000
    monthlyMap[month].scope2 += (e.electricity * 0.87) / 1000
  })

  transportEntries.forEach((t) => {
    const month = t.date ? t.date.substring(0, 7) : "Lainnya"
    if (!monthlyMap[month]) monthlyMap[month] = { scope1: 0, scope2: 0, scope3: 0 }
    monthlyMap[month].scope3 += (t.distance * t.cargoWeight * 0.000096)
  })

  const monthlyTrend = Object.entries(monthlyMap).map(([period, v]) => ({
    period,
    scope1: Math.round(v.scope1 * 100) / 100,
    scope2: Math.round(v.scope2 * 100) / 100,
    scope3: Math.round(v.scope3 * 100) / 100,
  })).sort((a, b) => a.period.localeCompare(b.period))

  // Net-Zero 2030 target path calculated from live totalEmissions
  const currentYear = new Date().getFullYear()
  const reductionTargets = totalEmissions > 0 ? Array.from({ length: 6 }, (_, i) => {
    const y = currentYear + i
    const targetFactor = 1 - (i * 0.1) // 10% reduction per year path
    return {
      year: String(y),
      actual: i === 0 ? Math.round(totalEmissions * 100) / 100 : null,
      target: Math.round(totalEmissions * targetFactor * 100) / 100,
    }
  }) : []

  return (
  <ModuleGate moduleName="M7 · Carbon Accounting">
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">{t(dict, "carbon.page_title")}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-sm text-neutral-500">Inventarisasi Emisi GHG {getActiveScopes(boundary)} terintegrasi dengan Data Hub.</p>
            <Badge variant="neutral" className="text-[10px]">{getBoundaryLabel(boundary)}</Badge>
            <TraceCalcButton onClick={() => setTraceOpen(true)} />
          </div>
        </div>
        <Link
          href="/dashboard/carbon-credit"
          className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3.5 py-2 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
        >
          <Coins className="h-4 w-4 text-emerald-600" /> Monetisasi &amp; Registri Karbon Kredit (SRN-PPI / IDXCarbon)
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-sm text-neutral-400 gap-2">
          <Loader2 className="h-5 w-5 animate-spin" /> Mengkalkulasi Inventaris Emisi Karbon...
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title={t(dict, "carbon.scope1")} value={fmt(scope1, " tCO₂e")} description={t(dict, "carbon.scope1_desc")} icon={Flame}
              detail={{
                formula: "Σ (Volume Bahan Bakar × Faktor Emisi). Diesel: 2,68 kgCO₂e/L · Gas: 2,02 kgCO₂e/Nm³ · Batubara: 2.420 kgCO₂e/ton · LPG: 2,98 kgCO₂e/kg.",
                source: "Dihitung dari entri Energi (diesel, gas alam, batubara, LPG, steam) di Data Hub.",
                suggestion: "Ganti bahan bakar fosil dengan gas alam (~25% emisi lebih rendah vs diesel). Tingkatkan efisiensi boiler. Pertimbangkan co-firing biomassa.",
              }}
            />
            <div className={!isScopeActive(boundary, "scope2") ? "opacity-40 pointer-events-none" : ""}>
              <StatCard title={t(dict, "carbon.scope2")} value={isScopeActive(boundary, "scope2") ? fmt(scope2, " tCO₂e") : "N/A"} description={isScopeActive(boundary, "scope2") ? t(dict, "carbon.scope2_desc") : `Di luar batas ${getBoundaryLabel(boundary)}`} icon={Zap}
                detail={{
                  formula: "Σ (kWh Listrik PLN × 0,87 kgCO₂/kWh). Faktor emisi grid PLN Indonesia dari ESDM 2022.",
                  source: "Dihitung dari kolom 'Listrik PLN (kWh)' di entri Energi.",
                  suggestion: "Pasang solar panel (rooftop PV). Pertimbangkan PPA dengan penyedia energi terbarukan. Target REC (Renewable Energy Certificate).",
                }}
              />
            </div>
            <div className={!isScopeActive(boundary, "scope3") ? "opacity-40 pointer-events-none" : ""}>
              <StatCard title={t(dict, "carbon.scope3")} value={isScopeActive(boundary, "scope3") ? fmt(scope3, " tCO₂e") : "N/A"} description={isScopeActive(boundary, "scope3") ? t(dict, "carbon.scope3_desc") : `Di luar batas ${getBoundaryLabel(boundary)}`} icon={Truck}
                detail={{
                  formula: "Σ (Jarak km × Berat Kargo ton × EF ton-km). EF: Diesel 0,096 kgCO₂e/tkm · CNG 0,062 · EV 0,035.",
                  source: "Dihitung dari entri Transportasi (jarak, berat kargo, jenis bahan bakar) di Data Hub.",
                  suggestion: "Optimalkan rute logistik. Gunakan kendaraan CNG/listrik. Konsolidasikan pengiriman untuk mengurangi frekuensi.",
                }}
              />
            </div>
            <StatCard title={t(dict, "carbon.total_emissions")} value={fmt(totalEmissions, " tCO₂e")} description={getActiveScopes(boundary)} icon={Cloud}
              detail={{
                formula: "Scope 1 + Scope 2 + Scope 3 (difilter berdasarkan batas sistem yang dipilih di Goal & Scope).",
                source: "Agregasi dari ketiga scope di atas.",
                suggestion: "Fokus pada scope dengan kontribusi terbesar. Target PROPER EMAS: penurunan 2-5% per tahun. Buat roadmap Net Zero 2050.",
              }}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t(dict, "carbon.chart_trend")}</CardTitle>
              </CardHeader>
              {monthlyTrend.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                      <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Bar dataKey="scope1" fill="#0284c7" radius={[4, 4, 0, 0]} name="Scope 1 (Langsung)" />
                      <Bar dataKey="scope2" fill="#059669" radius={[4, 4, 0, 0]} name="Scope 2 (Listrik)" />
                      <Bar dataKey="scope3" fill="#d97706" radius={[4, 4, 0, 0]} name="Scope 3 (Rantai Nilai)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-72 items-center justify-center text-sm text-neutral-400">
                  Belum ada data inventaris emisi. Masukkan data Energi/Transportasi di Data Hub.
                </div>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t(dict, "carbon.chart_reduction")}</CardTitle>
              </CardHeader>
              {reductionTargets.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reductionTargets}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                      <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Line type="monotone" dataKey="actual" stroke="#059669" strokeWidth={2.5} name="Aktual Terdaftar (tCO₂e)" dot={{ r: 5 }} connectNulls />
                      <Line type="monotone" dataKey="target" stroke="#d97706" strokeWidth={2} strokeDasharray="6 3" name="Jalur Target Reduksi Net-Zero" dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-72 items-center justify-center text-sm text-neutral-400">
                  Belum ada data baseline emisi di Data Hub.
                </div>
              )}
            </Card>
          </div>
        </>
      )}
      <CalcTraceModal
        isOpen={traceOpen}
        onClose={() => setTraceOpen(false)}
        title="Rincian Kalkulasi Emisi Karbon (GHG Protocol)"
        subtitle="Modul 7 — Carbon Accounting · Scope 1 + 2 + 3"
        groups={buildCarbonTraceGroups(kpis, energyEntries, transportEntries)}
      />
    </div>
    </ModuleGate>
  )
}
