"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trees, ShieldAlert, CheckCircle2, Plus, Trash2, Leaf, Info, Award } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface BiodiversityRecord {
  id: string
  siteName: string
  conservationAreaHa: number
  protectedFloraCount: number
  protectedFaunaCount: number
  rehabilitationStatus: string
  shannonIndex: number
  partnerInstitution: string
}

const DEFAULT_RECORDS: BiodiversityRecord[] = [
  {
    id: "bio-1",
    siteName: "Fasilitas Pengolahan Site A",
    conservationAreaHa: 125.5,
    protectedFloraCount: 14,
    protectedFaunaCount: 8,
    rehabilitationStatus: "Dalam Penanaman Ulang (75%)",
    shannonIndex: 3.42,
    partnerInstitution: "BKSDA Provinsi / BRIN",
  },
  {
    id: "bio-2",
    siteName: "Area Penyangga Site B",
    conservationAreaHa: 80.0,
    protectedFloraCount: 9,
    protectedFaunaCount: 5,
    rehabilitationStatus: "Pemantauan Rutin (90%)",
    shannonIndex: 2.85,
    partnerInstitution: "YSHL / Universitas Lokal",
  },
]

export default function BiodiversityPage() {
  const [records, setRecords] = useState<BiodiversityRecord[]>(DEFAULT_RECORDS)
  const [saved, setSaved] = useState(false)

  const totalArea = records.reduce((acc, r) => acc + (Number(r.conservationAreaHa) || 0), 0)
  const totalFlora = records.reduce((acc, r) => acc + (Number(r.protectedFloraCount) || 0), 0)
  const totalFauna = records.reduce((acc, r) => acc + (Number(r.protectedFaunaCount) || 0), 0)
  const avgShannon = records.length ? (records.reduce((acc, r) => acc + (Number(r.shannonIndex) || 0), 0) / records.length).toFixed(2) : "0"

  const handleUpdate = (id: string, field: keyof BiodiversityRecord, value: any) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    )
    setSaved(false)
  }

  const handleAdd = () => {
    setRecords((prev) => [
      ...prev,
      {
        id: `bio-${Date.now()}`,
        siteName: "Site Baru",
        conservationAreaHa: 10,
        protectedFloraCount: 0,
        protectedFaunaCount: 0,
        rehabilitationStatus: "Perencanaan Baseline",
        shannonIndex: 2.0,
        partnerInstitution: "Mitra Konservasi",
      },
    ])
    setSaved(false)
  }

  const handleDelete = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const chartData = records.map((r) => ({
    name: r.siteName.length > 15 ? r.siteName.substring(0, 15) + "..." : r.siteName,
    "Area Konservasi (Ha)": r.conservationAreaHa,
    "Flora Dilindungi": r.protectedFloraCount,
    "Fauna Dilindungi": r.protectedFaunaCount,
  }))

  return (
    <div className="space-y-6">
      {/* Top Header matching App Standard */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" className="text-[10px] font-bold">Modul 9</Badge>
            <Badge variant="neutral" className="text-[10px]">PerMen LHK No. 1/2021 Poin 4f</Badge>
            <Badge variant="neutral" className="text-[10px]">ISO 14040 & PROPER KLHK</Badge>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Keanekaragaman Hayati (Biodiversity)</h1>
          <p className="mt-1 text-sm text-neutral-500 max-w-3xl">
            Inventarisasi & pemantauan keanekaragaman hayati, perlindungan spesies flora/fauna endemik, serta rasio pemulihan ekosistem sesuai kriteria PROPER Emas & Hijau KLHK.
          </p>
        </div>
        <Button onClick={handleSave}>
          {saved ? <><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" />Tersimpan</> : "Simpan Data M9"}
        </Button>
      </div>

      {/* Info Alert Box */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
        <div>
          <p className="text-sm font-semibold text-blue-900">Komponen Wajib PROPER Hijau / Emas (PerMen LHK No. 1/2021 Poin 4f)</p>
          <p className="mt-0.5 text-xs text-blue-700">
            Perusahaan sektor ekstraktif/energi yang beroperasi di sekitar kawasan konservasi wajib mencatat indeks keanekaragaman hayati (Shannon-Wiener H'), pemantauan spesies flora & fauna dilindungi, dan keberhasilan rehabilitasi habitat.
          </p>
        </div>
      </div>

      {/* Stat Metric Cards - Fixed Vertical Block Layout */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Area Konservasi</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Trees className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-neutral-900">
              {totalArea.toFixed(1)} <span className="text-sm font-normal text-neutral-500">Ha</span>
            </p>
          </div>
          <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Kriteria PROPER Emas ≥50 Ha
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Flora Dilindungi</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Leaf className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-neutral-900">
              {totalFlora} <span className="text-sm font-normal text-neutral-500">Jenis</span>
            </p>
          </div>
          <p className="mt-1.5 text-xs text-neutral-500">
            Termonitor & Terdaftar BKSDA
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Fauna Dilindungi</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-neutral-900">
              {totalFauna} <span className="text-sm font-normal text-neutral-500">Jenis</span>
            </p>
          </div>
          <p className="mt-1.5 text-xs text-neutral-500">
            Status IUCN / Lampiran UU 5/1990
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Indeks Shannon (H')</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-neutral-900">
              {avgShannon} <span className="text-sm font-normal text-neutral-500">H'</span>
            </p>
          </div>
          <p className="mt-1.5 text-xs font-medium text-purple-600">
            Keanekaragaman Sedang - Tinggi (&gt;2.5)
          </p>
        </Card>
      </div>

      {/* Visual Chart Card */}
      <Card className="p-5">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <Trees className="h-4 w-4 text-emerald-600" />
            Grafik Pemantauan Area Konservasi & Keragaman Spesies per Site
          </h3>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
              <Bar dataKey="Area Konservasi (Ha)" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Flora Dilindungi" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Fauna Dilindungi" fill="#d97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Data Ingestion Table Card */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-neutral-900">
            Inventarisasi & Program Rehabilitasi Ekosistem (Modul 9)
          </h3>
          <Button variant="secondary" size="sm" onClick={handleAdd}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah Site Log
          </Button>
        </div>
        <div className="overflow-x-auto rounded-lg border border-neutral-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 font-semibold text-neutral-600 border-b border-neutral-200">
              <tr>
                <th className="p-3">Nama Site / Area</th>
                <th className="p-3">Luas Area (Ha)</th>
                <th className="p-3">Flora Dilindungi</th>
                <th className="p-3">Fauna Dilindungi</th>
                <th className="p-3">Indeks Shannon (H')</th>
                <th className="p-3">Status Rehabilitasi</th>
                <th className="p-3">Lembaga Mitra</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-800">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="p-2.5">
                    <input
                      type="text"
                      value={r.siteName}
                      onChange={(e) => handleUpdate(r.id, "siteName", e.target.value)}
                      className="w-full rounded-md border border-neutral-200 px-2.5 py-1 text-xs text-neutral-900 font-medium focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-100"
                    />
                  </td>
                  <td className="p-2.5">
                    <input
                      type="number"
                      step="0.1"
                      value={r.conservationAreaHa}
                      onChange={(e) => handleUpdate(r.id, "conservationAreaHa", parseFloat(e.target.value) || 0)}
                      className="w-20 rounded-md border border-neutral-200 px-2.5 py-1 text-xs text-neutral-900 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-100"
                    />
                  </td>
                  <td className="p-2.5">
                    <input
                      type="number"
                      value={r.protectedFloraCount}
                      onChange={(e) => handleUpdate(r.id, "protectedFloraCount", parseInt(e.target.value, 10) || 0)}
                      className="w-16 rounded-md border border-neutral-200 px-2.5 py-1 text-xs text-neutral-900 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-100"
                    />
                  </td>
                  <td className="p-2.5">
                    <input
                      type="number"
                      value={r.protectedFaunaCount}
                      onChange={(e) => handleUpdate(r.id, "protectedFaunaCount", parseInt(e.target.value, 10) || 0)}
                      className="w-16 rounded-md border border-neutral-200 px-2.5 py-1 text-xs text-neutral-900 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-100"
                    />
                  </td>
                  <td className="p-2.5">
                    <input
                      type="number"
                      step="0.01"
                      value={r.shannonIndex}
                      onChange={(e) => handleUpdate(r.id, "shannonIndex", parseFloat(e.target.value) || 0)}
                      className="w-16 rounded-md border border-neutral-200 px-2.5 py-1 text-xs text-neutral-900 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-100"
                    />
                  </td>
                  <td className="p-2.5">
                    <input
                      type="text"
                      value={r.rehabilitationStatus}
                      onChange={(e) => handleUpdate(r.id, "rehabilitationStatus", e.target.value)}
                      className="w-full rounded-md border border-neutral-200 px-2.5 py-1 text-xs text-neutral-900 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-100"
                    />
                  </td>
                  <td className="p-2.5">
                    <input
                      type="text"
                      value={r.partnerInstitution}
                      onChange={(e) => handleUpdate(r.id, "partnerInstitution", e.target.value)}
                      className="w-full rounded-md border border-neutral-200 px-2.5 py-1 text-xs text-neutral-900 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-100"
                    />
                  </td>
                  <td className="p-2.5 text-right">
                    <Button onClick={() => handleDelete(r.id)} size="icon" variant="ghost" className="h-7 w-7 text-neutral-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
