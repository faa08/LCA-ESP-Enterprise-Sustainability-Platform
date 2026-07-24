"use client"

import { t, type Locale } from "@/lib/i18n"
import { id } from "@/locales/id"
import { en } from "@/locales/en"
import { StatCard } from "@/components/ui/stat-card"
import { KpiProgress } from "@/components/ui/kpi-progress"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProperRankCard } from "@/components/dashboard/proper-rank-card"
import { useIndustryId } from "@/lib/use-industry-id"
import { getMeasurements, paramValue } from "@/lib/measurements"
import {
  OTHER_PARAMS,
} from "@/lib/proper"
import {
  Cloud,
  Zap,
  Droplets,
  Recycle,
  ShieldCheck,
  TrendingUp,
  Factory,
  AlertTriangle,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const dicts: Record<Locale, Record<string, string>> = { id, en }

import { useViewMode } from "@/lib/use-view-mode"
import { Briefcase, Wrench } from "lucide-react"

export function ExecutiveOverview({ locale }: { locale: Locale }) {
  const dict = dicts[locale]
  const industryId = useIndustryId()
  const measurements = getMeasurements(industryId)
  const [viewMode] = useViewMode()

  const get = (code: string) => {
    const p = OTHER_PARAMS.find((x) => x.code === code)
    if (!p) return null
    const v = paramValue(p, measurements)
    return typeof v === "number" ? v : null
  }

  const scope1 = get("ghg_scope1") ?? 0
  const scope2 = get("ghg_scope2") ?? 0
  const scope3 = get("ghg_scope3") ?? 0
  const carbonTotal = scope1 + scope2 + scope3
  const energyTotal = get("energy_total") ?? 0
  const energyRenewable = get("energy_renewable") ?? 0

  const hasData = (code: string) => get(code) !== null
  const hasCarbon = hasData("ghg_scope1") || hasData("ghg_scope2") || hasData("ghg_scope3")
  const hasEnergy = hasData("energy_total")
  const hasRenewable = hasData("energy_renewable")

  const renewablePct = energyTotal > 0 ? Math.round((energyRenewable / energyTotal) * 100) : 0

  const fmt = (n: number) =>
    n === 0 ? "0" : n.toLocaleString("en-US", { maximumFractionDigits: 2 })

  const enteredCount = OTHER_PARAMS.filter((p) => paramValue(p, measurements) !== null).length
  const hasSeries = hasCarbon || hasEnergy
  const emissionsSeries = hasSeries
    ? [{ period: "YTD", scope1, scope2, scope3, energy: energyTotal, water: 0 }]
    : []

  return (
    <div className="space-y-6">
      {/* Mode Indicator Banner */}
      <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-3.5 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${viewMode === "executive" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}`}>
            {viewMode === "executive" ? <Briefcase className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-900">
              Tampilan Aktif: {viewMode === "executive" ? "👔 Executive Director View (Ringkasan Direksi)" : "👷 EHS Engineer View (Detail Teknis & Sensor)"}
            </p>
            <p className="text-[11px] text-neutral-500">
              {viewMode === "executive"
                ? "Fokus pada Skor Kepatuhan PROPER, Monetisasi Karbon Kredit, ROI Lingkungan, dan Risiko High-Level."
                : "Fokus pada Baku Mutu Parameter, Log Telemetri CEMS, Ingest Data Hub, dan Tindakan Korektif (CAPA)."}
            </p>
          </div>
        </div>
        <Badge variant={viewMode === "executive" ? "success" : "brand"}>
          {viewMode.toUpperCase()} MODE
        </Badge>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t(dict, "dashboard.kpi.carbon")}
          value={hasCarbon ? `${fmt(carbonTotal)} tCO₂e` : "0"}
          description={t(dict, "dashboard.kpi.carbon_desc")}
          icon={Cloud}
        />
        <StatCard
          title={t(dict, "dashboard.kpi.energy")}
          value={hasEnergy ? `${fmt(energyTotal)} MWh` : "0"}
          description={t(dict, "dashboard.kpi.energy_desc")}
          icon={Zap}
        />
        <StatCard
          title={t(dict, "dashboard.kpi.water")}
          value="0"
          description={t(dict, "dashboard.kpi.water_desc")}
          icon={Droplets}
        />
        <StatCard
          title={t(dict, "dashboard.kpi.recycled")}
          value={hasRenewable && energyTotal > 0 ? `${renewablePct}%` : "0"}
          description={t(dict, "dashboard.kpi.recycled_desc")}
          icon={Recycle}
        />
      </div>

      <ProperRankCard compact />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t(dict, "dashboard.kpi.compliance")}
          value="0/100"
          description={t(dict, "dashboard.kpi.compliance_desc")}
          icon={ShieldCheck}
        />
        <StatCard
          title={t(dict, "dashboard.kpi.esg")}
          value="—"
          description={t(dict, "dashboard.kpi.esg_desc")}
          icon={TrendingUp}
        />
        <StatCard
          title={t(dict, "dashboard.kpi.facilities")}
          value="0"
          description={t(dict, "dashboard.kpi.facilities_desc")}
          icon={Factory}
        />
        <StatCard
          title={t(dict, "dashboard.kpi.issues")}
          value="0"
          description={t(dict, "dashboard.kpi.issues_desc")}
          icon={AlertTriangle}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "dashboard.chart.weekly")}</CardTitle>
          </CardHeader>
          <div className="h-72">
            {emissionsSeries.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                {t(dict, "datahub.empty")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={emissionsSeries}>
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#a3a3a3" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#a3a3a3" />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="scope1" stroke="#059669" strokeWidth={2} name="Scope 1" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="scope2" stroke="#d97706" strokeWidth={2} name="Scope 2" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="scope3" stroke="#0284c7" strokeWidth={2} name="Scope 3" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "dashboard.chart.scope")}</CardTitle>
          </CardHeader>
          <div className="h-72">
            {emissionsSeries.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                {t(dict, "datahub.empty")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emissionsSeries}>
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#a3a3a3" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#a3a3a3" />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="scope1" fill="#059669" radius={[4, 4, 0, 0]} name="Scope 1" />
                  <Bar dataKey="scope2" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Scope 2" />
                  <Bar dataKey="scope3" fill="#a855f7" radius={[4, 4, 0, 0]} name="Scope 3" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "dashboard.kpi.title")}</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <KpiProgress label={t(dict, "dashboard.kpi.carbon_red")} current={hasCarbon ? carbonTotal : 0} target={3500} unit="tCO₂e" />
            <KpiProgress label={t(dict, "dashboard.kpi.renewable")} current={renewablePct} target={50} unit="%" />
            <KpiProgress label={t(dict, "dashboard.kpi.water_eff")} current={0} target={85} unit="%" />
            <KpiProgress label={t(dict, "dashboard.kpi.waste_div")} current={0} target={75} unit="%" />
            <KpiProgress label={t(dict, "dashboard.kpi.compliance_kpi")} current={0} target={100} unit="%" />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "dashboard.issues.title")}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {enteredCount === 0 ? (
              <p className="px-1 py-6 text-center text-sm text-neutral-400">
                {t(dict, "datahub.empty")}
              </p>
            ) : (
              OTHER_PARAMS.filter((p) => paramValue(p, measurements) !== null).map((p) => {
                const v = paramValue(p, measurements)
                return (
                  <div key={p.code} className="flex items-start justify-between rounded-lg border border-neutral-100 p-3">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{p.name}</p>
                      <p className="text-xs text-neutral-500">{typeof v === "number" ? `${fmt(v)} ${(p as { unit?: string }).unit || ""}` : t(dict, "proper.yes")}</p>
                    </div>
                    <Badge variant="neutral">{t(dict, "proper.status_ok")}</Badge>
                  </div>
                )
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
