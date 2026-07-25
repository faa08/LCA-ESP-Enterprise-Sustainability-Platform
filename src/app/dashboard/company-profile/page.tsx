"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Plus, Trash2, CheckCircle2, Users, MapPin, Factory, ChevronDown, ChevronRight } from "lucide-react"

type EntityLevel = "korporat" | "subholding" | "site"

interface Entity {
  id: string
  level: EntityLevel
  name: string
  location: string
  industry: string
  employees: string
  parentId: string | null
}

const INDUSTRY_OPTIONS = [
  "Minyak & Gas", "Pertambangan Batubara", "Pertambangan Mineral", "Pembangkitan Listrik",
  "Manufaktur Semen", "Manufaktur Baja", "Manufaktur Kimia", "Perkebunan Kelapa Sawit",
  "Pengolahan Makanan & Minuman", "Tekstil", "Pulp & Kertas", "Transportasi", "Lainnya",
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

function genId() { return Math.random().toString(36).slice(2, 9) }

export default function CompanyProfilePage() {
  const [entities, setEntities] = useState<Entity[]>([
    { id: "corp1", level: "korporat", name: "", location: "", industry: "", employees: "", parentId: null },
  ])
  const [expandedIds, setExpandedIds] = useState<string[]>(["corp1"])
  const [saved, setSaved] = useState(false)

  const toggleExpand = (id: string) =>
    setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])

  const addEntity = (level: EntityLevel, parentId: string | null) => {
    const newEntity: Entity = { id: genId(), level, name: "", location: "", industry: "", employees: "", parentId }
    setEntities(prev => [...prev, newEntity])
    setExpandedIds(prev => [...prev, newEntity.id])
  }

  const updateEntity = (id: string, field: keyof Entity, value: string) =>
    setEntities(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))

  const removeEntity = (id: string) =>
    setEntities(prev => prev.filter(e => e.id !== id && e.parentId !== id))

  const roots = entities.filter(e => e.parentId === null)
  const children = (parentId: string) => entities.filter(e => e.parentId === parentId)
  const filledEntities = entities.filter(e => e.name.trim().length > 0).length

  const renderEntity = (entity: Entity, depth = 0) => {
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
            {entity.level !== "korporat" && (
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
                  <input type="text" value={entity.name} onChange={e => updateEntity(entity.id, "name", e.target.value)}
                    placeholder={entity.level === "korporat" ? "PT Contoh Tbk" : entity.level === "subholding" ? "PT Anak Usaha" : "Pabrik / Fasilitas Produksi A"}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Lokasi</label>
                  <input type="text" value={entity.location} onChange={e => updateEntity(entity.id, "location", e.target.value)}
                    placeholder="Kota, Provinsi"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Jumlah Tenaga Kerja</label>
                  <input type="number" value={entity.employees} onChange={e => updateEntity(entity.id, "employees", e.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
                </div>
                <div className="sm:col-span-2 lg:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Jenis Industri / Sektor</label>
                  <select value={entity.industry} onChange={e => updateEntity(entity.id, "industry", e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 bg-white">
                    <option value="">-- Pilih Sektor --</option>
                    {INDUSTRY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
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
            </div>
          )}
        </div>
        {isExpanded && kids.map(kid => renderEntity(kid, depth + 1))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" className="text-[10px]">Modul 1</Badge>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Company Profile</h1>
          <p className="mt-1 text-sm text-neutral-500">Data dasar perusahaan dengan dukungan struktur multi-entitas untuk grup usaha besar.</p>
        </div>
        <Button onClick={() => setSaved(true)} disabled={filledEntities === 0}>
          {saved ? <><CheckCircle2 className="mr-2 h-4 w-4" />Tersimpan</> : "Simpan Profil"}
        </Button>
      </div>

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
              {entities.reduce((s, e) => s + (parseInt(e.employees) || 0), 0).toLocaleString("id-ID")}
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

      <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-500">
        <span className={`rounded border px-2 py-0.5 font-bold ${levelColor.korporat}`}>Korporat Induk</span>
        <span>→</span>
        <span className={`rounded border px-2 py-0.5 font-bold ${levelColor.subholding}`}>Subholding / Anak Usaha</span>
        <span>→</span>
        <span className={`rounded border px-2 py-0.5 font-bold ${levelColor.site}`}>Site / Fasilitas</span>
        <span className="text-neutral-400">· Data diagregasi otomatis ke level grup</span>
      </div>

      <div>{roots.map(e => renderEntity(e, 0))}</div>
    </div>
  )
}
