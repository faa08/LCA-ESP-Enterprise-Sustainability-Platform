"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck } from "lucide-react"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { useIndustryId } from "@/lib/use-industry-id"
import { getMeasurements, evaluate } from "@/lib/measurements"
import {
  INDUSTRIES,
  EMISSIONS_PARAMS,
  LIMBAH_B3_PARAMS,
  type ProperCategory,
  type ProperParam,
  type ComplianceStatus,
} from "@/lib/proper"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const statusColor: Record<ComplianceStatus | "empty", string> = {
  ok: "text-emerald-600",
  warn: "text-amber-600",
  fail: "text-red-600",
  empty: "text-neutral-400",
}

const statusLabelKey: Record<ComplianceStatus | "empty", string> = {
  ok: "proper.status_ok",
  warn: "proper.status_warn",
  fail: "proper.status_fail",
  empty: "proper.status_empty",
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

  const measurements = getMeasurements(industryId)
  const results = params.map((p) => ({ p, ...evaluate(p, measurements) }))
  const fails = results.filter((r) => r.status === "fail").length
  const warns = results.filter((r) => r.status === "warn").length
  const empty = results.filter((r) => r.status === "empty").length

  const worst: ComplianceStatus | "empty" =
    fails > 0 ? "fail" : warns > 0 ? "warn" : empty === results.length ? "empty" : "ok"
  const badgeVariant = worst === "fail" ? "danger" : worst === "warn" ? "warning" : worst === "empty" ? "neutral" : "success"

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
          {empty > 0 && <Badge variant="neutral">{empty} {t(dict, "proper.no_data_short")}</Badge>}
          <span className="text-red-600">{fails} {t(dict, "proper.fails").toLowerCase()}</span>
          <span className="text-amber-600">{warns} {t(dict, "proper.warn").toLowerCase()}</span>
          <Badge variant={badgeVariant}>
            {worst === "empty" ? t(dict, "proper.status_empty") : fails === 0 && warns === 0 ? t(dict, "proper.status_ok") : `${results.length} ${t(dict, "proper.param_short")}`}
          </Badge>
        </div>
      </div>
    </Card>
  )
}
