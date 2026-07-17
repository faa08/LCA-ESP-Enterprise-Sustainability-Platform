"use client"

import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Recycle, DollarSign, TrendingDown, AlertTriangle, Plus } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const wasteTrend = [
  { month: "Jan", total: 132, recycled: 55, hazardous: 12 },
  { month: "Feb", total: 125, recycled: 52, hazardous: 11 },
  { month: "Mar", total: 140, recycled: 60, hazardous: 14 },
  { month: "Apr", total: 118, recycled: 68, hazardous: 10 },
  { month: "May", total: 105, recycled: 70, hazardous: 8 },
  { month: "Jun", total: 98, recycled: 65, hazardous: 7 },
  { month: "Jul", total: 92, recycled: 62, hazardous: 6 },
  { month: "Aug", total: 88, recycled: 60, hazardous: 5 },
  { month: "Sep", total: 84, recycled: 58, hazardous: 5 },
  { month: "Oct", total: 80, recycled: 55, hazardous: 4 },
  { month: "Nov", total: 76, recycled: 52, hazardous: 3 },
  { month: "Dec", total: 72, recycled: 50, hazardous: 3 },
]

const wastePie = [
  { name: "General Waste", value: 42, color: "#6b7280" },
  { name: "Recyclable", value: 31, color: "#059669" },
  { name: "Organic", value: 15, color: "#0ea5e9" },
  { name: "Hazardous", value: 7, color: "#ef4444" },
  { name: "Construction", value: 6, color: "#d97706" },
]

const programData = [
  { name: "Zero Waste to Landfill", target: "95%", progress: 72, status: "on-track" as const, deadline: "Q4 2027" },
  { name: "Plastic Reduction", target: "-50%", progress: 38, status: "at-risk" as const, deadline: "Q2 2026" },
  { name: "Composting Program", target: "100% organic", progress: 85, status: "on-track" as const, deadline: "Q3 2026" },
]

export default function WasteManagement() {
  const locale = getLocaleClient()
  const dict = dicts[locale]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">{t(dict, "waste.page_title")}</h1>
          <p className="text-sm text-neutral-500">{t(dict, "waste.page_desc")}</p>
        </div>
        <Link
          href="/waste-management/input"
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          {t(dict, "input_data")}
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t(dict, "waste.total_generated")} value="1,240 t" description={t(dict, "common.ytd")} change="-8% YoY" changeType="positive" trend="down" icon={Trash2} />
        <StatCard title={t(dict, "waste.recycling_rate")} value="64.2%" description={t(dict, "waste.target").replace("{n}", "75%")} change="+5% YoY" changeType="positive" trend="up" icon={Recycle} />
        <StatCard title={t(dict, "waste.waste_cost")} value="$184,500" description={t(dict, "common.ytd")} change="-12% YoY" changeType="positive" trend="down" icon={DollarSign} />
        <StatCard title={t(dict, "waste.hazardous")} value="86 t" description={t(dict, "common.ytd")} change="-3% YoY" changeType="positive" trend="down" icon={AlertTriangle} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "waste.chart_trend")}</CardTitle>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wasteTrend}>
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
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "waste.chart_composition")}</CardTitle>
          </CardHeader>
          <div className="flex h-64 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={wastePie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                  {wastePie.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "waste.table_title")}</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "common.category")}</th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "common.amount")}</th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "common.recycled")}</th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "common.disposal_method")}</th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "common.cost")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-100">
                  <td className="px-3 py-2.5 font-medium text-neutral-900">General Waste</td>
                  <td className="px-3 py-2.5 text-neutral-600">520 t</td>
                  <td className="px-3 py-2.5 text-neutral-600">45%</td>
                  <td className="px-3 py-2.5 text-neutral-600">Landfill</td>
                  <td className="px-3 py-2.5 text-neutral-600">$78,000</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="px-3 py-2.5 font-medium text-neutral-900">Recyclable Materials</td>
                  <td className="px-3 py-2.5 text-neutral-600">380 t</td>
                  <td className="px-3 py-2.5 text-neutral-600">95%</td>
                  <td className="px-3 py-2.5 text-neutral-600">Recycling Facility</td>
                  <td className="px-3 py-2.5 text-neutral-600">$12,000</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="px-3 py-2.5 font-medium text-neutral-900">Organic Waste</td>
                  <td className="px-3 py-2.5 text-neutral-600">180 t</td>
                  <td className="px-3 py-2.5 text-neutral-600">100%</td>
                  <td className="px-3 py-2.5 text-neutral-600">Composting</td>
                  <td className="px-3 py-2.5 text-neutral-600">$8,500</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="px-3 py-2.5 font-medium text-neutral-900">Hazardous Waste (B3)</td>
                  <td className="px-3 py-2.5 text-neutral-600">86 t</td>
                  <td className="px-3 py-2.5 text-neutral-600">30%</td>
                  <td className="px-3 py-2.5 text-neutral-600">Incineration</td>
                  <td className="px-3 py-2.5 text-neutral-600">$62,000</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="px-3 py-2.5 font-medium text-neutral-900">Construction Debris</td>
                  <td className="px-3 py-2.5 text-neutral-600">74 t</td>
                  <td className="px-3 py-2.5 text-neutral-600">80%</td>
                  <td className="px-3 py-2.5 text-neutral-600">Crushing/Reuse</td>
                  <td className="px-3 py-2.5 text-neutral-600">$24,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "waste.programs")}</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {programData.map((program, i) => (
              <div key={i} className="space-y-2 rounded-lg border border-neutral-100 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-900">{program.name}</p>
                  <Badge variant={program.status === "on-track" ? "success" : "warning"}>{t(dict, program.status === "on-track" ? "common.on_track" : "common.at_risk")}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>{t(dict, "waste.progress").replace("{n}", String(program.progress))}</span>
                  <span>{t(dict, "waste.target_label").replace("{n}", program.target)}</span>
                  <span>{t(dict, "waste.deadline").replace("{n}", program.deadline)}</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100">
                  <div
                    className={`h-2 rounded-full ${program.status === "on-track" ? "bg-emerald-500" : "bg-amber-500"}`}
                    style={{ width: `${program.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-neutral-100 pt-4">
            <CardHeader>
              <CardTitle>{t(dict, "waste.manifest")}</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {[
                { manifest: "MAN-2026-045", waste: "Oli Bekas", vendor: "PT Pengolah Limbah", qty: "2.5 t", date: "12 Jul 2026" },
                { manifest: "MAN-2026-044", waste: "Katalis Bekas", vendor: "PT Recycling", qty: "1.8 t", date: "10 Jul 2026" },
                { manifest: "MAN-2026-043", waste: "Sludge IPAL", vendor: "PT Pengolah Limbah", qty: "5.0 t", date: "08 Jul 2026" },
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-100 p-2.5">
                  <div>
                    <p className="text-xs font-medium text-neutral-900">{m.manifest}</p>
                    <p className="text-xs text-neutral-500">{m.waste}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-neutral-900">{m.qty}</p>
                    <p className="text-xs text-neutral-500">{m.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
