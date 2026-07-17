"use client"

import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wind, Droplets, Trash2, AlertTriangle, Target } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const monthlyPerformance = [
  { month: "Jan", emissions: 14, water: 8500, waste: 120 },
  { month: "Feb", emissions: 13, water: 8200, waste: 115 },
  { month: "Mar", emissions: 15, water: 8800, waste: 130 },
  { month: "Apr", emissions: 12, water: 7900, waste: 108 },
  { month: "May", emissions: 10, water: 7600, waste: 95 },
  { month: "Jun", emissions: 9, water: 7400, waste: 88 },
  { month: "Jul", emissions: 8, water: 7100, waste: 82 },
  { month: "Aug", emissions: 8, water: 6900, waste: 78 },
  { month: "Sep", emissions: 7, water: 6700, waste: 74 },
  { month: "Oct", emissions: 6, water: 6500, waste: 70 },
  { month: "Nov", emissions: 6, water: 6300, waste: 66 },
  { month: "Dec", emissions: 5, water: 6100, waste: 62 },
]

const airEmissions = [
  { month: "Jan", so2: 155, nox: 210, particulate: 48, limitSo2: 200, limitNox: 350, limitParticulate: 75 },
  { month: "Feb", so2: 148, nox: 195, particulate: 42, limitSo2: 200, limitNox: 350, limitParticulate: 75 },
  { month: "Mar", so2: 162, nox: 220, particulate: 55, limitSo2: 200, limitNox: 350, limitParticulate: 75 },
  { month: "Apr", so2: 140, nox: 185, particulate: 38, limitSo2: 200, limitNox: 350, limitParticulate: 75 },
  { month: "May", so2: 135, nox: 175, particulate: 35, limitSo2: 200, limitNox: 350, limitParticulate: 75 },
  { month: "Jun", so2: 130, nox: 170, particulate: 32, limitSo2: 200, limitNox: 350, limitParticulate: 75 },
]

export default function EnvironmentalMonitoring() {
  const locale = getLocaleClient()
  const dict = dicts[locale]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">{t(dict, "env.page_title")}</h1>
        <p className="text-sm text-neutral-500">{t(dict, "env.page_desc")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t(dict, "env.air_emissions")} value="126 t" description={t(dict, "common.ytd")} change="-5% vs target" changeType="positive" trend="down" icon={Wind} />
        <StatCard title={t(dict, "env.water_consumption")} value="92,500 m³" description={t(dict, "common.ytd")} change="+2% vs target" changeType="negative" trend="up" icon={Droplets} />
        <StatCard title={t(dict, "env.waste_generated")} value="1,240 t" description={t(dict, "common.ytd")} change="-8% vs target" changeType="positive" trend="down" icon={Trash2} />
        <StatCard title={t(dict, "env.incidents")} value="12" description={t(dict, "common.this_year")} change="+3 vs last year" changeType="negative" trend="up" icon={AlertTriangle} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "env.chart_performance")}</CardTitle>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyPerformance}>
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
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "env.chart_targets")}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {[
              { target: "Reduce air emissions by 15%", status: "on-track" as const, deadline: "Q4 2026" },
              { target: "Zero environmental incidents", status: "at-risk" as const, deadline: "Q4 2026" },
              { target: "Water consumption -10% YoY", status: "on-track" as const, deadline: "Q4 2026" },
            ].map((tItem, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-100 p-3">
                <div className="flex items-center gap-3">
                  <Target className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-neutral-700">{tItem.target}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={tItem.status === "on-track" ? "success" : "warning"}>{t(dict, tItem.status === "on-track" ? "common.on_track" : "common.at_risk")}</Badge>
                  <span className="text-xs text-neutral-400">{tItem.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "env.chart_air_quality")}</CardTitle>
        </CardHeader>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={airEmissions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
              <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="so2" fill="#059669" radius={[4, 4, 0, 0]} name="SO₂" />
              <Bar dataKey="nox" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="NOx" />
              <Bar dataKey="particulate" fill="#d97706" radius={[4, 4, 0, 0]} name="Particulate" />
              <Line type="monotone" dataKey="limitSo2" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 3" name="SO₂ Limit" dot={false} />
              <Line type="monotone" dataKey="limitNox" stroke="#dc2626" strokeWidth={2} strokeDasharray="6 3" name="NOx Limit" dot={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
