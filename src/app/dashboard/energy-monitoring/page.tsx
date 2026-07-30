"use client"

import { useState, useEffect, useCallback } from "react"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Zap, Flame, Fuel, Thermometer, Loader2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { useIndustryId } from "@/lib/use-industry-id"
import { useSiteId } from "@/lib/use-site-id"
import { calcEngineAsync, type CalculatedKPIs } from "@/lib/calc-engine"
import { getHubEntries, type EnergyEntry } from "@/lib/supabase/data-service"
import { ModuleGate } from "@/components/dashboard/module-gate"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const fmt = (v: number | null, unit = "", dec = 1) => (v === null || v === 0 ? "—" : `${v.toLocaleString("id-ID", { maximumFractionDigits: dec })}${unit}`)

export default function EnergyMonitoring() {
  const [locale, setLocale] = useState<Locale>("id")
  useEffect(() => {
    setLocale(getLocaleClient())
  }, [])
  const dict = dicts[locale]
  const industryId = useIndustryId()
  const siteId = useSiteId()

  const [kpis, setKpis] = useState<CalculatedKPIs | null>(null)
  const [entries, setEntries] = useState<EnergyEntry[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!siteId) return
    setLoading(true)
    const kpiData = await calcEngineAsync(siteId, industryId)
    setKpis(kpiData)
    const rawEntries = await getHubEntries<EnergyEntry>("energy", siteId, industryId)
    setEntries(rawEntries)
    setLoading(false)
  }, [siteId, industryId])

  useEffect(() => { refresh() }, [refresh])

  // Build real monthly trend chart from hub entries
  const monthlyMap: Record<string, number> = {}
  entries.forEach((e) => {
    const month = e.date ? e.date.substring(0, 7) : "Lainnya"
    const mwh = (e.electricity * 0.001) + (e.diesel * 0.01017) + (e.naturalGas * 0.01077) + (e.coal * 7.0) + (e.biomass * 4.9)
    monthlyMap[month] = (monthlyMap[month] ?? 0) + mwh
  })

  const energyTrend = Object.entries(monthlyMap).map(([month, val]) => ({
    month,
    energy: Math.round(val * 10) / 10,
  })).sort((a, b) => a.month.localeCompare(b.month))

  const totalMWh = kpis?.energy_total_MWh ?? 0
  const renewableMWh = kpis?.energy_renewable_MWh ?? 0
  const renewablePct = kpis?.renewable_pct ?? 0
  const fossilMWh = kpis?.energy_fossil_MWh ?? 0

  return (
    <ModuleGate moduleName="M3 · Energy & Water Assessment">
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">{t(dict, "energy.page_title")}</h1>
        <p className="text-sm text-neutral-500">Pemantauan konsumsi energi riil terintegrasi dengan Data Hub.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-sm text-neutral-400 gap-2">
          <Loader2 className="h-5 w-5 animate-spin" /> Memuat data energi...
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Energi" value={fmt(totalMWh, " MWh")} description="PLN, Bahan Bakar & Biomassa" icon={Zap}
              detail={{
                formula: "Σ konversi semua sumber energi ke MWh. PLN: kWh/1000 · Diesel: L×0,01017 · Gas: Nm³×0,01077 · Batubara: ton×7,0 · Biomassa: ton×4,9.",
                source: "Dihitung dari seluruh entri Energi di Data Hub (listrik PLN + bahan bakar fosil + biomassa).",
                suggestion: "Lakukan audit energi untuk identifikasi inefisiensi. Pasang VSD pada motor listrik besar. Optimasi jadwal operasi peralatan.",
              }}
            />
            <StatCard title="Energi Fosil" value={fmt(fossilMWh, " MWh")} description="Batu bara, Solar, Gas Alam" icon={Flame}
              detail={{
                formula: "Σ (Diesel L×0,01017 + Gas Nm³×0,01077 + Batubara ton×7,0 + LPG kg×0,01386 + Steam ton×0,698) + PLN kWh × 87% × 0,001 MWh.",
                source: "Dihitung dari komponen bahan bakar fosil di entri Energi + porsi fosil listrik PLN (87% grid nasional).",
                suggestion: "Ganti batubara/diesel dengan gas alam (emisi ~25% lebih rendah). Pertimbangkan co-firing biomassa di boiler.",
              }}
            />
            <StatCard title="Energi Terbarukan" value={fmt(renewableMWh, " MWh")} description="Biomassa & Terbarukan" icon={Thermometer}
              detail={{
                formula: "PLN kWh × 13% (porsi EBT grid nasional) × 0,001 + Biomassa ton × 4,9 MWh/ton.",
                source: "Dihitung dari komponen biomassa di entri Energi + porsi EBT listrik PLN (13% mix nasional, ESDM).",
                suggestion: "Tambah kapasitas biomassa atau biogas dari limbah proses. Pasang solar PV (rooftop). Target porsi EBT ≥23% (RUEN 2025).",
              }}
            />
            <StatCard title="Porsi Terbarukan" value={renewablePct > 0 ? `${renewablePct}%` : "—"} description="Share Renewable MWh" icon={Fuel}
              detail={{
                formula: "(Energi Terbarukan MWh / Total Energi MWh) × 100%.",
                source: "Rasio dari Total Energi Terbarukan dibagi Total Energi keseluruhan.",
                suggestion: "Target PROPER Beyond Compliance: porsi EBT >20%. Evaluasi kelayakan turbin angin atau panas bumi jika lokasi mendukung.",
              }}
            />
          </div>

          {!kpis?.hasData && (
            <Card>
              <div className="px-1 py-8 text-center text-sm text-neutral-400">
                Belum ada data energi. Silakan masukkan data di <b>Data Hub</b>.
              </div>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t(dict, "energy.chart_consumption")}</CardTitle>
              </CardHeader>
              {energyTrend.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={energyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                      <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Bar dataKey="energy" fill="#059669" radius={[4, 4, 0, 0]} name="Total Energi (MWh)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-72 items-center justify-center text-sm text-neutral-400">Belum ada tren data energi</div>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rincian Sumber Energi (Data Hub)</CardTitle>
              </CardHeader>
              <div className="space-y-3 p-4">
                {[
                  { source: "Listrik PLN", val: entries.reduce((s, e) => s + e.electricity, 0), unit: "kWh" },
                  { source: "Solar / Diesel", val: entries.reduce((s, e) => s + e.diesel, 0), unit: "Liter" },
                  { source: "Gas Alam", val: entries.reduce((s, e) => s + e.naturalGas, 0), unit: "Nm³" },
                  { source: "Batu Bara", val: entries.reduce((s, e) => s + e.coal, 0), unit: "Ton" },
                  { source: "Biomassa", val: entries.reduce((s, e) => s + e.biomass, 0), unit: "Ton" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-100 p-3 text-sm">
                    <span className="font-medium text-neutral-700">{item.source}</span>
                    <span className="font-bold text-neutral-900">{item.val > 0 ? `${item.val.toLocaleString("id-ID")} ${item.unit}` : "—"}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
    </ModuleGate>
  )
}

