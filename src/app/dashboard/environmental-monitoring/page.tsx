"use client"

import { useMemo } from "react"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wind, Droplets, Trash2, AlertTriangle, Target } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { ProperStrip } from "@/components/layout/proper-strip"
import { useIndustryId } from "@/lib/use-industry-id"
import { getMeasurements, paramValue, evaluate } from "@/lib/measurements"
import { getIndustry, EMISSIONS_PARAMS } from "@/lib/proper"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

function fmt(n: number | null): string {
  if (n === null || Number.isNaN(n)) return "—"
  return n.toLocaleString("id-ID")
}

export default function EnvironmentalMonitoring() {
  const locale = getLocaleClient()
  const dict = dicts[locale]
  const industryId = useIndustryId()

  const { measurements, industry, airParams, emissionValues, incidentCount, noData } = useMemo(() => {
    const measurements = getMeasurements(industryId)
    const industry = getIndustry(industryId)
    const airParams = EMISSIONS_PARAMS
    const emissionValues = airParams.map((p) => ({ p, v: paramValue(p, measurements) }))
    const incidentCount = 0
    const hasAny = airParams.some((p) => measurements[p.code] !== undefined && measurements[p.code] !== "")
    const noData = !industry || !hasAny
    return { measurements, industry, airParams, emissionValues, incidentCount, noData }
  }, [industryId])

  const airTotal = airParams.reduce((sum, p) => {
    const v = paramValue(p, measurements)
    return sum + (typeof v === "number" ? v : 0)
  }, 0)

  const envTargets = useMemo(() => {
    if (!industry) return []
    return industry.params
      .filter((p) => p.category === "air_limbah")
      .slice(0, 3)
      .map((p) => {
        const ev = evaluate(p, measurements)
        const status = ev.status === "fail" ? "at-risk" : "on-track"
        return { name: p.name, status, limit: (p as { max?: number; min?: number }).max ?? (p as { max?: number; min?: number }).min ?? null, value: ev.value }
      })
  }, [industry, measurements])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">{t(dict, "env.page_title")}</h1>
        <p className="text-sm text-neutral-500">{t(dict, "env.page_desc")}</p>
      </div>

      <ProperStrip category="emisi" titleKey="proper.emisi" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t(dict, "env.air_emissions")} value={noData ? "—" : `${fmt(airTotal)}`} description={t(dict, "common.ytd")} icon={Wind} />
        <StatCard title={t(dict, "env.water_consumption")} value="—" description={t(dict, "common.ytd")} icon={Droplets} />
        <StatCard title={t(dict, "env.waste_generated")} value="—" description={t(dict, "common.ytd")} icon={Trash2} />
        <StatCard title={t(dict, "env.incidents")} value={String(incidentCount)} description={t(dict, "common.this_year")} icon={AlertTriangle} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "env.chart_performance")}</CardTitle>
          </CardHeader>
          {noData ? (
            <div className="flex h-72 items-center justify-center text-sm text-neutral-400">
              {t(dict, "datahub.empty")}
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Line yAxisId="left" type="monotone" dataKey="emissions" stroke="#059669" strokeWidth={2} name={t(dict, "env.emissions_t")} dot={{ r: 3 }} />
                  <Line yAxisId="right" type="monotone" dataKey="water" stroke="#0284c7" strokeWidth={2} name={t(dict, "env.water_m3")} dot={{ r: 3 }} />
                  <Line yAxisId="left" type="monotone" dataKey="waste" stroke="#d97706" strokeWidth={2} name={t(dict, "env.waste_t")} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "env.chart_targets")}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {envTargets.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-sm text-neutral-400">
                {t(dict, "datahub.empty")}
              </div>
            ) : (
              envTargets.map((tItem, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-100 p-3">
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-neutral-400" />
                    <span className="text-sm text-neutral-700">{tItem.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={tItem.status === "on-track" ? "success" : "warning"}>{t(dict, tItem.status === "on-track" ? "common.on_track" : "common.at_risk")}</Badge>
                    <span className="text-xs text-neutral-400">{tItem.value === null || tItem.value === undefined ? "—" : String(tItem.value)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "env.chart_air_quality")}</CardTitle>
        </CardHeader>
        {noData ? (
          <div className="flex h-72 items-center justify-center text-sm text-neutral-400">
            {t(dict, "datahub.empty")}
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={airParams.map((p) => ({ name: p.code.toUpperCase(), value: typeof paramValue(p, measurements) === "number" ? (paramValue(p, measurements) as number) : 0, limit: (p as { max?: number }).max ?? 0 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} name={t(dict, "env.emissions_t")} />
                <Line type="monotone" dataKey="limit" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" name="Limit" dot={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  )
}
