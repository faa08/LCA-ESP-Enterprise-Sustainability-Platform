"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardList, Download, Filter, Shield, CheckCircle2, Upload, Search, Lock, Inbox, Loader2 } from "lucide-react"
import { type AuditLogEntry } from "@/lib/datahub"
import { getAuditLogSb } from "@/lib/supabase/data-service"
import { useIndustryId } from "@/lib/use-industry-id"
import { useSiteId } from "@/lib/use-site-id"
import { getRoleClient } from "@/lib/role"

const ACTION_COLOR: Record<string, string> = {
  CREATE: "bg-emerald-100 text-emerald-700",
  DELETE: "bg-red-100 text-red-700",
}

const SOURCE_LABEL: Record<AuditLogEntry["source"], { label: string; color: string }> = {
  measured: { label: "Terukur", color: "bg-emerald-100 text-emerald-700" },
  estimated: { label: "Estimasi", color: "bg-amber-100 text-amber-700" },
  default:   { label: "Default Factor", color: "bg-neutral-100 text-neutral-600" },
}

const MODULE_LABELS: Record<string, string> = {
  production:  "Produksi",
  materials:   "Material",
  energy:      "Energi",
  water:       "Air",
  laboratory:  "Laboratorium",
  stack:       "Emisi Cerobong",
  b3:          "Limbah B3",
  transport:   "Transportasi",
  supplier:    "Pemasok",
  documents:   "Dokumen",
}

export default function AuditTrailPage() {
  const industryId = useIndustryId()
  const siteId = useSiteId()

  const [entries, setEntries] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterModule, setFilterModule] = useState("")
  const [filterAction, setFilterAction] = useState<"all" | "CREATE" | "DELETE">("all")

  const refresh = useCallback(async () => {
    if (!siteId) return
    setLoading(true)
    const data = await getAuditLogSb(siteId, industryId)
    setEntries(data)
    setLoading(false)
  }, [siteId, industryId])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 5000)
    return () => clearInterval(interval)
  }, [refresh])

  const modules = [...new Set(entries.map((e) => e.module))]

  const filtered = entries.filter((e) => {
    const q = search.toLowerCase()
    const matchSearch =
      q === "" ||
      e.module.toLowerCase().includes(q) ||
      e.field.toLowerCase().includes(q) ||
      e.newValue.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q)
    const matchModule = filterModule === "" || e.module === filterModule
    const matchAction = filterAction === "all" || e.action === filterAction
    return matchSearch && matchModule && matchAction
  })

  // CSV export
  const handleExport = () => {
    const header = ["Waktu", "Peran", "Modul", "Aksi", "Field", "Nilai Baru", "Sumber"].join(",")
    const rows = entries.map((e) =>
      [e.timestamp, e.role, e.module, e.action, e.field, `"${e.newValue}"`, e.source].join(",")
    )
    const csv = [header, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-trail-${industryId}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" className="text-[10px]">Modul 13</Badge>
            <Badge variant="neutral" className="text-[10px] font-bold">Enterprise Audit Trail</Badge>
            <Badge variant="neutral" className="text-[10px] text-emerald-700">Immutable Log</Badge>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Data Verification & Audit Trail</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Log otomatis setiap perubahan data yang dilakukan melalui Data Hub — terekam di database secara real-time.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={refresh} disabled={loading}>
            <RefreshIcon loading={loading} /> Refresh
          </Button>
          <Button onClick={handleExport} disabled={entries.length === 0}>
            <Download className="mr-1.5 h-4 w-4" />Export CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-sm">Total Log Entri</CardTitle>
            </div>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{entries.length}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-sm">Penambahan Data</CardTitle>
            </div>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              {entries.filter((e) => e.action === "CREATE").length}
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-red-500" />
              <CardTitle className="text-sm">Penghapusan Data</CardTitle>
            </div>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {entries.filter((e) => e.action === "DELETE").length}
            </p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-purple-600" />
              <CardTitle className="text-sm">Modul Terekam</CardTitle>
            </div>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{modules.length}</p>
          </CardHeader>
        </Card>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
        <p className="text-xs text-blue-700">
          <b>Log Otomatis:</b> Setiap penambahan dan penghapusan data di <b>Data Hub</b> akan otomatis tersimpan di tabel <code className="font-mono">audit_trail_logs</code>.
          Gunakan tombol <b>Export CSV</b> untuk mengirimkan paket data ke lembaga verifikasi independen (SUCOFINDO, TÜV SÜD, KAP).
        </p>
      </div>

      {/* Filter + Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 min-w-48">
              <Search className="h-4 w-4 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari modul, field, nilai..."
                className="flex-1 bg-transparent text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none"
              />
            </div>

            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm bg-white focus:border-emerald-400 focus:outline-none"
            >
              <option value="">Semua Modul</option>
              {modules.map((m) => (
                <option key={m} value={m}>{MODULE_LABELS[m] ?? m}</option>
              ))}
            </select>

            <div className="flex rounded-lg border border-neutral-200 overflow-hidden">
              {(["all", "CREATE", "DELETE"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilterAction(opt)}
                  className={`px-3 py-2 text-xs font-medium transition-colors ${
                    filterAction === opt ? "bg-emerald-600 text-white" : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {opt === "all" ? "Semua" : opt === "CREATE" ? "Tambah" : "Hapus"}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-neutral-300 mb-3" />
            <p className="text-sm font-medium text-neutral-500">Memuat audit log...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Inbox className="h-10 w-10 text-neutral-200 mb-3" />
            <p className="text-sm font-medium text-neutral-500">Belum ada log aktivitas</p>
            <p className="text-xs text-neutral-400 mt-1">
              Log akan muncul otomatis saat Anda menambah atau menghapus data di <b>Data Hub</b>.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  {["Waktu", "Peran", "Modul", "Aksi", "Field / Nilai", "Sumber"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-sm text-neutral-400">
                      Tidak ada log yang sesuai filter
                    </td>
                  </tr>
                ) : (
                  filtered.map((e) => (
                    <tr key={e.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="px-3 py-2.5 text-xs text-neutral-500 whitespace-nowrap">{e.timestamp}</td>
                      <td className="px-3 py-2.5 text-xs font-medium text-neutral-700">{e.role}</td>
                      <td className="px-3 py-2.5 text-xs text-neutral-700">
                        {MODULE_LABELS[e.module] ?? e.module}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${ACTION_COLOR[e.action] ?? "bg-neutral-100 text-neutral-600"}`}>
                          {e.action}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-neutral-700 max-w-xs truncate" title={e.newValue}>
                        {e.newValue}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${SOURCE_LABEL[e.source]?.color ?? "bg-neutral-100"}`}>
                          {SOURCE_LABEL[e.source]?.label ?? e.source}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {entries.length > 0 && (
          <p className="mt-2 text-[11px] italic text-neutral-400 px-3 pb-2">
            {filtered.length} dari {entries.length} entri ditampilkan
          </p>
        )}
      </Card>
    </div>
  )
}

function RefreshIcon({ loading }: { loading: boolean }) {
  if (loading) return <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
  return <Shield className="mr-1.5 h-4 w-4" />
}
