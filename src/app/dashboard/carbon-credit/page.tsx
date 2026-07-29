"use client"

import { useState, useEffect } from "react"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Recycle, CheckCircle2, Coins, Info, ArrowUpRight } from "lucide-react"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { useIndustryId } from "@/lib/use-industry-id"
import { useMeasurements, paramValue } from "@/lib/measurements"
import { OTHER_PARAMS } from "@/lib/proper"
import Link from "next/link"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const CARBON_PRICE_IDR = 70_000 // Rp/tCOâ‚‚e (IDXCarbon referensi)

export default function CarbonCreditPage() {
  const [locale, setLocale] = useState<Locale>("id")
  useEffect(() => {
    setLocale(getLocaleClient())
  }, [])
  const dict = dicts[locale]
  const industryId = useIndustryId()
  const m = useMeasurements(industryId)

  const get = (code: string): number | null => {
    const p = OTHER_PARAMS.find((x) => x.code === code)
    if (!p) return null
    const v = paramValue(p, m)
    return typeof v === "number" ? v : null
  }

  const scope1 = get("ghg_scope1")
  const scope2 = get("ghg_scope2")
  const scope3 = get("ghg_scope3")

  const totalEmissions =
    scope1 !== null || scope2 !== null || scope3 !== null
      ? (scope1 ?? 0) + (scope2 ?? 0) + (scope3 ?? 0)
      : null

  // Baseline SBTi: 50% reduksi di 2030 â†’ potensi kredit = selisih baseline vs target
  const reductionTarget2030 = totalEmissions !== null ? totalEmissions * 0.5 : null
  const potentialCreditTons = reductionTarget2030 !== null ? Math.round(reductionTarget2030) : null
  const potentialRevenueIdr =
    potentialCreditTons !== null ? potentialCreditTons * CARBON_PRICE_IDR : null

  const fmt = (n: number) => n.toLocaleString("id-ID", { maximumFractionDigits: 0 })
  const hasData = totalEmissions !== null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" className="text-[10px]">Modul 7b</Badge>
            <Badge variant="neutral" className="text-[10px] font-bold">SRN-PPI Â· IDXCarbon Â· Verra VCS</Badge>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Registri & Monetisasi Karbon Kredit</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Potensi karbon kredit dihitung otomatis dari baseline emisi aktual vs target reduksi SBTi 2030.
          </p>
        </div>
        <Link
          href="/dashboard/carbon-accounting"
          className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3.5 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
        >
          Lihat Carbon Accounting (Scope 1â€“3)
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* No data state */}
      {!hasData && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-900">Belum ada data emisi</p>
            <p className="mt-0.5 text-xs text-amber-700">
              Masukkan data Scope 1, Scope 2, dan Scope 3 di{" "}
              <Link href="/dashboard/data-hub" className="font-bold underline">Data Hub</Link> atau{" "}
              <Link href="/dashboard/carbon-accounting" className="font-bold underline">Carbon Accounting</Link>{" "}
              untuk menghitung potensi karbon kredit secara otomatis.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards â€” dari data real */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Emisi Baseline"
          value={hasData ? `${fmt(totalEmissions!)} tCOâ‚‚e` : "â€”"}
          description="Scope 1 + 2 + 3 (tahun berjalan)"
          icon={Leaf}
        />
        <StatCard
          title="Potensi Reduksi (SBTi 50%)"
          value={potentialCreditTons !== null ? `${fmt(potentialCreditTons)} tCOâ‚‚e` : "â€”"}
          description="Target Net-Zero 2030"
          icon={CheckCircle2}
        />
        <StatCard
          title="Estimasi Nilai Kredit"
          value={potentialRevenueIdr !== null ? `Rp ${fmt(potentialRevenueIdr)}` : "â€”"}
          description={`@ Rp ${fmt(CARBON_PRICE_IDR)} / tCOâ‚‚e (IDXCarbon)`}
          icon={Coins}
        />
      </div>

      {/* Potensi Pendapatan */}
      {hasData && potentialCreditTons !== null && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <p className="text-sm font-bold text-emerald-900 flex items-center gap-2">
            <Coins className="mr-1.5 h-4 w-4" /> Potensi Revenue Karbon Kredit (IDXCarbon / SRN-PPI)
          </p>
          <p className="text-3xl font-black text-emerald-800 mt-1">
            Rp {fmt(potentialRevenueIdr!)}
            <span className="text-sm font-normal text-emerald-600 ml-2">/ tahun (estimasi)</span>
          </p>
          <p className="text-xs text-emerald-700 mt-1">
            Berdasarkan {fmt(potentialCreditTons)} tCOâ‚‚e potensi reduksi Ã— Rp {fmt(CARBON_PRICE_IDR)}/tCOâ‚‚e
            (harga referensi IDXCarbon 2026). Daftarkan proyek ke{" "}
            <a href="https://srn.menlhk.go.id" target="_blank" rel="noopener noreferrer" className="underline font-semibold">
              SRN-PPI KLHK
            </a>{" "}
            untuk memperoleh Sertifikat Pengurangan Emisi resmi.
          </p>
        </div>
      )}

      {/* Mekanisme Pasar */}
      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "carbon_credit.national_title")}</CardTitle>
          <p className="mt-1 text-sm text-neutral-500">{t(dict, "carbon_credit.national_desc")}</p>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { k: t(dict, "carbon_credit.sertifikat"), v: t(dict, "carbon_credit.sertifikat_desc") },
            { k: t(dict, "carbon_credit.ets"),        v: t(dict, "carbon_credit.ets_desc") },
            { k: t(dict, "carbon_credit.voluntary"),  v: t(dict, "carbon_credit.voluntary_desc") },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-neutral-100 p-4">
              <div className="text-sm font-semibold text-neutral-900">{s.k}</div>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500">{s.v}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Cara Registrasi */}
      <Card>
        <CardHeader>
          <CardTitle>Langkah Registrasi Proyek Karbon Kredit</CardTitle>
          <p className="mt-1 text-sm text-neutral-500">Prosedur pendaftaran ke SRN-PPI KLHK & IDXCarbon</p>
        </CardHeader>
        <ol className="space-y-3 px-1 pb-1">
          {[
            { step: "1", title: "Hitung Baseline Emisi", desc: "Verifikasi data Scope 1/2/3 di modul Carbon Accounting. Pastikan semua parameter terisi dan diaudit." },
            { step: "2", title: "Susun Dokumen MRV", desc: "Buat Measurement, Reporting & Verification (MRV) Plan sesuai metodologi yang disetujui KLHK (Permen LHK 21/2022)." },
            { step: "3", title: "Daftar ke SRN-PPI", desc: "Unggah dokumen proyek ke portal SRN-PPI (srn.menlhk.go.id). Terima nomor registrasi proyek aksi mitigasi." },
            { step: "4", title: "Verifikasi Pihak Ketiga", desc: "Gunakan data Audit Trail dari Modul 12 sebagai bukti verifikasi oleh lembaga terakreditasi (SUCOFINDO, TÃœV SÃœD)." },
            { step: "5", title: "Terbitkan & Perdagangkan SPE", desc: "Sertifikat Pengurangan Emisi (SPE-GRK) diterbitkan oleh KLHK dan dapat diperdagangkan di IDXCarbon." },
          ].map((item) => (
            <li key={item.step} className="flex items-start gap-4 rounded-xl border border-neutral-100 p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                <p className="mt-0.5 text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
        <p className="text-xs text-neutral-500">
          Nilai estimasi menggunakan harga referensi IDXCarbon. Nilai aktual bergantung pada metodologi proyek,
          verifikasi lapangan, dan kondisi pasar karbon saat perdagangan.
        </p>
      </div>
    </div>
  )
}

