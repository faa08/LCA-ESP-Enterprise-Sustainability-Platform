"use client"

import { useMemo } from "react"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Recycle, DollarSign, AlertTriangle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { ProperStrip } from "@/components/layout/proper-strip"
import { useIndustryId } from "@/lib/use-industry-id"
import { getMeasurements, paramValue } from "@/lib/measurements"
import { LIMBAH_B3_PARAMS } from "@/lib/proper"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

export default function WasteManagement() {
  const locale = getLocaleClient()
  const dict = dicts[locale]
  const industryId = useIndustryId()

  const { measurements, b3Results, compliant, total, rate, noData } = useMemo(() => {
    const measurements = getMeasurements(industryId)
    const b3Results = LIMBAH_B3_PARAMS.map((p) => ({ p, v: paramValue(p, measurements) }))
    const entered = b3Results.filter((r) => r.v !== null)
    const compliant = entered.filter((r) => r.v === true).length
    const total = entered.length
    const rate = total > 0 ? Math.round((compliant / total) * 100) : 0
    const noData = entered.length === 0
    return { measurements, b3Results, compliant, total, rate, noData }
  }, [industryId])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">{t(dict, "waste.page_title")}</h1>
        <p className="text-sm text-neutral-500">{t(dict, "waste.page_desc")}</p>
      </div>

      <ProperStrip category="limbah_b3" titleKey="proper.limbah_b3" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t(dict, "waste.total_generated")} value={noData ? "—" : String(total)} description={t(dict, "common.ytd")} icon={Trash2} />
        <StatCard title={t(dict, "waste.recycling_rate")} value={noData ? "—" : `${rate}%`} description={t(dict, "waste.target").replace("{n}", "100%")} icon={Recycle} />
        <StatCard title={t(dict, "waste.waste_cost")} value="—" description={t(dict, "common.ytd")} icon={DollarSign} />
        <StatCard title={t(dict, "waste.hazardous")} value={noData ? "—" : String(compliant)} description={t(dict, "common.ytd")} icon={AlertTriangle} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "waste.chart_trend")}</CardTitle>
          </CardHeader>
          {noData ? (
            <div className="flex h-72 items-center justify-center text-sm text-neutral-400">
              {t(dict, "datahub.empty")}
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="total" fill="#6b7280" radius={[4, 4, 0, 0]} name={t(dict, "waste.total_waste")} />
                  <Bar dataKey="recycled" fill="#059669" radius={[4, 4, 0, 0]} name={t(dict, "waste.recycled_label")} />
                  <Bar dataKey="hazardous" fill="#ef4444" radius={[4, 4, 0, 0]} name={t(dict, "waste.hazardous_b3")} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "waste.chart_composition")}</CardTitle>
          </CardHeader>
          {noData ? (
            <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
              {t(dict, "datahub.empty")}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center">
              <PieChart width={260} height={240}>
                <Pie data={b3Results.filter((r) => r.v !== null).map((r, i) => ({ name: r.p.name, value: r.v === true ? 1 : 0, color: i % 2 === 0 ? "#059669" : "#ef4444" }))} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}`}>
                  {b3Results.filter((r) => r.v !== null).map((entry, i) => (
                    <Cell key={i} fill={i % 2 === 0 ? "#059669" : "#ef4444"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "waste.table_title")}</CardTitle>
          </CardHeader>
          {noData ? (
            <div className="flex h-48 items-center justify-center text-sm text-neutral-400">
              {t(dict, "datahub.empty")}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "common.category")}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "common.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {b3Results.map((r, i) => (
                    <tr key={i} className="border-b border-neutral-100">
                      <td className="px-3 py-2.5 font-medium text-neutral-900">{r.p.name}</td>
                      <td className="px-3 py-2.5 text-neutral-600">{r.v === null ? "—" : r.v === true ? t(dict, "common.compliant") : t(dict, "common.needs_attention")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "waste.programs")}</CardTitle>
          </CardHeader>
          {noData ? (
            <div className="flex h-48 items-center justify-center text-sm text-neutral-400">
              {t(dict, "datahub.empty")}
            </div>
          ) : (
            <div className="space-y-4">
              {b3Results.map((r, i) => {
                const ok = r.v === true
                return (
                  <div key={i} className="space-y-2 rounded-lg border border-neutral-100 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-neutral-900">{r.p.name}</p>
                      <Badge variant={ok ? "success" : "warning"}>{t(dict, ok ? "common.on_track" : "common.at_risk")}</Badge>
                    </div>
                    <div className="h-2 rounded-full bg-neutral-100">
                      <div className={`h-2 rounded-full ${ok ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${ok ? 100 : 0}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-4 border-t border-neutral-100 pt-4">
            <CardHeader>
              <CardTitle>{t(dict, "waste.manifest")}</CardTitle>
            </CardHeader>
            <div className="flex h-32 items-center justify-center text-sm text-neutral-400">
              {t(dict, "datahub.empty")}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
