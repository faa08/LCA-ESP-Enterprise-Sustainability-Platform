"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardList, Download, Filter, Shield, CheckCircle2, Upload, Search, Lock } from "lucide-react"

interface AuditEntry {
  id: string
  timestamp: string
  user: string
  role: string
  module: string
  action: string
  field: string
  oldValue: string
  newValue: string
  source: "measured" | "estimated" | "default"
  verified: boolean
}

const MOCK_ENTRIES: AuditEntry[] = [
  { id: "1", timestamp: "2026-07-25 08:15:32", user: "Ahmad Fachry", role: "Manager", module: "Energy Assessment", action: "UPDATE", field: "Konsumsi Listrik", oldValue: "1.200.000 kWh", newValue: "1.245.000 kWh", source: "measured", verified: true },
  { id: "2", timestamp: "2026-07-25 07:30:11", user: "Siti Rahayu", role: "Manager", module: "Carbon Accounting", action: "CREATE", field: "Emisi Scope 1 — Gas Alam", oldValue: "—", newValue: "450 tCO₂e", source: "measured", verified: false },
  { id: "3", timestamp: "2026-07-24 16:22:44", user: "Ahmad Fachry", role: "Manager", module: "Waste Assessment", action: "UPDATE", field: "Volume Limbah B3", oldValue: "12.5 ton", newValue: "13.2 ton", source: "measured", verified: true },
  { id: "4", timestamp: "2026-07-24 14:10:05", user: "Budi Santoso", role: "Admin", module: "LCA Multi-Impact", action: "UPDATE", field: "GWP (kg CO₂e/unit)", oldValue: "—", newValue: "2.45", source: "estimated", verified: false },
  { id: "5", timestamp: "2026-07-23 10:55:29", user: "Siti Rahayu", role: "Manager", module: "Transportation", action: "CREATE", field: "Rute Distribusi — Truk", oldValue: "—", newValue: "250 km, 48 trip/thn", source: "measured", verified: true },
  { id: "6", timestamp: "2026-07-22 09:00:00", user: "System", role: "Admin", module: "Company Profile", action: "LOCK", field: "Struktur Entitas", oldValue: "Draft", newValue: "Locked v1.0", source: "measured", verified: true },
]

const SOURCE_LABEL: Record<AuditEntry["source"], { label: string; color: string }> = {
  measured: { label: "Terukur", color: "bg-emerald-100 text-emerald-700" },
  estimated: { label: "Estimasi", color: "bg-amber-100 text-amber-700" },
  default: { label: "Default Factor", color: "bg-neutral-100 text-neutral-600" },
}

const ACTION_COLOR: Record<string, string> = {
  UPDATE: "bg-blue-100 text-blue-700",
  CREATE: "bg-emerald-100 text-emerald-700",
  DELETE: "bg-red-100 text-red-700",
  LOCK: "bg-purple-100 text-purple-700",
}

export default function AuditTrailPage() {
  const [search, setSearch] = useState("")
  const [filterModule, setFilterModule] = useState("")
  const [filterVerified, setFilterVerified] = useState<"all" | "verified" | "unverified">("all")
  const [entries] = useState<AuditEntry[]>(MOCK_ENTRIES)

  const filtered = entries.filter(e => {
    const matchSearch = search === "" || e.user.toLowerCase().includes(search.toLowerCase()) || e.module.toLowerCase().includes(search.toLowerCase()) || e.field.toLowerCase().includes(search.toLowerCase())
    const matchModule = filterModule === "" || e.module === filterModule
    const matchVerified = filterVerified === "all" || (filterVerified === "verified" && e.verified) || (filterVerified === "unverified" && !e.verified)
    return matchSearch && matchModule && matchVerified
  })

  const modules = [...new Set(entries.map(e => e.module))]
  const verifiedCount = entries.filter(e => e.verified).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" className="text-[10px]">Modul 12</Badge>
            <Badge variant="neutral" className="text-[10px] font-bold">Enterprise Audit Trail</Badge>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Data Verification & Audit Trail</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Log lengkap setiap perubahan data — siapa, kapan, dari mana sumbernya. Paket data siap-verifikasi untuk auditor eksternal.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Upload className="mr-1.5 h-4 w-4" />Unggah Dokumen Pendukung
          </Button>
          <Button>
            <Download className="mr-1.5 h-4 w-4" />Export untuk Auditor
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-600" /><CardTitle className="text-sm">Total Log Entri</CardTitle></div>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{entries.length}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><CardTitle className="text-sm">Terverifikasi</CardTitle></div>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{verifiedCount} <span className="text-sm font-normal text-neutral-400">/ {entries.length}</span></p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><Filter className="h-4 w-4 text-amber-600" /><CardTitle className="text-sm">Belum Diverifikasi</CardTitle></div>
            <p className="text-2xl font-bold text-amber-600 mt-1">{entries.length - verifiedCount}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-purple-600" /><CardTitle className="text-sm">Modul Terekam</CardTitle></div>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{modules.length}</p>
          </CardHeader>
        </Card>
      </div>

      {/* Verifikasi Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
        <div className="text-xs text-blue-700">
          <b>Mode Ekspor Auditor</b>: Klik "Export untuk Auditor" untuk menghasilkan paket data terstruktur (CSV + metadata) yang dapat dikirimkan ke lembaga verifikasi independen seperti SUCOFINDO, TÜV SÜD, atau Kantor Akuntan Publik terakreditasi.
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 min-w-48">
              <Search className="h-4 w-4 text-neutral-400 shrink-0" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cari user, modul, field..."
                className="flex-1 bg-transparent text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none" />
            </div>
            <select value={filterModule} onChange={e => setFilterModule(e.target.value)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm bg-white focus:border-emerald-400 focus:outline-none">
              <option value="">Semua Modul</option>
              {modules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <div className="flex rounded-lg border border-neutral-200 overflow-hidden">
              {(["all", "verified", "unverified"] as const).map(opt => (
                <button key={opt} onClick={() => setFilterVerified(opt)}
                  className={`px-3 py-2 text-xs font-medium transition-colors ${filterVerified === opt ? "bg-emerald-600 text-white" : "text-neutral-600 hover:bg-neutral-50"}`}>
                  {opt === "all" ? "Semua" : opt === "verified" ? "Terverifikasi" : "Belum"}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                {["Waktu", "User / Peran", "Modul", "Aksi", "Field", "Nilai Lama → Baru", "Sumber Data", "Status"].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-sm text-neutral-400">Tidak ada log yang sesuai filter</td></tr>
              ) : filtered.map(e => (
                <tr key={e.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-3 py-2.5 text-xs text-neutral-500 whitespace-nowrap">{e.timestamp}</td>
                  <td className="px-3 py-2.5">
                    <p className="text-xs font-semibold text-neutral-900">{e.user}</p>
                    <p className="text-[10px] text-neutral-400">{e.role}</p>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-neutral-700">{e.module}</td>
                  <td className="px-3 py-2.5">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${ACTION_COLOR[e.action] ?? "bg-neutral-100 text-neutral-600"}`}>{e.action}</span>
                  </td>
                  <td className="px-3 py-2.5 text-xs font-medium text-neutral-700">{e.field}</td>
                  <td className="px-3 py-2.5 text-xs text-neutral-500">
                    <span className="text-red-400">{e.oldValue}</span>
                    {e.oldValue !== "—" && <span className="mx-1 text-neutral-300">→</span>}
                    <span className="text-emerald-700 font-medium">{e.newValue}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${SOURCE_LABEL[e.source].color}`}>{SOURCE_LABEL[e.source].label}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    {e.verified
                      ? <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" />Terverifikasi</span>
                      : <span className="text-[10px] text-neutral-400">Menunggu verifikasi</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] italic text-neutral-400 px-3">
          {filtered.length} dari {entries.length} entri ditampilkan · Log tersimpan permanen dan tidak dapat dihapus (immutable audit log)
        </p>
      </Card>
    </div>
  )
}
