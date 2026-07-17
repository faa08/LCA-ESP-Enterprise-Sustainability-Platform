"use client"

import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, Beaker, Package, BarChart3 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const impactData = [
  { stage: "Raw Material", gwp: 1.8, energy: 24, water: 45, percentage: 43 },
  { stage: "Manufacturing", gwp: 1.2, energy: 42, water: 35, percentage: 29 },
  { stage: "Distribution", gwp: 0.5, energy: 18, water: 5, percentage: 12 },
  { stage: "Product Use", gwp: 0.3, energy: 8, water: 25, percentage: 7 },
  { stage: "End of Life", gwp: 0.4, energy: 8, water: 10, percentage: 9 },
]

const pieData = [
  { name: "Raw Material", value: 43, color: "#059669" },
  { name: "Manufacturing", value: 29, color: "#0ea5e9" },
  { name: "Distribution", value: 12, color: "#d97706" },
  { name: "Product Use", value: 7, color: "#a855f7" },
  { name: "End of Life", value: 9, color: "#ef4444" },
]

const materialData = [
  { material: "Steel", qty: "0.85 kg", origin: "Local", recycled: "35%", gwp: "2.1 kg" },
  { material: "Aluminum", qty: "0.12 kg", origin: "Imported", recycled: "60%", gwp: "0.8 kg" },
  { material: "Plastic (PP)", qty: "0.08 kg", origin: "Local", recycled: "10%", gwp: "0.3 kg" },
  { material: "Cardboard", qty: "0.15 kg", origin: "Local", recycled: "85%", gwp: "0.1 kg" },
  { material: "Chemicals", qty: "0.05 kg", origin: "Imported", recycled: "0%", gwp: "0.5 kg" },
]

export default function LCAPage() {
  const locale = getLocaleClient()
  const dict = dicts[locale]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t(dict, "lca.active_projects")} value="8" description={t(dict, "lca.completed_q").replace("{n}", "3")} icon={Cpu} />
        <StatCard title={t(dict, "lca.products_analyzed")} value="24" description={t(dict, "lca.all_categories")} icon={Package} />
        <StatCard title={t(dict, "lca.gwp")} value={t(dict, "lca.gwp_value").replace("{n}", "4.2")} description={t(dict, "lca.average")} icon={BarChart3} />
        <StatCard title={t(dict, "lca.water_footprint")} value="120 L/kg" description={t(dict, "lca.average")} icon={Beaker} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "lca.chart_stages")}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {impactData.map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">{item.stage}</span>
                  <span className="font-medium text-neutral-900">{item.gwp} kg CO₂e</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "lca.chart_gwp")}</CardTitle>
          </CardHeader>
          <div className="flex h-64 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "lca.material_title").replace("{n}", "EcoBox 500")}</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "lca.material")}</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "lca.qty_per_unit")}</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "common.origin")}</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "lca.recycled_content")}</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "lca.gwp_contribution")}</th>
              </tr>
            </thead>
            <tbody>
              {materialData.map((item, i) => (
                <tr key={i} className="border-b border-neutral-100">
                  <td className="px-3 py-2.5 font-medium text-neutral-900">{item.material}</td>
                  <td className="px-3 py-2.5 text-neutral-600">{item.qty}</td>
                  <td className="px-3 py-2.5 text-neutral-600">{item.origin}</td>
                  <td className="px-3 py-2.5 text-neutral-600">{item.recycled}</td>
                  <td className="px-3 py-2.5 text-neutral-600">{item.gwp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "lca.chart_comparison")}</CardTitle>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impactData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="stage" tick={{ fontSize: 10 }} stroke="#a3a3a3" />
                <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="energy" fill="#0ea5e9" radius={[4, 4, 0, 0]} name={t(dict, "lca.energy_mj")} />
                <Bar dataKey="water" fill="#0284c7" radius={[4, 4, 0, 0]} name={t(dict, "lca.water_l")} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "lca.recent_projects")}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {[
              { name: "Packaging Optimization V2", product: "EcoBox 500", status: "active" as const, date: "Started Jan 2026" },
              { name: "Raw Material Substitution", product: "Steel Grade A", status: "completed" as const, date: "Completed Dec 2025" },
              { name: "Transport Route Analysis", product: "Logistics Chain", status: "draft" as const, date: "Created Mar 2026" },
              { name: "Manufacturing Efficiency", product: "Assembly Line 3", status: "active" as const, date: "Started Feb 2026" },
            ].map((project, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-100 p-3">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{project.name}</p>
                  <p className="text-xs text-neutral-500">{project.product} &middot; {project.date}</p>
                </div>
                <Badge variant={project.status === "completed" ? "success" : project.status === "active" ? "default" : "neutral"}>
                  {t(dict, "common." + project.status)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
