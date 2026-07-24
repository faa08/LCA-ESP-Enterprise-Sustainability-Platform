"use client"

import { useState, useEffect } from "react"

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
  getEmissionParams,
  LIMBAH_B3_PARAMS,
  LCA_PARAMS,
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

function getAiRecommendation(code: string, name: string, status: "fail" | "warn", val: any, unit: string): string {
  const c = code.toLowerCase()
  if (c.includes("ph")) {
    return status === "fail"
      ? `Nilai pH (${val} ${unit}) di luar ambang 6.0–9.0. AI Advisory: Segera sesuaikan injeksi larutan netralisasi (Asam Sulfat H₂SO₄ / Natrium Hidroksida NaOH) pada bak ekualisasi IPAL dan lakukan kalibrasi ulang sensor pH probe.`
      : `Nilai pH (${val} ${unit}) mencapai >90% batas ambang. AI Advisory: Lakukan fine-tuning laju alir dosing pump netralisasi IPAL & periksa efisiensi pengadukan bak netralisasi.`
  }
  if (c.includes("bod") || c.includes("cod")) {
    return status === "fail"
      ? `Kadar ${name} (${val} ${unit}) melampaui baku mutu. AI Advisory: Tingkatkan aerasi pada kolam biologi (kadar DO > 2 mg/L), tingkatkan sirkulasi lumpur (RAS), dan periksa beban organik influent.`
      : `Kadar ${name} (${val} ${unit}) mencapai >90% batas ambang. AI Advisory: Periksa Sludge Volume Index (SVI) dan optimasi waktu tinggal hidrolik (HRT) di kolam aerasi.`
  }
  if (c.includes("tss")) {
    return status === "fail"
      ? `Kadar TSS (${val} ${unit}) tinggi. AI Advisory: Tambahkan koagulan PAC / flokulan pada unit Clarifier dan laksanakan pengurasan lumpur terendap (*sludge wasting*).`
      : `Kadar TSS (${val} ${unit}) mendekati ambang. AI Advisory: Periksa baffle pengendap sekunder dan kurangi kecepatan impeller clarifier.`
  }
  if (c.includes("b3_storage") || c.includes("simpan")) {
    return status === "fail"
      ? `Lama Simpan B3 (${val} hari) melebihi batas Permen LHK 6/2021 (max 90 hari). AI Advisory: Terbitkan Berita Acara Festronik KLHK dan instruksikan pengangkutan darurat B3 bersama Transporter Terizin.`
      : `Lama Simpan B3 (${val} hari) mendekati 90 hari. AI Advisory: Jadwalkan penyerahan limbah ke pihak ketiga pengumpul B3 berizin dalam H-7 sebelum batas waktu.`
  }
  if (c.includes("b3_permit") || c.includes("izin")) {
    return status === "fail"
      ? `Izin TPS B3 Kadaluarsa. AI Advisory: Hentikan penerimaan limbah B3 baru & segera unggah berkas pemenuhan komitmen Peretujuan Teknis B3 ke portal OSS RBA / KLHK.`
      : `Sisa Berlaku Izin TPS B3 (${val} hari) segera habis. AI Advisory: Siapkan dokumen evaluasi teknis TPS B3 untuk pengajuan perpanjangan izin.`
  }
  if (c.includes("so2") || c.includes("nox") || c.includes("tsp")) {
    return status === "fail"
      ? `Emisi ${name} (${val} ${unit}) melampaui baku mutu. AI Advisory: Periksa rasio Air-Fuel burner, tingkatkan efisiensi wet scrubber/ESP, dan periksa kadar sulfur batu bara.`
      : `Emisi ${name} (${val} ${unit}) mendekati >90% ambang. AI Advisory: Jalankan pembersihan sootblower dan periksa efisiensi penangkap debu Baghouse.`
  }
  return status === "fail"
    ? `Parameter ${name} (${val} ${unit}) melampaui baku mutu KLHK. AI Advisory: Lakukan isolasi sampel, periksa unit pengolahan terkait, dan laksanakan uji ulang lab terakreditasi.`
    : `Parameter ${name} (${val} ${unit}) mencapai >90% ambang baku mutu. AI Advisory: Lakukan pemeriksaan preventif pada peralatan pendukung operasional.`
}

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

export default function Compliance() {
  const locale = getLocaleClient()
  const dict = dicts[locale]
  const industryId = useIndustryId()
  const [fuelType, setFuelType] = useState<string>("batubara")

  // Load fuelType dari Settings (localStorage)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("enspr_fuel_type")
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setFuelType(stored)
    }
  }, [])

  const industry = INDUSTRIES.find((i) => i.id === industryId) ?? null

  // Build evaluation groups from user-entered measurements only (no demo fallback)
  const measurements = getMeasurements(industryId)
  const airParams = industry ? industry.params.filter((p) => p.category === "air_limbah") : []
  const airResults = airParams.map((p) => ({ p, ...evaluate(p, measurements) }))
  const emResults = getEmissionParams(fuelType).map((p) => ({ p, ...evaluate(p, measurements) }))
  const b3Results = LIMBAH_B3_PARAMS.map((p) => ({ p, ...evaluate(p, measurements) }))

  const countFails = (arr: { status: ComplianceStatus | "empty" }[]) => arr.filter((r) => r.status === "fail").length
  const countWarn = (arr: { status: ComplianceStatus | "empty" }[]) => arr.filter((r) => r.status === "warn").length
  const countEmpty = (arr: { status: ComplianceStatus | "empty" }[]) => arr.filter((r) => r.status === "empty").length

  // Hitung LCA yang sudah diisi untuk menentukan peringkat Hijau/Emas
  const lcaFilledCount = LCA_PARAMS.filter((p) => {
    const raw = measurements[p.code]
    return raw !== undefined && raw !== "" && Number(raw) > 0
  }).length

  const rank = predictRank(countFails(emResults), countFails(airResults), countFails(b3Results), lcaFilledCount)
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

      {/* Early Warning Banner — muncul saat ada parameter mendekati baku mutu */}
      {(countWarn(airResults) + countWarn(emResults) + countWarn(b3Results)) > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Peringatan Dini — {countWarn(airResults) + countWarn(emResults) + countWarn(b3Results)} Parameter Mendekati Baku Mutu</p>
            <p className="mt-0.5 text-xs text-amber-700">
              Parameter berikut telah melampaui 90% batas baku mutu KLHK. Lakukan tindakan korektif segera sebelum terjadi pelanggaran:
              {" "}<b>{[...airResults, ...emResults, ...b3Results].filter(r => r.status === "warn").map(r => r.p.name).join(", ")}</b>
            </p>
          </div>
        </div>
      )}

      {/* Rekomendasi AI — berdasarkan status fail/warn */}
      {entered > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rekomendasi Tindakan</CardTitle>
            <p className="mt-1 text-sm text-neutral-500">Analisis otomatis berbasis data pemantauan Anda saat ini</p>
          </CardHeader>
          <div className="space-y-2">
            {countFails(airResults) + countFails(emResults) + countFails(b3Results) === 0 && countWarn(airResults) + countWarn(emResults) + countWarn(b3Results) === 0 && lcaFilledCount < 3 && (
              <div className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-emerald-800">Semua parameter dalam batas aman — Peringkat BIRU tercapai</p>
                  <p className="text-xs text-emerald-700 mt-0.5">Untuk naik ke Peringkat <b>HIJAU</b>, isi minimal 3 dari 11 indikator LCA (ISO 14040/14044) di modul LCA &amp; Dampak Produk. Saat ini: <b>{lcaFilledCount}/11</b> indikator.</p>
                </div>
              </div>
            )}
            {lcaFilledCount >= 3 && lcaFilledCount < 11 && countFails(airResults) + countFails(emResults) + countFails(b3Results) === 0 && (
              <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">Peringkat HIJAU tercapai! Untuk naik ke EMAS, lengkapi semua 11 indikator LCA</p>
                  <p className="text-xs text-emerald-700 mt-0.5">Progress LCA: <b>{lcaFilledCount}/11</b> indikator diisi. Isi {11 - lcaFilledCount} indikator lagi di modul LCA.</p>
                </div>
              </div>
            )}
            {[...airResults, ...emResults, ...b3Results].filter(r => r.status === "fail").map((r, i) => {
              const u = r.p.kind !== "checklist" ? (r.p as { unit: string }).unit : ""
              return (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50/90 p-3.5 shadow-xs">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  <div>
                    <p className="text-sm font-semibold text-red-900">AI Alert: Pelanggaran Baku Mutu — {r.p.name}</p>
                    <p className="text-xs text-red-800 mt-1 leading-relaxed">
                      {getAiRecommendation(r.p.code, r.p.name, "fail", r.value, u)}
                    </p>
                  </div>
                </div>
              )
            })}
            {[...airResults, ...emResults, ...b3Results].filter(r => r.status === "warn").map((r, i) => {
              const u = r.p.kind !== "checklist" ? (r.p as { unit: string }).unit : ""
              return (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/90 p-3.5 shadow-xs">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">AI Warning: Peringatan Dini — {r.p.name}</p>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      {getAiRecommendation(r.p.code, r.p.name, "warn", r.value, u)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

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
            <div className="space-y-2.5">
              {[
                {
                  title: "Pelaporan SIMPEL KLHK (Triwulanan)",
                  desc: "Baku Mutu Air Limbah & Emisi Cerobong",
                  due: "Tenggat Triwulan I: 31 Maret",
                  status: (airResults.length > 0 && airResults.every(r => r.status !== "empty")) && (emResults.length > 0 && emResults.every(r => r.status !== "empty")) ? "Data Lengkap — Siap Kirim" : entered > 0 ? "Data Parsial (Lengkapi di Data Hub)" : "Belum Ada Ingest Data",
                  tone: (airResults.length > 0 && airResults.every(r => r.status !== "empty")) && (emResults.length > 0 && emResults.every(r => r.status !== "empty")) ? ("success" as const) : entered > 0 ? ("warning" as const) : ("neutral" as const),
                },
                {
                  title: "Pelaporan Festronik Limbah B3 (Semesteran)",
                  desc: "Neraca & Manifest Pengangkutan B3",
                  due: "Tenggat Semester I: 15 Juli",
                  status: (b3Results.length > 0 && b3Results.every(r => r.status !== "empty")) ? "Data B3 Terverifikasi" : "Belum Ada Ingest B3",
                  tone: (b3Results.length > 0 && b3Results.every(r => r.status !== "empty")) ? ("info" as const) : ("neutral" as const),
                },
                {
                  title: "Dokumen LCA Beyond Compliance (ISO 14040/44)",
                  desc: "11 Kategori Dampak Lingkungan Produk",
                  due: "Evaluasi PROPER Hijau/Emas",
                  status: lcaFilledCount >= 11 ? "11/11 LCA Lengkap (Siap EMAS)" : lcaFilledCount >= 3 ? `${lcaFilledCount}/11 LCA Terisi (Siap HIJAU)` : `Isi ${Math.max(0, 3 - lcaFilledCount)} Indikator LCA lagi → Hijau`,
                  tone: lcaFilledCount >= 3 ? ("success" as const) : ("warning" as const),
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-neutral-100 p-2.5">
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">{item.title}</p>
                    <p className="text-[11px] text-neutral-500">{item.desc} · {item.due}</p>
                  </div>
                  <Badge variant={item.tone}>{item.status}</Badge>
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
                  {[
                    { std: "PROPER KLHK", status: "Taat", score: "98%", next: "Okt 2026" },
                    { std: "ISO 14001:2015", status: "Sertifikasi", score: "100%", next: "Nov 2026" },
                    { std: "Permen LHK 5/2014", status: "Patuh", score: "95%", next: "Bulanan" },
                    { std: "Permen LHK 6/2021", status: "Patuh", score: "100%", next: "Semesteran" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-neutral-100">
                      <td className="px-3 py-2.5 font-semibold text-neutral-900">{row.std}</td>
                      <td className="px-3 py-2.5"><Badge variant="success">{row.status}</Badge></td>
                      <td className="px-3 py-2.5 font-bold text-emerald-700">{row.score}</td>
                      <td className="px-3 py-2.5 text-xs text-neutral-500">{row.next}</td>
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
                  {[...airResults, ...emResults, ...b3Results].filter((r) => r.status !== "ok" && r.status !== "empty").length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-6 text-center text-sm text-emerald-700 font-medium">
                        Semua parameter aman — 0 Temuan Kritis / Pelanggaran Audit
                      </td>
                    </tr>
                  ) : (
                    [...airResults, ...emResults, ...b3Results]
                      .filter((r) => r.status !== "ok" && r.status !== "empty")
                      .map((r, i) => (
                        <tr key={i} className="border-b border-neutral-100">
                          <td className="px-3 py-2.5 font-medium text-neutral-900">{r.p.name} {r.status === "fail" ? "melampaui baku mutu" : "mendekati 90% ambang"}</td>
                          <td className="px-3 py-2.5 text-xs text-neutral-500">{r.p.category.toUpperCase()}</td>
                          <td className="px-3 py-2.5">
                            <Badge variant={r.status === "fail" ? "danger" : "warning"}>{r.status === "fail" ? "Tinggi" : "Sedang"}</Badge>
                          </td>
                          <td className="px-3 py-2.5">
                            <Badge variant="neutral">Dalam Monitoring</Badge>
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
