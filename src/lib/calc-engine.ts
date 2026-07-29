// src/lib/calc-engine.ts
// ensPR Calculation Engine
// Derives Scope 1/2/3, LCA categories, and Energy KPIs automatically from raw operational data.
// All emission factors are Indonesia-specific defaults (can be refined per industry).
// Respects System Boundary from Goal & Scope (Modul 0) to filter active scopes.

import { getHubEntries, type EnergyEntry, type TransportEntry, type StackEntry, type WaterEntry, type LabEntry } from "@/lib/supabase/data-service"
import { type SystemBoundary, isScopeActive } from "@/lib/boundary-context"

/* ─────────────── Emission Factors ─────────────── */

// Indonesian PLN grid emission factor (kgCO2/kWh) - ESDM 2022
const PLN_GRID_FACTOR = 0.87

// Fuel emission factors (kgCO2e per unit)
const EF = {
  diesel:     2.68,   // kgCO2e/L
  naturalGas: 2.02,   // kgCO2e/Nm3
  coal:       2.42,   // kgCO2e/kg → x1000 for tons
  biomass:    0.0,    // biogenic carbon (counted as 0 for GHG scope)
  lpg:        2.98,   // kgCO2e/kg
  steam:      0.30,   // kgCO2e/ton (if from fossil boiler)
}

// Transport emission factors (kgCO2e per ton-km)
const TRANSPORT_EF = {
  diesel:   0.000096, // truck diesel
  cng:      0.000062,
  electric: 0.000035,
  default:  0.000096,
}

// Energy conversion to MWh
const ENERGY_TO_MWH = {
  electricity: 0.001,    // kWh -> MWh
  diesel:      0.01017,  // L -> MWh (calorific value / 3.6)
  naturalGas:  0.01077,  // Nm3 -> MWh
  coal:        7.0,      // ton -> MWh
  biomass:     4.9,      // ton -> MWh
  steam:       0.698,    // ton -> MWh
  lpg:         0.01386,  // kg -> MWh
}

/* ─────────────── Calculated KPIs Interface ─────────────── */

export interface CalculatedKPIs {
  // Carbon Accounting
  scope1_tCO2e: number        // Direct (fuel combustion)
  scope2_tCO2e: number        // Indirect (purchased electricity)
  scope3_tCO2e: number        // Value chain (transport, upstream)
  total_ghg_tCO2e: number

  // Energy
  energy_total_MWh: number
  energy_renewable_MWh: number
  energy_fossil_MWh: number
  energy_intensity: number    // MWh / production unit (requires production data)
  renewable_pct: number

  // LCA Indicators (simplified, based on available raw data)
  gwp_kgCO2e: number          // Global Warming Potential (= total GHG in kg)
  ap_kgSO2e: number           // Acidification Potential (from SO2, NOx stack emissions)
  ep_kgPO4e: number           // Eutrophication (estimated from wastewater COD/NH3)
  pocp_kgNMVOC: number        // Photochemical Ozone (estimated from VOC, default minimal)
  odp_kgCFC11e: number        // Ozone Depletion (default 0 unless halon refrigerants)
  ht_kg14DB: number           // Human Toxicity (estimated from heavy metals in wastewater)
  fet_kg14DB: number          // Freshwater Ecotoxicity (estimated)
  wud_m3: number              // Water Use Depletion (from water entries)
  adpf_MJ: number             // Abiotic Depletion Fossil (from fossil energy in MJ)
  pm_kgPM25e: number          // Particulate Matter (from TSP stack)

  // Data completeness
  hasData: boolean
  energyEntryCount: number
  transportEntryCount: number
  stackEntryCount: number
}

/* ─────────────── Main Calculation Function ─────────────── */

export function calcEngineFromEntries(
  energyEntries: EnergyEntry[] = [],
  transportEntries: TransportEntry[] = [],
  stackEntries: StackEntry[] = [],
  waterEntries: WaterEntry[] = [],
  labEntries: LabEntry[] = [],
  boundary: SystemBoundary = "cradle-to-grave",
): CalculatedKPIs {
  const safeEnergy = Array.isArray(energyEntries) ? energyEntries : []
  const safeTransport = Array.isArray(transportEntries) ? transportEntries : []
  const safeStack = Array.isArray(stackEntries) ? stackEntries : []
  const safeWater = Array.isArray(waterEntries) ? waterEntries : []
  const safeLab = Array.isArray(labEntries) ? labEntries : []

  const zero: CalculatedKPIs = {
    scope1_tCO2e: 0, scope2_tCO2e: 0, scope3_tCO2e: 0, total_ghg_tCO2e: 0,
    energy_total_MWh: 0, energy_renewable_MWh: 0, energy_fossil_MWh: 0,
    energy_intensity: 0, renewable_pct: 0,
    gwp_kgCO2e: 0, ap_kgSO2e: 0, ep_kgPO4e: 0, pocp_kgNMVOC: 0,
    odp_kgCFC11e: 0, ht_kg14DB: 0, fet_kg14DB: 0, wud_m3: 0,
    adpf_MJ: 0, pm_kgPM25e: 0,
    hasData: false,
    energyEntryCount: 0, transportEntryCount: 0, stackEntryCount: 0,
  }

  if (safeEnergy.length === 0 && safeTransport.length === 0 && safeStack.length === 0) return zero

  // ── Scope 1: Direct combustion ──
  let scope1_kg = 0
  let fossilMWh = 0
  let renewableMWh = 0
  let totalMWh = 0

  const PLN_RENEWABLE_MIX = 0.13 // 13% EBT in national grid

  for (const e of safeEnergy) {
    scope1_kg +=
      (e.diesel      || 0) * EF.diesel +
      (e.naturalGas  || 0) * EF.naturalGas +
      (e.coal        || 0) * 1000 * EF.coal +
      (e.lpg         || 0) * EF.lpg +
      (e.steam       || 0) * EF.steam

    const elecMWh = (e.electricity || 0) * ENERGY_TO_MWH.electricity
    const elecFossilMWh = elecMWh * (1 - PLN_RENEWABLE_MIX)
    const elecRenewableMWh = elecMWh * PLN_RENEWABLE_MIX

    fossilMWh +=
      elecFossilMWh +
      (e.diesel      || 0) * ENERGY_TO_MWH.diesel +
      (e.naturalGas  || 0) * ENERGY_TO_MWH.naturalGas +
      (e.coal        || 0) * ENERGY_TO_MWH.coal +
      (e.lpg         || 0) * ENERGY_TO_MWH.lpg +
      (e.steam       || 0) * ENERGY_TO_MWH.steam

    renewableMWh += elecRenewableMWh + (e.biomass || 0) * ENERGY_TO_MWH.biomass
  }

  totalMWh = fossilMWh + renewableMWh

  // ── Scope 2: Purchased electricity ──
  let scope2_kg = 0
  for (const e of safeEnergy) {
    scope2_kg += (e.electricity || 0) * PLN_GRID_FACTOR
  }

  // ── Scope 3: Transportation ──
  let scope3_kg = 0
  for (const t of safeTransport) {
    const ef = TRANSPORT_EF[t.fuelType as keyof typeof TRANSPORT_EF] ?? TRANSPORT_EF.default
    scope3_kg += (t.distance || 0) * (t.cargoWeight || 0) * ef * 1000
  }

  // ── LCA: Acidification Potential (AP) from stack SO2/NOx ──
  let ap_kg = 0
  let pm_kg = 0
  for (const s of safeStack) {
    const hours = 8760
    ap_kg += ((s.so2 || 0) * 1.0 + (s.nox || 0) * 0.7) * (s.flowRate || 0) * hours / 1e9
    pm_kg += (s.tsp || 0) * (s.flowRate || 0) * hours / 1e9
  }

  // ── LCA: Water Use Depletion ──
  let wud = 0
  for (const w of safeWater) {
    wud += (w.rawWater || 0) + (w.groundwater || 0)
  }

  // ── LCA: Eutrophication (simplified estimate from wastewater) ──
  let ep_kg = 0
  let ht_kg = 0
  for (const l of safeLab) {
    ep_kg += (l.nh3 || 0) * 0.33 / 1000
    ht_kg += (l.phenol || 0) * 0.1 / 1000
  }

  // ── Abiotic Depletion Fossil (in MJ) ──
  const adpf_MJ = fossilMWh * 3600

  // ── Assemble totals (filtered by boundary) ──
  const scope1_t = scope1_kg / 1000
  const scope2_t = isScopeActive(boundary, "scope2") ? scope2_kg / 1000 : 0
  const scope3_t = isScopeActive(boundary, "scope3") ? scope3_kg / 1000 : 0
  const total_t = scope1_t + scope2_t + scope3_t

  return {
    scope1_tCO2e:       +scope1_t.toFixed(3),
    scope2_tCO2e:       +scope2_t.toFixed(3),
    scope3_tCO2e:       +scope3_t.toFixed(3),
    total_ghg_tCO2e:    +total_t.toFixed(3),

    energy_total_MWh:     +totalMWh.toFixed(2),
    energy_renewable_MWh: +renewableMWh.toFixed(2),
    energy_fossil_MWh:    +fossilMWh.toFixed(2),
    energy_intensity:     0,
    renewable_pct:        totalMWh > 0 ? +(renewableMWh / totalMWh * 100).toFixed(1) : 0,

    gwp_kgCO2e:     +(total_t * 1000).toFixed(1),
    ap_kgSO2e:      +ap_kg.toFixed(4),
    ep_kgPO4e:      +ep_kg.toFixed(4),
    pocp_kgNMVOC:   0,
    odp_kgCFC11e:   0,
    ht_kg14DB:      +ht_kg.toFixed(4),
    fet_kg14DB:     +(ht_kg * 0.56).toFixed(4),
    wud_m3:         +wud.toFixed(1),
    adpf_MJ:        +adpf_MJ.toFixed(0),
    pm_kgPM25e:     +pm_kg.toFixed(4),

    hasData: safeEnergy.length > 0 || safeTransport.length > 0 || safeStack.length > 0,
    energyEntryCount:    safeEnergy.length,
    transportEntryCount: safeTransport.length,
    stackEntryCount:     safeStack.length,
  }
}

// Async wrapper that fetches entries from Supabase
export async function calcEngineAsync(siteId: string, industryId: string, boundary: SystemBoundary = "cradle-to-grave"): Promise<CalculatedKPIs> {
  const energyEntries = await getHubEntries<EnergyEntry>("energy", siteId, industryId)
  const transportEntries = await getHubEntries<TransportEntry>("transport", siteId, industryId)
  const stackEntries = await getHubEntries<StackEntry>("stack", siteId, industryId)
  const waterEntries = await getHubEntries<WaterEntry>("water", siteId, industryId)
  const labEntries = await getHubEntries<LabEntry>("laboratory", siteId, industryId)

  return calcEngineFromEntries(energyEntries, transportEntries, stackEntries, waterEntries, labEntries, boundary)
}

// Backward-compatible export: returns zero if called synchronously without entries
export function calcEngine(industryId: string): CalculatedKPIs {
  return calcEngineFromEntries([], [], [], [], [])
}
