"use client"

import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Droplets, Cloud, Gauge, TrendingUp, AlertTriangle } from "lucide-react"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const insights = [
  {
    icon: Zap,
    titleKey: "ai.high_energy",
    descKey: "ai.high_energy_desc",
    severity: "warning" as const,
    categoryKey: "ai.category.energy",
  },
  {
    icon: Droplets,
    titleKey: "ai.water_exceeds",
    descKey: "ai.water_exceeds_desc",
    severity: "warning" as const,
    categoryKey: "ai.category.water",
  },
  {
    icon: Cloud,
    titleKey: "ai.carbon_down",
    descKey: "ai.carbon_down_desc",
    severity: "positive" as const,
    categoryKey: "ai.category.carbon",
  },
  {
    icon: Gauge,
    titleKey: "ai.equipment_issue",
    descKey: "ai.equipment_issue_desc",
    severity: "warning" as const,
    categoryKey: "ai.category.energy",
  },
  {
    icon: TrendingUp,
    titleKey: "ai.recycling_up",
    descKey: "ai.recycling_up_desc",
    severity: "positive" as const,
    categoryKey: "ai.category.waste",
  },
  {
    icon: AlertTriangle,
    titleKey: "ai.deadline_approach",
    descKey: "ai.deadline_approach_desc",
    severity: "info" as const,
    categoryKey: "ai.category.compliance",
  },
]

export default function AIInsights() {
  const locale = getLocaleClient()
  const dict = dicts[locale]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500">{t(dict, "ai.desc")}</p>
        </div>
      </div>

      <div className="grid gap-4">
        {insights.map((insight, i) => (
          <Card key={i} className="group">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  insight.severity === "positive"
                    ? "bg-emerald-50 text-emerald-600"
                    : insight.severity === "warning"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-blue-50 text-blue-600"
                }`}
              >
                <insight.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-neutral-900">{t(dict, insight.titleKey)}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-neutral-400">{t(dict, insight.categoryKey)}</span>
                  </div>
                </div>
                <p className="mt-1 text-sm text-neutral-500 leading-relaxed">{t(dict, insight.descKey)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
