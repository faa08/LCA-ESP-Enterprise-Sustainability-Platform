"use client"

import Link from "next/link"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Cloud, Flame, Zap, Truck, TrendingDown, Plus } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const monthlyTrend = [
  { month: "Jan", scope1: 210, scope2: 190, scope3: 65 },
  { month: "Feb", scope1: 195, scope2: 180, scope3: 60 },
  { month: "Mar", scope1: 220, scope2: 200, scope3: 70 },
  { month: "Apr", scope1: 205, scope2: 175, scope3: 55 },
  { month: "May", scope1: 185, scope2: 160, scope3: 50 },
  { month: "Jun", scope1: 175, scope2: 155, scope3: 45 },
  { month: "Jul", scope1: 160, scope2: 145, scope3: 42 },
  { month: "Aug", scope1: 150, scope2: 140, scope3: 38 },
  { month: "Sep", scope1: 145, scope2: 135, scope3: 35 },
  { month: "Oct", scope1: 140, scope2: 130, scope3: 33 },
  { month: "Nov", scope1: 135, scope2: 125, scope3: 30 },
  { month: "Dec", scope1: 130, scope2: 120, scope3: 28 },
]

const reductionTargets = [
  { year: "2024", actual: 3800, target: 4000 },
  { year: "2025", actual: 3200, target: 3500 },
  { year: "2026", actual: 2847, target: 3000 },
  { year: "2027", actual: null, target: 2500 },
  { year: "2028", actual: null, target: 2000 },
]

export default function CarbonAccounting() {
  const locale = getLocaleClient()
  const dict = dicts[locale]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">{t(dict, "carbon.page_title")}</h1>
          <p className="text-sm text-neutral-500">{t(dict, "carbon.page_desc")}</p>
        </div>
        <Link
          href="/carbon-accounting/input"
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          {t(dict, "input_data")}
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t(dict, "carbon.scope1")} value="1,240 tCO₂e" description={t(dict, "carbon.scope1_desc")} icon={Flame} />
        <StatCard title={t(dict, "carbon.scope2")} value="1,180 tCO₂e" description={t(dict, "carbon.scope2_desc")} icon={Zap} />
        <StatCard title={t(dict, "carbon.scope3")} value="427 tCO₂e" description={t(dict, "carbon.scope3_desc")} icon={Truck} />
        <StatCard title={t(dict, "carbon.total_emissions")} value="2,847 tCO₂e" description={t(dict, "carbon.all_scopes")} change="-12% YoY" changeType="positive" trend="down" icon={Cloud} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { title: "carbon.scope1.fuel", value: "680 tCO₂e", change: "-8%", scope: "carbon.scope1_short" },
          { title: "carbon.scope1.vehicles", value: "320 tCO₂e", change: "-5%", scope: "carbon.scope1_short" },
          { title: "carbon.scope1.generators", value: "240 tCO₂e", change: "+2%", scope: "carbon.scope1_short" },
          { title: "carbon.scope2.electricity", value: "980 tCO₂e", change: "-10%", scope: "carbon.scope2_short" },
          { title: "carbon.scope2.steam", value: "200 tCO₂e", change: "-3%", scope: "carbon.scope2_short" },
          { title: "carbon.scope3.transport", value: "180 tCO₂e", change: "+5%", scope: "carbon.scope3_short" },
          { title: "carbon.scope3.suppliers", value: "120 tCO₂e", change: "-2%", scope: "carbon.scope3_short" },
          { title: "carbon.scope3.travel", value: "67 tCO₂e", change: "+15%", scope: "carbon.scope3_short" },
          { title: "carbon.scope3.waste", value: "60 tCO₂e", change: "-12%", scope: "carbon.scope3_short" },
        ].map((item, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>{t(dict, item.title)}</CardTitle>
              <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">{t(dict, item.scope)}</span>
            </CardHeader>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-neutral-900">{item.value}</p>
              <p className="text-xs text-neutral-500">{item.change} {t(dict, "common.vs_last_year")}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "carbon.chart_trend")}</CardTitle>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="scope1" fill="#059669" radius={[4, 4, 0, 0]} name={t(dict, "carbon.scope1_short")} />
                <Bar dataKey="scope2" fill="#0ea5e9" radius={[4, 4, 0, 0]} name={t(dict, "carbon.scope2_short")} />
                <Bar dataKey="scope3" fill="#a855f7" radius={[4, 4, 0, 0]} name={t(dict, "carbon.scope3_short")} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "carbon.chart_reduction")}</CardTitle>
          </CardHeader>
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
        </Card>
      </div>
    </div>
  )
}
