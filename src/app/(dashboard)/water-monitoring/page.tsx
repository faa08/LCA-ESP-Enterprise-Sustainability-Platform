"use client"

import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, ArrowDownToLine, ArrowUpFromLine, Recycle, Gauge, AlertTriangle, Plus } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, AreaChart, Area } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const waterTrend = [
  { month: "Jan", intake: 10500, consumption: 8500, discharge: 2000, recycling: 1200 },
  { month: "Feb", intake: 10200, consumption: 8200, discharge: 1950, recycling: 1250 },
  { month: "Mar", intake: 11000, consumption: 8800, discharge: 2100, recycling: 1300 },
  { month: "Apr", intake: 9800, consumption: 7900, discharge: 1850, recycling: 1280 },
  { month: "May", intake: 9500, consumption: 7600, discharge: 1800, recycling: 1320 },
  { month: "Jun", intake: 9200, consumption: 7400, discharge: 1750, recycling: 1350 },
  { month: "Jul", intake: 8900, consumption: 7100, discharge: 1700, recycling: 1380 },
  { month: "Aug", intake: 8600, consumption: 6900, discharge: 1650, recycling: 1400 },
  { month: "Sep", intake: 8300, consumption: 6700, discharge: 1600, recycling: 1420 },
  { month: "Oct", intake: 8000, consumption: 6500, discharge: 1550, recycling: 1450 },
  { month: "Nov", intake: 7800, consumption: 6300, discharge: 1500, recycling: 1480 },
  { month: "Dec", intake: 7600, consumption: 6100, discharge: 1450, recycling: 1500 },
]

const waterQuality = [
  { month: "Jan", pH: 7.2, tss: 28, cod: 75, bod: 22, temp: 34 },
  { month: "Feb", pH: 7.1, tss: 25, cod: 70, bod: 20, temp: 33 },
  { month: "Mar", pH: 7.3, tss: 30, cod: 80, bod: 24, temp: 35 },
  { month: "Apr", pH: 7.0, tss: 22, cod: 65, bod: 18, temp: 32 },
  { month: "May", pH: 7.1, tss: 20, cod: 60, bod: 16, temp: 32 },
  { month: "Jun", pH: 7.2, tss: 18, cod: 55, bod: 15, temp: 33 },
]

export default function WaterMonitoring() {
  const locale = getLocaleClient()
  const dict = dicts[locale]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">{t(dict, "water.page_title")}</h1>
          <p className="text-sm text-neutral-500">{t(dict, "water.page_desc")}</p>
        </div>
        <Link
          href="/water-monitoring/input"
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          {t(dict, "input_data")}
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t(dict, "water.intake")} value="115,000 m³" description={t(dict, "common.ytd")} change="-5% YoY" changeType="positive" trend="down" icon={ArrowDownToLine} />
        <StatCard title={t(dict, "water.consumption")} value="92,500 m³" description={t(dict, "common.ytd")} change="+2% YoY" changeType="negative" trend="up" icon={Droplets} />
        <StatCard title={t(dict, "water.discharge")} value="22,500 m³" description={t(dict, "common.ytd")} change="-8% YoY" changeType="positive" trend="down" icon={ArrowUpFromLine} />
        <StatCard title={t(dict, "water.recycling")} value="15,200 m³" description={t(dict, "water.recycled_pct").replace("{n}", "13.2")} change="+3% YoY" changeType="positive" trend="up" icon={Recycle} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "water.chart_usage")}</CardTitle>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waterTrend}>
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
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "water.chart_quality")}</CardTitle>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waterQuality}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line yAxisId="left" type="monotone" dataKey="pH" stroke="#059669" strokeWidth={2} name="pH" dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="tss" stroke="#d97706" strokeWidth={2} name="TSS (mg/L)" dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="cod" stroke="#ef4444" strokeWidth={2} name="COD (mg/L)" dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="bod" stroke="#a855f7" strokeWidth={2} name="BOD (mg/L)" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "water.balance")}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {[
              { label: t(dict, "water.total_intake"), value: "115,000 m³", pct: 100, color: "bg-blue-500" },
              { label: t(dict, "water.consumed"), value: "92,500 m³", pct: 80, color: "bg-emerald-500" },
              { label: t(dict, "water.discharged"), value: "22,500 m³", pct: 20, color: "bg-amber-500" },
              { label: t(dict, "water.recycled_water"), value: "15,200 m³", pct: 13, color: "bg-purple-500" },
            ].map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">{item.label}</span>
                  <span className="font-medium text-neutral-900">{item.value}</span>
                </div>
                {i > 0 && (
                  <div className="h-2 rounded-full bg-neutral-100">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "water.leak_detection")}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {[
              { location: "Plant A - Pipeline 3", status: "active" as const, severity: "high" as const, loss: "2,400 m³" },
              { location: "Plant B - Cooling Tower", status: "resolved" as const, severity: "medium" as const, loss: "800 m³" },
              { location: "Plant C - Storage Tank", status: "active" as const, severity: "low" as const, loss: "150 m³" },
            ].map((leak, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-100 p-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-neutral-400" />
                  <div>
                    <span className="text-sm text-neutral-700">{leak.location}</span>
                    <p className="text-xs text-neutral-400">{t(dict, "water.loss").replace("{n}", leak.loss)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={leak.severity === "high" ? "danger" : leak.severity === "medium" ? "warning" : "neutral"}>
                    {t(dict, "common." + leak.severity)}
                  </Badge>
                  <Badge variant={leak.status === "active" ? "warning" : "success"}>{t(dict, leak.status === "active" ? "water.active" : "water.resolved")}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
