"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck } from "lucide-react"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { useIndustryId } from "@/lib/use-industry-id"
import { getMeasurements, paramValue } from "@/lib/measurements"
import {
  INDUSTRIES,
  EMISSIONS_PARAMS,
  LIMBAH_B3_PARAMS,
  evaluateParam,
  type ProperCategory,
  type ProperParam,
  type ComplianceStatus,
} from "@/lib/proper"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const statusColor: Record<ComplianceStatus, string> = {
  ok: "text-emerald-600",
  warn: "text-amber-600",
  fail: "text-red-600",
}

const statusLabelKey: Record<ComplianceStatus, string> = {
  ok: "proper.status_ok",
  warn: "proper.status_warn",
  fail: "proper.status_fail",
}

export function ProperStrip({ category, titleKey }: { category: ProperCategory; titleKey: string }) {
  const locale = getLocaleClient()
  const dict = dicts[locale]
  const industryId = useIndustryId()

  const industry = INDUSTRIES.find((i) => i.id === industryId) ?? null
  if (!industry) return null

  let params: ProperParam[] = []
  if (category === "air_limbah") params = industry.params.filter((p) => p.category === "air_limbah")
  else if (category === "emisi") params = EMISSIONS_PARAMS
  else params = LIMBAH_B3_PARAMS

  const results = params.map((p) => ({ p, s: evaluateParam(p, paramValue(p, getMeasurements(industryId))) }))
  const fails = results.filter((r) => r.s === "fail").length
  const warns = results.filter((r) => r.s === "warn").length

  const worst: ComplianceStatus = fails > 0 ? "fail" : warns > 0 ? "warn" : "ok"
  const badgeVariant = worst === "fail" ? "danger" : worst === "warn" ? "warning" : "success"

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`h-4 w-4 ${statusColor[worst]}`} />
          <span className="text-sm font-medium text-neutral-900">{t(dict, titleKey)}</span>
          <span className={`text-xs font-medium ${statusColor[worst]}`}>
            {t(dict, statusLabelKey[worst])}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {industry.isMock && <Badge variant="neutral">{t(dict, "settings.industry_mock")}</Badge>}
          <span className="text-red-600">{fails} {t(dict, "proper.fails").toLowerCase()}</span>
          <span className="text-amber-600">{warns} {t(dict, "proper.warn").toLowerCase()}</span>
          <Badge variant={badgeVariant}>
            {fails === 0 && warns === 0 ? t(dict, "proper.status_ok") : `${results.length} ${t(dict, "proper.param_short")}`}
          </Badge>
        </div>
      </div>
    </Card>
  )
}
