"use client"

import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, Beaker, Package, BarChart3 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { useIndustryId } from "@/lib/use-industry-id"
import { useMeasurements, paramValue } from "@/lib/measurements"
import { LCA_PARAMS, OTHER_PARAMS } from "@/lib/proper"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const fmt = (v: number | null, unit = "") => (v === null ? "—" : `${v}${unit}`)

function val(code: string, m: Record<string, string>) {
  const p = OTHER_PARAMS.find((p) => p.code === code)
  return p ? paramValue(p, m) : null
}

export default function LCAPage() {
  const locale = getLocaleClient()
  const dict = dicts[locale]
  const industryId = useIndustryId()
  const m = useMeasurements(industryId)

  const gwp = (val("lca_gwp", m) as number | null)
  const water = (val("lca_water", m) as number | null)
  const recycled = (val("lca_recycled", m) as number | null)

  const impactData = LCA_PARAMS.map((p) => ({
    stage: p.name,
    gwp: (paramValue(p, m) as number | null) ?? 0,
    percentage: 0,
  }))

  const pieData = impactData.map((d, i) => ({
    name: d.stage,
    value: d.gwp,
    color: ["#059669", "#0ea5e9", "#d97706", "#a855f7"][i % 4],
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t(dict, "lca.active_projects")} value="0" description={t(dict, "lca.completed_q").replace("{n}", "0")} icon={Cpu} />
        <StatCard title={t(dict, "lca.products_analyzed")} value="0" description={t(dict, "lca.all_categories")} icon={Package} />
        <StatCard title={t(dict, "lca.gwp")} value={fmt(gwp, " kg CO₂e/unit")} description={t(dict, "lca.average")} icon={BarChart3} />
        <StatCard title={t(dict, "lca.water_footprint")} value={fmt(water, " L/kg")} description={t(dict, "lca.average")} icon={Beaker} />
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
        <p className="text-sm text-emerald-800">{t(dict, "lca.proper_link")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "lca.chart_stages")}</CardTitle>
          </CardHeader>
          {impactData.some((d) => d.gwp > 0) ? (
            <div className="space-y-3">
              {impactData.map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">{item.stage}</span>
                    <span className="font-medium text-neutral-900">{fmt(item.gwp, " kg CO₂e")}</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-1 py-6 text-sm text-neutral-400">{t(dict, "common.no_data")}</p>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "lca.chart_gwp")}</CardTitle>
          </CardHeader>
          {pieData.some((d) => d.value > 0) ? (
            <div className="flex h-64 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}`}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-neutral-400">{t(dict, "common.no_data")}</div>
          )}
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "lca.material_title").replace("{n}", "—")}</CardTitle>
        </CardHeader>
        <p className="px-1 py-6 text-sm text-neutral-400">{t(dict, "common.no_data")}</p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "lca.chart_comparison")}</CardTitle>
          </CardHeader>
          {impactData.some((d) => d.gwp > 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="stage" tick={{ fontSize: 10 }} stroke="#a3a3a3" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="gwp" fill="#0ea5e9" radius={[4, 4, 0, 0]} name={t(dict, "lca.gwp")} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-neutral-400">{t(dict, "common.no_data")}</div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "lca.recent_projects")}</CardTitle>
          </CardHeader>
          <p className="px-1 py-6 text-sm text-neutral-400">{t(dict, "common.no_data")}</p>
        </Card>
      </div>

      {/* Methodology & Scope */}
      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "lca.methodology_title")}</CardTitle>
          <p className="mt-1 text-sm text-neutral-500">{t(dict, "lca.methodology_desc")}</p>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: t(dict, "lca.standard_iso"), v: t(dict, "lca.standard_iso_desc") },
            { k: t(dict, "lca.standard_sni"), v: t(dict, "lca.standard_sni_desc") },
            { k: t(dict, "lca.standard_perpres"), v: t(dict, "lca.standard_perpres_desc") },
            { k: t(dict, "lca.standard_tek"), v: t(dict, "lca.standard_tek_desc") },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-neutral-100 p-4">
              <div className="text-sm font-semibold text-neutral-900">{s.k}</div>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500">{s.v}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-neutral-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "lca.functional_unit")}</div>
            <div className="mt-1 text-sm text-neutral-800">{t(dict, "lca.functional_unit_val")}</div>
          </div>
          <div className="rounded-xl bg-neutral-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "lca.system_boundary")}</div>
            <div className="mt-1 text-sm text-neutral-800">{t(dict, "lca.system_boundary_val")}</div>
          </div>
          <div className="rounded-xl bg-neutral-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "lca.cutoff")}</div>
            <div className="mt-1 text-sm text-neutral-800">{t(dict, "lca.cutoff_val")}</div>
          </div>
        </div>
      </Card>

      {/* LCIA Impact Categories */}
      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "lca.impact_title")}</CardTitle>
          <p className="mt-1 text-sm text-neutral-500">{t(dict, "lca.impact_desc")}</p>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "lca.impact_category")}</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "lca.impact_indicator")}</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "lca.impact_unit")}</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "lca.impact_value")}</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "lca.impact_method")}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cat: "Climate Change", ind: "GWP", unit: "kg CO₂e", val: fmt(gwp), method: "IPCC 2021" },
                { cat: "Water Depletion", ind: "WD", unit: "L", val: fmt(water), method: "AWARE" },
                { cat: "Eutrophication", ind: "EP", unit: "kg PO₄e", val: fmt(val("lca_eutro", m) as number | null), method: "CML-IA" },
                { cat: "Recycled Content", ind: "RC", unit: "%", val: fmt(recycled), method: "User Input" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-neutral-100">
                  <td className="px-3 py-2.5 font-medium text-neutral-900">{row.cat}</td>
                  <td className="px-3 py-2.5 text-neutral-600">{row.ind}</td>
                  <td className="px-3 py-2.5 text-neutral-600">{row.unit}</td>
                  <td className="px-3 py-2.5 text-neutral-600">{row.val}</td>
                  <td className="px-3 py-2.5 text-neutral-600">{row.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 px-3 text-xs italic text-neutral-400">{t(dict, "lca.disclaimer")}</p>
      </Card>
    </div>
  )
}
