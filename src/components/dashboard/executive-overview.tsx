"use client"

import { useState, useEffect, useCallback } from "react"
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
import { useSiteId } from "@/lib/use-site-id"
import { calcEngineAsync, type CalculatedKPIs } from "@/lib/calc-engine"
import {
  getHubEntries,
  type EnergyEntry,
  type WaterEntry,
  type LabEntry,
  type StackEntry,
  type TransportEntry,
  type B3Entry,
} from "@/lib/supabase/data-service"
import { seedLautanOtsukaData } from "@/lib/demo-lautan-otsuka"
import {
  Cloud,
  Zap,
  Droplets,
  Recycle,
  ShieldCheck,
  TrendingUp,
  Leaf,
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
  Loader2,
  Info,
  X,
  ChevronRight,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { useViewMode } from "@/lib/use-view-mode"
import { useBoundary, getBoundaryLabel, getActiveScopes, isScopeActive, type SystemBoundary } from "@/lib/boundary-context"

const dicts: Record<Locale, Record<string, string>> = { id, en }

const modulesSummary = [
  { code: "M0", label: "Goal & Scope", path: "/dashboard/goal-scope", icon: Target, highlight: "Cradle-to-Gate" },
  { code: "M1", label: "Company Profile", path: "/dashboard/company-profile", icon: Building2, highlight: "Multi-Entity Group" },
  { code: "M2", label: "Product Assessment", path: "/dashboard/product-assessment", icon: Package, highlight: "ISO 14044 LCI" },
  { code: "M3", label: "Energy Assessment", path: "/dashboard/energy-monitoring", icon: Zap, highlight: "Faktor Grid Nasional" },
  { code: "M4", label: "Waste Assessment", path: "/dashboard/waste-management", icon: Recycle, highlight: "B3 & Non-B3" },
  { code: "M5", label: "Transportation", path: "/dashboard/transportation", icon: Truck, highlight: "Scope 3 Cat. 4/9" },
  { code: "M6", label: "LCIA Multi-Impact", path: "/dashboard/lca", icon: Cpu, highlight: "ISO 14044 LCIA" },
  { code: "M7", label: "Carbon Accounting", path: "/dashboard/carbon-accounting", icon: BarChart3, highlight: "Scope 1, 2, 3" },
  { code: "M8", label: "Circular Economy", path: "/dashboard/circular-economy", icon: RefreshCcw, highlight: "Material Recycled" },
  { code: "M9", label: "Keanekaragaman Hayati", path: "/dashboard/biodiversity", icon: Leaf, highlight: "Indeks Shannon-Wiener" },
  { code: "M10", label: "Regulatory Mapping", path: "/dashboard/compliance", icon: ShieldCheck, highlight: "Pemetaan Otomatis" },
  { code: "M11", label: "ESG & Net Zero", path: "/dashboard/esg-reporting", icon: TrendingUp, highlight: "Roadmap 2050" },
  { code: "M12", label: "SDGs Dashboard", path: "/dashboard/sdgs", icon: Globe2, highlight: "TPB Nasional" },
  { code: "M13", label: "Audit Trail", path: "/dashboard/audit-trail", icon: ClipboardList, highlight: "Siap Audit Eksternal" },
  { code: "M14", label: "Reporting", path: "/dashboard/reporting", icon: FileOutput, highlight: "Format OJK & GRI" },
]

const fmt = (n: number) =>
  n === 0 ? "0" : n.toLocaleString("id-ID", { maximumFractionDigits: 2 })

export function ExecutiveOverview({ locale }: { locale: Locale }) {
  const dict = dicts[locale]
  const industryId = useIndustryId()
  const siteId = useSiteId()
  const [viewMode] = useViewMode()
  const { boundary, setBoundary } = useBoundary()

  const [kpis, setKpis] = useState<CalculatedKPIs | null>(null)
  const [energyCount, setEnergyCount] = useState(0)
  const [waterCount, setWaterCount] = useState(0)
  const [labCount, setLabCount] = useState(0)
  const [stackCount, setStackCount] = useState(0)
  const [transportCount, setTransportCount] = useState(0)
  const [b3Count, setB3Count] = useState(0)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)

  const refresh = useCallback(async () => {
    if (!siteId) return
    setLoading(true)
    const [kpiData, energyData, waterData, labData, stackData, transportData, b3Data] = await Promise.all([
      calcEngineAsync(siteId, industryId, boundary),
      getHubEntries<EnergyEntry>("energy", siteId, industryId),
      getHubEntries<WaterEntry>("water", siteId, industryId),
      getHubEntries<LabEntry>("laboratory", siteId, industryId),
      getHubEntries<StackEntry>("stack", siteId, industryId),
      getHubEntries<TransportEntry>("transport", siteId, industryId),
      getHubEntries<B3Entry>("b3", siteId, industryId),
    ])
    setKpis(kpiData)
    setEnergyCount(energyData.length)
    setWaterCount(waterData.length)
    setLabCount(labData.length)
    setStackCount(stackData.length)
    setTransportCount(transportData.length)
    setB3Count(b3Data.length)
    setLoading(false)
  }, [siteId, industryId, boundary])

  useEffect(() => { refresh() }, [refresh])

  const hasEmissionData = kpis?.hasData ?? false
  const hasEnergyData = hasEmissionData

  const scope1 = kpis?.scope1_tCO2e ?? 0
  const scope2 = isScopeActive(boundary, "scope2") ? (kpis?.scope2_tCO2e ?? 0) : 0
  const scope3 = isScopeActive(boundary, "scope3") ? (kpis?.scope3_tCO2e ?? 0) : 0
  const carbonTotal = kpis?.total_ghg_tCO2e ?? 0
  const energyTotal = kpis?.energy_total_MWh ?? 0
  const renewablePct = kpis?.renewable_pct ?? 0

  const totalEntries = energyCount + waterCount + labCount + stackCount + transportCount + b3Count
  // ESG completeness score based on categories filled
  const filledCategories = [
    energyCount > 0, waterCount > 0, labCount > 0,
    stackCount > 0, transportCount > 0, b3Count > 0,
  ].filter(Boolean).length
  const esgScore = totalEntries > 0 ? Math.round((filledCategories / 6) * 100) : 0

  // Only real data — no fabricated series
  const emissionsSeries = hasEmissionData
    ? [{ period: "Periode Berjalan", scope1, scope2, scope3, energy: energyTotal }]
    : []

  // Audit readiness: needs at least energy + one of lab/stack to be verifiable
  const auditReady = energyCount > 0 && (labCount > 0 || stackCount > 0)

  const [showDemoModal, setShowDemoModal] = useState(false)

  const handleSeedDataWithBoundary = async (selectedBoundary: SystemBoundary) => {
    setBoundary(selectedBoundary)
    setShowDemoModal(false)
    setSeeding(true)
    await seedLautanOtsukaData(siteId)
    await refresh()
    setSeeding(false)
  }

  return (
    <div className="space-y-6">
      {/* Demo Boundary Selection Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900">Pilih Batas Sistem</h3>
              <button onClick={() => setShowDemoModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-6 text-sm text-neutral-600">
              Sebelum memuat data demo PT. Lautan Otsuka, pilih batas sistem (System Boundary) LCA yang ingin Anda gunakan.
            </p>
            <div className="space-y-3">
              {(["gate-to-gate", "cradle-to-gate", "cradle-to-grave", "cradle-to-cradle"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => handleSeedDataWithBoundary(b)}
                  className="flex w-full items-center justify-between rounded-xl border border-neutral-200 p-4 text-left transition-colors hover:border-emerald-500 hover:bg-emerald-50"
                >
                  <div>
                    <div className="font-semibold text-neutral-900">{getBoundaryLabel(b)}</div>
                    <div className="mt-0.5 text-xs text-neutral-500">
                      {b === "gate-to-gate" && "Hanya operasional internal pabrik (Scope 1)"}
                      {b === "cradle-to-gate" && "Termasuk bahan baku hulu (Scope 1+2)"}
                      {b === "cradle-to-grave" && "Termasuk transportasi ke konsumen (Scope 1-3)"}
                      {b === "cradle-to-cradle" && "Termasuk pemulihan/daur ulang sirkular"}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-neutral-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
        <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-0">
          <button 
            onClick={() => setShowDemoModal(true)}
            disabled={seeding}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
          >
            {seeding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Database className="h-3.5 w-3.5" />}
            Demo: Data PT. Lautan Otsuka
          </button>
          <Badge variant={viewMode === "executive" ? "success" : "brand"}>
            {viewMode.toUpperCase()} MODE
          </Badge>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-neutral-100 bg-white py-12 gap-2 text-sm text-neutral-400">
          <Loader2 className="h-5 w-5 animate-spin" /> Memuat data operasional...
        </div>
      ) : (
        <>
          {/* No data warning */}
          {totalEntries === 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-sm text-amber-800">
                Belum ada data operasional. Masukkan data di <strong>Data Hub</strong> agar semua KPI dan grafik terisi secara otomatis.
              </p>
            </div>
          )}

          {/* Top Level KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title={t(dict, "dashboard.kpi.carbon")}
              value={hasEmissionData ? `${fmt(carbonTotal)} tCO₂e` : "—"}
              description={`${getActiveScopes(boundary)} (${getBoundaryLabel(boundary)})`}
              icon={Cloud}
            />
            <StatCard
              title={t(dict, "dashboard.kpi.energy")}
              value={hasEnergyData ? `${fmt(energyTotal)} MWh` : "—"}
              description={hasEnergyData ? `Bauran EBT ${renewablePct}% (Grid KLHK)` : "Belum ada data energi"}
              icon={Zap}
            />
            <StatCard
              title="Skor Kelengkapan Data"
              value={totalEntries > 0 ? `${esgScore}%` : "—"}
              description={`${filledCategories}/6 kategori Data Hub terisi`}
              icon={ShieldCheck}
            />
            <StatCard
              title="Total Entri Data Hub"
              value={`${totalEntries}`}
              description={`${energyCount} energi · ${waterCount} air · ${labCount} lab · ${stackCount} emisi`}
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
                <p className="text-xs text-neutral-500 mt-0.5">Emisi Scope 1, Scope 2, dan Scope 3 dari data yang dimasukkan</p>
              </CardHeader>
              <div className="h-72">
                {emissionsSeries.length > 0 ? (
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
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                    Belum ada data emisi — masukkan data energi di Data Hub
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Komposisi Emisi Karbon berdasarkan Scope</CardTitle>
                <p className="text-xs text-neutral-500 mt-0.5">Distribusi beban emisi operasional & rantai nilai</p>
              </CardHeader>
              <div className="h-72">
                {emissionsSeries.length > 0 ? (
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
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                    Belum ada data emisi — masukkan data energi di Data Hub
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Target Progress & Data Completeness */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Target Dekarbonisasi & Keberlanjutan</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                {hasEmissionData ? (
                  <KpiProgress label="Reduksi Emisi Karbon (SBTi Target 2030)" current={carbonTotal} target={3500} unit="tCO₂e" />
                ) : (
                  <p className="text-xs text-neutral-400 py-2">Masukkan data emisi di Data Hub untuk melihat progres target SBTi</p>
                )}
                {hasEnergyData ? (
                  <KpiProgress label="Porsi Bauran Energi Terbarukan (EBT)" current={renewablePct} target={50} unit="%" />
                ) : (
                  <p className="text-xs text-neutral-400 py-2">Masukkan data energi di Data Hub untuk melihat bauran EBT</p>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Kelengkapan Data & Audit Readiness</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                {[
                  { label: "Data Energi (Scope 1 & 2)", count: energyCount, icon: Zap },
                  { label: "Data Air & Lab Uji", count: waterCount + labCount, icon: Droplets },
                  { label: "Emisi Cerobong (Stack)", count: stackCount, icon: Factory },
                  { label: "Transportasi (Scope 3)", count: transportCount, icon: Truck },
                  { label: "Limbah B3", count: b3Count, icon: AlertTriangle },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-lg border border-neutral-100 p-3">
                    <div className="flex items-center gap-2.5">
                      <item.icon className={`h-4 w-4 ${item.count > 0 ? "text-emerald-600" : "text-neutral-300"}`} />
                      <p className="text-sm text-neutral-700">{item.label}</p>
                    </div>
                    <Badge variant={item.count > 0 ? "success" : "neutral"}>
                      {item.count > 0 ? `${item.count} entri` : "Kosong"}
                    </Badge>
                  </div>
                ))}

                <div className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium ${auditReady ? "border-emerald-100 bg-emerald-50 text-emerald-800" : "border-amber-100 bg-amber-50 text-amber-800"}`}>
                  <span>{auditReady ? "Audit Readiness Status" : "Audit Readiness Status"}</span>
                  <span>{auditReady ? "Siap Diverifikasi Pihak Ke-3" : "Perlu Data Energi & Lab/Emisi"}</span>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
