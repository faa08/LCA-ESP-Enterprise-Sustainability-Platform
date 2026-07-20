"use client"

import { useMemo } from "react"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, ArrowDownToLine, ArrowUpFromLine, Recycle, AlertTriangle } from "lucide-react"
import { XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, AreaChart, Area } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { ProperStrip } from "@/components/layout/proper-strip"
import { useIndustryId } from "@/lib/use-industry-id"
import { getMeasurements, paramValue } from "@/lib/measurements"
import { getIndustry } from "@/lib/proper"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

function fmt(n: number | null): string {
  if (n === null || Number.isNaN(n)) return "—"
  return n.toLocaleString("id-ID")
}

export default function WaterMonitoring() {
  const locale = getLocaleClient()
  const dict = dicts[locale]
  const industryId = useIndustryId()

  const { measurements, industry, waterParams, noData, ph, tss, cod, bod } = useMemo(() => {
    const measurements = getMeasurements(industryId)
    const industry = getIndustry(industryId)
    const waterParams = industry ? industry.params.filter((p) => p.category === "air_limbah") : []
    const hasAny = waterParams.some((p) => measurements[p.code] !== undefined && measurements[p.code] !== "")
    const noData = !industry || !hasAny
    const get = (code: string): number | null => {
      const p = waterParams.find((x) => x.code === code)
      return p ? (typeof paramValue(p, measurements) === "number" ? (paramValue(p, measurements) as number) : null) : null
    }
    return {
      measurements,
      industry,
      waterParams,
      noData,
      ph: get("ph"),
      tss: get("tss"),
      cod: get("cod"),
      bod: get("bod"),
    }
  }, [industryId])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">{t(dict, "water.page_title")}</h1>
        <p className="text-sm text-neutral-500">{t(dict, "water.page_desc")}</p>
      </div>

      <ProperStrip category="air_limbah" titleKey="proper.air_limbah" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t(dict, "water.intake")} value={noData ? "—" : fmt(ph)} description={t(dict, "common.ytd")} icon={ArrowDownToLine} />
        <StatCard title={t(dict, "water.consumption")} value={noData ? "—" : fmt(tss)} description={t(dict, "common.ytd")} icon={Droplets} />
        <StatCard title={t(dict, "water.discharge")} value={noData ? "—" : fmt(cod)} description={t(dict, "common.ytd")} icon={ArrowUpFromLine} />
        <StatCard title={t(dict, "water.recycling")} value={noData ? "—" : fmt(bod)} description={t(dict, "common.ytd")} icon={Recycle} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "water.chart_usage")}</CardTitle>
          </CardHeader>
          {noData ? (
            <div className="flex h-72 items-center justify-center text-sm text-neutral-400">
              {t(dict, "datahub.empty")}
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Area type="monotone" dataKey="intake" stackId="1" stroke="#0284c7" fill="#0284c7" fillOpacity={0.3} name={t(dict, "water.intake")} />
                  <Area type="monotone" dataKey="consumption" stackId="2" stroke="#059669" fill="#059669" fillOpacity={0.3} name={t(dict, "water.consumption")} />
                  <Area type="monotone" dataKey="discharge" stackId="3" stroke="#d97706" fill="#d97706" fillOpacity={0.3} name={t(dict, "water.discharge")} />
                  <Area type="monotone" dataKey="recycling" stackId="4" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} name={t(dict, "water.recycling")} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "water.chart_quality")}</CardTitle>
          </CardHeader>
          {noData ? (
            <div className="flex h-72 items-center justify-center text-sm text-neutral-400">
              {t(dict, "datahub.empty")}
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waterParams.filter((p) => ["ph", "tss", "cod", "bod"].includes(p.code)).map((p) => ({ name: p.code.toUpperCase(), value: typeof paramValue(p, measurements) === "number" ? (paramValue(p, measurements) as number) : 0 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} name={t(dict, "water.chart_quality")} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "water.balance")}</CardTitle>
          </CardHeader>
          {noData ? (
            <div className="flex h-48 items-center justify-center text-sm text-neutral-400">
              {t(dict, "datahub.empty")}
            </div>
          ) : (
            <div className="space-y-3">
              {waterParams.slice(0, 4).map((p, i) => {
                const v = typeof paramValue(p, measurements) === "number" ? (paramValue(p, measurements) as number) : null
                const pct = v !== null && v > 0 ? Math.min(100, Math.round((v / (v || 1)) * 100)) : 0
                const colors = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500"]
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">{p.name}</span>
                      <span className="font-medium text-neutral-900">{v === null ? "—" : `${fmt(v)} ${(p as { unit: string }).unit}`}</span>
                    </div>
                    {i > 0 && (
                      <div className="h-2 rounded-full bg-neutral-100">
                        <div className={`h-2 rounded-full ${colors[i % colors.length]}`} style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "water.leak_detection")}</CardTitle>
          </CardHeader>
          <div className="flex h-48 items-center justify-center text-sm text-neutral-400">
            {t(dict, "datahub.empty")}
          </div>
        </Card>
      </div>
    </div>
  )
}
