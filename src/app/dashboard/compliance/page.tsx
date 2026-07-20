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

const monthlyScores = [
  { month: "Jan", actual: 82, target: 85 },
  { month: "Feb", actual: 84, target: 85 },
  { month: "Mar", actual: 81, target: 86 },
  { month: "Apr", actual: 85, target: 86 },
  { month: "May", actual: 87, target: 87 },
  { month: "Jun", actual: 90, target: 88 },
  { month: "Jul", actual: 92, target: 89 },
  { month: "Aug", actual: 94, target: 90 },
]

const capaItems = [
  {
    issue: "Waste Storage Label Missing",
    priority: "high" as const,
    assigned: "HSE Manager",
    due: "20 Jul",
    status: "in_progress" as const,
  },
  {
    issue: "Expired Emission Permit",
    priority: "critical" as const,
    assigned: "Compliance Officer",
    due: "15 Jul",
    status: "overdue" as const,
  },
  {
    issue: "pH Discharge Exceeds Limit",
    priority: "high" as const,
    assigned: "Environmental Engineer",
    due: "25 Jul",
    status: "assigned" as const,
  },
  {
    issue: "Stack Test Report Missing",
    priority: "medium" as const,
    assigned: "Lab Coordinator",
    due: "05 Aug",
    status: "open" as const,
  },
  {
    issue: "Hazardous Waste Manifest Error",
    priority: "high" as const,
    assigned: "Waste Supervisor",
    due: "18 Jul",
    status: "in_progress" as const,
  },
]

const permits = [
  { nameKey: "compliance.air_permit", status: "valid" as const, expires: null },
  { nameKey: "compliance.wastewater_permit", status: "expiring" as const, expires: "28 days" },
  { nameKey: "compliance.hazardous_permit", status: "valid" as const, expires: null },
  { nameKey: "compliance.env_approval", status: "valid" as const, expires: null },
]

const calendarActivities = [
  { nameKey: "compliance.iso_audit", date: "01 Sep 2026", daysLeft: 47 },
  { nameKey: "compliance.proper_submission", date: "15 Aug 2026", daysLeft: 30 },
  { nameKey: "compliance.ghg_verification", date: "15 Oct 2026", daysLeft: 91 },
  { nameKey: "compliance.water_quality", date: "31 Jul 2026", daysLeft: 15 },
  { nameKey: "compliance.env_report", date: "31 Aug 2026", daysLeft: 46 },
]

const standardsData = [
  { name: "ISO 14001", status: "certified" as const, score: "100%", nextAudit: "Q3 2026" },
  { name: "GRI", status: "compliant" as const, score: "95%", nextAudit: "Q4 2026" },
  { name: "PROPER", status: "compliant" as const, score: "88%", nextAudit: "Q2 2026" },
  { name: "CDP", status: "submitted" as const, score: "A-", nextAudit: "Q1 2027" },
  { name: "TCFD", status: "compliant" as const, score: "92%", nextAudit: "Q1 2027" },
  { name: "SBTi", status: "pending" as const, score: "-", nextAudit: "Q4 2026" },
]

const findingsData = [
  { finding: "High COD Discharge", categoryKey: "compliance.wastewater_permit", severity: "high" as const, status: "open" as const },
  { finding: "Chemical Storage Label Missing", categoryKey: "compliance.hazardous_permit", severity: "medium" as const, status: "assigned" as const },
  { finding: "Expired Calibration Certificate", categoryKey: "compliance.air_permit", severity: "low" as const, status: "closed" as const },
  { finding: "Noise Level Exceedance", categoryKey: "compliance.env_approval", severity: "medium" as const, status: "in_progress" as const },
  { finding: "Waste Manifest Incomplete", categoryKey: "compliance.hazardous_permit", severity: "high" as const, status: "open" as const },
]

const permitColorMap: Record<string, string> = {
  valid: "bg-emerald-500",
  expiring: "bg-amber-500",
  expired: "bg-red-500",
}

const riskItems = [
  { labelKey: "compliance.low_risk", count: 18, color: "bg-emerald-500", width: "45%" },
  { labelKey: "compliance.medium_risk", count: 8, color: "bg-amber-500", width: "20%" },
  { labelKey: "compliance.high_risk", count: 3, color: "bg-red-500", width: "7.5%" },
]

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
        <StatCard title={t(dict, "compliance.score")} value="94/100" description={t(dict, "compliance.across_standards")} change="+2 pts" changeType="positive" trend="up" icon={ShieldCheck} />
        <StatCard title={t(dict, "compliance.open_findings")} value="12" description={t(dict, "compliance.requiring_action")} change="+3 this month" changeType="negative" trend="up" icon={AlertTriangle} />
        <StatCard title={t(dict, "compliance.audits_this_year")} value="8" description={t(dict, "compliance.audits_detail").replace("{c}", "4").replace("{s}", "4")} icon={ClipboardCheck} />
        <StatCard title={t(dict, "compliance.deadlines")} value="5" description={t(dict, "compliance.next_30_days")} icon={CalendarDays} />
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
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyScores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 3" name={t(dict, "compliance.target")} dot={false} />
                  <Line type="monotone" dataKey="actual" stroke="#059669" strokeWidth={2} name={t(dict, "compliance.actual")} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
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
                  {capaItems.map((item, i) => (
                    <tr key={i} className="border-b border-neutral-100">
                      <td className="px-3 py-2.5 font-medium text-neutral-900">{item.issue}</td>
                      <td className="px-3 py-2.5">
                        <Badge variant={item.priority === "critical" ? "danger" : item.priority === "high" ? "warning" : "neutral"}>
                          {item.priority === "critical" ? t(dict, "common.critical") : item.priority === "high" ? t(dict, "common.high") : t(dict, "common.medium")}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5 text-neutral-600">{item.assigned}</td>
                      <td className="px-3 py-2.5 text-neutral-600">{item.due}</td>
                      <td className="px-3 py-2.5">
                        <Badge variant={item.status === "overdue" ? "danger" : item.status === "in_progress" ? "warning" : item.status === "assigned" ? "default" : "neutral"}>
                          {t(dict, "compliance." + item.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
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
              {permits.map((permit, i) => (
                <div key={i} className="rounded-lg border border-neutral-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-900">{t(dict, permit.nameKey)}</span>
                    <span className={`flex h-2.5 w-2.5 shrink-0 rounded-full ${permitColorMap[permit.status]}`} />
                  </div>
                  <p className={`mt-1 text-xs font-medium ${permit.status === "valid" ? "text-emerald-600" : permit.status === "expiring" ? "text-amber-600" : "text-red-600"}`}>
                    {permit.status === "valid" ? t(dict, "compliance.valid") : t(dict, "compliance.expires_in").replace("{n}", permit.expires || "")}
                  </p>
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
              {calendarActivities.map((activity, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-100 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-50">
                      <CalendarDays className="h-4 w-4 text-neutral-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{t(dict, activity.nameKey)}</p>
                      <p className="text-xs text-neutral-500">{activity.date}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${activity.daysLeft <= 15 ? "text-red-600" : activity.daysLeft <= 46 ? "text-amber-600" : "text-neutral-500"}`}>
                    {t(dict, "compliance.days_remaining").replace("{n}", String(activity.daysLeft))}
                  </span>
                </div>
              ))}
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
                  {standardsData.map((item, i) => (
                    <tr key={i} className="border-b border-neutral-100">
                      <td className="px-3 py-2.5 font-medium text-neutral-900">{item.name}</td>
                      <td className="px-3 py-2.5">
                        <Badge variant={item.status === "compliant" || item.status === "certified" ? "success" : item.status === "submitted" ? "default" : "warning"}>
                          {t(dict, "common." + item.status)}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5 text-neutral-600">{item.score}</td>
                      <td className="px-3 py-2.5 text-neutral-600">{item.nextAudit}</td>
                    </tr>
                  ))}
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
                  {findingsData.map((item, i) => (
                    <tr key={i} className="border-b border-neutral-100">
                      <td className="px-3 py-2.5 font-medium text-neutral-900">{item.finding}</td>
                      <td className="px-3 py-2.5 text-neutral-600">{t(dict, item.categoryKey)}</td>
                      <td className="px-3 py-2.5">
                        <Badge variant={item.severity === "high" ? "danger" : item.severity === "medium" ? "warning" : "neutral"}>
                          {t(dict, "common." + item.severity)}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge variant={item.status === "closed" ? "success" : item.status === "in_progress" ? "warning" : item.status === "assigned" ? "default" : "neutral"}>
                          {t(dict, "compliance." + item.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
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
          {riskItems.map((risk, i) => (
            <div key={i} className="rounded-lg border border-neutral-100 p-4">
              <p className="text-sm text-neutral-500">{t(dict, risk.labelKey)}</p>
              <p className="mt-1 text-2xl font-bold text-neutral-900">{risk.count}</p>
              <div className="mt-2 h-2 rounded-full bg-neutral-100">
                <div className={`h-2 rounded-full ${risk.color}`} style={{ width: risk.width }} />
              </div>
            </div>
          ))}
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm text-amber-700">{t(dict, "compliance.overall_risk")}</p>
            <div className="mt-1 flex items-center gap-2">
              <Gauge className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold text-amber-700">{t(dict, "compliance.moderate")}</span>
            </div>
            <p className="mt-1 text-xs text-amber-600">3 high-risk items need immediate action</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
