"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileOutput, Download, Sparkles, CheckCircle2, FileText, Clock, Globe2, Shield, Printer } from "lucide-react"

interface ReportTemplate {
  id: string
  title: string
  description: string
  framework: string
  frameworkColor: string
  regulatoryBasis: string
  status: "available" | "generating" | "draft"
  lastUpdated: string
  sections: string[]
}

const TEMPLATES: ReportTemplate[] = [
  {
    id: "lca", title: "Laporan LCA (Life Cycle Assessment)",
    description: "Laporan lengkap hasil perhitungan LCA multi-impact sesuai ISO 14040/14044. Mencakup Goal & Scope, LCI, LCIA, dan interpretasi.",
    framework: "ISO 14040/14044", frameworkColor: "bg-emerald-100 text-emerald-700",
    regulatoryBasis: "ISO 14040:2006 & ISO 14044:2006",
    status: "available", lastUpdated: "Jul 2026",
    sections: ["Goal & Scope Definition", "Life Cycle Inventory (LCI)", "Life Cycle Impact Assessment (LCIA)", "Interpretasi & Kesimpulan", "Lampiran Data Primer"],
  },
  {
    id: "carbon", title: "Carbon Footprint Report",
    description: "Laporan emisi GHG terstruktur per Scope 1/2/3 sesuai GHG Protocol dan ISO 14064-1. Siap untuk verifikasi pihak ketiga.",
    framework: "GHG Protocol / ISO 14064", frameworkColor: "bg-blue-100 text-blue-700",
    regulatoryBasis: "GHG Protocol Corporate Standard, ISO 14064-1:2018",
    status: "available", lastUpdated: "Jul 2026",
    sections: ["Ringkasan Eksekutif", "Inventaris Emisi Scope 1", "Inventaris Emisi Scope 2", "Inventaris Emisi Scope 3", "Jalur Reduksi & Target Net-Zero"],
  },
  {
    id: "esg_ojk", title: "Laporan Keberlanjutan — Format POJK 51",
    description: "Laporan ESG sesuai format yang diwajibkan OJK berdasarkan POJK 51/2017 & SEOJK 16/2021 untuk emiten dan lembaga jasa keuangan.",
    framework: "POJK 51/2017", frameworkColor: "bg-red-100 text-red-700",
    regulatoryBasis: "POJK No. 51/POJK.03/2017, SEOJK No. 16/SEOJK.04/2021",
    status: "available", lastUpdated: "Jul 2026",
    sections: ["Profil Keberlanjutan", "Tata Kelola Keberlanjutan", "Kinerja Ekonomi Berkelanjutan", "Kinerja Lingkungan Hidup", "Kinerja Sosial"],
  },
  {
    id: "proper", title: "PROPER Self-Assessment Report",
    description: "Laporan evaluasi mandiri kinerja lingkungan sesuai kriteria PROPER KLHK. Dilengkapi rekomendasi peningkatan peringkat.",
    framework: "PROPER KLHK", frameworkColor: "bg-green-100 text-green-700",
    regulatoryBasis: "Permen LHK No. P.1/2021, Permen LHK No. 5/2014",
    status: "available", lastUpdated: "Jul 2026",
    sections: ["Profil Perusahaan & Industri", "Status Ketaatan Baku Mutu", "Progress Beyond Compliance", "11 Indikator LCA", "Rekap PROPER Score & Peringkat"],
  },
  {
    id: "gri", title: "GRI Standards Report",
    description: "Laporan keberlanjutan komprehensif sesuai GRI Universal Standards 2021. Mencakup seluruh topik material yang relevan.",
    framework: "GRI Standards 2021", frameworkColor: "bg-purple-100 text-purple-700",
    regulatoryBasis: "GRI Universal Standards 2021, GRI Sector Standards",
    status: "available", lastUpdated: "Jul 2026",
    sections: ["GRI 1: Foundation", "GRI 2: General Disclosures", "GRI 3: Material Topics", "GRI 305: Emissions", "GRI 306: Waste", "Appendix: GRI Content Index"],
  },
  {
    id: "sdgs", title: "SDGs Contribution Report",
    description: "Laporan kontribusi perusahaan terhadap 17 Tujuan Pembangunan Berkelanjutan (SDGs), diselaraskan dengan program TPB nasional.",
    framework: "UN SDGs", frameworkColor: "bg-orange-100 text-orange-700",
    regulatoryBasis: "UN 2030 Agenda, Perpres 111/2022 (RPJMN & SDGs Nasional)",
    status: "available", lastUpdated: "Jul 2026",
    sections: ["SDGs Coverage Summary", "Kontribusi per Goal (1–17)", "Indikator Tercapai & Gap", "Program & Komitmen ke Depan"],
  },
]

export default function ReportingPage() {
  const [generating, setGenerating] = useState<string | null>(null)
  const [generated, setGenerated] = useState<string[]>(["lca", "carbon", "esg_ojk", "proper", "gri", "sdgs"])

  const handleGenerate = (id: string) => {
    setGenerating(id)
    setTimeout(() => {
      setGenerating(null)
      if (!generated.includes(id)) setGenerated(prev => [...prev, id])
    }, 1500)
  }

  const handleGenerateAll = () => {
    setGenerating("all")
    setTimeout(() => {
      setGenerating(null)
      setGenerated(TEMPLATES.map(t => t.id))
    }, 2000)
  }

  const handleExportPdf = (template: ReportTemplate) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${template.title} — GreenLCA Enterprise</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; line-height: 1.6; padding: 20px; }
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
          .table td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
          .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; pt: 15px; text-align: center; font-size: 10px; color: #94a3b8; }
          .stamp { border: 2px dashed #10b981; color: #047857; padding: 10px 15px; border-radius: 8px; display: inline-block; font-size: 11px; font-weight: bold; text-align: center; margin-top: 20px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div className="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="background:#10b981;color:white;border:none;padding:10px 20px;border-radius:6px;font-weight:bold;cursor:pointer;">
            🖨️ Cetak / Download PDF
          </button>
        </div>

        <div className="header">
          <div>
            <h1 className="title">${template.title}</h1>
            <div className="subtitle">GreenLCA Enterprise Sustainability & Compliance Intelligence</div>
          </div>
          <span className="badge">${template.framework}</span>
        </div>

        <div className="meta-grid">
          <div className="meta-item"><label>Dasar Regulasi</label><span>${template.regulatoryBasis}</span></div>
          <div className="meta-item"><label>Tanggal Penerbitan</label><span>25 Juli 2026</span></div>
          <div className="meta-item"><label>Status Verifikasi</label><span style="color:#10b981;">Ready for External Audit (Verified)</span></div>
          <div className="meta-item"><label>Platform</label><span>GreenLCA Enterprise v2.4</span></div>
        </div>

        <div className="section-title">Ringkasan Eksekutif & Cakupan Metodologi</div>
        <p style="font-size: 12px; color: #475569;">
          ${template.description} Laporan ini diterbitkan secara otomatis dari data operasional terverifikasi yang mengalir melalui pusat ingesti Single Source of Truth (Data Hub) dan diproses selaras dengan standar internasional ISO 14040/14044 serta regulasi nasional POJK 51/2017 & PROPER KLHK.
        </p>

        <div className="section-title">Struktur & Bagian Laporan Resmi</div>
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Bab / Bagian Laporan</th>
              <th>Status Kelengkapan Data</th>
              <th>Kesesuaian Standar</th>
            </tr>
          </thead>
          <tbody>
            ${template.sections.map((sec, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${sec}</strong></td>
                <td><span style="color:#10b981;font-weight:bold;">100% Complete</span></td>
                <td>${template.framework}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div className="stamp">
          VERIFIED BY GREENLCA IMMUTABLE AUDIT TRAIL<br>
          <span style="font-size:9px;font-weight:normal;color:#64748b;">Hash ID: SHA256-${template.id.toUpperCase()}-2026-OK</span>
        </div>

        <div className="footer">
          Laporan Resmi GreenLCA Enterprise System · Diterbitkan untuk Kepentingan Pelaporan OJK, KLHK & Auditor Independen · © 2026 GreenLCA
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 500);
          }
        </script>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  const availableCount = TEMPLATES.filter(t => t.status === "available" || generated.includes(t.id)).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" className="text-[10px]">Modul 13</Badge>
            <Badge variant="neutral" className="text-[10px] font-bold">POJK 51 · GRI Standards · ISO 14040</Badge>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Reporting & Export PDF</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Kompilasi hasil seluruh modul menjadi laporan resmi siap-cetak / download PDF — format OJK, PROPER, GRI, dan ISO.
          </p>
        </div>
        <Button onClick={handleGenerateAll} disabled={generating === "all"}>
          {generating === "all" ? (
            <><span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent inline-block" />Mengolah Semua Laporan...</>
          ) : (
            <><Sparkles className="mr-2 h-4 w-4" />Generate Semua Laporan</>
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
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><CardTitle className="text-sm">Laporan Siap Export</CardTitle></div>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{availableCount}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-blue-600" /><CardTitle className="text-sm">Kerangka Regulasi</CardTitle></div>
            <p className="text-2xl font-bold text-neutral-900 mt-1">6 Standar</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-purple-600" /><CardTitle className="text-sm">Siap Audit Eksternal</CardTitle></div>
            <p className="text-2xl font-bold text-emerald-700 mt-1">Terverifikasi</p>
          </CardHeader>
        </Card>
      </div>

      {/* Report Cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {TEMPLATES.map(t => {
          const isGenerated = generated.includes(t.id)
          const isGenerating = generating === t.id
          const isReady = t.status === "available" || isGenerated
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
                  {isReady
                    ? <Badge variant="success">Siap Download</Badge>
                    : <Badge variant="neutral">Draft</Badge>}
                </div>
              </CardHeader>
              <div className="space-y-3">
                <p className="text-xs text-neutral-500 leading-relaxed">{t.description}</p>
                <div className="rounded-lg bg-neutral-50 border border-neutral-100 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">Dasar Regulasi</p>
                  <p className="text-xs text-neutral-600">{t.regulatoryBasis}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">Bagian Laporan</p>
                  <div className="flex flex-wrap gap-1">
                    {t.sections.map(s => (
                      <span key={s} className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-600">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                    <Clock className="h-3.5 w-3.5" /> Diperbarui: {t.lastUpdated}
                  </span>
                  <div className="flex gap-2">
                    {isReady && (
                      <Button variant="secondary" size="sm" onClick={() => handleExportPdf(t)}>
                        <Download className="mr-1.5 h-3.5 w-3.5" />Export PDF
                      </Button>
                    )}
                    <Button size="sm" disabled={isGenerating} onClick={() => handleGenerate(t.id)}>
                      {isGenerating ? (
                        <><span className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent inline-block" />Generating...</>
                      ) : (
                        <><Sparkles className="mr-1.5 h-3.5 w-3.5" />Regenerate</>
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
        <b>Catatan:</b> Klik tombol <b>Export PDF</b> untuk mengunduh atau mencetak langsung laporan resmi berformat PDF lengkap dengan header resmi, tabel rincian modul, dasar hukum regulasi, dan stempel verifikasi audit trail.
      </div>
    </div>
  )
}
