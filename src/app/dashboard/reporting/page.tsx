"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileOutput, Download, Sparkles, CheckCircle2, FileText, Clock, Globe2, Shield, Loader2, AlertCircle } from "lucide-react"
import { useIndustryId } from "@/lib/use-industry-id"
import { useSiteId } from "@/lib/use-site-id"
import { calcEngineAsync, type CalculatedKPIs } from "@/lib/calc-engine"
import {
  getHubEntries,
  getAuditLogSb,
  type EnergyEntry,
  type WaterEntry,
  type LabEntry,
  type StackEntry,
  type TransportEntry,
  type B3Entry,
} from "@/lib/supabase/data-service"
import { ModuleGate } from "@/components/dashboard/module-gate"

/* ── Types ── */
interface DataStatus {
  energy: number
  water: number
  lab: number
  stack: number
  transport: number
  b3: number
  kpis: CalculatedKPIs | null
  loaded: boolean
}

interface ReportTemplate {
  id: string
  title: string
  description: string
  framework: string
  frameworkColor: string
  regulatoryBasis: string
  lastUpdated: string
  sections: { label: string; dataKey: keyof DataStatus | "kpi" }[]
}

const TEMPLATES: ReportTemplate[] = [
  {
    id: "lca",
    title: "Laporan LCA (Life Cycle Assessment)",
    description: "Laporan lengkap hasil perhitungan LCA multi-impact sesuai ISO 14040/14044. Mencakup Goal & Scope, LCI, LCIA, dan interpretasi.",
    framework: "ISO 14040/14044", frameworkColor: "bg-emerald-100 text-emerald-700",
    regulatoryBasis: "ISO 14040:2006 & ISO 14044:2006", lastUpdated: "Jul 2026",
    sections: [
      { label: "Goal & Scope Definition", dataKey: "kpi" },
      { label: "Life Cycle Inventory (LCI) — Data Energi", dataKey: "energy" },
      { label: "Life Cycle Inventory (LCI) — Data Emisi Cerobong", dataKey: "stack" },
      { label: "Life Cycle Impact Assessment (LCIA)", dataKey: "kpi" },
      { label: "Interpretasi & Kesimpulan", dataKey: "kpi" },
    ],
  },
  {
    id: "carbon",
    title: "Carbon Footprint Report",
    description: "Laporan emisi GHG terstruktur per Scope 1/2/3 sesuai GHG Protocol dan ISO 14064-1. Siap untuk verifikasi pihak ketiga.",
    framework: "GHG Protocol / ISO 14064", frameworkColor: "bg-blue-100 text-blue-700",
    regulatoryBasis: "GHG Protocol Corporate Standard, ISO 14064-1:2018", lastUpdated: "Jul 2026",
    sections: [
      { label: "Inventaris Emisi Scope 1 — Pembakaran Langsung", dataKey: "energy" },
      { label: "Inventaris Emisi Scope 2 — Listrik Dibeli", dataKey: "energy" },
      { label: "Inventaris Emisi Scope 3 — Transportasi", dataKey: "transport" },
      { label: "Jalur Reduksi & Target Net-Zero", dataKey: "kpi" },
    ],
  },
  {
    id: "esg_ojk",
    title: "Laporan Keberlanjutan — Format POJK 51",
    description: "Laporan ESG sesuai format yang diwajibkan OJK berdasarkan POJK 51/2017 & SEOJK 16/2021 untuk emiten dan lembaga jasa keuangan.",
    framework: "POJK 51/2017", frameworkColor: "bg-red-100 text-red-700",
    regulatoryBasis: "POJK No. 51/POJK.03/2017, SEOJK No. 16/SEOJK.04/2021", lastUpdated: "Jul 2026",
    sections: [
      { label: "Profil Keberlanjutan", dataKey: "kpi" },
      { label: "Tata Kelola Keberlanjutan", dataKey: "kpi" },
      { label: "Kinerja Ekonomi Berkelanjutan", dataKey: "kpi" },
      { label: "Kinerja Lingkungan Hidup — Emisi & Energi", dataKey: "energy" },
      { label: "Kinerja Sosial & Kepatuhan", dataKey: "lab" },
    ],
  },
  {
    id: "proper",
    title: "PROPER Self-Assessment Report",
    description: "Laporan evaluasi mandiri kinerja lingkungan sesuai kriteria PROPER KLHK. Dilengkapi rekomendasi peningkatan peringkat.",
    framework: "PROPER KLHK", frameworkColor: "bg-green-100 text-green-700",
    regulatoryBasis: "Permen LHK No. P.1/2021, Permen LHK No. 5/2014", lastUpdated: "Jul 2026",
    sections: [
      { label: "Status Ketaatan Baku Mutu Air Limbah", dataKey: "lab" },
      { label: "Status Ketaatan Emisi Udara (Cerobong)", dataKey: "stack" },
      { label: "Ketaatan Pengelolaan Limbah B3", dataKey: "b3" },
      { label: "Ketaatan Air Permukaan & Bahan Berbahaya", dataKey: "water" },
      { label: "11 Indikator LCA & Rekap PROPER Score", dataKey: "kpi" },
    ],
  },
  {
    id: "gri",
    title: "GRI Standards Report",
    description: "Laporan keberlanjutan komprehensif sesuai GRI Universal Standards 2021. Mencakup seluruh topik material yang relevan.",
    framework: "GRI Standards 2021", frameworkColor: "bg-purple-100 text-purple-700",
    regulatoryBasis: "GRI Universal Standards 2021, GRI Sector Standards", lastUpdated: "Jul 2026",
    sections: [
      { label: "GRI 2: General Disclosures", dataKey: "kpi" },
      { label: "GRI 3: Material Topics", dataKey: "kpi" },
      { label: "GRI 305: Emissions (Scope 1/2/3)", dataKey: "energy" },
      { label: "GRI 306: Waste (Limbah B3)", dataKey: "b3" },
      { label: "GRI 303: Water & Effluents", dataKey: "water" },
    ],
  },
  {
    id: "sdgs",
    title: "SDGs Contribution Report",
    description: "Laporan kontribusi perusahaan terhadap 17 Tujuan Pembangunan Berkelanjutan (SDGs), diselaraskan dengan program TPB nasional.",
    framework: "UN SDGs", frameworkColor: "bg-orange-100 text-orange-700",
    regulatoryBasis: "UN 2030 Agenda, Perpres 111/2022 (RPJMN & SDGs Nasional)", lastUpdated: "Jul 2026",
    sections: [
      { label: "SDGs Coverage — Energi Bersih (SDG 7)", dataKey: "energy" },
      { label: "SDGs Coverage — Air Bersih & Sanitasi (SDG 6)", dataKey: "water" },
      { label: "SDGs Coverage — Iklim (SDG 13)", dataKey: "kpi" },
      { label: "SDGs Coverage — Ekosistem Darat (SDG 15)", dataKey: "kpi" },
    ],
  },
]

/* ── Helpers ── */
function sectionStatus(dataKey: keyof DataStatus | "kpi", ds: DataStatus): { pct: number; label: string; color: string } {
  if (!ds.loaded) return { pct: 0, label: "Memuat...", color: "#94a3b8" }

  if (dataKey === "kpi") {
    const hasKpi = ds.kpis?.hasData ?? false
    return hasKpi
      ? { pct: 100, label: "Data Tersedia", color: "#10b981" }
      : { pct: 0, label: "Belum Ada Data", color: "#f59e0b" }
  }

  const count = ds[dataKey as keyof DataStatus] as number
  if (count === 0) return { pct: 0, label: "Belum Ada Data", color: "#f59e0b" }
  const pct = Math.min(100, count * 20) // 5 entries = 100%
  return { pct, label: `${count} entri (${pct}%)`, color: pct >= 80 ? "#10b981" : "#f59e0b" }
}

function templateCompleteness(t: ReportTemplate, ds: DataStatus): number {
  if (!ds.loaded) return 0
  const pcts = t.sections.map((s) => sectionStatus(s.dataKey, ds).pct)
  return Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length)
}

export default function ReportingPage() {
  const industryId = useIndustryId()
  const siteId = useSiteId()

  const [dataStatus, setDataStatus] = useState<DataStatus>({
    energy: 0, water: 0, lab: 0, stack: 0, transport: 0, b3: 0, kpis: null, loaded: false,
  })
  const [generating, setGenerating] = useState<string | null>(null)

  const loadStatus = useCallback(async () => {
    if (!siteId) return
    const [energyData, waterData, labData, stackData, transportData, b3Data, kpis] = await Promise.all([
      getHubEntries<EnergyEntry>("energy", siteId, industryId),
      getHubEntries<WaterEntry>("water", siteId, industryId),
      getHubEntries<LabEntry>("laboratory", siteId, industryId),
      getHubEntries<StackEntry>("stack", siteId, industryId),
      getHubEntries<TransportEntry>("transport", siteId, industryId),
      getHubEntries<B3Entry>("b3", siteId, industryId),
      calcEngineAsync(siteId, industryId),
    ])
    setDataStatus({
      energy: energyData.length,
      water: waterData.length,
      lab: labData.length,
      stack: stackData.length,
      transport: transportData.length,
      b3: b3Data.length,
      kpis,
      loaded: true,
    })
  }, [siteId, industryId])

  useEffect(() => { loadStatus() }, [loadStatus])

  /* ── PDF Generator ── */
  const handleExportPdf = (template: ReportTemplate) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return
    const kpis = dataStatus.kpis
    const completeness = templateCompleteness(template, dataStatus)
    const verificationStatus = completeness >= 80
      ? `<span style="color:#10b981;">Data Tersedia — Siap Audit Eksternal (${completeness}% lengkap)</span>`
      : completeness > 0
      ? `<span style="color:#f59e0b;">Data Sebagian — Perlu Pelengkapan Data (${completeness}% lengkap)</span>`
      : `<span style="color:#ef4444;">Data Kosong — Isi Data Hub terlebih dahulu (0% lengkap)</span>`

    const sectionRows = template.sections.map((sec, idx) => {
      const st = sectionStatus(sec.dataKey, dataStatus)
      const count = sec.dataKey !== "kpi" ? (dataStatus[sec.dataKey as keyof DataStatus] as number) : null
      const detail = sec.dataKey === "kpi"
        ? (kpis?.hasData ? `GWP: ${kpis.gwp_kgCO2e?.toFixed(1) ?? "—"} kgCO₂e | Energi: ${kpis.energy_total_MWh?.toFixed(1) ?? "—"} MWh` : "Belum ada data operasional")
        : (count !== null && count > 0 ? `${count} entri terdaftar` : "Belum ada data di Data Hub")
      return `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${sec.label}</strong><br><span style="font-size:10px;color:#64748b;">${detail}</span></td>
          <td><span style="color:${st.color};font-weight:bold;">${st.pct}% ${st.label}</span></td>
          <td>${template.framework}</td>
        </tr>`
    }).join("")

    const kpiSection = kpis?.hasData ? `
      <div class="section-title">Ringkasan KPI Operasional (Dari Data Hub)</div>
      <table class="table">
        <thead><tr><th>Indikator</th><th>Nilai</th><th>Satuan</th></tr></thead>
        <tbody>
          <tr><td>Total GHG Emisi</td><td><strong>${kpis.total_ghg_tCO2e}</strong></td><td>tCO₂e</td></tr>
          <tr><td>Emisi Scope 1</td><td>${kpis.scope1_tCO2e}</td><td>tCO₂e</td></tr>
          <tr><td>Emisi Scope 2</td><td>${kpis.scope2_tCO2e}</td><td>tCO₂e</td></tr>
          <tr><td>Emisi Scope 3</td><td>${kpis.scope3_tCO2e}</td><td>tCO₂e</td></tr>
          <tr><td>Total Energi</td><td>${kpis.energy_total_MWh}</td><td>MWh</td></tr>
          <tr><td>Energi Terbarukan</td><td>${kpis.energy_renewable_MWh}</td><td>MWh</td></tr>
          <tr><td>% Energi Terbarukan</td><td>${kpis.renewable_pct}</td><td>%</td></tr>
          <tr><td>Global Warming Potential (GWP)</td><td>${kpis.gwp_kgCO2e}</td><td>kgCO₂e</td></tr>
          <tr><td>Acidification Potential (AP)</td><td>${kpis.ap_kgSO2e}</td><td>kgSO₂e</td></tr>
          <tr><td>Eutrophication Potential (EP)</td><td>${kpis.ep_kgPO4e}</td><td>kgPO₄e</td></tr>
          <tr><td>Water Use Depletion</td><td>${kpis.wud_m3}</td><td>m³</td></tr>
          <tr><td>Abiotic Depletion Fossil</td><td>${kpis.adpf_MJ}</td><td>MJ</td></tr>
        </tbody>
      </table>` : `
      <div class="section-title">Ringkasan KPI Operasional</div>
      <p style="font-size:12px;color:#f59e0b;padding:12px;border:1px solid #fcd34d;border-radius:8px;background:#fffbeb;">
        Data operasional belum tersedia. Silakan isi Data Hub terlebih dahulu agar laporan ini berisi nilai KPI yang riil.
      </p>`

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>${template.title} — GreenLCA Enterprise</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; line-height: 1.6; padding: 20px; }
    .print-btn { margin-bottom: 20px; text-align: right; }
    .header { border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-end; }
    .title { font-size: 24px; font-weight: bold; color: #065f46; margin: 0; }
    .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
    .badge { background: #d1fae5; color: #065f46; padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: bold; }
    .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 25px; font-size: 12px; }
    .meta-item label { font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: bold; display: block; }
    .meta-item span { font-weight: bold; color: #0f172a; }
    .section-title { font-size: 16px; font-weight: bold; color: #0f172a; border-left: 4px solid #10b981; padding-left: 10px; margin: 25px 0 12px 0; }
    .table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
    .table th { background: #f1f5f9; padding: 10px; text-align: left; font-weight: bold; color: #475569; border-bottom: 1px solid #cbd5e1; }
    .table td { padding: 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 10px; color: #94a3b8; }
    .stamp { border: 2px dashed #10b981; color: #047857; padding: 10px 15px; border-radius: 8px; display: inline-block; font-size: 11px; font-weight: bold; text-align: center; margin-top: 20px; }
    .completeness-bar { background:#e2e8f0; border-radius:4px; height:8px; margin-top:6px; }
    .completeness-fill { background:${completeness >= 80 ? "#10b981" : completeness > 0 ? "#f59e0b" : "#ef4444"}; border-radius:4px; height:8px; width:${completeness}%; }
    @media print { .print-btn { display: none; } }
  </style>
</head>
<body>
  <div class="print-btn">
      <button onclick="window.print()" style="background:#10b981;color:white;border:none;padding:10px 20px;border-radius:6px;font-weight:bold;cursor:pointer;">Cetak / Download PDF</button>
  </div>

  <div class="header">
    <div>
      <h1 class="title">${template.title}</h1>
      <div class="subtitle">GreenLCA Enterprise Sustainability &amp; Compliance Intelligence</div>
    </div>
    <span class="badge">${template.framework}</span>
  </div>

  <div class="meta-grid">
    <div class="meta-item"><label>Dasar Regulasi</label><span>${template.regulatoryBasis}</span></div>
    <div class="meta-item"><label>Tanggal Penerbitan</label><span>${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span></div>
    <div class="meta-item"><label>Status Verifikasi</label><span>${verificationStatus}</span></div>
    <div class="meta-item"><label>Kelengkapan Data</label>
      <span>${completeness}%</span>
      <div class="completeness-bar"><div class="completeness-fill"></div></div>
    </div>
  </div>

  <div class="section-title">Ringkasan Eksekutif &amp; Cakupan Metodologi</div>
  <p style="font-size:12px;color:#475569;">
    ${template.description} Data laporan ini bersumber langsung dari Data Hub yang terverifikasi. Tingkat kelengkapan data saat ini: <strong>${completeness}%</strong>.
    ${completeness < 80 ? "<br><strong style='color:#f59e0b;'>Laporan ini perlu dilengkapi dengan data operasional di modul Data Hub sebelum dapat digunakan untuk keperluan audit resmi.</strong>" : ""}
  </p>

  <div class="section-title">Struktur &amp; Bagian Laporan Resmi</div>
  <table class="table">
    <thead>
      <tr>
        <th>No</th>
        <th>Bab / Bagian Laporan</th>
        <th>Status &amp; Kelengkapan Data</th>
        <th>Standar</th>
      </tr>
    </thead>
    <tbody>${sectionRows}</tbody>
  </table>

  ${kpiSection}

  <div class="stamp">
    ${completeness >= 80 ? "TERVERIFIKASI OLEH GREENLCA" : "DATA BELUM LENGKAP — ISI DATA HUB TERLEBIH DAHULU"}<br>
    <span style="font-size:9px;font-weight:normal;color:#64748b;">
      Generated: ${new Date().toISOString()} | Completeness: ${completeness}%
    </span>
  </div>

  <div class="footer">
    Laporan Resmi GreenLCA Enterprise System · Diterbitkan untuk Kepentingan Pelaporan OJK, KLHK &amp; Auditor Independen · Â© 2026 GreenLCA
  </div>

  <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); }</script>
</body>
</html>`

    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  const handleGenerate = (id: string) => {
    setGenerating(id)
    setTimeout(() => setGenerating(null), 1000)
  }

  const handleGenerateAll = () => {
    setGenerating("all")
    loadStatus().then(() => setGenerating(null))
  }

  const totalEntries = dataStatus.energy + dataStatus.water + dataStatus.lab + dataStatus.stack + dataStatus.transport + dataStatus.b3
  const readyCount = TEMPLATES.filter((t) => templateCompleteness(t, dataStatus) >= 80).length

  return (
    <ModuleGate moduleName="M14 · Reporting & Export">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" className="text-[10px]">Modul 14</Badge>
            <Badge variant="neutral" className="text-[10px] font-bold">POJK 51 · GRI Standards · ISO 14040</Badge>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Reporting & Export PDF</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Kompilasi hasil seluruh modul menjadi laporan resmi siap-cetak. Status kelengkapan dihitung langsung dari data riil di database.
          </p>
        </div>
        <Button onClick={handleGenerateAll} disabled={generating === "all"}>
          {generating === "all" ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Memuat Data Riil...</>
          ) : (
            <><Sparkles className="mr-2 h-4 w-4" />Refresh Status Data</>
          )}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-emerald-600" /><CardTitle className="text-sm">Template Tersedia</CardTitle></div>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{TEMPLATES.length}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><CardTitle className="text-sm">Siap Audit (&gt;80%)</CardTitle></div>
            <p className={`text-2xl font-bold mt-1 ${readyCount > 0 ? "text-emerald-700" : "text-amber-600"}`}>
              {dataStatus.loaded ? readyCount : <Loader2 className="h-5 w-5 animate-spin" />}
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-blue-600" /><CardTitle className="text-sm">Entri Data Hub</CardTitle></div>
            <p className={`text-2xl font-bold mt-1 ${totalEntries > 0 ? "text-blue-700" : "text-neutral-400"}`}>
              {dataStatus.loaded ? totalEntries : <Loader2 className="h-5 w-5 animate-spin" />}
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-purple-600" /><CardTitle className="text-sm">Status Emisi GHG</CardTitle></div>
            <p className={`text-sm font-bold mt-1 ${dataStatus.kpis?.hasData ? "text-emerald-700" : "text-neutral-400"}`}>
              {!dataStatus.loaded ? <Loader2 className="h-5 w-5 animate-spin" /> : dataStatus.kpis?.hasData ? `${dataStatus.kpis.total_ghg_tCO2e} tCO₂e` : "Belum Ada Data"}
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* Warning if no data */}
      {dataStatus.loaded && totalEntries === 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div className="text-sm text-amber-800">
            <strong>Data Hub masih kosong.</strong> Isi data operasional di modul <strong>Data Hub</strong> terlebih dahulu agar laporan memiliki kelengkapan data yang riil.
            Status laporan di bawah akan otomatis diperbarui.
          </div>
        </div>
      )}

      {/* Report Cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {TEMPLATES.map((t) => {
          const completeness = templateCompleteness(t, dataStatus)
          const isReady = completeness >= 80
          const isGenerating = generating === t.id
          return (
            <Card key={t.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                      <FileOutput className="h-5 w-5 text-neutral-600" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{t.title}</CardTitle>
                      <span className={`inline-block mt-1 rounded px-2 py-0.5 text-[10px] font-bold ${t.frameworkColor}`}>{t.framework}</span>
                    </div>
                  </div>
                  {!dataStatus.loaded ? (
                    <Badge variant="neutral"><Loader2 className="h-3 w-3 animate-spin" /></Badge>
                  ) : isReady ? (
                    <Badge variant="success">Siap Download</Badge>
                  ) : completeness > 0 ? (
                    <Badge variant="neutral" className="text-amber-700 bg-amber-50 border-amber-200">Data Sebagian</Badge>
                  ) : (
                    <Badge variant="neutral">Belum Ada Data</Badge>
                  )}
                </div>
              </CardHeader>
              <div className="space-y-3">
                <p className="text-xs text-neutral-500 leading-relaxed">{t.description}</p>

                {/* Completeness bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Kelengkapan Data</span>
                    <span className={`text-[11px] font-bold ${isReady ? "text-emerald-700" : completeness > 0 ? "text-amber-600" : "text-neutral-400"}`}>
                      {dataStatus.loaded ? `${completeness}%` : "—"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-neutral-100">
                    <div
                      className={`h-1.5 rounded-full transition-all ${isReady ? "bg-emerald-500" : completeness > 0 ? "bg-amber-400" : "bg-neutral-200"}`}
                      style={{ width: `${completeness}%` }}
                    />
                  </div>
                </div>

                {/* Section status */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Bagian &amp; Status Data</p>
                  <div className="space-y-1">
                    {t.sections.map((s) => {
                      const st = sectionStatus(s.dataKey, dataStatus)
                      return (
                        <div key={s.label} className="flex items-center justify-between gap-2 rounded-md bg-neutral-50 border border-neutral-100 px-2.5 py-1.5">
                          <span className="text-[11px] text-neutral-600 truncate flex-1">{s.label}</span>
                          <span className="text-[10px] font-bold shrink-0" style={{ color: st.color }}>
                            {dataStatus.loaded ? st.label : "—"}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-lg bg-neutral-50 border border-neutral-100 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">Dasar Regulasi</p>
                  <p className="text-xs text-neutral-600">{t.regulatoryBasis}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                    <Clock className="mr-1.5 h-3.5 w-3.5" /> Diperbarui: {t.lastUpdated}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleExportPdf(t)}>
                      <Download className="mr-1.5 h-3.5 w-3.5" />Export PDF
                    </Button>
                    <Button size="sm" disabled={isGenerating} onClick={() => handleGenerate(t.id)}>
                      {isGenerating ? (
                        <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />Refresh...</>
                      ) : (
                        <><Sparkles className="mr-1.5 h-3.5 w-3.5" />Refresh</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
        <b>Catatan:</b> Status kelengkapan laporan dihitung langsung dari data riil di <b>Data Hub</b>.
        Isi modul Data Hub terlebih dahulu agar laporan dapat mencapai status <b>Siap Download (&ge;80%)</b>.
        Klik <b>Export PDF</b> untuk mengunduh laporan beserta nilai KPI aktual.
      </div>
    </div>
    </ModuleGate>
  )
}

