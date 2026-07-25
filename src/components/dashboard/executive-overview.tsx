"use client"

import Link from "next/link"
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
import { OTHER_PARAMS } from "@/lib/proper"
import {
  Cloud,
  Zap,
  Droplets,
  Recycle,
  ShieldCheck,
  TrendingUp,
  Factory,
  AlertTriangle,
  Briefcase,
  Wrench,
  Target,
  Building2,
  Package,
  Truck,
  RefreshCcw,
  Globe2,
  ClipboardList,
  FileOutput,
  Cpu,
  BarChart3,
  Database,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { useViewMode } from "@/lib/use-view-mode"

const dicts: Record<Locale, Record<string, string>> = { id, en }

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

  const scope1 = get("ghg_scope1") ?? 450
  const scope2 = get("ghg_scope2") ?? 120
  const scope3 = get("ghg_scope3") ?? 280
  const carbonTotal = scope1 + scope2 + scope3
  const energyTotal = get("energy_total") ?? 12500
  const energyRenewable = get("energy_renewable") ?? 3200

  const renewablePct = energyTotal > 0 ? Math.round((energyRenewable / energyTotal) * 100) : 0

  const fmt = (n: number) =>
    n === 0 ? "0" : n.toLocaleString("id-ID", { maximumFractionDigits: 2 })

  const enteredCount = OTHER_PARAMS.filter((p) => paramValue(p, measurements) !== null).length

  const emissionsSeries = [
    { period: "Q1", scope1: 120, scope2: 35, scope3: 75, energy: 3100 },
    { period: "Q2", scope1: 115, scope2: 30, scope3: 70, energy: 3000 },
    { period: "Q3", scope1: 110, scope2: 28, scope3: 68, energy: 2950 },
    { period: "Q4 (YTD)", scope1, scope2, scope3, energy: energyTotal / 4 },
  ]

  const modulesSummary = [
    { code: "M0", label: "Goal & Scope", path: "/dashboard/goal-scope", icon: Target, status: "Terdefinisi (ISO 14040)", highlight: "Cradle-to-Gate" },
    { code: "M1", label: "Company Profile", path: "/dashboard/company-profile", icon: Building2, status: "3 Entitas Terdaftar", highlight: "Multi-Entity Group" },
    { code: "M2", label: "Product Assessment", path: "/dashboard/product-assessment", icon: Package, status: "BOM Material Terstruktur", highlight: "ISO 14044 LCI" },
    { code: "M3", label: "Energy Assessment", path: "/dashboard/energy-monitoring", icon: Zap, status: `${fmt(energyTotal)} MWh`, highlight: "Faktor Grid Nasional" },
    { code: "M4", label: "Waste Assessment", path: "/dashboard/waste-management", icon: Recycle, status: "Terkelola Berkelanjutan", highlight: "B3 & Non-B3" },
    { code: "M5", label: "Transportation", path: "/dashboard/transportation", icon: Truck, status: "Rantai Pasok Up/Downstream", highlight: "Scope 3 Cat. 4/9" },
    { code: "M6", label: "LCIA Multi-Impact", path: "/dashboard/lca", icon: Cpu, status: "11 Kategori Dampak", highlight: "ISO 14044 LCIA" },
    { code: "M7", label: "Carbon Accounting", path: "/dashboard/carbon-accounting", icon: BarChart3, status: `${fmt(carbonTotal)} tCO₂e`, highlight: "Scope 1, 2, 3" },
    { code: "M8", label: "Circular Economy", path: "/dashboard/circular-economy", icon: RefreshCcw, status: "Indeks Sirkularitas 68/100", highlight: "Material Recycled" },
    { code: "M9", label: "Regulatory Mapping", path: "/dashboard/compliance", icon: ShieldCheck, status: "POJK 51 · PROPER · GRI", highlight: "Pemetaan Otomatis" },
    { code: "M10", label: "ESG & Net Zero", path: "/dashboard/esg-reporting", icon: TrendingUp, status: "Skor ESG 72 / GPI 68", highlight: "Roadmap 2050" },
    { code: "M11", label: "SDGs Dashboard", path: "/dashboard/sdgs", icon: Globe2, status: "12 SDGs Berkontribusi", highlight: "TPB Nasional" },
    { code: "M12", label: "Audit Trail", path: "/dashboard/audit-trail", icon: ClipboardList, status: "Log Data Terverifikasi", highlight: "Siap Audit Eksternal" },
    { code: "M13", label: "Reporting", path: "/dashboard/reporting", icon: FileOutput, status: "6 Template Laporan PDF", highlight: "Format OJK & GRI" },
  ]

  return (
    <div className="space-y-6">
      {/* Mode Indicator Banner */}
      <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-3.5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${viewMode === "executive" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}`}>
            {viewMode === "executive" ? <Briefcase className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-900">
              Tampilan Aktif: {viewMode === "executive" ? "Executive Director View (Ringkasan Direksi 13 Modul)" : "EHS Engineer View (Detail Teknis & Telemetri)"}
            </p>
            <p className="text-[11px] text-neutral-500">
              {viewMode === "executive"
                ? "Ringkasan Eksekutif Terintegrasi: LCA ISO 14040/14044, Carbon Scopes 1-3, ESG Dashboard, Kepatuhan POJK 51/PROPER, dan Audit Readiness."
                : "Detail Parameter Teknis: Baku Mutu Emisi Udara, Air Limbah, Telemetri Ingest Data Hub, dan Log Audit."}
            </p>
          </div>
        </div>
        <Badge variant={viewMode === "executive" ? "success" : "brand"}>
          {viewMode.toUpperCase()} MODE
        </Badge>
      </div>

      {/* Top Level KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t(dict, "dashboard.kpi.carbon")}
          value={`${fmt(carbonTotal)} tCO₂e`}
          description="Scope 1 + 2 + 3 (GHG Protocol)"
          icon={Cloud}
        />
        <StatCard
          title={t(dict, "dashboard.kpi.energy")}
          value={`${fmt(energyTotal)} MWh`}
          description={`Bauran EBT ${renewablePct}% (Grid KLHK)`}
          icon={Zap}
        />
        <StatCard
          title="Skor Kepatuhan ESG"
          value="72/100"
          description="GRI Standards & POJK 51/2017"
          icon={ShieldCheck}
        />
        <StatCard
          title="Green Productivity Index"
          value="68/100"
          description="Rasio Output vs Dampak Lingkungan"
          icon={TrendingUp}
        />
      </div>

      <ProperRankCard compact />

      {/* 13 Module Architecture Executive Status Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Arsitektur Enterprise 13 Modul GreenLCA</CardTitle>
              <p className="text-xs text-neutral-500 mt-0.5">Status dan integrasi data seluruh modul sesuai blueprint new.md</p>
            </div>
            <Badge variant="neutral" className="text-[10px]">ISO 14040 · POJK 51 · GRI</Badge>
          </div>
        </CardHeader>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modulesSummary.map((m) => (
            <Link key={m.code} href={m.path} className="group rounded-xl border border-neutral-200 bg-neutral-50/50 p-3.5 transition-all hover:border-emerald-300 hover:bg-emerald-50/30 hover:shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-2xs border border-neutral-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <m.icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-neutral-900">{m.code}</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-neutral-300 group-hover:text-emerald-600 transition-colors" />
              </div>
              <p className="text-xs font-semibold text-neutral-800">{m.label}</p>
              <p className="text-[11px] font-medium text-emerald-700 mt-0.5">{m.status}</p>
              <span className="mt-2 inline-block rounded bg-white px-2 py-0.5 text-[10px] text-neutral-500 border border-neutral-200/60 font-mono">
                {m.highlight}
              </span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Visualizations Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tren Emisi Karbon per Scope (tCO₂e)</CardTitle>
            <p className="text-xs text-neutral-500 mt-0.5">Pemantauan emisi Scope 1, Scope 2, dan Scope 3 per triwulan</p>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emissionsSeries}>
                <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#a3a3a3" />
                <YAxis tick={{ fontSize: 12 }} stroke="#a3a3a3" />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="scope1" stroke="#059669" strokeWidth={2} name="Scope 1 (Langsung)" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="scope2" stroke="#d97706" strokeWidth={2} name="Scope 2 (Listrik)" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="scope3" stroke="#0284c7" strokeWidth={2} name="Scope 3 (Rantai Pasok)" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Komposisi Emisi Karbon berdasarkan Scope</CardTitle>
            <p className="text-xs text-neutral-500 mt-0.5">Distribusi beban emisi operasional & rantai nilai</p>
          </CardHeader>
          <div className="h-72">
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
          </div>
        </Card>
      </div>

      {/* Target Progress & Governance Issues */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Target Dekarbonisasi & Target Keberlanjutan</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <KpiProgress label="Reduksi Emisi Karbon (SBTi Target 2030)" current={carbonTotal} target={3500} unit="tCO₂e" />
            <KpiProgress label="Porsi Bauran Energi Terbarukan (EBT)" current={renewablePct} target={50} unit="%" />
            <KpiProgress label="Tingkat Daur Ulang & Pengurangan Limbah (3R)" current={65} target={75} unit="%" />
            <KpiProgress label="Kepatuhan Regulasi Indonesia (POJK 51 / PROPER)" current={85} target={100} unit="%" />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Tata Kelola & Parameter Terpantau</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {OTHER_PARAMS.filter((p) => paramValue(p, measurements) !== null).slice(0, 5).map((p) => {
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
            })}
            <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Audit Readiness Status
              </span>
              <span>Siap Diverifikasi Pihak Ke-3</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
