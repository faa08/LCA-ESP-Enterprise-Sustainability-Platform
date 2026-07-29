"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2, Plus, Trash2, CheckCircle2, Users, MapPin,
  Factory, ChevronDown, ChevronRight, Loader2, AlertCircle, Database, Lock
} from "lucide-react"
import { useSiteId } from "@/lib/use-site-id"
import {
  getCompanyProfile, saveCompanyProfile, saveSiteIndustry,
  type EntityRecord,
} from "@/lib/supabase/data-service"
import { ModuleGate } from "@/components/dashboard/module-gate"

type EntityLevel = "korporat" | "subholding" | "site"

const INDUSTRY_OPTIONS = [
  { id: "kimia", label: "Manufaktur Kimia" },
  { id: "pltu", label: "Pembangkit Listrik" },
  { id: "migas", label: "Minyak dan Gas" },
]

const levelColor: Record<EntityLevel, string> = {
  korporat: "bg-purple-100 text-purple-700 border-purple-200",
  subholding: "bg-blue-100 text-blue-700 border-blue-200",
  site: "bg-emerald-100 text-emerald-700 border-emerald-200",
}

const levelLabel: Record<EntityLevel, string> = {
  korporat: "Korporat Induk",
  subholding: "Subholding / Anak Usaha",
  site: "Site / Fasilitas",
}

function genId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

function emptyEntities(): EntityRecord[] {
  return [{ id: genId(), level: "korporat", name: "", location: "", industry: "", employees: 0, parentId: null }]
}

export default function CompanyProfilePage() {
  const siteId = useSiteId()

  const [entities, setEntities] = useState<EntityRecord[]>(emptyEntities())
  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLocked, setIsLocked] = useState(false)

  const refresh = useCallback(async () => {
    if (!siteId) return
    setLoading(true)
    const data = await getCompanyProfile(siteId)
    if (data.length > 0) {
      setEntities(data)
      setExpandedIds(data.map(e => e.id))
      setIsLocked(true) // Lock if data already exists
    } else {
      // Try fallback dari localStorage (migrasi dari versi lama)
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("enspr_company_profile")
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (Array.isArray(parsed) && parsed.length > 0) {
              setEntities(parsed.map((p: Record<string, unknown>) => ({
                id: String(p.id ?? genId()),
                level: (p.level as EntityLevel) ?? "korporat",
                name: String(p.name ?? ""),
                location: String(p.location ?? ""),
                industry: String(p.industry ?? ""),
                employees: Number(p.employees ?? 0),
                parentId: (p.parentId as string | null) ?? null,
              })))
              setExpandedIds(parsed.map((p: Record<string, unknown>) => String(p.id)))
            }
          } catch { /* ignore */ }
        }
      }
      const initial = emptyEntities()
      if (entities.length === 0) {
        setEntities(initial)
        setExpandedIds([initial[0].id])
      }
    }
    setLoading(false)
  }, [siteId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { refresh() }, [refresh])

  const toggleExpand = (id: string) =>
    setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])

  const addEntity = (level: EntityLevel, parentId: string | null) => {
    const newEntity: EntityRecord = { id: genId(), level, name: "", location: "", industry: "", employees: 0, parentId }
    setEntities(prev => [...prev, newEntity])
    setExpandedIds(prev => [...prev, newEntity.id])
  }

  const removeEntity = (id: string) =>
    setEntities(prev => prev.filter(e => e.id !== id && e.parentId !== id))

  const updateEntity = (id: string, field: keyof EntityRecord, value: string | number) =>
    setEntities(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))

  const handleSave = async () => {
    if (!siteId) return
    setSaving(true)
    setError(null)

    // Simpan company profile ke Supabase
    const result = await saveCompanyProfile(siteId, entities)

    // Simpan industryId dari site entity ke Supabase
    const siteEntity = entities.find(e => e.level === "site")
    const industryId = siteEntity?.industry ?? entities.find(e => e.level === "korporat")?.industry ?? ""
    if (industryId) await saveSiteIndustry(siteId, industryId)

    // Backup ke localStorage juga (untuk kompatibilitas)
    if (typeof window !== "undefined") {
      localStorage.setItem("enspr_company_profile", JSON.stringify(entities))
    }

    setSaving(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSaved(true)
      setIsLocked(true) // Lock after saving
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const handleEdit = () => {
    setIsLocked(false)
  }

  const roots = entities.filter(e => e.parentId === null)
  const children = (parentId: string) => entities.filter(e => e.parentId === parentId)

  const renderEntity = (entity: EntityRecord, depth = 0): React.ReactNode => {
    const isExpanded = expandedIds.includes(entity.id)
    const kids = children(entity.id)
    return (
      <div key={entity.id} style={{ marginLeft: depth * 24 }}>
        <div className={`rounded-xl border mb-3 transition-shadow hover:shadow-sm ${depth === 0 ? "border-neutral-200" : depth === 1 ? "border-blue-100" : "border-emerald-100"}`}>
          <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => toggleExpand(entity.id)}>
            {kids.length > 0 || entity.level !== "site" ? (
              isExpanded ? <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" /> : <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400" />
            ) : <div className="w-4" />}
            <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold ${levelColor[entity.level]}`}>{levelLabel[entity.level]}</span>
            <span className="flex-1 truncate text-sm font-medium text-neutral-700">{entity.name || "Belum diberi nama"}</span>
            {entity.level !== "korporat" && !isLocked && (
              <button onClick={e => { e.stopPropagation(); removeEntity(entity.id) }} className="text-neutral-300 hover:text-red-500 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          {isExpanded && (
            <div className="border-t border-neutral-100 px-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Nama {levelLabel[entity.level]} <span className="text-red-500">*</span></label>
                  <input type="text" value={entity.name} disabled={isLocked}
                    onChange={e => updateEntity(entity.id, "name", e.target.value)}
                    placeholder={entity.level === "korporat" ? "PT Contoh Tbk" : entity.level === "subholding" ? "PT Anak Usaha" : "Pabrik / Fasilitas Produksi A"}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 disabled:bg-neutral-100" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Lokasi (Kota, Provinsi)</label>
                  <input type="text" value={entity.location} disabled={isLocked}
                    onChange={e => updateEntity(entity.id, "location", e.target.value)}
                    placeholder="Cilegon, Banten"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 disabled:bg-neutral-100" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Jumlah Tenaga Kerja</label>
                  <input type="number" value={entity.employees || ""} disabled={isLocked}
                    onChange={e => updateEntity(entity.id, "employees", parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 disabled:bg-neutral-100" />
                </div>
                {(entity.level === "korporat" || entity.level === "site") && (
                  <div className="sm:col-span-2 lg:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Jenis Industri / Sektor
                      {entity.level === "site" && <span className="ml-1 text-emerald-600 font-normal">(menentukan baku mutu & metodologi)</span>}
                    </label>
                    <select value={entity.industry} disabled={isLocked}
                      onChange={e => updateEntity(entity.id, "industry", e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white disabled:opacity-50 disabled:bg-neutral-100">
                      <option value="">-- Pilih Sektor --</option>
                      {INDUSTRY_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                    </select>
                  </div>
                )}
              </div>
              {!isLocked && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {entity.level === "korporat" && (
                    <Button variant="secondary" size="sm" onClick={() => addEntity("subholding", entity.id)}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Tambah Anak Usaha
                    </Button>
                  )}
                  {entity.level === "subholding" && (
                    <Button variant="secondary" size="sm" onClick={() => addEntity("site", entity.id)}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Tambah Site / Fasilitas
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {isExpanded && kids.map(kid => renderEntity(kid, depth + 1))}
      </div>
    )
  }

  return (
    <ModuleGate moduleName="M1 · Company Profile">
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" className="text-[10px]">Modul 1</Badge>
            <Badge variant="neutral" className="text-[10px] font-bold">Multi-Entity Enterprise</Badge>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Company Profile</h1>
          <p className="mt-1 text-sm text-neutral-500">Data dasar perusahaan dengan struktur multi-entitas (Korporat → Subholding → Site). Tersimpan permanen di database.</p>
        </div>
        {isLocked ? (
          <Button onClick={handleEdit} variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50">
            <Lock className="mr-2 h-4 w-4" /> Buka Kunci (Edit)
          </Button>
        ) : (
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</>
              : saved
                ? <><CheckCircle2 className="mr-2 h-4 w-4" />Tersimpan</>
                : "Simpan & Terapkan"}
          </Button>
        )}
      </div>

      {/* Supabase badge */}
      <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
        <Database className="h-3.5 w-3.5 shrink-0" />
        <span>Data tersimpan di Supabase (bukan localStorage). Jenis industri yang dipilih di sini akan otomatis menjadi konteks untuk semua modul.</span>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Gagal menyimpan: {error}. Cek kolom <code>industry_type</code> dan <code>employee_count</code> di tabel <code>sites</code>.</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-sm text-neutral-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Memuat profil perusahaan dari database...
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2"><Building2 className="h-5 w-5 text-purple-600" /><CardTitle className="text-sm">Entitas Terdaftar</CardTitle></div>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{entities.length}</p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2"><Users className="h-5 w-5 text-blue-600" /><CardTitle className="text-sm">Total Tenaga Kerja</CardTitle></div>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {entities.reduce((s, e) => s + (e.employees || 0), 0).toLocaleString("id-ID")}
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-emerald-600" /><CardTitle className="text-sm">Site / Fasilitas</CardTitle></div>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{entities.filter(e => e.level === "site").length}</p>
              </CardHeader>
            </Card>
          </div>

          {/* Industry indicator */}
          {(() => {
            const siteEnt = entities.find(e => e.level === "site") ?? entities.find(e => e.level === "korporat")
            const industryId = siteEnt?.industry
            const industryLabel = INDUSTRY_OPTIONS.find(o => o.id === industryId)?.label ?? industryId
            return industryId ? (
              <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-700">
                <Factory className="h-3.5 w-3.5 shrink-0" />
                <span>Industri aktif: <strong>{industryLabel}</strong> → ID: <code className="bg-amber-100 px-1 rounded">{industryId}</code> — digunakan untuk baku mutu PROPER, faktor emisi, dan metodologi LCA</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 text-xs text-orange-700">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>Jenis industri belum dipilih. Pilih di field <strong>Jenis Industri</strong> di entitas Site atau Korporat, lalu simpan — ini diperlukan agar Data Hub dan semua modul berfungsi dengan benar.</span>
              </div>
            )
          })()}

          {/* Hierarchy Legend */}
          <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-500">
            <span className={`rounded border px-2 py-0.5 font-bold ${levelColor.korporat}`}>Korporat Induk</span>
            <span>→</span>
            <span className={`rounded border px-2 py-0.5 font-bold ${levelColor.subholding}`}>Subholding / Anak Usaha</span>
            <span>→</span>
            <span className={`rounded border px-2 py-0.5 font-bold ${levelColor.site}`}>Site / Fasilitas</span>
            <span className="text-neutral-400">· Data diagregasi otomatis ke level grup</span>
          </div>

          <div>{roots.map(e => renderEntity(e, 0))}</div>
        </>
      )}
    </div>
    </ModuleGate>
  )
}
