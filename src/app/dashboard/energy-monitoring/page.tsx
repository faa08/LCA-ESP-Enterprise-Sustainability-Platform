"use client"

import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Flame, Fuel, Thermometer } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { useIndustryId } from "@/lib/use-industry-id"
import { useMeasurements, paramValue } from "@/lib/measurements"
import { ENERGY_PARAMS, OTHER_PARAMS } from "@/lib/proper"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

function val(code: string, m: Record<string, string>) {
  const p = OTHER_PARAMS.find((p) => p.code === code)
  return p ? (paramValue(p, m) as number | null) : null
}

const fmt = (v: number | null, unit = "") => (v === null ? "—" : `${v}${unit}`)

export default function EnergyMonitoring() {
  const locale = getLocaleClient()
  const dict = dicts[locale]
  const industryId = useIndustryId()
  const m = useMeasurements(industryId)

  const total = val("energy_total", m)
  const renewable = val("energy_renewable", m)
  const intensity = val("energy_intensity", m)
  const renewablePct = total && total > 0 && renewable !== null ? Math.round((renewable / total) * 100) : null

  const hasData = [total, renewable, intensity].some((v) => v !== null)
  const energyTrend: { month: string; energy: number }[] = []
  const energyIntensity: { month: string; intensity: number; production: number }[] = []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">{t(dict, "energy.page_title")}</h1>
        <p className="text-sm text-neutral-500">{t(dict, "energy.page_desc")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t(dict, "energy.electricity_stat")} value={fmt(total, " MWh")} description={t(dict, "common.entered_value")} icon={Zap} />
        <StatCard title={t(dict, "energy.natural_gas")} value={fmt(renewable, " MWh")} description={t(dict, "common.entered_value")} icon={Flame} />
        <StatCard title={t(dict, "energy.steam_usage")} value={fmt(renewablePct, " %")} description={t(dict, "energy.renewable_share")} icon={Thermometer} />
        <StatCard title={t(dict, "energy.fuel_usage")} value={fmt(intensity, " kWh/unit")} description={t(dict, "common.entered_value")} icon={Fuel} />
      </div>

      {!hasData && (
        <Card>
          <div className="px-1 py-8 text-center text-sm text-neutral-400">{t(dict, "common.no_data")}</div>
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
                  <Bar dataKey="energy" fill="#059669" radius={[4, 4, 0, 0]} name={t(dict, "energy.electricity_stat")} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center text-sm text-neutral-400">{t(dict, "common.no_data")}</div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "energy.chart_intensity")}</CardTitle>
          </CardHeader>
          {energyIntensity.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={energyIntensity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Line yAxisId="left" type="monotone" dataKey="intensity" stroke="#059669" strokeWidth={2} name={t(dict, "energy.intensity")} dot={{ r: 3 }} />
                  <Line yAxisId="right" type="monotone" dataKey="production" stroke="#0ea5e9" strokeWidth={2} name={t(dict, "energy.production")} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center text-sm text-neutral-400">{t(dict, "common.no_data")}</div>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "energy.equipment")}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {ENERGY_PARAMS.map((p, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-100 p-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-neutral-900">{p.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-600">{fmt(paramValue(p, m) as number | null, ` ${(p as { unit: string }).unit}`)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "energy.cost_overview")}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {[
              { source: t(dict, "energy.electricity_stat"), value: fmt(total, " MWh") },
              { source: t(dict, "energy.natural_gas"), value: fmt(renewable, " MWh") },
              { source: t(dict, "energy.intensity"), value: fmt(intensity, " kWh/unit") },
            ].map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">{item.source}</span>
                  <span className="font-medium text-neutral-900">{item.value}</span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-sm font-semibold">
              <span className="text-neutral-900">{t(dict, "energy.total")}</span>
              <span className="text-neutral-900">{fmt(total, " MWh")}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
