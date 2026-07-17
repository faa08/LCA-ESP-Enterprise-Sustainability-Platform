"use client"

import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Factory, Users, Key, Bell, Link2, Shield, UserCircle, ChevronRight } from "lucide-react"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"

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
    icon: Bell,
    nameKey: "settings.notifications",
    descKey: "settings.notifications_desc",
    color: "text-rose-600 bg-rose-50",
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
  {
    icon: UserCircle,
    nameKey: "settings.security",
    descKey: "settings.security_desc",
    color: "text-indigo-600 bg-indigo-50",
  },
]

export default function Settings() {
  const locale = getLocaleClient()
  const dict = dicts[locale]

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
