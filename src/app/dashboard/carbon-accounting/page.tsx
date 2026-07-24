"use client"

import Link from "next/link"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Cloud, Flame, Zap, Truck, Coins, ArrowUpRight } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { useIndustryId } from "@/lib/use-industry-id"
import { useMeasurements, paramValue } from "@/lib/measurements"
import { CARBON_PARAMS, OTHER_PARAMS } from "@/lib/proper"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

function val(code: string, m: Record<string, string>) {
  const p = OTHER_PARAMS.find((p) => p.code === code)
  return p ? (paramValue(p, m) as number | null) : null
}

const fmt = (v: number | null, unit = "") => (v === null ? "—" : `${v}${unit}`)

export default function CarbonAccounting() {
  const locale = getLocaleClient()
  const dict = dicts[locale]
  const industryId = useIndustryId()
  const m = useMeasurements(industryId)

  const scope1 = val("ghg_scope1", m)
  const scope2 = val("ghg_scope2", m)
  const scope3 = val("ghg_scope3", m)
  const captured = val("carbon_captured", m)
  const total = (scope1 ?? 0) + (scope2 ?? 0) + (scope3 ?? 0) - (captured ?? 0)

  const hasData = [scope1, scope2, scope3, captured].some((v) => v !== null)
  const totalEmissions = hasData ? Math.max(0, (scope1 ?? 0) + (scope2 ?? 0) + (scope3 ?? 0) - (captured ?? 0)) : null

  // Baseline 2026 s/d 2030 target path (SBTi 50% Net-Zero target)
  const reductionTargets = totalEmissions !== null ? [
    { year: "2023", actual: null, target: null },
    { year: "2024", actual: null, target: null },
    { year: "2025", actual: null, target: null },
    { year: "2026", actual: totalEmissions, target: totalEmissions },
    { year: "2027", actual: null, target: Math.round(totalEmissions * 0.88) },
    { year: "2028", actual: null, target: Math.round(totalEmissions * 0.76) },
    { year: "2029", actual: null, target: Math.round(totalEmissions * 0.64) },
    { year: "2030", actual: null, target: Math.round(totalEmissions * 0.50) },
  ] : []

  // Breakout emisi periode berjalan yang benar-benar di-input
  const monthlyTrend = hasData ? [
    { period: "Jan 2026", scope1: scope1 ?? 0, scope2: scope2 ?? 0, scope3: scope3 ?? 0 }
  ] : []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">{t(dict, "carbon.page_title")}</h1>
          <p className="text-sm text-neutral-500">{t(dict, "carbon.page_desc")}</p>
        </div>
        <Link
          href="/dashboard/carbon-credit"
          className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3.5 py-2 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
        >
          <Coins className="h-4 w-4 text-emerald-600" /> Monetisasi &amp; Registri Karbon Kredit (SRN-PPI / IDXCarbon)
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t(dict, "carbon.scope1")} value={fmt(scope1, " tCO₂e")} description={t(dict, "carbon.scope1_desc")} icon={Flame} />
        <StatCard title={t(dict, "carbon.scope2")} value={fmt(scope2, " tCO₂e")} description={t(dict, "carbon.scope2_desc")} icon={Zap} />
        <StatCard title={t(dict, "carbon.scope3")} value={fmt(scope3, " tCO₂e")} description={t(dict, "carbon.scope3_desc")} icon={Truck} />
        <StatCard title={t(dict, "carbon.total_emissions")} value={fmt(totalEmissions, " tCO₂e")} description={t(dict, "carbon.all_scopes")} icon={Cloud} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {CARBON_PARAMS.map((p, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
              <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">{(p as { unit: string }).unit}</span>
            </CardHeader>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-neutral-900">{fmt(paramValue(p, m) as number | null, ` ${(p as { unit: string }).unit}`)}</p>
              <p className="text-xs text-neutral-500">{t(dict, "common.entered_value")}</p>
            </div>
          </Card>
        ))}
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
              Belum ada data inventaris emisi. Masukkan data Scope 1, 2, atau 3 di Data Hub.
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
                  <Line type="monotone" dataKey="target" stroke="#d97706" strokeWidth={2} strokeDasharray="6 3" name="Jalur Target Reduksi Net-Zero 2030" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center text-sm text-neutral-400">
              Belum ada data baseline emisi. Masukkan data di Data Hub untuk menghitung jalur reduksi.
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
