"use client"

import { useState, useEffect } from "react"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, AlertTriangle, CheckCircle2, TrendingDown, Lightbulb, ShieldCheck } from "lucide-react"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { useIndustryId } from "@/lib/use-industry-id"
import { getMeasurements, evaluate } from "@/lib/measurements"
import {
  INDUSTRIES,
  EMISSIONS_PARAMS,
  LIMBAH_B3_PARAMS,
  predictRank,
  type ComplianceStatus,
  type ProperParam,
  type ProperRank,
} from "@/lib/proper"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const rankColor: Record<ProperRank, string> = {
  Emas: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Hijau: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Biru: "bg-blue-100 text-blue-700 border-blue-200",
  Merah: "bg-red-100 text-red-700 border-red-200",
  Hitam: "bg-neutral-800 text-white border-neutral-700",
}

const statusMeta: Record<ComplianceStatus | "empty", { dot: string; labelKey: string; adviceKey: string }> = {
  ok: { dot: "bg-emerald-500", labelKey: "proper.status_ok", adviceKey: "ai.proper_ok" },
  warn: { dot: "bg-amber-500", labelKey: "proper.status_warn", adviceKey: "ai.proper_risk_warn" },
  fail: { dot: "bg-red-500", labelKey: "proper.status_fail", adviceKey: "ai.proper_risk_high" },
  empty: { dot: "bg-neutral-300", labelKey: "proper.status_empty", adviceKey: "ai.proper_ok" },
}

import { useSiteId } from "@/lib/use-site-id"
import { getHubEntries, type LabEntry, type StackEntry, type B3Entry } from "@/lib/supabase/data-service"

export default function AIInsights() {
  const [locale, setLocale] = useState<Locale>("id")
  const dict = dicts[locale]
  const industryId = useIndustryId()
  const siteId = useSiteId()
  const [sbMeasurements, setSbMeasurements] = useState<Record<string, string>>({})

  useEffect(() => {
    setLocale(getLocaleClient())
    const loadSbData = async () => {
      if (!siteId) return
      import("@/lib/measurements").then(m => {
        m.getMeasurementsFromHub(siteId, industryId).then(setSbMeasurements).catch(console.error)
      })
    }

    loadSbData()
  }, [siteId, industryId])

  const industry = INDUSTRIES.find((i) => i.id === industryId) ?? null

  if (!industry) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <CardTitle>{t(dict, "ai.proper_title")}</CardTitle>
            </div>
            <p className="mt-1 text-sm text-neutral-500">{t(dict, "ai.proper_desc")}</p>
          </CardHeader>
          <div className="rounded-lg bg-amber-50 px-3 py-3 text-sm text-amber-700">
            {t(dict, "ai.proper_select")}
          </div>
        </Card>
      </div>
    )
  }

  const groups: { titleKey: string; icon: React.ReactNode; params: ProperParam[] }[] = [
    { titleKey: "proper.air_limbah", icon: <ShieldCheck className="h-4 w-4" />, params: industry.params.filter((p) => p.category === "air_limbah") },
    { titleKey: "proper.emisi", icon: <TrendingDown className="h-4 w-4" />, params: EMISSIONS_PARAMS },
    { titleKey: "proper.limbah_b3", icon: <CheckCircle2 className="h-4 w-4" />, params: LIMBAH_B3_PARAMS },
  ]

  const measurements = Object.keys(sbMeasurements).length > 0 ? sbMeasurements : getMeasurements(industryId)
  const allResults = groups.flatMap((g) => g.params.map((p) => ({ p, ...evaluate(p, measurements) })))

  const fails = allResults.filter((r) => r.status === "fail")
  const warns = allResults.filter((r) => r.status === "warn")
  const rank = predictRank(
    groups[1].params.filter((p) => evaluate(p, measurements).status === "fail").length,
    groups[0].params.filter((p) => evaluate(p, measurements).status === "fail").length,
    groups[2].params.filter((p) => evaluate(p, measurements).status === "fail").length,
  )
  const entered = allResults.filter((r) => r.status !== "empty").length

  const atRisk = [...fails, ...warns]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <CardTitle>{t(dict, "ai.proper_title")}</CardTitle>
          </div>
          <p className="mt-1 text-sm text-neutral-500">{t(dict, "ai.proper_desc")}</p>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-100 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "ai.proper_summary")}</p>
            <p className="mt-2 text-2xl font-bold text-neutral-900">{fails.length} <span className="text-sm font-normal text-red-600">/ {warns.length} peringatan</span></p>
            <p className="text-xs text-neutral-500">{t(dict, "proper.fails")} / {t(dict, "proper.warn")}</p>
          </div>
          <div className={`rounded-xl border p-4 ${rankColor[rank]}`}>
            <p className="text-xs font-medium uppercase tracking-wider opacity-80">{t(dict, "ai.proper_rank")}</p>
            <p className="mt-2 text-2xl font-bold">{rank}</p>
          </div>
          <div className="rounded-xl border border-neutral-100 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "ai.proper_risks")}</p>
            <p className="mt-2 text-2xl font-bold text-neutral-900">{atRisk.length}</p>
            <p className="text-xs text-neutral-500">{industry.name}</p>
          </div>
        </div>
        {entered === 0 && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">{t(dict, "proper.no_data_note")}</p>
        )}
      </Card>

      {/* Parameters at Risk */}
      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "ai.proper_risks")}</CardTitle>
        </CardHeader>
        {atRisk.length === 0 ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-3 text-sm text-emerald-700">{t(dict, "ai.proper_none_risk")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "ai.proper_param")}</th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "ai.proper_status")}</th>
                  <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "ai.proper_advice")}</th>
                </tr>
              </thead>
              <tbody>
                {atRisk.map((r, i) => {
                  const meta = statusMeta[r.status]
                  return (
                    <tr key={i} className="border-b border-neutral-100">
                      <td className="px-3 py-2.5 font-medium text-neutral-900">{r.p.name}</td>
                      <td className="px-3 py-2.5">
                        <span className={`flex items-center gap-1.5 text-xs font-medium ${meta.dot === "bg-emerald-500" ? "text-emerald-600" : meta.dot === "bg-amber-500" ? "text-amber-600" : "text-red-600"}`}>
                          <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                          {t(dict, meta.labelKey)}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-neutral-600">{t(dict, meta.adviceKey)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Recommended Actions + Projection */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Lightbulb className="h-4 w-4" />
              </div>
              <CardTitle>{t(dict, "ai.proper_reco")}</CardTitle>
            </div>
          </CardHeader>
          <ul className="space-y-2">
            {atRisk.length === 0 ? (
              <li className="flex items-start gap-2 text-sm text-neutral-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                {t(dict, "ai.proper_none_risk")}
              </li>
            ) : (
              atRisk.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
<AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${r.status === "fail" ? "text-red-500" : "text-amber-500"}`} />
<span><b className="text-neutral-900">{r.p.name}:</b> {t(dict, statusMeta[r.status].adviceKey)}</span>
                </li>
              ))
            )}
            <li className="flex items-start gap-2 text-sm text-neutral-600">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              {t(dict, "ai.proper_link_lca")}
            </li>
          </ul>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "ai.proper_predict")}</CardTitle>
            <p className="mt-1 text-sm text-neutral-500">{t(dict, "ai.proper_predict_desc")}</p>
          </CardHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">{t(dict, "ai.proper_rank")}</span>
              <Badge variant={rank === "Merah" || rank === "Hitam" ? "danger" : rank === "Biru" ? "default" : "success"}>{rank}</Badge>
            </div>
            <div className="h-2 rounded-full bg-neutral-100">
              <div className={`h-2 rounded-full ${rank === "Hitam" ? "bg-neutral-800" : rank === "Merah" ? "bg-red-500" : rank === "Biru" ? "bg-blue-500" : "bg-emerald-500"}`} style={{ width: rank === "Emas" ? "100%" : rank === "Hijau" ? "85%" : rank === "Biru" ? "65%" : rank === "Merah" ? "35%" : "15%" }} />
            </div>
            <p className="text-xs text-neutral-500">
              {fails.length === 0
                ? t(dict, "ai.proper_none_risk")
                : t(dict, "ai.proper_predict_desc")}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
