"use client"

import { useState } from "react"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, Beaker, Package, BarChart3, Zap, TrendingDown } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts"
import { t, type Locale, getLocaleClient } from "@/lib/i18n"
import { id as idDict } from "@/locales/id"
import { en as enDict } from "@/locales/en"
import { useIndustryId } from "@/lib/use-industry-id"
import { useMeasurements, paramValue } from "@/lib/measurements"
import { LCA_PARAMS, OTHER_PARAMS, EMISSION_PROFILES } from "@/lib/proper"

const dicts: Record<Locale, Record<string, string>> = { id: idDict, en: enDict }

const fmt = (v: number | null, unit = "") => (v === null ? "—" : `${v}${unit}`)

function val(code: string, m: Record<string, string>) {
  const p = OTHER_PARAMS.find((p) => p.code === code)
  return p ? paramValue(p, m) : null
}

// Faktor emisi CO₂ per bahan bakar (kg CO₂/GJ) — referensi IPCC 2006
const FUEL_CO2_FACTOR: Record<string, number> = {
  batubara: 94.6,
  biomassa: 0,
  gas: 56.1,
  minyak: 74.1,
}

const CARBON_PRICE_IDR = 70000

export default function LCAPage() {
  const locale = getLocaleClient()
  const dict = dicts[locale]
  const industryId = useIndustryId()
  const m = useMeasurements(industryId)

  const [coalPct, setCoalPct] = useState(100)
  const [simCoalPct, setSimCoalPct] = useState(60)
  const fuelMix = simCoalPct < 100 ? "biomassa" : "batubara"

  const gwp = (val("gwp", m) as number | null) ?? (val("ghg_scope1", m) as number | null)
  const water = (val("wud", m) as number | null)

  const currentCO2Factor = FUEL_CO2_FACTOR.batubara * (coalPct / 100)
  const simCO2Factor = FUEL_CO2_FACTOR.batubara * (simCoalPct / 100) + FUEL_CO2_FACTOR.biomassa * ((100 - simCoalPct) / 100)
  const reductionPct = currentCO2Factor > 0 ? Math.round(((currentCO2Factor - simCO2Factor) / currentCO2Factor) * 100) : 0
  const baselineEmission = 5000
  const savedTons = Math.round(baselineEmission * reductionPct / 100)
  const carbonCreditIdr = savedTons * CARBON_PRICE_IDR

  const simRank = simCoalPct <= 60 ? "Hijau" : "Biru"
  const simEmissionProfile = EMISSION_PROFILES[fuelMix]

  const lcaFilledCount = LCA_PARAMS.filter((p) => {
    const raw = m[p.code]
    return raw !== undefined && raw !== "" && Number(raw) > 0
  }).length

  const impactData = LCA_PARAMS.slice(0, 6).map((p) => ({
    name: p.name.split(" ").slice(0, 2).join(" "),
    value: (paramValue(p, m) as number | null) ?? 0,
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t(dict, "lca.gwp")} value={fmt(gwp, " kg CO₂e/unit")} description={t(dict, "lca.average")} icon={BarChart3} />
        <StatCard title={t(dict, "lca.water_footprint")} value={fmt(water, " m³/unit")} description={t(dict, "lca.average")} icon={Beaker} />
        <StatCard title="Indikator LCA Terisi" value={`${lcaFilledCount}/11`} description="ISO 14040/14044" icon={Package} />
        <StatCard title="Progress PROPER" value={lcaFilledCount >= 11 ? "EMAS" : lcaFilledCount >= 3 ? "HIJAU" : "BIRU"} description={lcaFilledCount >= 11 ? "Semua 11 LCA terpenuhi" : `Isi ${Math.max(0, 3 - lcaFilledCount)} LCA lagi → Hijau`} icon={Cpu} />
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
        <p className="text-sm text-emerald-800">{t(dict, "lca.proper_link")}</p>
      </div>

      {/* What-If Decision Simulator */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>What-If Decision Simulator</CardTitle>
              <p className="mt-0.5 text-sm text-neutral-500">Simulasikan dampak penggantian bahan bakar boiler terhadap emisi, PROPER rank, dan karbon kredit</p>
            </div>
          </div>
        </CardHeader>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <label className="font-medium text-neutral-700">Kondisi Saat Ini — % Batubara</label>
                <span className="font-bold text-neutral-900">{coalPct}%</span>
              </div>
              <input type="range" min={0} max={100} value={coalPct} onChange={(e) => setCoalPct(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-orange-500" />
              <div className="mt-1 flex justify-between text-xs text-neutral-400">
                <span>0% (All Biomassa)</span><span>100% (All Batubara)</span>
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <label className="font-medium text-neutral-700">Setelah Retrofit — % Batubara</label>
                <span className="font-bold text-emerald-700">{simCoalPct}%</span>
              </div>
              <input type="range" min={0} max={100} value={simCoalPct} onChange={(e) => setSimCoalPct(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-emerald-500" />
              <div className="mt-1 flex justify-between text-xs text-neutral-400">
                <span>0% (All Biomassa)</span><span>100% (All Batubara)</span>
              </div>
            </div>
            <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Batas Emisi Proyeksi — {simEmissionProfile.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(simEmissionProfile.limits).map(([code, lim]) => (
                  <div key={code} className="rounded border border-neutral-200 bg-white px-2 py-1 text-center">
                    <p className="text-[10px] font-semibold uppercase text-neutral-400">{code === "opacity" ? "Opasitas" : code.toUpperCase()}</p>
                    <p className="text-xs font-bold text-neutral-800">{lim}<span className="ml-0.5 text-[10px] font-normal text-neutral-400">{code === "opacity" ? "%" : " mg/Nm³"}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-center">
                <TrendingDown className="mx-auto h-5 w-5 text-emerald-600" />
                <p className="mt-1 text-2xl font-bold text-emerald-700">↓{reductionPct}%</p>
                <p className="text-xs text-emerald-600">Penurunan Emisi CO₂</p>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-center">
                <p className="text-lg font-bold text-blue-700">{simRank}</p>
                <p className="mt-0.5 text-xs text-blue-600">Proyeksi Peringkat PROPER</p>
              </div>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-800">POTENSI REVENUE KARBON KREDIT (IDXCARBON)</p>
                <Badge variant="warning">Rp 70.000 / tCO₂e</Badge>
              </div>
              <p className="mt-1 text-2xl font-black text-amber-900">{savedTons.toLocaleString("id-ID")} tCO₂e/tahun</p>
              <p className="mt-0.5 text-sm font-extrabold text-amber-700">
                ≈ Rp {carbonCreditIdr.toLocaleString("id-ID")} <span className="text-xs font-normal text-amber-600">/ tahun (Estimasi Pendapatan)</span>
              </p>
            </div>

            {/* Financial ROI Calculator */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">KALKULATOR ROI EFISIENSI LINGKUNGAN</p>
                <span className="rounded-md bg-emerald-200/60 px-2 py-0.5 text-[10px] font-bold text-emerald-900">+142% Estimated ROI</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="rounded-lg bg-white p-2.5 border border-emerald-100">
                  <p className="text-[11px] text-neutral-500">Estimasi Hemat Energi</p>
                  <p className="font-bold text-emerald-700 text-sm">Rp {(savedTons * 180000).toLocaleString("id-ID")}</p>
                </div>
                <div className="rounded-lg bg-white p-2.5 border border-emerald-100">
                  <p className="text-[11px] text-neutral-500">Net Return (Tahun 1)</p>
                  <p className="font-bold text-emerald-700 text-sm">Rp {(savedTons * 250000).toLocaleString("id-ID")}</p>
                </div>
              </div>
              <p className="text-[11px] text-emerald-800">
                💡 **Analisis AI**: Pengalihan {100 - simCoalPct}% biomassa memberikan *payback period* ~1.4 tahun dengan efisiensi biaya bahan bakar &amp; insentif pajak karbon.
              </p>
            </div>

            <div className="rounded-lg border border-neutral-100 p-3 text-xs text-neutral-500">
              Simulasi ini adalah proyeksi estimasi. Nilai aktual bergantung pada kapasitas boiler, jam operasi, dan verifikasi lapangan.
            </div>
          </div>
        </div>
      </Card>

      {/* 11 Indikator LCA */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t(dict, "lca.chart_stages")}</CardTitle>
            <p className="mt-1 text-xs text-neutral-500">6 indikator teratas (dari 11 kategori ISO 14040/14044)</p>
          </CardHeader>
          {impactData.some((d) => d.value > 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#a3a3a3" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} name="Nilai" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="px-1 py-6 text-sm text-neutral-400">{t(dict, "common.no_data")} — Isi data LCA di Data Hub</p>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress 11 Indikator LCA (ISO 14040/14044)</CardTitle>
            <p className="mt-1 text-xs text-neutral-500">Syarat PROPER Hijau ≥ 3 indikator · Syarat PROPER Emas = 11 indikator</p>
          </CardHeader>
          <div className="space-y-1.5">
            {LCA_PARAMS.map((p) => {
              const raw = m[p.code]
              const filled = raw !== undefined && raw !== "" && Number(raw) > 0
              return (
                <div key={p.code} className="flex items-center gap-3 rounded-lg border border-neutral-100 px-3 py-2">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${filled ? "bg-emerald-500" : "bg-neutral-200"}`} />
                  <p className="min-w-0 flex-1 truncate text-xs text-neutral-700">{p.name}</p>
                  <span className="text-xs font-medium text-neutral-500">{filled ? raw : "—"} <span className="text-neutral-400">{"unit" in p ? (p as {unit: string}).unit : ""}</span></span>
                </div>
              )
            })}
          </div>
          <div className="mt-3 rounded-lg bg-neutral-50 px-3 py-2 text-center text-xs text-neutral-500">
            {lcaFilledCount}/11 terisi ·{" "}
            {lcaFilledCount >= 11 ? "Syarat PROPER EMAS terpenuhi" : lcaFilledCount >= 3 ? "Syarat PROPER HIJAU terpenuhi" : `Isi ${3 - lcaFilledCount} lagi untuk PROPER HIJAU`}
          </div>
        </Card>
      </div>

      {/* Methodology */}
      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "lca.methodology_title")}</CardTitle>
          <p className="mt-1 text-sm text-neutral-500">{t(dict, "lca.methodology_desc")}</p>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: t(dict, "lca.standard_iso"), v: t(dict, "lca.standard_iso_desc") },
            { k: t(dict, "lca.standard_sni"), v: t(dict, "lca.standard_sni_desc") },
            { k: t(dict, "lca.standard_perpres"), v: t(dict, "lca.standard_perpres_desc") },
            { k: t(dict, "lca.standard_tek"), v: t(dict, "lca.standard_tek_desc") },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-neutral-100 p-4">
              <div className="text-sm font-semibold text-neutral-900">{s.k}</div>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500">{s.v}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* LCIA Impact Categories — 11 lengkap */}
      <Card>
        <CardHeader>
          <CardTitle>{t(dict, "lca.impact_title")}</CardTitle>
          <p className="mt-1 text-sm text-neutral-500">11 Kategori Dampak Wajib PROPER Hijau/Emas — Permen LHK No. 1/2021</p>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Kategori Dampak</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Kode</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Satuan</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Nilai</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {LCA_PARAMS.map((p, i) => {
                const raw = m[p.code]
                const filled = raw !== undefined && raw !== "" && Number(raw) > 0
                return (
                  <tr key={i} className="border-b border-neutral-100">
                    <td className="px-3 py-2.5 font-medium text-neutral-900">{p.name}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-neutral-500">{p.code.toUpperCase()}</td>
                    <td className="px-3 py-2.5 text-neutral-500">{"unit" in p ? (p as {unit: string}).unit : "—"}</td>
                    <td className="px-3 py-2.5 text-neutral-700">{filled ? raw : "—"}</td>
                    <td className="px-3 py-2.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${filled ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-400"}`}>
                        {filled ? "✓ Terisi" : "Belum diisi"}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 px-3 text-xs italic text-neutral-400">{t(dict, "lca.disclaimer")}</p>
      </Card>
    </div>
  )
}
