"use client"

import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, AlertTriangle, ClipboardCheck, CalendarDays, Gauge, Wind, Droplets, Recycle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
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
  type ProperRank,
  type ProperParam,
} from "@/lib/proper"

const rankColor: Record<ProperRank, string> = {
  Emas: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Hijau: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Biru: "bg-blue-100 text-blue-700 border-blue-200",
  Merah: "bg-red-100 text-red-700 border-red-200",
  Hitam: "bg-neutral-800 text-white border-neutral-700",
}

const statusMeta: Record<ComplianceStatus | "empty", { dot: string; labelKey: string }> = {
  ok: { dot: "bg-emerald-500", labelKey: "proper.status_ok" },
  warn: { dot: "bg-amber-500", labelKey: "proper.status_warn" },
  fail: { dot: "bg-red-500", labelKey: "proper.status_fail" },
  empty: { dot: "bg-neutral-300", labelKey: "proper.status_empty" },
}

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

export default function Compliance() {
  const locale = getLocaleClient()
  const dict = dicts[locale]
  const industryId = useIndustryId()

  const industry = INDUSTRIES.find((i) => i.id === industryId) ?? null

  // Build evaluation groups from user-entered measurements only (no demo fallback)
  const measurements = getMeasurements(industryId)
  const airParams = industry ? industry.params.filter((p) => p.category === "air_limbah") : []
  const airResults = airParams.map((p) => ({ p, ...evaluate(p, measurements) }))
  const emResults = EMISSIONS_PARAMS.map((p) => ({ p, ...evaluate(p, measurements) }))
  const b3Results = LIMBAH_B3_PARAMS.map((p) => ({ p, ...evaluate(p, measurements) }))

  const countFails = (arr: { status: ComplianceStatus | "empty" }[]) => arr.filter((r) => r.status === "fail").length
  const countWarn = (arr: { status: ComplianceStatus | "empty" }[]) => arr.filter((r) => r.status === "warn").length
  const countEmpty = (arr: { status: ComplianceStatus | "empty" }[]) => arr.filter((r) => r.status === "empty").length

  const rank = predictRank(countFails(emResults), countFails(airResults), countFails(b3Results))
  const entered = airResults.length + emResults.length + b3Results.length - countEmpty(airResults) - countEmpty(emResults) - countEmpty(b3Results)

  const renderGroup = (
    title: string,
    icon: React.ReactNode,
    results: { p: ProperParam; value: number | boolean | null; status: ComplianceStatus | "empty" }[],
  ) => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">{icon}</div>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <div className="space-y-2">
        {results.map((r, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-neutral-900">{r.p.name}</p>
              <p className="text-xs text-neutral-500">
                {r.value === null
                  ? `— / ${r.p.kind === "range" ? `${(r.p as { min: number }).min}–${(r.p as { max: number }).max}` : r.p.kind === "numeric" && (r.p as { max?: number }).max !== undefined ? `max ${(r.p as { max: number }).max}` : "—"} ${(r.p as { unit?: string }).unit || ""}`
                  : r.p.kind === "checklist"
                    ? r.value ? t(dict, "proper.yes") : t(dict, "proper.no")
                    : `${r.value} ${r.p.unit || ""}`}
                {r.p.kind === "numeric" && (r.p as { max?: number }).max !== undefined ? ` / max ${(r.p as { max: number }).max} ${r.p.unit}` : ""}
                {r.p.kind === "range" ? ` / ${(r.p as { min: number }).min}–${(r.p as { max: number }).max}` : ""}
              </p>
            </div>
            <span className={`flex items-center gap-1.5 text-xs font-medium ${statusMeta[r.status].dot === "bg-emerald-500" ? "text-emerald-600" : statusMeta[r.status].dot === "bg-amber-500" ? "text-amber-600" : statusMeta[r.status].dot === "bg-red-500" ? "text-red-600" : "text-neutral-400"}`}>
              <span className={`h-2 w-2 rounded-full ${statusMeta[r.status].dot}`} />
              {t(dict, statusMeta[r.status].labelKey)}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-neutral-500">{t(dict, "proper.fails")}: <b className="text-red-600">{countFails(results)}</b> · {t(dict, "proper.warn")}: <b className="text-amber-600">{countWarn(results)}</b> · {t(dict, "proper.no_data_short")}: <b className="text-neutral-400">{countEmpty(results)}</b></span>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* PROPER Snapshot */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>{t(dict, "proper.snapshot_title")}</CardTitle>
              <p className="mt-1 text-sm text-neutral-500">{t(dict, "proper.snapshot_desc")}</p>
            </div>
            <div className={`rounded-xl border px-5 py-3 text-center ${rankColor[rank]}`}>
              <p className="text-xs font-medium opacity-80">{t(dict, "proper.predicted_rank")}</p>
              <p className="text-2xl font-bold">{rank}</p>
            </div>
          </div>
          {!industry && (
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
              {t(dict, "proper.no_industry")}
            </p>
          )}
          {industry && entered === 0 && (
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
              {t(dict, "proper.no_data_note")}
            </p>
          )}
        </CardHeader>
        <div className="grid gap-4 lg:grid-cols-3">
          {renderGroup(t(dict, "proper.air_limbah"), <Droplets className="h-4 w-4" />, airResults)}
          {renderGroup(t(dict, "proper.emisi"), <Wind className="h-4 w-4" />, emResults)}
          {renderGroup(t(dict, "proper.limbah_b3"), <Recycle className="h-4 w-4" />, b3Results)}
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t(dict, "compliance.score")} value={`${entered === 0 ? 0 : Math.max(0, 100 - countFails(airResults) - countFails(emResults) - countFails(b3Results))}/100`} description={t(dict, "compliance.across_standards")} icon={ShieldCheck} />
        <StatCard title={t(dict, "compliance.open_findings")} value={String(countFails(airResults) + countFails(emResults) + countFails(b3Results))} description={t(dict, "compliance.requiring_action")} icon={AlertTriangle} />
        <StatCard title={t(dict, "compliance.audits_this_year")} value={String(entered)} description={t(dict, "compliance.audits_detail").replace("{c}", "0").replace("{s}", "0")} icon={ClipboardCheck} />
        <StatCard title={t(dict, "compliance.deadlines")} value="0" description={t(dict, "compliance.next_30_days")} icon={CalendarDays} />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* 1. Compliance Trend */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>{t(dict, "compliance.trend")}</CardTitle>
              <p className="text-xs text-neutral-500">{t(dict, "compliance.trend_desc")}</p>
            </CardHeader>
            <div className="h-64">
              {entered === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                  {t(dict, "datahub.empty")}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[{ period: "YTD", actual: Math.max(0, 100 - countFails(airResults) - countFails(emResults) - countFails(b3Results)), target: 100 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                    <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 3" name={t(dict, "compliance.target")} dot={false} />
                    <Line type="monotone" dataKey="actual" stroke="#059669" strokeWidth={2} name={t(dict, "compliance.actual")} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>

        {/* 2. Open Corrective Actions (CAPA) */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>{t(dict, "compliance.capa")}</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "compliance.capa_issue")}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "compliance.capa_priority")}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "compliance.capa_assigned")}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "compliance.capa_due")}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "compliance.capa_status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {countFails(airResults) + countFails(emResults) + countFails(b3Results) === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center text-sm text-neutral-400">
                        {t(dict, "datahub.empty")}
                      </td>
                    </tr>
                  ) : (
                    [...airResults, ...emResults, ...b3Results]
                      .filter((r) => r.status === "fail")
                      .map((r, i) => (
                        <tr key={i} className="border-b border-neutral-100">
                          <td className="px-3 py-2.5 font-medium text-neutral-900">{r.p.name}</td>
                          <td className="px-3 py-2.5">
                            <Badge variant="danger">{t(dict, "common.high")}</Badge>
                          </td>
                          <td className="px-3 py-2.5 text-neutral-600">—</td>
                          <td className="px-3 py-2.5 text-neutral-600">—</td>
                          <td className="px-3 py-2.5">
                            <Badge variant="neutral">{t(dict, "compliance.open")}</Badge>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* 3. Environmental Permit Status */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>{t(dict, "compliance.permits")}</CardTitle>
            </CardHeader>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { nameKey: "compliance.air_permit", status: "valid" as const },
                { nameKey: "compliance.wastewater_permit", status: "valid" as const },
                { nameKey: "compliance.hazardous_permit", status: "valid" as const },
                { nameKey: "compliance.env_approval", status: "valid" as const },
              ].map((permit, i) => (
                <div key={i} className="rounded-lg border border-neutral-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-900">{t(dict, permit.nameKey)}</span>
                    <span className={`flex h-2.5 w-2.5 shrink-0 rounded-full ${permit.status === "valid" ? "bg-emerald-500" : permit.status === "expiring" ? "bg-amber-500" : "bg-red-500"}`} />
                  </div>
                  <p className="mt-1 text-xs font-medium text-neutral-600">{t(dict, "compliance.valid")}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 4. Compliance Calendar */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>{t(dict, "compliance.calendar")}</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <p className="px-1 py-6 text-center text-sm text-neutral-400">
                {t(dict, "datahub.empty")}
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* 5. Standards Compliance */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>{t(dict, "compliance.overview")}</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "common.standard")}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "common.status")}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "common.score")}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "common.next_audit")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-sm text-neutral-400">
                      {t(dict, "datahub.empty")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* 6. Recent Audit Findings */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>{t(dict, "compliance.findings")}</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "compliance.finding")}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "compliance.category")}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "compliance.severity")}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{t(dict, "compliance.capa_status")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-sm text-neutral-400">
                      {t(dict, "datahub.empty")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* 7. Compliance Risk Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "compliance.risk_overview")}</CardTitle>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-neutral-100 p-4">
            <p className="text-sm text-neutral-500">{t(dict, "compliance.low_risk")}</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">{countFails(airResults) + countFails(emResults) + countFails(b3Results) === 0 && entered > 0 ? 1 : 0}</p>
            <div className="mt-2 h-2 rounded-full bg-neutral-100">
              <div className="h-2 rounded-full bg-emerald-500" style={{ width: entered > 0 ? "100%" : "0%" }} />
            </div>
          </div>
          <div className="rounded-lg border border-neutral-100 p-4">
            <p className="text-sm text-neutral-500">{t(dict, "compliance.medium_risk")}</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">{countWarn(airResults) + countWarn(emResults) + countWarn(b3Results)}</p>
            <div className="mt-2 h-2 rounded-full bg-neutral-100">
              <div className="h-2 rounded-full bg-amber-500" style={{ width: countWarn(airResults) + countWarn(emResults) + countWarn(b3Results) > 0 ? "100%" : "0%" }} />
            </div>
          </div>
          <div className="rounded-lg border border-neutral-100 p-4">
            <p className="text-sm text-neutral-500">{t(dict, "compliance.high_risk")}</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">{countFails(airResults) + countFails(emResults) + countFails(b3Results)}</p>
            <div className="mt-2 h-2 rounded-full bg-neutral-100">
              <div className="h-2 rounded-full bg-red-500" style={{ width: countFails(airResults) + countFails(emResults) + countFails(b3Results) > 0 ? "100%" : "0%" }} />
            </div>
          </div>
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm text-amber-700">{t(dict, "compliance.overall_risk")}</p>
            <div className="mt-1 flex items-center gap-2">
              <Gauge className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold text-amber-700">{entered === 0 ? "—" : t(dict, "compliance.moderate")}</span>
            </div>
            <p className="mt-1 text-xs text-amber-600">
              {countFails(airResults) + countFails(emResults) + countFails(b3Results)} high-risk items need immediate action
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
