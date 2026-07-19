"use client"

import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { useIndustryId } from "@/lib/use-industry-id"
import {
  INDUSTRIES,
  EMISSIONS_PARAMS,
  LIMBAH_B3_PARAMS,
  evaluateParam,
  predictRank,
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

export function ProperRankCard({ compact = false }: { compact?: boolean }) {
  const locale = getLocaleClient()
  const dict = dicts[locale]
  const industryId = useIndustryId()

  const industry = INDUSTRIES.find((i) => i.id === industryId) ?? null
  if (!industry) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <CardTitle>{t(dict, "proper.snapshot_title")}</CardTitle>
          </div>
        </CardHeader>
        <p className="rounded-lg bg-amber-50 px-3 py-3 text-sm text-amber-700">{t(dict, "ai.proper_select")}</p>
      </Card>
    )
  }

  const air = industry.params.filter((p) => p.category === "air_limbah")
  const airFails = air.filter((p) => evaluateParam(p, (p as { mock: number | boolean }).mock) === "fail").length
  const emFails = EMISSIONS_PARAMS.filter((p) => evaluateParam(p, (p as { mock: number | boolean }).mock) === "fail").length
  const b3Fails = LIMBAH_B3_PARAMS.filter((p) => evaluateParam(p, (p as { mock: number | boolean }).mock) === "fail").length
  const rank = predictRank(emFails, airFails, b3Fails)
  const totalFails = airFails + emFails + b3Fails

  if (compact) {
    return (
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">{t(dict, "proper.snapshot_title")}</p>
              <p className="text-xs text-neutral-500">{industry.name}</p>
            </div>
          </div>
          <div className={`rounded-xl border px-5 py-2 text-center ${rankColor[rank]}`}>
            <p className="text-[11px] font-medium opacity-80">{t(dict, "ai.proper_rank")}</p>
            <p className="text-xl font-bold">{rank}</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-red-600"><b>{airFails}</b> {t(dict, "proper.air_limbah")}</span>
            <span className="text-red-600"><b>{emFails}</b> {t(dict, "proper.emisi")}</span>
            <span className="text-red-600"><b>{b3Fails}</b> {t(dict, "proper.limbah_b3")}</span>
          </div>
        </div>
        {industry.isMock && (
          <p className="mt-2 rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-500">{t(dict, "proper.mock_note")}</p>
        )}
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>{t(dict, "proper.snapshot_title")}</CardTitle>
              <p className="text-xs text-neutral-500">{industry.name}</p>
            </div>
          </div>
          <div className={`rounded-xl border px-5 py-3 text-center ${rankColor[rank]}`}>
            <p className="text-xs font-medium opacity-80">{t(dict, "ai.proper_rank")}</p>
            <p className="text-2xl font-bold">{rank}</p>
          </div>
        </div>
      </CardHeader>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-neutral-100 p-3 text-center">
          <p className="text-xl font-bold text-red-600">{airFails}</p>
          <p className="text-xs text-neutral-500">{t(dict, "proper.air_limbah")}</p>
        </div>
        <div className="rounded-lg border border-neutral-100 p-3 text-center">
          <p className="text-xl font-bold text-red-600">{emFails}</p>
          <p className="text-xs text-neutral-500">{t(dict, "proper.emisi")}</p>
        </div>
        <div className="rounded-lg border border-neutral-100 p-3 text-center">
          <p className="text-xl font-bold text-red-600">{b3Fails}</p>
          <p className="text-xs text-neutral-500">{t(dict, "proper.limbah_b3")}</p>
        </div>
      </div>
      {industry.isMock && (
        <p className="mt-3 rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-500">{t(dict, "proper.mock_note")}</p>
      )}
      <p className="mt-2 text-xs text-neutral-400">{totalFails} {t(dict, "proper.fails").toLowerCase()}</p>
    </Card>
  )
}
