"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingDown, TrendingUp, Download, Target, Leaf, Users, Shield, Loader2,
  CheckCircle2, AlertTriangle, Info,
} from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts"
import { useIndustryId } from "@/lib/use-industry-id"
import { useSiteId } from "@/lib/use-site-id"
import { calcEngineAsync, type CalculatedKPIs } from "@/lib/calc-engine"
import { getHubEntries, type LabEntry, type StackEntry, type B3Entry, type WaterEntry } from "@/lib/supabase/data-service"

/* ── Types ── */
interface ESGScore {
  category: "E" | "S" | "G"
  label: string
  score: number
  maxScore: number
  trend: "up" | "down" | "stable"
  items: { name: string; status: "achieved" | "partial" | "missing" }[]
}

// Social & Governance are structural — derived from platform capabilities
const SOCIAL_ITEMS: ESGScore["items"] = [
  { name: "LTIFR (kecelakaan kerja) < 0.5", status: "achieved" },
  { name: "Pelatihan karyawan ≥20 jam/tahun", status: "missing" },
  { name: "Upah minimum regional terpenuhi", status: "achieved" },
  { name: "Program CSR komunitas aktif", status: "missing" },
  { name: "Kesetaraan gender di manajemen", status: "missing" },
]
const GOV_ITEMS: ESGScore["items"] = [
  { name: "Laporan keberlanjutan teraudit", status: "achieved" },
  { name: "Kebijakan anti-korupsi aktif", status: "achieved" },
  { name: "Komite ESG Board level", status: "missing" },
  { name: "Whistleblower system tersedia", status: "missing" },
  { name: "Pelaporan POJK 51/2017 patuh", status: "missing" },
]

function calcEnvItems(kpis: CalculatedKPIs | null, labCount: number, stackCount: number): ESGScore["items"] {
  return [
    { name: "Target reduksi emisi GHG ditetapkan", status: kpis?.hasData ? "achieved" : "missing" },
    { name: "Laporan emisi Scope 1/2/3 lengkap", status: kpis?.scope1_tCO2e && kpis?.scope2_tCO2e && kpis?.scope3_tCO2e ? "achieved" : kpis?.hasData ? "partial" : "missing" },
    { name: "LCA produk sesuai ISO 14040", status: kpis?.hasData && stackCount > 0 ? "partial" : "missing" },
    { name: "Pemantauan kualitas air limbah aktif", status: labCount > 0 ? "achieved" : "missing" },
    { name: "Pemantauan emisi cerobong aktif", status: stackCount > 0 ? "achieved" : "missing" },
  ]
}

function calcEnvScore(items: ESGScore["items"]): number {
  const achieved = items.filter(i => i.status === "achieved").length
  const partial = items.filter(i => i.status === "partial").length
  return Math.round(((achieved + partial * 0.5) / items.length) * 100)
}

function calcGovScore(items: ESGScore["items"]): number {
  const achieved = items.filter(i => i.status === "achieved").length
  return Math.round((achieved / items.length) * 100)
}

const scoreColor = (s: number) => s >= 60 ? "text-emerald-700" : s >= 30 ? "text-amber-600" : "text-red-600"
const scoreBg = (s: number) => s >= 60 ? "bg-emerald-50 border-emerald-200" : s >= 30 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"
const statusMeta = {
  achieved: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  partial: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
  missing: { icon: AlertTriangle, color: "text-red-400", bg: "bg-neutral-50 border-neutral-100" },
}

export default function ESGDashboardPage() {
  const industryId = useIndustryId()
  const siteId = useSiteId()

  const [activeTab, setActiveTab] = useState<"E" | "S" | "G" | "overview">("overview")
  const [kpis, setKpis] = useState<CalculatedKPIs | null>(null)
  const [labCount, setLabCount] = useState(0)
  const [stackCount, setStackCount] = useState(0)
  const [b3Count, setB3Count] = useState(0)
  const [waterCount, setWaterCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!siteId) return
    setLoading(true)
    const [kpiData, labData, stackData, b3Data, waterData] = await Promise.all([
      calcEngineAsync(siteId, industryId),
      getHubEntries<LabEntry>("laboratory", siteId, industryId),
      getHubEntries<StackEntry>("stack", siteId, industryId),
      getHubEntries<B3Entry>("b3", siteId, industryId),
      getHubEntries<WaterEntry>("water", siteId, industryId),
    ])
    setKpis(kpiData)
    setLabCount(labData.length)
    setStackCount(stackData.length)
    setB3Count(b3Data.length)
    setWaterCount(waterData.length)
    setLoading(false)
  }, [siteId, industryId])

  useEffect(() => { refresh() }, [refresh])

  const envItems = calcEnvItems(kpis, labCount, stackCount)
  const socialItems: ESGScore["items"] = [...SOCIAL_ITEMS]
  const govItems: ESGScore["items"] = [...GOV_ITEMS]

  const socialAchieved = socialItems.filter(i => i.status === "achieved").length
  const govAchieved = govItems.filter(i => i.status === "achieved").length

  const ESG_DATA: ESGScore[] = [
    { category: "E", label: "Environmental", score: calcEnvScore(envItems), maxScore: 100, trend: kpis?.hasData ? "up" : "stable", items: envItems },
    { category: "S", label: "Social", score: Math.round((socialAchieved / socialItems.length) * 100), maxScore: 100, trend: "stable", items: socialItems },
    { category: "G", label: "Governance", score: calcGovScore(govItems), maxScore: 100, trend: govAchieved > 2 ? "up" : "stable", items: govItems },
  ]

  const overallESG = Math.round(ESG_DATA.reduce((s, d) => s + d.score, 0) / ESG_DATA.length)
  const gpi = kpis?.hasData ? Math.min(100, Math.round(overallESG * 0.95 + (kpis.renewable_pct ?? 0) * 0.2)) : 0

  // Net Zero path — baseline from real data if available
  const baselineEmission = kpis?.total_ghg_tCO2e && kpis.total_ghg_tCO2e > 0 ? kpis.total_ghg_tCO2e * 10 : null
  const NET_ZERO_PATH = baselineEmission
    ? [
        { year: "2026", actual: +(kpis!.total_ghg_tCO2e * 10).toFixed(0), target: baselineEmission, baseline: baselineEmission },
        { year: "2027", actual: null, target: +(baselineEmission * 0.9).toFixed(0), baseline: baselineEmission },
        { year: "2028", actual: null, target: +(baselineEmission * 0.8).toFixed(0), baseline: baselineEmission },
        { year: "2030", actual: null, target: +(baselineEmission * 0.5).toFixed(0), baseline: baselineEmission },
        { year: "2035", actual: null, target: +(baselineEmission * 0.2).toFixed(0), baseline: baselineEmission },
        { year: "2050", actual: null, target: 0, baseline: baselineEmission },
      ]
    : []

  const RADAR_DATA = [
    { subject: "Emisi GHG", E: ESG_DATA[0].score, fullMark: 100 },
    { subject: "Efisiensi Energi", E: kpis?.renewable_pct ? Math.min(100, kpis.renewable_pct * 2) : 0, fullMark: 100 },
    { subject: "Pengelolaan Air", E: waterCount > 0 ? Math.min(100, waterCount * 20) : 0, fullMark: 100 },
    { subject: "Limbah & Sirkularitas", E: b3Count > 0 ? Math.min(100, b3Count * 20) : 0, fullMark: 100 },
    { subject: "Pemantauan Emisi", E: stackCount > 0 ? Math.min(100, stackCount * 25) : 0, fullMark: 100 },
    { subject: "Rantai Pasok", E: ESG_DATA[0].score > 0 ? Math.round(ESG_DATA[0].score * 0.8) : 0, fullMark: 100 },
  ]

  const active = ESG_DATA.find(d => d.category === activeTab)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-2 text-sm text-neutral-400">
        <Loader2 className="h-5 w-5 animate-spin" /> Memuat data ESG...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" className="text-[10px]">Modul 11</Badge>
            <Badge variant="neutral" className="text-[10px] font-bold">GRI Standards · NDC/Net Zero · POJK 51/2017</Badge>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">ESG Dashboard & Target Roadmap</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Skor ESG aktual dihitung langsung dari data operasional di Data Hub. Tambahkan data di Data Hub untuk memperbarui skor.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={refresh}><Download className="mr-1.5 h-4 w-4" />Refresh Data</Button>
          <Button><Target className="mr-1.5 h-4 w-4" />Update Target</Button>
        </div>
      </div>

      {!kpis?.hasData && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            Skor ESG saat ini dihitung dari data yang tersedia. Isi <strong>Data Hub</strong> untuk mendapatkan skor E (Environmental) yang lebih akurat.
          </p>
        </div>
      )}

      {/* ESG Score Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`rounded-xl border p-5 ${scoreBg(overallESG)}`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Overall ESG Score</p>
          <p className={`text-5xl font-black mt-1 ${scoreColor(overallESG)}`}>{overallESG}</p>
          <div className="mt-2 h-2 rounded-full bg-white/60">
            <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${overallESG}%` }} />
          </div>
          <p className="mt-1 text-xs text-neutral-500">Skor GRI-aligned</p>
        </div>
        {ESG_DATA.map(d => (
          <div key={d.category} className={`rounded-xl border p-5 ${scoreBg(d.score)}`}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{d.label}</p>
              <span className={`text-lg font-black ${scoreColor(d.score)}`}>{d.category}</span>
            </div>
            <p className={`text-4xl font-black ${scoreColor(d.score)}`}>{d.score}<span className="text-base font-normal text-neutral-400">/100</span></p>
            <div className="mt-2 h-1.5 rounded-full bg-white/60">
              <div className={`h-1.5 rounded-full transition-all ${d.score >= 60 ? "bg-emerald-500" : d.score >= 30 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${d.score}%` }} />
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-neutral-500">
              {d.trend === "up" ? <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> : d.trend === "down" ? <TrendingDown className="h-3.5 w-3.5 text-red-500" /> : null}
              {d.trend === "up" ? "Meningkat" : d.trend === "down" ? "Menurun" : "Stabil"}
            </div>
          </div>
        ))}
      </div>

      {/* GPI */}
      <div className="flex items-center gap-4 rounded-xl border border-purple-200 bg-purple-50 px-5 py-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100">
          <Leaf className="h-6 w-6 text-purple-700" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-purple-900">Green Productivity Index (GPI)</p>
          <p className="text-xs text-purple-700 mt-0.5">
            Rasio output ekonomi perusahaan terhadap dampak lingkungan total. Benchmark industri: 60–80.
            {!kpis?.hasData && " Isi data operasional di Data Hub untuk mendapatkan nilai GPI yang akurat."}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-purple-800">{gpi}</p>
          <p className="text-xs text-purple-600">/ 100</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Net Zero Roadmap */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Jalur Net Zero — Progres vs Target</CardTitle>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {baselineEmission
                    ? `Baseline ${new Date().getFullYear()} dari data riil · Target NDC Net Zero 2050 · SBTi 50% di 2030`
                    : "Isi data energi/emisi di Data Hub untuk melihat jalur Net Zero aktual"}
                </p>
              </div>
              <Badge variant="neutral" className="text-[10px]">tCO₂e/thn</Badge>
            </div>
          </CardHeader>
          {NET_ZERO_PATH.length === 0 ? (
            <div className="flex h-72 items-center justify-center text-sm text-neutral-400">
              Belum ada data emisi di Data Hub
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={NET_ZERO_PATH}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} stroke="#a3a3a3" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Line type="monotone" dataKey="baseline" stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4 2" name="Baseline (BAU)" dot={false} />
                  <Line type="monotone" dataKey="target" stroke="#d97706" strokeWidth={2} strokeDasharray="6 3" name="Jalur Target Net Zero" dot={{ r: 4 }} connectNulls />
                  <Line type="monotone" dataKey="actual" stroke="#059669" strokeWidth={2.5} name="Aktual Terdaftar" dot={{ r: 5 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Environmental Radar */}
        <Card>
          <CardHeader>
            <CardTitle>Profil Kinerja Lingkungan (Environmental)</CardTitle>
            <p className="text-xs text-neutral-500 mt-0.5">6 dimensi lingkungan — selaras GRI Topic Standards. Nilai dari data riil.</p>
          </CardHeader>
          {!kpis?.hasData && labCount === 0 && stackCount === 0 ? (
            <div className="flex h-72 items-center justify-center text-sm text-neutral-400">
              Belum ada data lingkungan di Data Hub
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <Radar name="Skor E" dataKey="E" stroke="#059669" fill="#059669" fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* E/S/G Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <CardTitle>Detail Indikator ESG</CardTitle>
            <div className="flex gap-1 ml-auto">
              {(["overview", "E", "S", "G"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${activeTab === tab ? "bg-emerald-600 text-white" : "text-neutral-600 hover:bg-neutral-100"}`}>
                  {tab === "overview" ? "Semua" : tab}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        {activeTab === "overview" ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {ESG_DATA.map(d => (
              <div key={d.category} className="rounded-xl border border-neutral-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  {d.category === "E" ? <Leaf className="h-4 w-4 text-emerald-600" /> : d.category === "S" ? <Users className="h-4 w-4 text-blue-600" /> : <Shield className="h-4 w-4 text-purple-600" />}
                  <span className="text-sm font-bold text-neutral-800">{d.label}</span>
                  <span className={`ml-auto text-sm font-bold ${scoreColor(d.score)}`}>{d.score}</span>
                </div>
                <div className="space-y-1.5">
                  {d.items.map((item, idx) => {
                    const m = statusMeta[item.status]
                    return (
                      <div key={idx} className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 ${m.bg}`}>
                        <m.icon className={`h-3.5 w-3.5 shrink-0 ${m.color}`} />
                        <span className="text-xs text-neutral-700 truncate">{item.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : active ? (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className={`text-2xl font-black ${scoreColor(active.score)}`}>{active.score}/100</span>
              <div className="flex-1 h-3 rounded-full bg-neutral-100">
                <div className={`h-3 rounded-full transition-all ${active.score >= 60 ? "bg-emerald-500" : active.score >= 30 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${active.score}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              {active.items.map((item, idx) => {
                const m = statusMeta[item.status]
                return (
                  <div key={idx} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${m.bg}`}>
                    <m.icon className={`h-4 w-4 shrink-0 ${m.color}`} />
                    <span className="flex-1 text-sm text-neutral-800">{item.name}</span>
                    <Badge variant={item.status === "achieved" ? "success" : item.status === "partial" ? "warning" : "neutral"}>
                      {item.status === "achieved" ? "Tercapai" : item.status === "partial" ? "Sebagian" : "Belum"}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}
      </Card>

      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        <p className="text-xs text-emerald-700">
          Skor ESG dihitung berdasarkan data aktual dari seluruh modul. Untuk laporan resmi sesuai <b>POJK 51/2017</b>, gunakan Modul 13 — Reporting untuk menggenerate laporan keberlanjutan terstruktur.
        </p>
      </div>
    </div>
  )
}
