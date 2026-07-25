// src/lib/datahub.ts
// ensPR Data Hub — Schema types & Supabase storage utilities for 10 operational categories.
// Semua localStorage telah diganti dengan Supabase sebagai single source of truth.
// Data entered here feeds the calc-engine to derive Scope 1/2/3, LCA, Energy KPIs automatically.

/* ─────────────── Entry Types ─────────────── */

export interface ProductionEntry {
  id: string
  date: string
  plant: string
  line: string
  product: string
  qty: number
  qtyUnit: string
  hours: number
  rejectQty: number
}

export interface MaterialEntry {
  id: string
  date: string
  material: string
  supplier: string
  qty: number
  unit: string
  countryOfOrigin: string
}

export interface EnergyEntry {
  id: string
  date: string
  electricity: number
  diesel: number
  naturalGas: number
  coal: number
  biomass: number
  steam: number
  lpg: number
}

export interface WaterEntry {
  id: string
  date: string
  rawWater: number
  groundwater: number
  processWater: number
  wastewater: number
  flowRate: number
}

export interface LabEntry {
  id: string
  date: string
  samplePoint: string
  ph: number
  cod: number
  bod: number
  tss: number
  nh3: number
  oilGrease: number
  phenol: number
  heavyMetals: Record<string, number>
}

export interface StackEntry {
  id: string
  date: string
  stackId: string
  tsp: number
  so2: number
  nox: number
  co: number
  opacity: number
  flowRate: number
}

export interface B3Entry {
  id: string
  date: string
  wasteType: string
  wasteCode: string
  qty: number
  storageDuration: number
  manifestNo: string
  recycler: string
  disposalCompany: string
}

export interface TransportEntry {
  id: string
  date: string
  vehicleType: string
  fuelType: string
  distance: number
  cargoWeight: number
}

export interface SupplierEntry {
  id: string
  date: string
  supplierName: string
  category: string
  country: string
  sustainability: string
  notes: string
}

export interface DocumentEntry {
  id: string
  date: string
  docType: string
  fileName: string
  fileSize: number
  fileDataUrl: string
  notes: string
}

export type HubCategory =
  | "production"
  | "materials"
  | "energy"
  | "water"
  | "laboratory"
  | "stack"
  | "b3"
  | "transport"
  | "supplier"
  | "documents"

export type AnyEntry =
  | ProductionEntry | MaterialEntry | EnergyEntry | WaterEntry
  | LabEntry | StackEntry | B3Entry | TransportEntry | SupplierEntry | DocumentEntry

// Re-export Supabase CRUD functions sebagai API publik untuk semua komponen
export {
  getHubEntries as getEntries,
  saveHubEntry as saveEntry,
  deleteHubEntry as deleteEntry,
} from "@/lib/supabase/data-service"

export function newId(): string {
  // Gunakan UUID v4 format untuk kompatibilitas dengan Supabase (UUID primary key)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === "x" ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/* ─────────────── Audit Trail ─────────────── */

export type AuditAction = "CREATE" | "DELETE"
export type AuditSource = "measured" | "estimated" | "default"

export interface AuditLogEntry {
  id: string
  timestamp: string
  role: string
  module: string
  action: AuditAction
  field: string
  newValue: string
  source: AuditSource
}

// Re-export audit functions dari Supabase service
export {
  writeAuditLogSb as writeAuditLog,
  getAuditLogSb as getAuditLog,
} from "@/lib/supabase/data-service"

export interface CategoryMeta {
  key: HubCategory
  label: string
  icon: string
  description: string
  colorClass: string
  bgClass: string
  borderClass: string
  textClass: string
}

export const CATEGORY_META: CategoryMeta[] = [
  { key: "production",  label: "Produksi",        icon: "", description: "Data produksi harian: lini, produk, kuantitas, jam operasional",             colorClass: "text-blue-700",    bgClass: "bg-blue-50",    borderClass: "border-blue-200",   textClass: "text-blue-800" },
  { key: "materials",   label: "Material",         icon: "", description: "Konsumsi bahan baku dan penolong: pemasok, kuantitas, asal negara",          colorClass: "text-orange-700",  bgClass: "bg-orange-50",  borderClass: "border-orange-200", textClass: "text-orange-800" },
  { key: "energy",      label: "Energi",           icon: "", description: "Konsumsi energi: listrik, bahan bakar, biomassa, uap",                       colorClass: "text-yellow-700",  bgClass: "bg-yellow-50",  borderClass: "border-yellow-200", textClass: "text-yellow-800" },
  { key: "water",       label: "Air",              icon: "", description: "Penggunaan dan pengelolaan air: baku, tanah, proses, limbah",                 colorClass: "text-cyan-700",    bgClass: "bg-cyan-50",    borderClass: "border-cyan-200",   textClass: "text-cyan-800" },
  { key: "laboratory",  label: "Laboratorium",     icon: "", description: "Hasil uji laboratorium air limbah: pH, COD, BOD, TSS, logam berat",          colorClass: "text-purple-700",  bgClass: "bg-purple-50",  borderClass: "border-purple-200", textClass: "text-purple-800" },
  { key: "stack",       label: "Emisi Cerobong",   icon: "", description: "Hasil uji emisi sumber tidak bergerak: TSP, SO₂, NOx, CO, opasitas",         colorClass: "text-red-700",     bgClass: "bg-red-50",     borderClass: "border-red-200",    textClass: "text-red-800" },
  { key: "b3",          label: "Limbah B3",        icon: "", description: "Pengelolaan limbah B3: jenis, kode, manifest, penyimpanan, pengolah",         colorClass: "text-amber-700",   bgClass: "bg-amber-50",   borderClass: "border-amber-200",  textClass: "text-amber-800" },
  { key: "transport",   label: "Transportasi",     icon: "", description: "Kegiatan transportasi: jenis kendaraan, bahan bakar, jarak, muatan",          colorClass: "text-slate-700",   bgClass: "bg-slate-50",   borderClass: "border-slate-200",  textClass: "text-slate-800" },
  { key: "supplier",    label: "Pemasok",          icon: "", description: "Data rantai pasok: pemasok, kategori, negara asal, sertifikasi",              colorClass: "text-green-700",   bgClass: "bg-green-50",   borderClass: "border-green-200",  textClass: "text-green-800" },
  { key: "documents",   label: "Dokumen",          icon: "", description: "Upload dokumen resmi: laporan lab, manifest, izin lingkungan, AMDAL",         colorClass: "text-neutral-700", bgClass: "bg-neutral-50", borderClass: "border-neutral-200",textClass: "text-neutral-800" },
]
