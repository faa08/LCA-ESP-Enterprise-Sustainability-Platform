"use client"

import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import {
  Database, CheckCircle2, AlertTriangle, ArrowRight, ChevronDown, ChevronUp,
  Plus, Trash2, Calculator, Settings2, Building2, Clock, FileText, Upload, Info,
  Zap, BarChart3, X, Save, Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useIndustryId } from "@/lib/use-industry-id"
import { useSiteId } from "@/lib/use-site-id"
import { INDUSTRIES } from "@/lib/proper"
import {
  CATEGORY_META, newId,
  type HubCategory, type ProductionEntry, type MaterialEntry, type EnergyEntry,
  type WaterEntry, type LabEntry, type StackEntry, type B3Entry,
  type TransportEntry, type SupplierEntry, type DocumentEntry, type AnyEntry,
} from "@/lib/datahub"
import {
  getHubEntries, saveHubEntry, deleteHubEntry, writeAuditLogSb,
} from "@/lib/supabase/data-service"
import { calcEngineAsync, type CalculatedKPIs } from "@/lib/calc-engine"
import { getRoleClient, isReadOnly } from "@/lib/role"
import { useBoundary, isCategoryVisible, getBoundaryLabel, getActiveScopes } from "@/lib/boundary-context"
import { ModuleGate } from "@/components/dashboard/module-gate"

/* â”€â”€â”€ audit helpers â”€â”€â”€ */
function auditSave(category: HubCategory, siteId: string, industryId: string, role: string, summary: string) {
  writeAuditLogSb(siteId, industryId, { role, module: category, action: "CREATE", field: category, newValue: summary, source: "measured" })
}
function auditDelete(category: HubCategory, siteId: string, industryId: string, role: string, summary: string) {
  writeAuditLogSb(siteId, industryId, { role, module: category, action: "DELETE", field: category, newValue: summary, source: "measured" })
}

/* â”€â”€â”€ helpers â”€â”€â”€ */
const today = () => new Date().toISOString().split("T")[0]

function num(v: unknown): number {
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

function fmt(v: number, dec = 2): string {
  if (v === 0) return "â€”"
  return v.toLocaleString("id-ID", { maximumFractionDigits: dec })
}

/* â”€â”€â”€ Field component â”€â”€â”€ */
function Field({
  label, unit, required, tooltip, children, half,
}: {
  label: string; unit?: string; required?: boolean; tooltip?: string; children: React.ReactNode; half?: boolean
}) {
  return (
    <div className={cn("flex flex-col gap-1", half ? "col-span-1" : "")}>
      <label className="flex items-center gap-1 text-xs font-semibold text-neutral-700">
        {label}
        {required && <span className="text-red-500">*</span>}
        {unit && <span className="ml-1 font-normal text-neutral-400">({unit})</span>}
        {tooltip && (
          <span title={tooltip} className="cursor-help text-neutral-300 hover:text-neutral-500">
            <Info className="h-3 w-3" />
          </span>
        )}
      </label>
      {children}
    </div>
  )
}

function Input({
  value, onChange, type = "text", placeholder, min, max, step,
}: {
  value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string; min?: string; max?: string; step?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? ""}
      min={min}
      max={max}
      step={step}
      className="w-full rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-900 placeholder-neutral-300 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
    />
  )
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

/* â”€â”€â”€ KPI Panel â”€â”€â”€ */
function KpiPanel({ kpis, onClose }: { kpis: CalculatedKPIs; onClose: () => void }) {
  const kpiRows = [
    { label: "Scope 1 (Pembakaran Langsung)", value: fmt(kpis.scope1_tCO2e, 3), unit: "tCOâ‚‚e", color: "text-red-700" },
    { label: "Scope 2 (Listrik PLN)", value: fmt(kpis.scope2_tCO2e, 3), unit: "tCOâ‚‚e", color: "text-orange-700" },
    { label: "Scope 3 (Transportasi & Rantai Pasok)", value: fmt(kpis.scope3_tCO2e, 3), unit: "tCOâ‚‚e", color: "text-amber-700" },
    { label: "Total GHG", value: fmt(kpis.total_ghg_tCO2e, 3), unit: "tCOâ‚‚e", color: "text-emerald-700" },
    { label: "Total Energi", value: fmt(kpis.energy_total_MWh, 1), unit: "MWh", color: "text-blue-700" },
    { label: "Energi Terbarukan", value: fmt(kpis.energy_renewable_MWh, 1), unit: "MWh", color: "text-green-700" },
    { label: "Porsi Energi Terbarukan", value: kpis.renewable_pct > 0 ? `${kpis.renewable_pct}%` : "â€”", unit: "", color: "text-green-700" },
    { label: "GWP (Global Warming Potential)", value: fmt(kpis.gwp_kgCO2e, 1), unit: "kg COâ‚‚e", color: "text-neutral-700" },
    { label: "AP (Acidification Potential)", value: fmt(kpis.ap_kgSO2e, 4), unit: "kg SOâ‚‚e", color: "text-neutral-700" },
    { label: "EP (Eutrophication)", value: fmt(kpis.ep_kgPO4e, 4), unit: "kg POâ‚„e", color: "text-neutral-700" },
    { label: "Water Use Depletion", value: fmt(kpis.wud_m3, 1), unit: "mÂ³", color: "text-neutral-700" },
    { label: "PM (Particulate Matter)", value: fmt(kpis.pm_kgPM25e, 4), unit: "kg PMâ‚‚.â‚…e", color: "text-neutral-700" },
    { label: "Abiotic Depletion (Fossil)", value: fmt(kpis.adpf_MJ, 0), unit: "MJ", color: "text-neutral-700" },
  ]
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between border-b border-neutral-100 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">KPI Terhitung Otomatis</p>
            <h2 className="text-base font-bold text-neutral-900">Ringkasan Emisi & Energi</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
            <p className="font-semibold">Dihitung otomatis dari data operasional Anda</p>
            <p className="mt-0.5 text-emerald-700">Nilai berikut tidak perlu diinput manual. Sistem menghitung berdasarkan data Energi, Transportasi, dan Emisi Cerobong yang telah Anda masukkan.</p>
          </div>
          {!kpis.hasData && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
              Belum ada data operasional. Masukkan data Energi terlebih dahulu untuk melihat KPI terhitung.
            </div>
          )}
          <div className="space-y-1">
            {kpiRows.map((r) => (
              <div key={r.label} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-neutral-50">
                <span className="text-xs text-neutral-600">{r.label}</span>
                <div className="text-right">
                  <span className={cn("text-sm font-bold", r.color)}>{r.value}</span>
                  {r.unit && <span className="ml-1 text-[10px] text-neutral-400">{r.unit}</span>}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-neutral-400 pt-2 border-t border-neutral-100">
            Faktor emisi: PLN grid 0.87 kgCOâ‚‚/kWh Â· Diesel 2.68 kgCOâ‚‚/L Â· Gas 2.02 kgCOâ‚‚/NmÂ³ Â· Batubara 2.42 kgCOâ‚‚/kg (ESDM 2022)
          </p>
        </div>
      </div>
    </div>
  )
}

/* â”€â”€â”€ Entry Table â”€â”€â”€ */
function EntryTable({ entries, columns, onDelete, loading }: {
  entries: AnyEntry[]
  columns: { key: string; label: string; render?: (row: AnyEntry) => React.ReactNode }[]
  onDelete: (id: string) => void
  loading?: boolean
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-neutral-400 gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Memuat data dari database...
      </div>
    )
  }
  if (entries.length === 0) {
    return <p className="py-6 text-center text-sm text-neutral-400">Belum ada data yang dimasukkan.</p>
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      <table className="w-full text-left text-xs">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            {columns.map((c) => <th key={c.key} className="px-3 py-2 font-semibold">{c.label}</th>)}
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {entries.map((row) => (
            <tr key={row.id} className="hover:bg-neutral-50">
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2 text-neutral-700">
                  {c.render ? c.render(row) : String((row as unknown as Record<string, unknown>)[c.key] ?? "â€”")}
                </td>
              ))}
              <td className="px-3 py-2 text-right">
                <button onClick={() => onDelete(row.id)} className="rounded p-1 text-neutral-300 hover:bg-red-50 hover:text-red-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* â”€â”€â”€ Category Section wrapper â”€â”€â”€ */
function Section({ meta, children, entryCount }: {
  meta: typeof CATEGORY_META[number]; children: React.ReactNode; entryCount: number
}) {
  const [open, setOpen] = useState(true)
  return (
    <div className={cn("rounded-xl border", meta.borderClass)}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn("flex w-full items-center justify-between rounded-t-xl px-5 py-3.5", meta.bgClass)}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{meta.icon}</span>
          <div className="text-left">
            <p className={cn("text-sm font-bold", meta.colorClass)}>{meta.label}</p>
            <p className="text-xs text-neutral-500">{meta.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {entryCount > 0 && (
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", meta.bgClass, meta.colorClass, "border", meta.borderClass)}>
              {entryCount} entri
            </span>
          )}
          {open ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
        </div>
      </button>
      {open && <div className="border-t border-neutral-100 p-5">{children}</div>}
    </div>
  )
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CATEGORY FORMS â€” semua async dengan database
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function ProductionForm({ siteId, industryId, role }: { siteId: string; industryId: string; role: string }) {
  const meta = CATEGORY_META.find((m) => m.key === "production")!
  const [entries, setEntries] = useState<ProductionEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Omit<ProductionEntry, "id">>({
    date: "", plant: "", line: "", product: "", qty: 0, qtyUnit: "Ton", hours: 0, rejectQty: 0,
  })
  const [showForm, setShowForm] = useState(false)
  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await getHubEntries<ProductionEntry>("production", siteId, industryId)
    setEntries(data)
    setLoading(false)
  }, [siteId, industryId])
  useEffect(() => { refresh() }, [refresh])
  const f = (k: keyof typeof form) => (v: string) => setForm((p) => ({ ...p, [k]: k === "date" || k === "plant" || k === "line" || k === "product" || k === "qtyUnit" ? v : num(v) }))
  const save = async () => {
    if (!form.plant || !form.product) return
    setSaving(true)
    const entry = { ...form, id: newId() }
    await saveHubEntry("production", siteId, industryId, entry)
    auditSave("production", siteId, industryId, role, `${form.product} â€” ${form.qty} ${form.qtyUnit} @ ${form.plant}`)
    await refresh(); setShowForm(false); setSaving(false)
    setForm({ date: today(), plant: "", line: "", product: "", qty: 0, qtyUnit: "Ton", hours: 0, rejectQty: 0 })
  }
  return (
    <Section meta={meta} entryCount={entries.length}>
      {!showForm && (
        <Button size="sm" variant="secondary" onClick={() => setShowForm(true)} className="mb-4">
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah Entri Produksi
        </Button>
      )}
      {showForm && (
        <div className="mb-4 grid gap-3 rounded-lg border border-blue-100 bg-blue-50/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Tanggal" required><Input type="date" value={form.date} onChange={f("date")} /></Field>
          <Field label="Plant / Area" required><Input value={form.plant} onChange={f("plant")} placeholder="Pabrik A" /></Field>
          <Field label="Lini Produksi"><Input value={form.line} onChange={f("line")} placeholder="Line 1" /></Field>
          <Field label="Produk" required><Input value={form.product} onChange={f("product")} placeholder="Nama produk" /></Field>
          <Field label="Kuantitas Produksi" required><Input type="number" value={form.qty || ""} onChange={f("qty")} min="0" step="0.01" /></Field>
          <Field label="Satuan">
            <Select value={form.qtyUnit} onChange={f("qtyUnit")} options={[{ value: "Ton", label: "Ton" }, { value: "Unit", label: "Unit" }, { value: "mÂ³", label: "mÂ³" }, { value: "L", label: "Liter" }]} />
          </Field>
          <Field label="Jam Operasional" unit="jam/hari"><Input type="number" value={form.hours || ""} onChange={f("hours")} min="0" max="24" step="0.5" /></Field>
          <Field label="Kuantitas Reject" unit={form.qtyUnit}><Input type="number" value={form.rejectQty || ""} onChange={f("rejectQty")} min="0" step="0.01" /></Field>
          <div className="col-span-full flex gap-2">
            <Button size="sm" onClick={save} disabled={saving}>{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Simpan</Button>
            <Button size="sm" variant="secondary" onClick={() => setShowForm(false)}><X className="mr-1.5 h-3.5 w-3.5" /> Batal</Button>
          </div>
        </div>
      )}
      <EntryTable loading={loading}
        entries={entries}
        columns={[
          { key: "date", label: "Tanggal" }, { key: "plant", label: "Plant" }, { key: "product", label: "Produk" },
          { key: "qty", label: "Qty", render: (r) => `${(r as ProductionEntry).qty} ${(r as ProductionEntry).qtyUnit}` },
          { key: "hours", label: "Jam", render: (r) => `${(r as ProductionEntry).hours} h` },
        ]}
        onDelete={async (id) => {
          const e = entries.find(x => x.id === id)
          await deleteHubEntry("production", id)
          auditDelete("production", siteId, industryId, role, e ? `${e.product} â€” ${e.qty} ${e.qtyUnit}` : id)
          refresh()
        }}
      />
    </Section>
  )
}

function EnergyForm({ siteId, industryId, role, onCalcUpdate }: { siteId: string; industryId: string; role: string; onCalcUpdate: () => void }) {
  const meta = CATEGORY_META.find((m) => m.key === "energy")!
  const [entries, setEntries] = useState<EnergyEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const blank = { date: "", electricity: 0, diesel: 0, naturalGas: 0, coal: 0, biomass: 0, steam: 0, lpg: 0 }
  const [form, setForm] = useState<Omit<EnergyEntry, "id">>(blank)
  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await getHubEntries<EnergyEntry>("energy", siteId, industryId)
    setEntries(data); setLoading(false)
  }, [siteId, industryId])
  useEffect(() => { refresh() }, [refresh])
  // client-only date init
  useEffect(() => { setForm((p) => ({ ...p, date: p.date || today() })) }, [])
  const f = (k: keyof typeof form) => (v: string) => setForm((p) => ({ ...p, [k]: k === "date" ? v : num(v) }))
  const save = async () => {
    setSaving(true)
    await saveHubEntry("energy", siteId, industryId, { ...form, id: newId() })
    auditSave("energy", siteId, industryId, role, `Listrik ${form.electricity} kWh Â· Diesel ${form.diesel} L Â· Batubara ${form.coal} T Â· Biomassa ${form.biomass} T`)
    await refresh(); onCalcUpdate(); setShowForm(false); setForm(blank); setSaving(false)
  }
  return (
    <Section meta={meta} entryCount={entries.length}>
      <div className="mb-4 rounded-lg border border-yellow-100 bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
        Data energi digunakan untuk menghitung Scope 1, Scope 2, Total Energi, dan Intensitas Energi secara otomatis.
      </div>
      {!showForm && (
        <Button size="sm" variant="secondary" onClick={() => setShowForm(true)} className="mb-4">
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah Data Energi
        </Button>
      )}
      {showForm && (
        <div className="mb-4 grid gap-3 rounded-lg border border-yellow-100 bg-yellow-50/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Tanggal" required><Input type="date" value={form.date} onChange={f("date")} /></Field>
          <Field label="Listrik PLN" unit="kWh"><Input type="number" value={form.electricity || ""} onChange={f("electricity")} min="0" step="1" /></Field>
          <Field label="Solar / Diesel" unit="Liter"><Input type="number" value={form.diesel || ""} onChange={f("diesel")} min="0" step="1" /></Field>
          <Field label="Gas Alam" unit="NmÂ³"><Input type="number" value={form.naturalGas || ""} onChange={f("naturalGas")} min="0" step="1" /></Field>
          <Field label="Batubara" unit="Ton"><Input type="number" value={form.coal || ""} onChange={f("coal")} min="0" step="0.1" /></Field>
          <Field label="Biomassa" unit="Ton"><Input type="number" value={form.biomass || ""} onChange={f("biomass")} min="0" step="0.1" /></Field>
          <Field label="Uap (Steam)" unit="Ton"><Input type="number" value={form.steam || ""} onChange={f("steam")} min="0" step="0.1" /></Field>
          <Field label="LPG" unit="kg"><Input type="number" value={form.lpg || ""} onChange={f("lpg")} min="0" step="1" /></Field>
          <div className="col-span-full flex gap-2">
            <Button size="sm" onClick={save} disabled={saving}>{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Simpan</Button>
            <Button size="sm" variant="secondary" onClick={() => setShowForm(false)}><X className="mr-1.5 h-3.5 w-3.5" /> Batal</Button>
          </div>
        </div>
      )}
      <EntryTable loading={loading} entries={entries} columns={[
        { key: "date", label: "Tanggal" },
        { key: "electricity", label: "Listrik (kWh)", render: (r) => fmt((r as EnergyEntry).electricity) },
        { key: "diesel", label: "Diesel (L)", render: (r) => fmt((r as EnergyEntry).diesel) },
        { key: "naturalGas", label: "Gas (NmÂ³)", render: (r) => fmt((r as EnergyEntry).naturalGas) },
        { key: "coal", label: "Batubara (T)", render: (r) => fmt((r as EnergyEntry).coal) },
        { key: "biomass", label: "Biomassa (T)", render: (r) => fmt((r as EnergyEntry).biomass) },
      ]} onDelete={async (id) => {
        const e = entries.find(x => x.id === id)
        await deleteHubEntry("energy", id)
        auditDelete("energy", siteId, industryId, role, e ? `Listrik ${e.electricity} kWh Â· ${e.date}` : id)
        refresh(); onCalcUpdate()
      }} />
    </Section>
  )
}

function WaterForm({ siteId, industryId, role }: { siteId: string; industryId: string; role: string }) {
  const meta = CATEGORY_META.find((m) => m.key === "water")!
  const [entries, setEntries] = useState<WaterEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const blank = { date: "", rawWater: 0, groundwater: 0, processWater: 0, wastewater: 0, flowRate: 0 }
  const [form, setForm] = useState<Omit<WaterEntry, "id">>(blank)
  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await getHubEntries<WaterEntry>("water", siteId, industryId)
    setEntries(data); setLoading(false)
  }, [siteId, industryId])
  useEffect(() => { refresh() }, [refresh])
  // client-only date init
  useEffect(() => { setForm((p) => ({ ...p, date: p.date || today() })) }, [])
  const f = (k: keyof typeof form) => (v: string) => setForm((p) => ({ ...p, [k]: k === "date" ? v : num(v) }))
  const save = async () => {
    setSaving(true)
    await saveHubEntry("water", siteId, industryId, { ...form, id: newId() })
    auditSave("water", siteId, industryId, role, `Air Baku ${form.rawWater} mÂ³ Â· Air Tanah ${form.groundwater} mÂ³ Â· ${form.date}`)
    await refresh(); setShowForm(false); setForm(blank); setSaving(false)
  }
  return (
    <Section meta={meta} entryCount={entries.length}>
      {!showForm && <Button size="sm" variant="secondary" onClick={() => setShowForm(true)} className="mb-4"><Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah Data Air</Button>}
      {showForm && (
        <div className="mb-4 grid gap-3 rounded-lg border border-cyan-100 bg-cyan-50/40 p-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Tanggal" required><Input type="date" value={form.date} onChange={f("date")} /></Field>
          <Field label="Air Baku (Sungai/PDAM)" unit="mÂ³"><Input type="number" value={form.rawWater || ""} onChange={f("rawWater")} min="0" /></Field>
          <Field label="Air Tanah" unit="mÂ³"><Input type="number" value={form.groundwater || ""} onChange={f("groundwater")} min="0" /></Field>
          <Field label="Air Proses" unit="mÂ³"><Input type="number" value={form.processWater || ""} onChange={f("processWater")} min="0" /></Field>
          <Field label="Air Limbah Keluar" unit="mÂ³"><Input type="number" value={form.wastewater || ""} onChange={f("wastewater")} min="0" /></Field>
          <Field label="Debit Aliran" unit="mÂ³/h"><Input type="number" value={form.flowRate || ""} onChange={f("flowRate")} min="0" step="0.1" /></Field>
          <div className="col-span-full flex gap-2">
            <Button size="sm" onClick={save} disabled={saving}>{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Simpan</Button>
            <Button size="sm" variant="secondary" onClick={() => setShowForm(false)}><X className="mr-1.5 h-3.5 w-3.5" /> Batal</Button>
          </div>
        </div>
      )}
      <EntryTable loading={loading} entries={entries} columns={[
        { key: "date", label: "Tanggal" },
        { key: "rawWater", label: "Air Baku (mÂ³)", render: (r) => fmt((r as WaterEntry).rawWater) },
        { key: "groundwater", label: "Air Tanah (mÂ³)", render: (r) => fmt((r as WaterEntry).groundwater) },
        { key: "wastewater", label: "Limbah Cair (mÂ³)", render: (r) => fmt((r as WaterEntry).wastewater) },
      ]} onDelete={async (id) => {
        const e = entries.find(x => x.id === id)
        await deleteHubEntry("water", id)
        auditDelete("water", siteId, industryId, role, e ? `Air Baku ${e.rawWater} mÂ³ Â· ${e.date}` : id)
        refresh()
      }} />
    </Section>
  )
}

function LabForm({ siteId, industryId, role }: { siteId: string; industryId: string; role: string }) {
  const meta = CATEGORY_META.find((m) => m.key === "laboratory")!
  const [entries, setEntries] = useState<LabEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const blank: Omit<LabEntry, "id"> = { date: "", samplePoint: "", ph: 0, cod: 0, bod: 0, tss: 0, nh3: 0, oilGrease: 0, phenol: 0, heavyMetals: {} }
  const [form, setForm] = useState<Omit<LabEntry, "id">>(blank)
  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await getHubEntries<LabEntry>("laboratory", siteId, industryId)
    setEntries(data); setLoading(false)
  }, [siteId, industryId])
  useEffect(() => { refresh() }, [refresh])
  // client-only date init
  useEffect(() => { setForm((p) => ({ ...p, date: p.date || today() })) }, [])
  const f = (k: keyof Omit<LabEntry, "id" | "heavyMetals">) => (v: string) =>
    setForm((p) => ({ ...p, [k]: k === "date" || k === "samplePoint" ? v : num(v) }))
  const save = async () => {
    setSaving(true)
    await saveHubEntry("laboratory", siteId, industryId, { ...form, id: newId() })
    auditSave("laboratory", siteId, industryId, role, `${form.samplePoint} â€” pH ${form.ph} Â· COD ${form.cod} mg/L Â· BOD ${form.bod} mg/L`)
    await refresh(); setShowForm(false); setForm(blank); setSaving(false)
  }
  return (
    <Section meta={meta} entryCount={entries.length}>
      <div className="mb-4 rounded-lg border border-purple-100 bg-purple-50 px-3 py-2 text-xs text-purple-800">
        Hasil uji laboratorium digunakan untuk mengevaluasi kepatuhan baku mutu air limbah (Permen LHK No. 5/2014).
      </div>
      {!showForm && <Button size="sm" variant="secondary" onClick={() => setShowForm(true)} className="mb-4"><Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah Hasil Lab</Button>}
      {showForm && (
        <div className="mb-4 grid gap-3 rounded-lg border border-purple-100 bg-purple-50/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Tanggal" required><Input type="date" value={form.date} onChange={f("date")} /></Field>
          <Field label="Titik Sampling" required><Input value={form.samplePoint} onChange={f("samplePoint")} placeholder="Outlet IPAL" /></Field>
          <Field label="pH"><Input type="number" value={form.ph || ""} onChange={f("ph")} min="0" max="14" step="0.1" /></Field>
          <Field label="COD" unit="mg/L"><Input type="number" value={form.cod || ""} onChange={f("cod")} min="0" step="0.1" /></Field>
          <Field label="BOD" unit="mg/L"><Input type="number" value={form.bod || ""} onChange={f("bod")} min="0" step="0.1" /></Field>
          <Field label="TSS" unit="mg/L"><Input type="number" value={form.tss || ""} onChange={f("tss")} min="0" step="0.1" /></Field>
          <Field label="NHâ‚ƒ-N (Amonia)" unit="mg/L"><Input type="number" value={form.nh3 || ""} onChange={f("nh3")} min="0" step="0.01" /></Field>
          <Field label="Minyak & Lemak" unit="mg/L"><Input type="number" value={form.oilGrease || ""} onChange={f("oilGrease")} min="0" step="0.01" /></Field>
          <div className="col-span-full flex gap-2">
            <Button size="sm" onClick={save} disabled={saving}>{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Simpan</Button>
            <Button size="sm" variant="secondary" onClick={() => setShowForm(false)}><X className="mr-1.5 h-3.5 w-3.5" /> Batal</Button>
          </div>
        </div>
      )}
      <EntryTable loading={loading} entries={entries} columns={[
        { key: "date", label: "Tanggal" }, { key: "samplePoint", label: "Titik Sampling" },
        { key: "ph", label: "pH", render: (r) => String((r as LabEntry).ph) },
        { key: "cod", label: "COD", render: (r) => `${(r as LabEntry).cod} mg/L` },
        { key: "bod", label: "BOD", render: (r) => `${(r as LabEntry).bod} mg/L` },
        { key: "tss", label: "TSS", render: (r) => `${(r as LabEntry).tss} mg/L` },
      ]} onDelete={async (id) => {
        const e = entries.find(x => x.id === id)
        await deleteHubEntry("laboratory", id)
        auditDelete("laboratory", siteId, industryId, role, e ? `${e.samplePoint} Â· ${e.date}` : id)
        refresh()
      }} />
    </Section>
  )
}

function StackForm({ siteId, industryId, role, onCalcUpdate }: { siteId: string; industryId: string; role: string; onCalcUpdate: () => void }) {
  const meta = CATEGORY_META.find((m) => m.key === "stack")!
  const [entries, setEntries] = useState<StackEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const blank: Omit<StackEntry, "id"> = { date: "", stackId: "", tsp: 0, so2: 0, nox: 0, co: 0, opacity: 0, flowRate: 0 }
  const [form, setForm] = useState<Omit<StackEntry, "id">>(blank)
  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await getHubEntries<StackEntry>("stack", siteId, industryId)
    setEntries(data); setLoading(false)
  }, [siteId, industryId])
  useEffect(() => { refresh() }, [refresh])
  // client-only date init
  useEffect(() => { setForm((p) => ({ ...p, date: p.date || today() })) }, [])
  const f = (k: keyof typeof form) => (v: string) => setForm((p) => ({ ...p, [k]: k === "date" || k === "stackId" ? v : num(v) }))
  const save = async () => {
    setSaving(true)
    await saveHubEntry("stack", siteId, industryId, { ...form, id: newId() })
    auditSave("stack", siteId, industryId, role, `${form.stackId} â€” TSP ${form.tsp} Â· SOâ‚‚ ${form.so2} Â· NOx ${form.nox} mg/NmÂ³`)
    await refresh(); onCalcUpdate(); setShowForm(false); setForm(blank); setSaving(false)
  }
  return (
    <Section meta={meta} entryCount={entries.length}>
      <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-800">
        Data emisi cerobong digunakan untuk menghitung Acidification Potential (AP) dan Particulate Matter (PM) dalam kalkulasi LCA.
      </div>
      {!showForm && <Button size="sm" variant="secondary" onClick={() => setShowForm(true)} className="mb-4"><Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah Data Emisi Cerobong</Button>}
      {showForm && (
        <div className="mb-4 grid gap-3 rounded-lg border border-red-100 bg-red-50/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Tanggal" required><Input type="date" value={form.date} onChange={f("date")} /></Field>
          <Field label="ID Cerobong" required><Input value={form.stackId} onChange={f("stackId")} placeholder="Stack-01" /></Field>
          <Field label="TSP (Partikulat)" unit="mg/NmÂ³"><Input type="number" value={form.tsp || ""} onChange={f("tsp")} min="0" step="0.1" /></Field>
          <Field label="SOâ‚‚" unit="mg/NmÂ³"><Input type="number" value={form.so2 || ""} onChange={f("so2")} min="0" step="0.1" /></Field>
          <Field label="NOx" unit="mg/NmÂ³"><Input type="number" value={form.nox || ""} onChange={f("nox")} min="0" step="0.1" /></Field>
          <Field label="CO" unit="mg/NmÂ³"><Input type="number" value={form.co || ""} onChange={f("co")} min="0" step="0.1" /></Field>
          <Field label="Opasitas" unit="%"><Input type="number" value={form.opacity || ""} onChange={f("opacity")} min="0" max="100" step="1" /></Field>
          <Field label="Laju Alir Cerobong" unit="NmÂ³/jam"><Input type="number" value={form.flowRate || ""} onChange={f("flowRate")} min="0" step="1" /></Field>
          <div className="col-span-full flex gap-2">
            <Button size="sm" onClick={save} disabled={saving}>{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Simpan</Button>
            <Button size="sm" variant="secondary" onClick={() => setShowForm(false)}><X className="mr-1.5 h-3.5 w-3.5" /> Batal</Button>
          </div>
        </div>
      )}
      <EntryTable loading={loading} entries={entries} columns={[
        { key: "date", label: "Tanggal" }, { key: "stackId", label: "Cerobong" },
        { key: "tsp", label: "TSP", render: (r) => `${(r as StackEntry).tsp} mg/NmÂ³` },
        { key: "so2", label: "SOâ‚‚", render: (r) => `${(r as StackEntry).so2} mg/NmÂ³` },
        { key: "nox", label: "NOx", render: (r) => `${(r as StackEntry).nox} mg/NmÂ³` },
        { key: "opacity", label: "Opasitas", render: (r) => `${(r as StackEntry).opacity}%` },
      ]} onDelete={async (id) => {
        const e = entries.find(x => x.id === id)
        await deleteHubEntry("stack", id)
        auditDelete("stack", siteId, industryId, role, e ? `${e.stackId} Â· ${e.date}` : id)
        refresh(); onCalcUpdate()
      }} />
    </Section>
  )
}

function B3Form({ siteId, industryId, role }: { siteId: string; industryId: string; role: string }) {
  const meta = CATEGORY_META.find((m) => m.key === "b3")!
  const [entries, setEntries] = useState<B3Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const blank: Omit<B3Entry, "id"> = { date: "", wasteType: "", wasteCode: "", qty: 0, storageDuration: 0, manifestNo: "", recycler: "", disposalCompany: "" }
  const [form, setForm] = useState<Omit<B3Entry, "id">>(blank)
  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await getHubEntries<B3Entry>("b3", siteId, industryId)
    setEntries(data); setLoading(false)
  }, [siteId, industryId])
  useEffect(() => { refresh() }, [refresh])
  // client-only date init
  useEffect(() => { setForm((p) => ({ ...p, date: p.date || today() })) }, [])
  const f = (k: keyof typeof form) => (v: string) => setForm((p) => ({ ...p, [k]: k === "qty" || k === "storageDuration" ? num(v) : v }))
  const save = async () => {
    if (!form.wasteType) return
    setSaving(true)
    await saveHubEntry("b3", siteId, industryId, { ...form, id: newId() })
    auditSave("b3", siteId, industryId, role, `${form.wasteType} (${form.wasteCode}) â€” ${form.qty} kg Â· Simpan ${form.storageDuration} hari`)
    await refresh(); setShowForm(false); setForm(blank); setSaving(false)
  }
  return (
    <Section meta={meta} entryCount={entries.length}>
      <div className="mb-4 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        Wajib diisi sesuai Permen LHK No. 6/2021. Masa simpan maksimal 90 hari. Manifest wajib menggunakan Festronik KLHK.
      </div>
      {!showForm && <Button size="sm" variant="secondary" onClick={() => setShowForm(true)} className="mb-4"><Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah Data Limbah B3</Button>}
      {showForm && (
        <div className="mb-4 grid gap-3 rounded-lg border border-amber-100 bg-amber-50/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Tanggal" required><Input type="date" value={form.date} onChange={f("date")} /></Field>
          <Field label="Jenis Limbah B3" required><Input value={form.wasteType} onChange={f("wasteType")} placeholder="Oli Bekas" /></Field>
          <Field label="Kode Limbah"><Input value={form.wasteCode} onChange={f("wasteCode")} placeholder="B105d" /></Field>
          <Field label="Kuantitas" unit="kg" required><Input type="number" value={form.qty || ""} onChange={f("qty")} min="0" step="0.1" /></Field>
          <Field label="Lama Penyimpanan" unit="hari"><Input type="number" value={form.storageDuration || ""} onChange={f("storageDuration")} min="0" max="365" /></Field>
          <Field label="No. Manifest (Festronik)"><Input value={form.manifestNo} onChange={f("manifestNo")} placeholder="FM-2024-XXXXX" /></Field>
          <Field label="Perusahaan Pengumpul"><Input value={form.recycler} onChange={f("recycler")} placeholder="PT Pengolah B3" /></Field>
          <Field label="Perusahaan Pemusnah"><Input value={form.disposalCompany} onChange={f("disposalCompany")} placeholder="PT Disposal" /></Field>
          <div className="col-span-full flex gap-2">
            <Button size="sm" onClick={save} disabled={saving}>{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Simpan</Button>
            <Button size="sm" variant="secondary" onClick={() => setShowForm(false)}><X className="mr-1.5 h-3.5 w-3.5" /> Batal</Button>
          </div>
        </div>
      )}
      <EntryTable loading={loading} entries={entries} columns={[
        { key: "date", label: "Tanggal" }, { key: "wasteType", label: "Jenis Limbah" }, { key: "wasteCode", label: "Kode" },
        { key: "qty", label: "Qty (kg)", render: (r) => fmt((r as B3Entry).qty) },
        { key: "storageDuration", label: "Masa Simpan", render: (r) => { const d = (r as B3Entry).storageDuration; return <span className={d > 90 ? "font-bold text-red-600" : ""}>{d} hari</span> } },
        { key: "manifestNo", label: "Manifest" },
        { key: "recycler", label: "Pengumpul" },
        { key: "disposalCompany", label: "Pemusnah" },
      ]} onDelete={async (id) => {
        const e = entries.find(x => x.id === id)
        await deleteHubEntry("b3", id)
        auditDelete("b3", siteId, industryId, role, e ? `${e.wasteType} â€” ${e.qty} kg` : id)
        refresh()
      }} />
    </Section>
  )
}

function TransportForm({ siteId, industryId, role, onCalcUpdate }: { siteId: string; industryId: string; role: string; onCalcUpdate: () => void }) {
  const meta = CATEGORY_META.find((m) => m.key === "transport")!
  const [entries, setEntries] = useState<TransportEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const blank: Omit<TransportEntry, "id"> = { date: "", vehicleType: "truck", fuelType: "diesel", distance: 0, cargoWeight: 0, direction: "upstream", frequencyPerYear: 1 }
  const [form, setForm] = useState<Omit<TransportEntry, "id">>(blank)
  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await getHubEntries<TransportEntry>("transport", siteId, industryId)
    setEntries(data); setLoading(false)
  }, [siteId, industryId])
  useEffect(() => { refresh() }, [refresh])
  // client-only date init
  useEffect(() => { setForm((p) => ({ ...p, date: p.date || today() })) }, [])
  const f = (k: keyof typeof form) => (v: string) => setForm((p) => ({ ...p, [k]: k === "vehicleType" || k === "fuelType" || k === "date" ? v : num(v) }))
  const save = async () => {
    setSaving(true)
    await saveHubEntry("transport", siteId, industryId, { ...form, id: newId() })
    auditSave("transport", siteId, industryId, role, `${form.vehicleType} Â· ${form.distance} km Â· ${form.cargoWeight} ton`)
    await refresh(); onCalcUpdate(); setShowForm(false); setForm(blank); setSaving(false)
  }
  return (
    <Section meta={meta} entryCount={entries.length}>
      <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-700">
        Data transportasi digunakan untuk menghitung Scope 3 (emisi rantai nilai tidak langsung).
      </div>
      {!showForm && <Button size="sm" variant="secondary" onClick={() => setShowForm(true)} className="mb-4"><Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah Data Transportasi</Button>}
      {showForm && (
        <div className="mb-4 grid gap-3 rounded-lg border border-slate-100 bg-slate-50/40 p-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Tanggal" required><Input type="date" value={form.date} onChange={f("date")} /></Field>
          <Field label="Jenis Kendaraan">
            <Select value={form.vehicleType} onChange={f("vehicleType")} options={[
              { value: "truck", label: "Truk" }, { value: "ship", label: "Kapal Laut" },
              { value: "rail", label: "Kereta Api" }, { value: "air", label: "Pesawat" },
            ]} />
          </Field>
          <Field label="Jenis Bahan Bakar">
            <Select value={form.fuelType} onChange={f("fuelType")} options={[
              { value: "diesel", label: "Solar / Diesel" }, { value: "cng", label: "CNG / BBG" }, { value: "electric", label: "Listrik" },
            ]} />
          </Field>
          <Field label="Jarak Tempuh" unit="km" required><Input type="number" value={form.distance || ""} onChange={f("distance")} min="0" step="0.1" /></Field>
          <Field label="Berat Muatan" unit="ton" required><Input type="number" value={form.cargoWeight || ""} onChange={f("cargoWeight")} min="0" step="0.1" /></Field>
          <div className="col-span-full flex gap-2">
            <Button size="sm" onClick={save} disabled={saving}>{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Simpan</Button>
            <Button size="sm" variant="secondary" onClick={() => setShowForm(false)}><X className="mr-1.5 h-3.5 w-3.5" /> Batal</Button>
          </div>
        </div>
      )}
      <EntryTable loading={loading} entries={entries} columns={[
        { key: "date", label: "Tanggal" }, { key: "vehicleType", label: "Kendaraan" }, { key: "fuelType", label: "BBM" },
        { key: "distance", label: "Jarak (km)", render: (r) => fmt((r as TransportEntry).distance) },
        { key: "cargoWeight", label: "Muatan (ton)", render: (r) => fmt((r as TransportEntry).cargoWeight) },
      ]} onDelete={async (id) => {
        const e = entries.find(x => x.id === id)
        await deleteHubEntry("transport", id)
        auditDelete("transport", siteId, industryId, role, e ? `${e.vehicleType} Â· ${e.distance} km Â· ${e.date}` : id)
        refresh(); onCalcUpdate()
      }} />
    </Section>
  )
}

function MaterialForm({ siteId, industryId, role }: { siteId: string; industryId: string; role: string }) {
  const meta = CATEGORY_META.find((m) => m.key === "materials")!
  const [entries, setEntries] = useState<MaterialEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const blank: Omit<MaterialEntry, "id"> = { date: "", material: "", supplier: "", qty: 0, unit: "Ton", countryOfOrigin: "Indonesia" }
  const [form, setForm] = useState<Omit<MaterialEntry, "id">>(blank)
  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await getHubEntries<MaterialEntry>("materials", siteId, industryId)
    setEntries(data); setLoading(false)
  }, [siteId, industryId])
  useEffect(() => { refresh() }, [refresh])
  // client-only date init
  useEffect(() => { setForm((p) => ({ ...p, date: p.date || today() })) }, [])
  const f = (k: keyof typeof form) => (v: string) => setForm((p) => ({ ...p, [k]: k === "qty" ? num(v) : v }))
  const save = async () => {
    if (!form.material) return
    setSaving(true)
    await saveHubEntry("materials", siteId, industryId, { ...form, id: newId() })
    auditSave("materials", siteId, industryId, role, `${form.material} â€” ${form.qty} ${form.unit} dari ${form.supplier || "â€”"}`)
    await refresh(); setShowForm(false); setForm(blank); setSaving(false)
  }
  return (
    <Section meta={meta} entryCount={entries.length}>
      {!showForm && <Button size="sm" variant="secondary" onClick={() => setShowForm(true)} className="mb-4"><Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah Data Material</Button>}
      {showForm && (
        <div className="mb-4 grid gap-3 rounded-lg border border-orange-100 bg-orange-50/40 p-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Tanggal" required><Input type="date" value={form.date} onChange={f("date")} /></Field>
          <Field label="Nama Material" required><Input value={form.material} onChange={f("material")} placeholder="Bahan baku utama" /></Field>
          <Field label="Pemasok / Supplier"><Input value={form.supplier} onChange={f("supplier")} placeholder="PT Supplier" /></Field>
          <Field label="Kuantitas" required><Input type="number" value={form.qty || ""} onChange={f("qty")} min="0" step="0.1" /></Field>
          <Field label="Satuan">
            <Select value={form.unit} onChange={f("unit")} options={[{ value: "Ton", label: "Ton" }, { value: "kg", label: "kg" }, { value: "L", label: "Liter" }, { value: "mÂ³", label: "mÂ³" }, { value: "Unit", label: "Unit" }]} />
          </Field>
          <Field label="Negara Asal"><Input value={form.countryOfOrigin} onChange={f("countryOfOrigin")} placeholder="Indonesia" /></Field>
          <div className="col-span-full flex gap-2">
            <Button size="sm" onClick={save} disabled={saving}>{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Simpan</Button>
            <Button size="sm" variant="secondary" onClick={() => setShowForm(false)}><X className="mr-1.5 h-3.5 w-3.5" /> Batal</Button>
          </div>
        </div>
      )}
      <EntryTable loading={loading} entries={entries} columns={[
        { key: "date", label: "Tanggal" }, { key: "material", label: "Material" }, { key: "supplier", label: "Pemasok" },
        { key: "qty", label: "Qty", render: (r) => `${fmt((r as MaterialEntry).qty)} ${(r as MaterialEntry).unit}` },
        { key: "countryOfOrigin", label: "Asal" },
      ]} onDelete={async (id) => {
        const e = entries.find(x => x.id === id)
        await deleteHubEntry("materials", id)
        auditDelete("materials", siteId, industryId, role, e ? `${e.material} â€” ${e.qty} ${e.unit}` : id)
        refresh()
      }} />
    </Section>
  )
}

function SupplierForm({ siteId, industryId, role }: { siteId: string; industryId: string; role: string }) {
  const meta = CATEGORY_META.find((m) => m.key === "supplier")!
  const [entries, setEntries] = useState<SupplierEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const blank: Omit<SupplierEntry, "id"> = { date: "", supplierName: "", category: "", country: "Indonesia", sustainability: "none", notes: "" }
  const [form, setForm] = useState<Omit<SupplierEntry, "id">>(blank)
  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await getHubEntries<SupplierEntry>("supplier", siteId, industryId)
    setEntries(data); setLoading(false)
  }, [siteId, industryId])
  useEffect(() => { refresh() }, [refresh])
  // client-only date init
  useEffect(() => { setForm((p) => ({ ...p, date: p.date || today() })) }, [])
  const f = (k: keyof typeof form) => (v: string) => setForm((p) => ({ ...p, [k]: v }))
  const save = async () => {
    if (!form.supplierName) return
    setSaving(true)
    await saveHubEntry("supplier", siteId, industryId, { ...form, id: newId() })
    auditSave("supplier", siteId, industryId, role, `${form.supplierName} Â· ${form.country} Â· ${form.sustainability}`)
    await refresh(); setShowForm(false); setForm(blank); setSaving(false)
  }
  return (
    <Section meta={meta} entryCount={entries.length}>
      {!showForm && <Button size="sm" variant="secondary" onClick={() => setShowForm(true)} className="mb-4"><Plus className="mr-1.5 h-3.5 w-3.5" /> Tambah Pemasok</Button>}
      {showForm && (
        <div className="mb-4 grid gap-3 rounded-lg border border-green-100 bg-green-50/40 p-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Tanggal" required><Input type="date" value={form.date} onChange={f("date")} /></Field>
          <Field label="Nama Pemasok" required><Input value={form.supplierName} onChange={f("supplierName")} placeholder="PT Pemasok" /></Field>
          <Field label="Kategori Material"><Input value={form.category} onChange={f("category")} placeholder="Bahan Kimia, Packaging, dll." /></Field>
          <Field label="Negara Asal"><Input value={form.country} onChange={f("country")} placeholder="Indonesia" /></Field>
          <Field label="Status Keberlanjutan">
            <Select value={form.sustainability} onChange={f("sustainability")} options={[
              { value: "certified", label: "Tersertifikasi (ISO 14001, RSPO, dll.)" },
              { value: "partial", label: "Sebagian Tersertifikasi" },
              { value: "none", label: "Belum Tersertifikasi" },
            ]} />
          </Field>
          <Field label="Catatan"><Input value={form.notes} onChange={f("notes")} placeholder="Keterangan tambahan..." /></Field>
          <div className="col-span-full flex gap-2">
            <Button size="sm" onClick={save} disabled={saving}>{saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Simpan</Button>
            <Button size="sm" variant="secondary" onClick={() => setShowForm(false)}><X className="mr-1.5 h-3.5 w-3.5" /> Batal</Button>
          </div>
        </div>
      )}
      <EntryTable loading={loading} entries={entries} columns={[
        { key: "date", label: "Tanggal" }, { key: "supplierName", label: "Pemasok" }, { key: "country", label: "Negara" },
        { key: "sustainability", label: "Status", render: (r) => { const s = (r as SupplierEntry).sustainability; return <span className={s === "certified" ? "text-emerald-700 font-semibold" : s === "partial" ? "text-amber-700" : "text-red-600"}>{s === "certified" ? "Tersertifikasi" : s === "partial" ? "Sebagian" : "Belum"}</span> } },
      ]} onDelete={async (id) => {
        const e = entries.find(x => x.id === id)
        await deleteHubEntry("supplier", id)
        auditDelete("supplier", siteId, industryId, role, e ? `${e.supplierName} Â· ${e.country}` : id)
        refresh()
      }} />
    </Section>
  )
}

function DocumentsForm({ siteId, industryId, role }: { siteId: string; industryId: string; role: string }) {
  const meta = CATEGORY_META.find((m) => m.key === "documents")!
  const [entries, setEntries] = useState<DocumentEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [docType, setDocType] = useState("lab_report")
  const [notes, setNotes] = useState("")
  const refresh = useCallback(async () => {
    setLoading(true)
    const data = await getHubEntries<DocumentEntry>("documents", siteId, industryId)
    setEntries(data); setLoading(false)
  }, [siteId, industryId])
  useEffect(() => { refresh() }, [refresh])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      await saveHubEntry("documents", siteId, industryId, {
        id: newId(), date: today(), docType, fileName: file.name,
        fileSize: file.size, fileDataUrl: ev.target?.result as string, notes,
      })
      auditSave("documents", siteId, industryId, role, `${file.name} (${docType})`)
      refresh(); setNotes("")
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const docTypeOptions = [
    { value: "lab_report", label: "Laporan Uji Laboratorium" },
    { value: "manifest", label: "Manifest B3 (Festronik)" },
    { value: "env_permit", label: "Izin Lingkungan / IPLC" },
    { value: "tps_permit", label: "Izin TPS B3" },
    { value: "amdal", label: "AMDAL / RKL-RPL" },
    { value: "ukl_upl", label: "UKL-UPL" },
    { value: "other", label: "Dokumen Lainnya" },
  ]

  return (
    <Section meta={meta} entryCount={entries.length}>
      <div className="mb-4 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
        Upload dokumen pendukung untuk audit KLHK, PROPER, dan laporan ESG. Format: PDF, JPG, PNG (maks 5 MB per file).
      </div>
      <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 bg-neutral-50/40 p-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-neutral-700">Jenis Dokumen</label>
          <select value={docType} onChange={(e) => setDocType(e.target.value)} className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none">
            {docTypeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
          <label className="text-xs font-semibold text-neutral-700">Catatan (opsional)</label>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Keterangan..." className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none" />
        </div>
        <label className="cursor-pointer">
          <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-600 hover:border-emerald-400 hover:text-emerald-700 transition-colors">
            <Upload className="mr-1.5 h-4 w-4" /> Upload File
          </div>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={handleFile} className="hidden" />
        </label>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-8 text-sm text-neutral-400 gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Memuat dokumen...
        </div>
      ) : entries.length === 0
        ? <p className="py-6 text-center text-sm text-neutral-400">Belum ada dokumen yang diunggah.</p>
        : (
          <div className="grid gap-2 sm:grid-cols-2">
            {entries.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 shrink-0 text-neutral-400" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-neutral-800">{doc.fileName}</p>
                    <p className="text-[11px] text-neutral-400">{docTypeOptions.find((o) => o.value === doc.docType)?.label} Â· {doc.date}</p>
                  </div>
                </div>
                <button onClick={async () => {
                  await deleteHubEntry("documents", doc.id)
                  auditDelete("documents", siteId, industryId, role, doc.fileName)
                  refresh()
                }} className="ml-2 shrink-0 rounded p-1 text-neutral-300 hover:bg-red-50 hover:text-red-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
    </Section>
  )
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MAIN PAGE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

export default function DataHubPage() {
  const role = getRoleClient() ?? "operator"
  const readOnly = isReadOnly(role)
  const industryId = useIndustryId()
  const siteId = useSiteId()
  const industry = INDUSTRIES.find((i) => i.id === industryId)
  const [kpis, setKpis] = useState<CalculatedKPIs | null>(null)
  const [showKpi, setShowKpi] = useState(false)
  const { boundary } = useBoundary()

  const refreshKpis = useCallback(async () => {
    if (siteId && industryId) {
      const res = await calcEngineAsync(siteId, industryId, boundary)
      setKpis(res)
    }
  }, [siteId, industryId, boundary])

  useEffect(() => { refreshKpis() }, [refreshKpis])

  return (
    <ModuleGate moduleName="Data Hub">
    <div className="space-y-6">
      {readOnly && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 flex items-center gap-3">
          <Info className="h-5 w-5 text-amber-600 shrink-0" />
          <div>
            <p className="font-bold">Akses Read-Only Data Hub (Role: Auditor / Viewer)</p>
            <p className="mt-0.5 text-amber-700">Anda dapat memantau seluruh entri data operasional di bawah. Formulir penambahan dan penghapusan data dinonaktifkan untuk peran Anda.</p>
          </div>
        </div>
      )}
      {/* â”€â”€ Page Header â”€â”€ */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <Database className="mr-1.5 h-3.5 w-3.5" /> Single Source of Truth â€” Database Terpusat
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Data Hub (Pusat Ingest Data Operasional)</h1>
          <p className="mt-1 max-w-2xl text-sm text-neutral-500">
            Pusat penampungan data operasional site. Data tersimpan secara permanen di database dan mengalir otomatis ke 13 modul analitik LCA, Carbon, dan ESG.
          </p>
        </div>
        <div className="flex flex-col items-start lg:items-end gap-3">
          <span className="text-xs text-neutral-500 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Terhubung ke Database
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/dashboard/company-profile">
              <Button variant="secondary" size="sm"><Building2 className="mr-2 h-4 w-4" /> Profil Perusahaan</Button>
            </Link>
            <Button size="sm" onClick={() => { refreshKpis(); setShowKpi(true) }} className="bg-emerald-600 text-white hover:bg-emerald-700">
              <Calculator className="mr-2 h-4 w-4" /> Lihat KPI Terhitung
            </Button>
          </div>
        </div>
      </div>

      {/* â”€â”€ Industry not selected â”€â”€ */}
      {!industry && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
          <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-amber-500" />
          <p className="font-semibold text-amber-800">Industri belum dipilih</p>
          <p className="mt-1 text-sm text-amber-700">Pilih jenis industri di Modul 1 (Company Profile) terlebih dahulu untuk memulai input data.</p>
          <Link href="/dashboard/company-profile" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:underline">
            Buka Profil Perusahaan <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* â”€â”€ KPI banner â”€â”€ */}
      {industry && (
        <div className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-3.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900">{industry.name}</p>
                <p className="text-xs text-emerald-700">
                  {getActiveScopes(boundary)} Â· GWP Â· AP Â· EP Â· Total Energi â†’ dihitung otomatis dari data di bawah ini
                  <span className="ml-1 inline-flex items-center rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 border border-emerald-200">
                    {getBoundaryLabel(boundary)}
                  </span>
                </p>
              </div>
            </div>
            {kpis?.hasData && (
              <div className="flex items-center gap-4 text-center">
                <div>
                  <p className="text-lg font-black text-emerald-800">{fmt(kpis.total_ghg_tCO2e, 1)}</p>
                  <p className="text-[10px] text-emerald-600">tCOâ‚‚e Total</p>
                </div>
                <div>
                  <p className="text-lg font-black text-blue-700">{fmt(kpis.energy_total_MWh, 0)}</p>
                  <p className="text-[10px] text-blue-500">MWh Energi</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* â”€â”€ Category Forms â”€â”€ */}
      {industry && (
        <div className="space-y-4">
          {/* Boundary filter info banner */}
          {(boundary === "gate-to-gate" || boundary === "cradle-to-gate") && (
            <div className="flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
              <Settings2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
              <div>
                <p className="text-xs font-bold text-orange-900">Batas Sistem: {getBoundaryLabel(boundary)}</p>
                <p className="text-[11px] text-orange-700 mt-0.5">
                  Beberapa kategori disembunyikan karena di luar batas sistem yang dipilih di Goal &amp; Scope.
                  {!isCategoryVisible(boundary, "materials") && " Materials (Bahan Baku) tersembunyi."}
                  {!isCategoryVisible(boundary, "transport") && " Transport (Transportasi) tersembunyi."}
                  {!isCategoryVisible(boundary, "supplier") && " Supplier (Pemasok) tersembunyi."}
                  {" "}Ubah di <a href="/dashboard/goal-scope" className="underline font-semibold">Goal &amp; Scope</a>.
                </p>
              </div>
            </div>
          )}
          <ProductionForm siteId={siteId} industryId={industryId} role={role} />
          {isCategoryVisible(boundary, "materials") && <MaterialForm siteId={siteId} industryId={industryId} role={role} />}
          <EnergyForm siteId={siteId} industryId={industryId} role={role} onCalcUpdate={refreshKpis} />
          <WaterForm siteId={siteId} industryId={industryId} role={role} />
          <LabForm siteId={siteId} industryId={industryId} role={role} />
          <StackForm siteId={siteId} industryId={industryId} role={role} onCalcUpdate={refreshKpis} />
          <B3Form siteId={siteId} industryId={industryId} role={role} />
          {isCategoryVisible(boundary, "transport") && <TransportForm siteId={siteId} industryId={industryId} role={role} onCalcUpdate={refreshKpis} />}
          {isCategoryVisible(boundary, "supplier") && <SupplierForm siteId={siteId} industryId={industryId} role={role} />}
          <DocumentsForm siteId={siteId} industryId={industryId} role={role} />
        </div>
      )}

      {/* â”€â”€ KPI Panel â”€â”€ */}
      {showKpi && kpis && <KpiPanel kpis={kpis} onClose={() => setShowKpi(false)} />}
    </div>
    </ModuleGate>
  )
}

