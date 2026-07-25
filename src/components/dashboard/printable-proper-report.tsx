"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Printer, X, Download, ShieldCheck, CheckCircle2, AlertTriangle, FileText, Coins, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useIndustryId } from "@/lib/use-industry-id"
import { getMeasurements, paramValue, evaluate } from "@/lib/measurements"
import {
  INDUSTRIES,
  getEmissionParams,
  LIMBAH_B3_PARAMS,
  LCA_PARAMS,
  predictRank,
} from "@/lib/proper"

export function PrintableProperReportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const industryId = useIndustryId()
  const industry = INDUSTRIES.find((i) => i.id === industryId) ?? INDUSTRIES[0]
  const measurements = getMeasurements(industryId)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!isOpen || !mounted) return null

  const airParams = industry.params.filter((p) => p.category === "air_limbah")
  const emParams = getEmissionParams("batubara")
  const b3Params = LIMBAH_B3_PARAMS

  const airResults = airParams.map((p) => ({ p, ...evaluate(p, measurements) }))
  const emResults = emParams.map((p) => ({ p, ...evaluate(p, measurements) }))
  const b3Results = b3Params.map((p) => ({ p, ...evaluate(p, measurements) }))

  const lcaFilledCount = LCA_PARAMS.filter((p) => {
    const v = paramValue(p, measurements)
    return typeof v === "number" && v > 0
  }).length

  const countAirFails = airResults.filter((r) => r.status === "fail").length
  const countEmFails = emResults.filter((r) => r.status === "fail").length
  const countB3Fails = b3Results.filter((r) => r.status === "fail").length
  const fails = countAirFails + countEmFails + countB3Fails
  const warns = [...airResults, ...emResults, ...b3Results].filter((r) => r.status === "warn").length
  const properRank = predictRank(countEmFails, countAirFails, countB3Fails, lcaFilledCount)

  const handlePrint = () => {
    window.print()
  }

  return createPortal(
    <div id="printable-portal-root">
      <div className="printable-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
        <div id="printable-report-modal" className="relative w-full max-w-4xl rounded-2xl bg-white p-8 shadow-2xl my-8">
        {/* Header Control (Hidden during print) */}
        <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-4 print-hide">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Preview Laporan Resmi Evaluasi PROPER &amp; LCA</h2>
            <p className="text-xs text-neutral-500">Format standar dokumen evaluasi kinerja lingkungan untuk Direksi &amp; Auditor KLHK</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} className="bg-emerald-600 text-white hover:bg-emerald-700">
              <Printer className="h-4 w-4" /> Cetak / Download PDF
            </Button>
            <button onClick={onClose} className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div className="space-y-6 text-neutral-900 print:text-black">
          {/* Letterhead Banner */}
          <div className="flex items-center justify-between border-b-2 border-emerald-700 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-700 font-bold text-white text-lg">
                  ens
                </div>
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-emerald-900">ensPR ENTERPRISE SUSTAINABILITY PLATFORM</h1>
                  <p className="text-xs font-medium text-emerald-700">Laporan Evaluasi Kinerja Lingkungan Hidup &amp; Analisis Siklus Daur Hidup (LCA)</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-neutral-700">No. Dokumen: ENS-RPT/{new Date().getFullYear()}/009</p>
              <p className="text-xs text-neutral-500">Tanggal Terbit: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
          </div>

          {/* Company Profile Section */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs">
            <div>
              <p className="text-neutral-500">Nama Perusahaan / Pabrik:</p>
              <p className="font-bold text-sm text-neutral-900">{industry.name}</p>
              <p className="mt-1 text-neutral-500">Kategori Sektor Industri:</p>
              <p className="font-semibold text-neutral-800">{industry.id.toUpperCase()} Industry</p>
            </div>
            <div>
              <p className="text-neutral-500">Regulasi Acuan Baku Mutu:</p>
              <p className="font-semibold text-neutral-800">PP No. 22/2021 &amp; Permen LHK No. 1/2021</p>
              <p className="mt-1 text-neutral-500">Status Verifikasi Sistem:</p>
              <p className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Terverifikasi Otomatis oleh ensPR Rule Engine
              </p>
            </div>
          </div>

          {/* Proper Executive Summary Card */}
          <div className="flex items-center justify-between rounded-xl border-2 border-emerald-600 bg-emerald-50/80 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Prediksi Peringkat Kinerja PROPER KLHK</p>
              <p className="mt-1 text-3xl font-extrabold text-emerald-950">PROPER {properRank.toUpperCase()}</p>
              <p className="mt-1 text-xs text-emerald-700">
                {fails === 0
                  ? `Semua baku mutu taat (0 Pelanggaran). Terverifikasi ${lcaFilledCount}/11 Indikator LCA ISO 14040/44.`
                  : `${fails} parameter melampaui baku mutu. Lakukan tindakan korektif untuk menghindari peringkat Merah.`}
              </p>
            </div>
            <div className="text-right">
              <div className="inline-flex flex-col items-end rounded-lg bg-white px-4 py-2 border border-emerald-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Skor Kepatuhan</span>
                <span className="text-2xl font-black text-emerald-700">{Math.max(0, 100 - fails * 15 - warns * 5)}/100</span>
              </div>
            </div>
          </div>

          {/* Operational Metrics Tables */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-900 border-b border-neutral-200 pb-1">
              1. Evaluasi Baku Mutu Air Limbah &amp; Emisi Cerobong
            </h3>
            <table className="w-full text-left text-xs border border-neutral-200">
              <thead className="bg-neutral-100 font-semibold text-neutral-700 border-b border-neutral-200">
                <tr>
                  <th className="p-2">Kode</th>
                  <th className="p-2">Nama Parameter</th>
                  <th className="p-2 text-right">Nilai Pengukuran</th>
                  <th className="p-2 text-center">Satuan</th>
                  <th className="p-2 text-center">Status Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {[...airResults, ...emResults].map((r, i) => (
                  <tr key={i} className="hover:bg-neutral-50">
                    <td className="p-2 font-mono font-bold text-neutral-600">{r.p.code}</td>
                    <td className="p-2 font-medium">{r.p.name}</td>
                    <td className="p-2 text-right font-bold">{r.value ?? "—"}</td>
                    <td className="p-2 text-center text-neutral-500">{"unit" in r.p ? (r.p as any).unit : "—"}</td>
                    <td className="p-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === "ok" ? "bg-emerald-100 text-emerald-800" :
                        r.status === "warn" ? "bg-amber-100 text-amber-800" :
                        r.status === "fail" ? "bg-red-100 text-red-800" : "bg-neutral-100 text-neutral-600"
                      }`}>
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* B3 Management */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-900 border-b border-neutral-200 pb-1">
              2. Kepatuhan Pengelolaan Limbah B3 (Permen LHK No. 6/2021)
            </h3>
            <table className="w-full text-left text-xs border border-neutral-200">
              <thead className="bg-neutral-100 font-semibold text-neutral-700 border-b border-neutral-200">
                <tr>
                  <th className="p-2">Indikator Operasional B3</th>
                  <th className="p-2 text-right">Nilai Terdaftar</th>
                  <th className="p-2 text-center">Batu Mutu / Acuan</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {b3Results.map((r, i) => (
                  <tr key={i}>
                    <td className="p-2 font-medium">{r.p.name}</td>
                    <td className="p-2 text-right font-bold">{r.value ?? "—"} {r.p.kind !== "checklist" ? (r.p as any).unit : ""}</td>
                    <td className="p-2 text-center text-neutral-500">
                      {r.p.code === "b3_storage_days" ? "≤ 90 Hari" : r.p.code === "b3_festronik_pct" ? "≥ 100%" : "—"}
                    </td>
                    <td className="p-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === "ok" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}>
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* LCA 11 Indicators Summary */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-900 border-b border-neutral-200 pb-1">
              3. Ringkasan 11 Indikator LCA ISO 14040/14044 (Beyond Compliance)
            </h3>
            <p className="text-xs text-neutral-600">
              Status pengisian dokumen LCA: <b>{lcaFilledCount}/11 Kategori Terpenuhi</b> ({lcaFilledCount >= 11 ? "Syarat PROPER EMAS Tercapai" : lcaFilledCount >= 3 ? "Syarat PROPER HIJAU Tercapai" : "Perlu min 3 indikator untuk Peringkat Hijau"}).
            </p>
          </div>

          {/* Signature Block for Print */}
          <div className="mt-12 grid grid-cols-2 gap-8 text-center text-xs pt-8 border-t border-neutral-300">
            <div>
              <p className="font-semibold text-neutral-500">Disiapkan Oleh,</p>
              <p className="font-bold text-neutral-900 mt-12">Manager EHS &amp; Lingkungan</p>
              <p className="text-[10px] text-neutral-400">Tim Kepatuhan PROPER Pabrik</p>
            </div>
            <div>
              <p className="font-semibold text-neutral-500">Disetujui Oleh,</p>
              <p className="font-bold text-neutral-900 mt-12">Direktur Utama / General Manager</p>
              <p className="text-[10px] text-neutral-400">Pimpinan Tertinggi Fasilitas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  , document.body)
}
