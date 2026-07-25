// src/lib/supabase/data-service.ts
// Supabase data service layer untuk semua modul Data Hub, Biodiversity,
// Circular Economy, Goal & Scope, dan Audit Trail.
// Menggantikan semua operasi localStorage yang ada sebelumnya.

import { createClient } from "@/lib/supabase/client"
import type {
  ProductionEntry, MaterialEntry, EnergyEntry, WaterEntry,
  LabEntry, StackEntry, B3Entry, TransportEntry, SupplierEntry,
  DocumentEntry, HubCategory, AnyEntry, AuditLogEntry,
} from "@/lib/datahub"

// Re-export all entry types so consumers can import from this module
export type {
  ProductionEntry, MaterialEntry, EnergyEntry, WaterEntry,
  LabEntry, StackEntry, B3Entry, TransportEntry, SupplierEntry,
  DocumentEntry, HubCategory, AnyEntry, AuditLogEntry,
}

// ─── Table mapping per kategori ───
const TABLE_MAP: Record<HubCategory, string> = {
  production:  "data_hub_production",
  materials:   "data_hub_materials",
  energy:      "data_hub_energy_logs",
  water:       "data_hub_water_logs",
  laboratory:  "data_hub_lab_logs",
  stack:       "data_hub_stack_logs",
  b3:          "data_hub_b3_logs",
  transport:   "data_hub_transport_logs",
  supplier:    "data_hub_suppliers",
  documents:   "data_hub_documents",
}

// ─── Column name mapping (camelCase → snake_case) per table ───
function toDbRow(category: HubCategory, entry: AnyEntry, siteId: string, industryId: string): Record<string, unknown> {
  const base = { id: entry.id, site_id: siteId, industry_id: industryId }

  switch (category) {
    case "production": {
      const e = entry as ProductionEntry
      return { ...base, log_date: e.date, plant: e.plant, line: e.line, product: e.product, qty: e.qty, qty_unit: e.qtyUnit, hours: e.hours, reject_qty: e.rejectQty }
    }
    case "materials": {
      const e = entry as MaterialEntry
      return { ...base, log_date: e.date, material: e.material, supplier: e.supplier, qty: e.qty, unit: e.unit, country_of_origin: e.countryOfOrigin }
    }
    case "energy": {
      const e = entry as EnergyEntry
      return { ...base, log_date: e.date, electricity: e.electricity, diesel: e.diesel, natural_gas: e.naturalGas, coal: e.coal, biomass: e.biomass, steam: e.steam, lpg: e.lpg }
    }
    case "water": {
      const e = entry as WaterEntry
      return { ...base, log_date: e.date, raw_water: e.rawWater, groundwater: e.groundwater, process_water: e.processWater, wastewater: e.wastewater, flow_rate: e.flowRate }
    }
    case "laboratory": {
      const e = entry as LabEntry
      return { ...base, test_date: e.date, sample_point: e.samplePoint, ph: e.ph, cod: e.cod, bod: e.bod, tss: e.tss, nh3: e.nh3, oil_grease: e.oilGrease, phenol: e.phenol, heavy_metals_json: e.heavyMetals }
    }
    case "stack": {
      const e = entry as StackEntry
      return { ...base, test_date: e.date, stack_id: e.stackId, tsp: e.tsp, so2: e.so2, nox: e.nox, co: e.co, opacity: e.opacity, flow_rate: e.flowRate }
    }
    case "b3": {
      const e = entry as B3Entry
      return { ...base, log_date: e.date, waste_type: e.wasteType, waste_code: e.wasteCode, qty: e.qty, storage_duration: e.storageDuration, manifest_no: e.manifestNo, recycler: e.recycler, disposal_company: e.disposalCompany }
    }
    case "transport": {
      const e = entry as TransportEntry
      return { ...base, log_date: e.date, vehicle_type: e.vehicleType, fuel_type: e.fuelType, distance: e.distance, cargo_weight: e.cargoWeight }
    }
    case "supplier": {
      const e = entry as SupplierEntry
      return { ...base, log_date: e.date, supplier_name: e.supplierName, category: e.category, country: e.country, sustainability: e.sustainability, notes: e.notes }
    }
    case "documents": {
      const e = entry as DocumentEntry
      return { ...base, log_date: e.date, doc_type: e.docType, file_name: e.fileName, file_path: e.fileDataUrl, file_size_bytes: e.fileSize, notes: e.notes }
    }
  }
}

function fromDbRow(category: HubCategory, row: Record<string, unknown>): AnyEntry {
  switch (category) {
    case "production":
      return { id: String(row.id), date: String(row.log_date), plant: String(row.plant ?? ""), line: String(row.line ?? ""), product: String(row.product ?? ""), qty: Number(row.qty ?? 0), qtyUnit: String(row.qty_unit ?? "Ton"), hours: Number(row.hours ?? 0), rejectQty: Number(row.reject_qty ?? 0) } as ProductionEntry
    case "materials":
      return { id: String(row.id), date: String(row.log_date), material: String(row.material ?? ""), supplier: String(row.supplier ?? ""), qty: Number(row.qty ?? 0), unit: String(row.unit ?? "Ton"), countryOfOrigin: String(row.country_of_origin ?? "Indonesia") } as MaterialEntry
    case "energy":
      return { id: String(row.id), date: String(row.log_date), electricity: Number(row.electricity ?? 0), diesel: Number(row.diesel ?? 0), naturalGas: Number(row.natural_gas ?? 0), coal: Number(row.coal ?? 0), biomass: Number(row.biomass ?? 0), steam: Number(row.steam ?? 0), lpg: Number(row.lpg ?? 0) } as EnergyEntry
    case "water":
      return { id: String(row.id), date: String(row.log_date), rawWater: Number(row.raw_water ?? 0), groundwater: Number(row.groundwater ?? 0), processWater: Number(row.process_water ?? 0), wastewater: Number(row.wastewater ?? 0), flowRate: Number(row.flow_rate ?? 0) } as WaterEntry
    case "laboratory":
      return { id: String(row.id), date: String(row.test_date), samplePoint: String(row.sample_point ?? ""), ph: Number(row.ph ?? 0), cod: Number(row.cod ?? 0), bod: Number(row.bod ?? 0), tss: Number(row.tss ?? 0), nh3: Number(row.nh3 ?? 0), oilGrease: Number(row.oil_grease ?? 0), phenol: Number(row.phenol ?? 0), heavyMetals: (row.heavy_metals_json as Record<string, number>) ?? {} } as LabEntry
    case "stack":
      return { id: String(row.id), date: String(row.test_date), stackId: String(row.stack_id ?? ""), tsp: Number(row.tsp ?? 0), so2: Number(row.so2 ?? 0), nox: Number(row.nox ?? 0), co: Number(row.co ?? 0), opacity: Number(row.opacity ?? 0), flowRate: Number(row.flow_rate ?? 0) } as StackEntry
    case "b3":
      return { id: String(row.id), date: String(row.log_date), wasteType: String(row.waste_type ?? ""), wasteCode: String(row.waste_code ?? ""), qty: Number(row.qty ?? 0), storageDuration: Number(row.storage_duration ?? 0), manifestNo: String(row.manifest_no ?? ""), recycler: String(row.recycler ?? ""), disposalCompany: String(row.disposal_company ?? "") } as B3Entry
    case "transport":
      return { id: String(row.id), date: String(row.log_date), vehicleType: String(row.vehicle_type ?? "truck"), fuelType: String(row.fuel_type ?? "diesel"), distance: Number(row.distance ?? 0), cargoWeight: Number(row.cargo_weight ?? 0) } as TransportEntry
    case "supplier":
      return { id: String(row.id), date: String(row.log_date), supplierName: String(row.supplier_name ?? ""), category: String(row.category ?? ""), country: String(row.country ?? "Indonesia"), sustainability: String(row.sustainability ?? "none"), notes: String(row.notes ?? "") } as SupplierEntry
    case "documents":
      return { id: String(row.id), date: String(row.log_date), docType: String(row.doc_type ?? ""), fileName: String(row.file_name ?? ""), fileSize: Number(row.file_size_bytes ?? 0), fileDataUrl: String(row.file_path ?? ""), notes: String(row.notes ?? "") } as DocumentEntry
  }
}

// ─── CRUD untuk Data Hub ───

export async function getHubEntries<T extends AnyEntry>(
  category: HubCategory,
  siteId: string,
  _industryId?: string,
): Promise<T[]> {
  const supabase = createClient()
  const table = TABLE_MAP[category]
  const dateCol = category === "laboratory" || category === "stack" ? "test_date" : "log_date"

  let query = supabase.from(table).select("*")
  if (siteId) {
    query = query.eq("site_id", siteId)
  } else if (_industryId) {
    query = query.eq("industry_id", _industryId)
  }

  const { data, error } = await query.order(dateCol, { ascending: false })

  if (error) {
    console.warn(`[DataHub] getHubEntries(${category}):`, error.message)
    return []
  }

  return (data ?? []).map((row) => fromDbRow(category, row as Record<string, unknown>)) as T[]
}

export const DEMO_SITE_ID = "00000000-0000-0000-0000-000000000001"

async function ensureSiteExists(siteId: string): Promise<void> {
  if (!siteId) return
  const supabase = createClient()
  try {
    const { data } = await supabase.from("sites").select("id").eq("id", siteId).maybeSingle()
    if (!data) {
      await supabase.from("sites").upsert({
        id: siteId,
        name: "Pabrik Utama Ciwandan",
        code: "SITE-CIWANDAN",
        city: "Cilegon",
        province: "Banten",
      }, { onConflict: "id" })
    }
  } catch {
    // Ignore
  }
}

export async function saveHubEntry<T extends AnyEntry>(
  category: HubCategory,
  siteId: string,
  industryId: string,
  entry: T,
): Promise<{ error: string | null }> {
  await ensureSiteExists(siteId)
  const supabase = createClient()
  const table = TABLE_MAP[category]
  const dbRow = toDbRow(category, entry, siteId, industryId)

  const { error } = await supabase
    .from(table)
    .upsert(dbRow, { onConflict: "id" })

  if (error) {
    console.warn(`[DataHub] saveHubEntry(${category}):`, error.message)
    return { error: error.message }
  }
  return { error: null }
}

export async function deleteHubEntry(
  category: HubCategory,
  id: string,
): Promise<{ error: string | null }> {
  const supabase = createClient()
  const table = TABLE_MAP[category]

  const { error } = await supabase
    .from(table)
    .delete()
    .eq("id", id)

  if (error) {
    console.warn(`[DataHub] deleteHubEntry(${category}):`, error.message)
    return { error: error.message }
  }
  return { error: null }
}

// ─── Audit Trail ───

export async function writeAuditLogSb(
  siteId: string,
  industryId: string,
  entry: Omit<AuditLogEntry, "id" | "timestamp">,
): Promise<void> {
  await ensureSiteExists(siteId)
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from("audit_trail_logs").insert({
    user_id: user?.id ?? null,
    site_id: siteId,
    industry_id: industryId,
    module_code: entry.module,
    action_type: entry.action,
    payload_snapshot: {
      role: entry.role,
      field: entry.field,
      newValue: entry.newValue,
      source: entry.source,
    },
  })

  if (error) console.warn("[AuditTrail] writeAuditLogSb:", error.message)
}

export async function getAuditLogSb(
  siteId: string,
  _industryId?: string,
  limit = 200,
): Promise<AuditLogEntry[]> {
  const supabase = createClient()

  let query = supabase.from("audit_trail_logs").select("*")
  if (siteId) {
    query = query.eq("site_id", siteId)
  } else if (_industryId) {
    query = query.eq("industry_id", _industryId)
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.warn("[AuditTrail] getAuditLogSb:", error.message)
    return []
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    timestamp: new Date(row.created_at as string).toLocaleString("id-ID", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    }).replace(/\//g, "-"),
    role: String((row.payload_snapshot as Record<string, unknown>)?.role ?? "operator"),
    module: String(row.module_code),
    action: String(row.action_type) as AuditLogEntry["action"],
    field: String((row.payload_snapshot as Record<string, unknown>)?.field ?? row.module_code),
    newValue: String((row.payload_snapshot as Record<string, unknown>)?.newValue ?? ""),
    source: String((row.payload_snapshot as Record<string, unknown>)?.source ?? "measured") as AuditLogEntry["source"],
  }))
}

// ─── Biodiversity ───

export interface BiodiversityRecord {
  id: string
  siteName: string
  conservationAreaHa: number
  protectedFloraCount: number
  protectedFaunaCount: number
  rehabilitationStatus: string
  shannonIndex: number
  partnerInstitution: string
}

export async function getBiodiversityRecords(
  siteId: string,
  industryId: string,
): Promise<BiodiversityRecord[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("biodiversity_logs")
    .select("*")
    .eq("site_id", siteId)
    .eq("industry_id", industryId)
    .order("created_at", { ascending: false })

  if (error) {
    console.warn("[Biodiversity] getBiodiversityRecords:", error.message)
    return []
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    siteName: String(row.site_name ?? ""),
    conservationAreaHa: Number(row.conservation_area_ha ?? 0),
    protectedFloraCount: Number(row.protected_flora_count ?? 0),
    protectedFaunaCount: Number(row.protected_fauna_count ?? 0),
    rehabilitationStatus: String(row.habitat_rehabilitation_status ?? "In Progress"),
    shannonIndex: Number(row.shannon_index ?? 0),
    partnerInstitution: String(row.partner_institution ?? ""),
  }))
}

export async function saveBiodiversityRecord(
  siteId: string,
  industryId: string,
  record: BiodiversityRecord,
): Promise<{ error: string | null }> {
  await ensureSiteExists(siteId)
  const supabase = createClient()

  const { error } = await supabase.from("biodiversity_logs").upsert({
    id: record.id,
    site_id: siteId,
    industry_id: industryId,
    site_name: record.siteName,
    reporting_year: new Date().getFullYear(),
    conservation_area_ha: record.conservationAreaHa,
    protected_flora_count: record.protectedFloraCount,
    protected_fauna_count: record.protectedFaunaCount,
    habitat_rehabilitation_status: record.rehabilitationStatus,
    shannon_index: record.shannonIndex,
    partner_institution: record.partnerInstitution,
    biodiversity_index_score: record.shannonIndex,
  }, { onConflict: "id" })

  if (error) {
    console.warn("[Biodiversity] saveBiodiversityRecord:", error.message)
    return { error: error.message }
  }
  return { error: null }
}

export async function deleteBiodiversityRecord(id: string): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { error } = await supabase.from("biodiversity_logs").delete().eq("id", id)
  if (error) return { error: error.message }
  return { error: null }
}

// ─── Circular Economy ───

export interface CircularFlowRecord {
  id: string
  name: string
  totalKgYear: number
  recycledPct: number
  reusedPct: number
  recoveredPct: number
  landfillPct: number
}

export async function getCircularFlows(
  siteId: string,
  industryId: string,
): Promise<CircularFlowRecord[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("circular_economy_flows")
    .select("*")
    .eq("site_id", siteId)
    .eq("industry_id", industryId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[CircularEconomy] getCircularFlows:", error.message)
    return []
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    name: String(row.name ?? ""),
    totalKgYear: Number(row.total_kg_year ?? 0),
    recycledPct: Number(row.recycled_pct ?? 0),
    reusedPct: Number(row.reused_pct ?? 0),
    recoveredPct: Number(row.recovered_pct ?? 0),
    landfillPct: Number(row.landfill_pct ?? 100),
  }))
}

export async function upsertCircularFlow(
  siteId: string,
  industryId: string,
  flow: CircularFlowRecord,
): Promise<{ error: string | null }> {
  await ensureSiteExists(siteId)
  const supabase = createClient()

  const { error } = await supabase.from("circular_economy_flows").upsert({
    id: flow.id,
    site_id: siteId,
    industry_id: industryId,
    name: flow.name,
    total_kg_year: flow.totalKgYear,
    recycled_pct: flow.recycledPct,
    reused_pct: flow.reusedPct,
    recovered_pct: flow.recoveredPct,
    landfill_pct: flow.landfillPct,
    updated_at: new Date().toISOString(),
  }, { onConflict: "id" })

  if (error) {
    console.error("[CircularEconomy] upsertCircularFlow:", error.message)
    return { error: error.message }
  }
  return { error: null }
}

export async function deleteCircularFlow(id: string): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { error } = await supabase.from("circular_economy_flows").delete().eq("id", id)
  if (error) return { error: error.message }
  return { error: null }
}

// ─── Goal & Scope ───

export interface GoalScopeRecord {
  id?: string
  studyGoal: string
  functionalUnit: string
  boundary: string
  allocation: string
  impactCategories: string[]
  dataQualityReqs: string
  comparativeStudy: boolean
  isLocked: boolean
}

export async function getGoalScope(
  siteId: string,
  industryId: string,
): Promise<GoalScopeRecord | null> {
  const supabase = createClient()

  try {
    let query = supabase.from("lca_goals_scopes").select("*")
    if (siteId) {
      query = query.eq("site_id", siteId)
    } else if (industryId) {
      query = query.eq("industry_id", industryId)
    }

    const { data, error } = await query.order("created_at", { ascending: false }).limit(1).maybeSingle()

    if (error) {
      console.warn("[GoalScope] getGoalScope (Pastikan migration SQL sudah di-run di Supabase Editor):", error.message)
      return null
    }
    if (!data) return null

    return {
      id: String(data.id),
      studyGoal: String(data.study_goal ?? ""),
      functionalUnit: String(data.functionalUnit ?? data.functional_unit ?? ""),
      boundary: String(data.boundary ?? "cradle-to-gate"),
      allocation: String(data.allocation ?? "mass"),
      impactCategories: (data.impact_categories as string[]) ?? ["Global Warming Potential (GWP)"],
      dataQualityReqs: String(data.data_quality_reqs ?? ""),
      comparativeStudy: Boolean(data.comparative_study ?? false),
      isLocked: Boolean(data.is_locked ?? false),
    }
  } catch (err: unknown) {
    console.warn("[GoalScope] Error fetching scope:", err)
    return null
  }
}

export async function saveGoalScope(
  siteId: string,
  industryId: string,
  record: GoalScopeRecord,
): Promise<{ error: string | null }> {
  await ensureSiteExists(siteId)
  const supabase = createClient()

  const payload = {
    site_id: siteId,
    industry_id: industryId,
    study_goal: record.studyGoal,
    functional_unit: record.functionalUnit,
    system_boundary: record.boundary === "cradle-to-gate" ? "cradle_to_gate"
      : record.boundary === "cradle-to-grave" ? "cradle_to_grave"
      : record.boundary === "gate-to-gate" ? "gate_to_gate"
      : "cradle_to_gate",
    boundary: record.boundary,
    allocation_method: record.allocation === "system-expansion" ? "none" : record.allocation as "mass" | "economic" | "energy" | "none",
    allocation: record.allocation,
    impact_categories: record.impactCategories,
    data_quality_reqs: record.dataQualityReqs,
    comparative_study: record.comparativeStudy,
    is_locked: record.isLocked,
  }

  if (record.id) {
    const { error } = await supabase
      .from("lca_goals_scopes")
      .update(payload)
      .eq("id", record.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from("lca_goals_scopes").insert(payload)
    if (error) return { error: error.message }
  }
  return { error: null }
}
