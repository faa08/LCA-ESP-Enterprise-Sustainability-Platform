"use client"

import { useState, useEffect } from "react"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Factory, Users, Key, Link2, Shield, ChevronRight, Check } from "lucide-react"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { INDUSTRIES } from "@/lib/proper"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const settingsSections = [
  {
    icon: Building2,
    nameKey: "settings.company_profile",
    descKey: "settings.company_desc",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Factory,
    nameKey: "settings.facility",
    descKey: "settings.facility_desc",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: Users,
    nameKey: "settings.users",
    descKey: "settings.users_desc",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: Shield,
    nameKey: "settings.permissions",
    descKey: "settings.permissions_desc",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: Link2,
    nameKey: "settings.integrations",
    descKey: "settings.integrations_desc",
    color: "text-cyan-600 bg-cyan-50",
  },
  {
    icon: Key,
    nameKey: "settings.api_keys",
    descKey: "settings.api_keys_desc",
    color: "text-orange-600 bg-orange-50",
  },
]

export default function Settings() {
  const locale = getLocaleClient()
  const dict = dicts[locale]
  const [industryId, setIndustryId] = useState<string>("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("enspr_industry")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setIndustryId(stored)
  }, [])

  const handleSave = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setIndustryId(val)
    if (typeof window !== "undefined") localStorage.setItem("enspr_industry", val)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const selected = INDUSTRIES.find((i) => i.id === industryId)

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-emerald-50 text-2xl font-bold text-emerald-600">
            ensPR
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-neutral-900">{t(dict, "settings.profile_name")}</p>
            <p className="text-sm text-neutral-500">{t(dict, "settings.company")}</p>
            <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400">
              <span>{t(dict, "settings.created").replace("{n}", "Jan 2026")}</span>
              <span>{t(dict, "settings.plan").replace("{n}", "Enterprise")}</span>
              <Badge variant="success">{t(dict, "common.active")}</Badge>
            </div>
          </div>
          <button className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
            {t(dict, "settings.edit_profile")}
          </button>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "settings.plant_profile")}</CardTitle>
          <p className="mt-1 text-sm text-neutral-500">{t(dict, "settings.plant_profile_desc")}</p>
        </CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="text-sm font-medium text-neutral-700">{t(dict, "settings.select_industry")}</label>
          <select
            value={industryId}
            onChange={handleSave}
            className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-emerald-500 focus:outline-none"
          >
            <option value="">—</option>
            {INDUSTRIES.map((i) => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
          {saved && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
              <Check className="h-3.5 w-3.5" /> {t(dict, "settings.industry_saved")}
            </span>
          )}
        </div>
        {selected && (
          <div className="mt-3">
            <Badge variant={selected.isMock ? "neutral" : "success"}>
              {selected.isMock ? t(dict, "settings.industry_mock") : t(dict, "settings.industry_real")}
            </Badge>
            <span className="ml-2 text-xs text-neutral-500">
              {selected.params.filter((p) => p.category === "air_limbah").length} parameter air limbah
            </span>
          </div>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {settingsSections.map((section, i) => (
          <Card key={i} className="group cursor-pointer hover:border-emerald-200">
            <div className="flex items-start gap-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${section.color}`}>
                <section.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-neutral-900">{t(dict, section.nameKey)}</p>
                  <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-neutral-500" />
                </div>
                <p className="mt-0.5 text-xs text-neutral-500">{t(dict, section.descKey)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { labelKey: "settings.total_users", value: "24", changeKey: "common.vs_last_year_change", changeVal: "+2" },
          { labelKey: "settings.active_facilities", value: "12", changeKey: null, changeVal: "3 regions" },
          { labelKey: "settings.storage_used", value: "2.4 GB", changeKey: null, changeVal: t(dict, "settings.of") + " 10 GB" },
        ].map((stat, i) => (
          <Card key={i}>
            <p className="text-xs text-neutral-500">{t(dict, stat.labelKey)}</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">{stat.value}</p>
            <p className="mt-0.5 text-xs text-neutral-400">{stat.changeVal}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
