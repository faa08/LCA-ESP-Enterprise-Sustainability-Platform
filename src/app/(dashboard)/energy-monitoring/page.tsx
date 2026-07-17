"use client"

import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Flame, Fuel, Gauge, Thermometer, Plus } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const energyTrend = [
  { month: "Jan", electricity: 1120, gas: 360, steam: 145, fuel: 65 },
  { month: "Feb", electricity: 1080, gas: 340, steam: 138, fuel: 60 },
  { month: "Mar", electricity: 1150, gas: 370, steam: 150, fuel: 68 },
  { month: "Apr", electricity: 1050, gas: 320, steam: 130, fuel: 58 },
  { month: "May", electricity: 1020, gas: 310, steam: 125, fuel: 55 },
  { month: "Jun", electricity: 980, gas: 300, steam: 118, fuel: 52 },
  { month: "Jul", electricity: 950, gas: 290, steam: 112, fuel: 50 },
  { month: "Aug", electricity: 930, gas: 280, steam: 108, fuel: 48 },
  { month: "Sep", electricity: 900, gas: 270, steam: 102, fuel: 45 },
  { month: "Oct", electricity: 880, gas: 260, steam: 98, fuel: 43 },
  { month: "Nov", electricity: 860, gas: 250, steam: 95, fuel: 42 },
  { month: "Dec", electricity: 840, gas: 240, steam: 90, fuel: 40 },
]

const energyIntensity = [
  { month: "Jan", intensity: 2.45, production: 480 },
  { month: "Feb", intensity: 2.38, production: 475 },
  { month: "Mar", intensity: 2.50, production: 490 },
  { month: "Apr", intensity: 2.30, production: 468 },
  { month: "May", intensity: 2.25, production: 460 },
  { month: "Jun", intensity: 2.18, production: 455 },
  { month: "Jul", intensity: 2.10, production: 448 },
  { month: "Aug", intensity: 2.05, production: 440 },
  { month: "Sep", intensity: 2.00, production: 435 },
  { month: "Oct", intensity: 1.95, production: 430 },
  { month: "Nov", intensity: 1.90, production: 425 },
  { month: "Dec", intensity: 1.85, production: 420 },
]

export default function EnergyMonitoring() {
  const locale = getLocaleClient()
  const dict = dicts[locale]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">{t(dict, "energy.page_title")}</h1>
          <p className="text-sm text-neutral-500">{t(dict, "energy.page_desc")}</p>
        </div>
        <Link
          href="/energy-monitoring/input"
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          {t(dict, "input_data")}
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t(dict, "energy.electricity_stat")} value="12,400 MWh" description={t(dict, "common.ytd")} change="+2% YoY" changeType="negative" trend="up" icon={Zap} />
        <StatCard title={t(dict, "energy.natural_gas")} value="3,800 MWh" description={t(dict, "common.ytd")} change="-8% YoY" changeType="positive" trend="down" icon={Flame} />
        <StatCard title={t(dict, "energy.steam_usage")} value="1,520 MWh" description={t(dict, "common.ytd")} change="-3% YoY" changeType="positive" trend="down" icon={Thermometer} />
        <StatCard title={t(dict, "energy.fuel_usage")} value="700 MWh" description={t(dict, "common.ytd")} change="+5% YoY" changeType="negative" trend="up" icon={Fuel} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "energy.chart_consumption")}</CardTitle>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={energyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="electricity" fill="#059669" radius={[4, 4, 0, 0]} name={t(dict, "energy.electricity_stat")} />
                <Bar dataKey="gas" fill="#0ea5e9" radius={[4, 4, 0, 0]} name={t(dict, "energy.natural_gas")} />
                <Bar dataKey="steam" fill="#d97706" radius={[4, 4, 0, 0]} name={t(dict, "energy.steam_usage")} />
                <Bar dataKey="fuel" fill="#a855f7" radius={[4, 4, 0, 0]} name={t(dict, "energy.fuel_usage")} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "energy.chart_intensity")}</CardTitle>
          </CardHeader>
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
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "energy.equipment")}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {[
              { equipment: "Boiler A", efficiency: "87%", status: "good" as const },
              { equipment: "Chiller 2", efficiency: "72%", status: "needs-attention" as const },
              { equipment: "Compressor 1", efficiency: "91%", status: "good" as const },
              { equipment: "Furnace B", efficiency: "65%", status: "needs-attention" as const },
              { equipment: "Cooling Tower", efficiency: "83%", status: "good" as const },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-100 p-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-neutral-900">{item.equipment}</span>
                  {item.status === "needs-attention" && (
                    <Badge variant="warning">{t(dict, "common.needs_attention")}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-600">{item.efficiency}</span>
                  <div className={`h-2 w-2 rounded-full ${item.status === "good" ? "bg-emerald-500" : "bg-amber-500"}`} />
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
              { source: t(dict, "energy.electricity_stat"), cost: "$186,000", pct: 58 },
              { source: t(dict, "energy.natural_gas"), cost: "$72,000", pct: 22 },
              { source: t(dict, "energy.steam_usage"), cost: "$38,000", pct: 12 },
              { source: t(dict, "energy.fuel_usage"), cost: "$26,000", pct: 8 },
            ].map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">{item.source}</span>
                  <span className="font-medium text-neutral-900">{item.cost}</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-sm font-semibold">
              <span className="text-neutral-900">{t(dict, "energy.total")}</span>
              <span className="text-neutral-900">$322,000</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
