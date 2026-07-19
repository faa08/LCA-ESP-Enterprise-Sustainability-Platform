"use client"

import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Recycle, CheckCircle2 } from "lucide-react"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const registry = [
  { project: "Rooftop Solar Phase 1", standard: "SPPE", vintage: "2025", qty: "1,250", status: "available" as const },
  { project: "Biogas Capture Unit", standard: "SPPE", vintage: "2025", qty: "820", status: "available" as const },
  { project: "Reforestation (Verra)", standard: "Verra VCS", vintage: "2024", qty: "430", status: "retired" as const },
  { project: "Waste Heat Recovery", standard: "Gold Standard", vintage: "2024", qty: "190", status: "retired" as const },
]

export default function CarbonCreditPage() {
  const locale = getLocaleClient()
  const dict = dicts[locale]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title={t(dict, "carbon_credit.issued")} value="2,690" description={t(dict, "carbon_credit.co2eq")} icon={Leaf} />
        <StatCard title={t(dict, "carbon_credit.retired")} value="620" description={t(dict, "carbon_credit.co2eq")} icon={CheckCircle2} />
        <StatCard title={t(dict, "carbon_credit.available")} value="2,070" description={t(dict, "carbon_credit.co2eq")} icon={Recycle} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "carbon_credit.registry_title")}</CardTitle>
          <p className="mt-1 text-sm text-neutral-500">{t(dict, "carbon_credit.link_carbon")}</p>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "carbon_credit.project")}</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "carbon_credit.standard")}</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "carbon_credit.vintage")}</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "carbon_credit.quantity")}</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "carbon_credit.status")}</th>
              </tr>
            </thead>
            <tbody>
              {registry.map((r, i) => (
                <tr key={i} className="border-b border-neutral-100">
                  <td className="px-3 py-2.5 font-medium text-neutral-900">{r.project}</td>
                  <td className="px-3 py-2.5 text-neutral-600">{r.standard}</td>
                  <td className="px-3 py-2.5 text-neutral-600">{r.vintage}</td>
                  <td className="px-3 py-2.5 text-neutral-600">{r.qty}</td>
                  <td className="px-3 py-2.5">
                    <Badge variant={r.status === "retired" ? "neutral" : "success"}>
                      {t(dict, "common." + r.status)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "carbon_credit.national_title")}</CardTitle>
          <p className="mt-1 text-sm text-neutral-500">{t(dict, "carbon_credit.national_desc")}</p>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { k: t(dict, "carbon_credit.sertifikat"), v: t(dict, "carbon_credit.sertifikat_desc") },
            { k: t(dict, "carbon_credit.ets"), v: t(dict, "carbon_credit.ets_desc") },
            { k: t(dict, "carbon_credit.voluntary"), v: t(dict, "carbon_credit.voluntary_desc") },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-neutral-100 p-4">
              <div className="text-sm font-semibold text-neutral-900">{s.k}</div>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500">{s.v}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
