"use client"

import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Cloud, Flame, Zap, Truck } from "lucide-react"
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
  const monthlyTrend: { month: string; scope: number }[] = []
  const reductionTargets: { year: string; actual: number | null; target: number | null }[] = []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">{t(dict, "carbon.page_title")}</h1>
        <p className="text-sm text-neutral-500">{t(dict, "carbon.page_desc")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t(dict, "carbon.scope1")} value={fmt(scope1, " tCO₂e")} description={t(dict, "carbon.scope1_desc")} icon={Flame} />
        <StatCard title={t(dict, "carbon.scope2")} value={fmt(scope2, " tCO₂e")} description={t(dict, "carbon.scope2_desc")} icon={Zap} />
        <StatCard title={t(dict, "carbon.scope3")} value={fmt(scope3, " tCO₂e")} description={t(dict, "carbon.scope3_desc")} icon={Truck} />
        <StatCard title={t(dict, "carbon.total_emissions")} value={fmt(hasData ? total : null, " tCO₂e")} description={t(dict, "carbon.all_scopes")} icon={Cloud} />
      </div>

      {!hasData && (
        <Card>
          <div className="px-1 py-8 text-center text-sm text-neutral-400">{t(dict, "common.no_data")}</div>
        </Card>
      )}

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
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="scope" fill="#059669" radius={[4, 4, 0, 0]} name={t(dict, "carbon.total_emissions")} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center text-sm text-neutral-400">{t(dict, "common.no_data")}</div>
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
                  <Line type="monotone" dataKey="actual" stroke="#059669" strokeWidth={2} name={t(dict, "carbon.actual")} dot={{ r: 4 }} connectNulls />
                  <Line type="monotone" dataKey="target" stroke="#d97706" strokeWidth={2} strokeDasharray="6 3" name={t(dict, "carbon.target")} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center text-sm text-neutral-400">{t(dict, "common.no_data")}</div>
          )}
        </Card>
      </div>
    </div>
  )
}
