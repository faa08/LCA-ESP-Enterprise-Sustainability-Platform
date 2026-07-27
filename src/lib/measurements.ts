"use client"

import { useEffect, useState } from "react"
import { useSiteId } from "@/lib/use-site-id"
import { evaluateParam, type ComplianceStatus, type ProperParam } from "@/lib/proper"
import { getHubEntries, type LabEntry, type StackEntry, type B3Entry, type EnergyEntry, type WaterEntry } from "@/lib/supabase/data-service"

export type EvalResult = "empty" | ComplianceStatus

const STORAGE_PREFIX = "enspr_measurements_"

// Translates Data Hub entries into the legacy Key-Value map used by PROPER rank engine
export async function getMeasurementsFromHub(siteId: string, industryId: string): Promise<Record<string, string>> {
  if (!siteId || !industryId) return {}

  const labs = await getHubEntries<LabEntry>("laboratory", siteId, industryId)
  const stacks = await getHubEntries<StackEntry>("stack", siteId, industryId)
  const b3s = await getHubEntries<B3Entry>("b3", siteId, industryId)
  const energy = await getHubEntries<EnergyEntry>("energy", siteId, industryId)
  const water = await getHubEntries<WaterEntry>("water", siteId, industryId)

  const merged: Record<string, string> = {}

  if (labs.length > 0) {
    const avg = (key: keyof LabEntry) => {
      const vals = labs.map(l => Number(l[key] ?? 0)).filter(v => v > 0)
      return vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0
    }
    const ph = avg("ph"); const cod = avg("cod"); const bod = avg("bod"); const tss = avg("tss"); const nh3 = avg("nh3"); const oil = avg("oilGrease")
    if (ph > 0) merged.ph = String(Math.round(ph * 100) / 100)
    if (cod > 0) merged.cod = String(Math.round(cod * 100) / 100)
    if (bod > 0) merged.bod = String(Math.round(bod * 100) / 100)
    if (tss > 0) merged.tss = String(Math.round(tss * 100) / 100)
    if (nh3 > 0) merged.nh3 = String(Math.round(nh3 * 100) / 100)
    if (oil > 0) merged.oil_grease = String(Math.round(oil * 100) / 100)
  }

  if (stacks.length > 0) {
    const avgS = (key: keyof StackEntry) => {
      const vals = stacks.map(s => Number(s[key] ?? 0)).filter(v => v > 0)
      return vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0
    }
    const tsp = avgS("tsp"); const so2 = avgS("so2"); const nox = avgS("nox"); const co = avgS("co"); const opacity = avgS("opacity")
    if (tsp > 0) merged.tsp = String(Math.round(tsp * 10) / 10)
    if (so2 > 0) merged.so2 = String(Math.round(so2 * 10) / 10)
    if (nox > 0) merged.nox = String(Math.round(nox * 10) / 10)
    if (co > 0) merged.co = String(Math.round(co * 10) / 10)
    if (opacity > 0) merged.opacity = String(Math.round(opacity))
  }

  if (b3s.length > 0) {
    const maxStorage = Math.max(...b3s.map(b => b.storageDuration || 0))
    if (maxStorage > 0) merged.b3_storage_days = String(maxStorage)
    const allHaveManifest = b3s.every(b => (b.manifestNo || "").trim().length > 0)
    merged.b3_permit = allHaveManifest ? "365" : "0"
  }

  if (energy.length > 0) { merged.energy_intensity = "true"; merged.ghg_reduction = "true" }
  if (water.length > 0) { merged.water_efficiency = "true" }

  return merged
}

// Read user-entered measurements for an industry (Legacy localStorage mode).
export function getMeasurements(industryId: string | null): Record<string, string> {
  if (!industryId || typeof window === "undefined") return {}
  const stored = localStorage.getItem(STORAGE_PREFIX + industryId)
  if (!stored) return {}
  try {
    return JSON.parse(stored) as Record<string, string>
  } catch {
    return {}
  }
}

export function saveMeasurements(industryId: string, values: Record<string, string>) {
  localStorage.setItem(STORAGE_PREFIX + industryId, JSON.stringify(values))
}

export function clearMeasurements(industryId: string) {
  localStorage.removeItem(STORAGE_PREFIX + industryId)
}

export type MeasureValue = number | boolean | null

// Resolve the effective value for a param from user input only.
// Returns null when nothing has been entered yet (no demo fallback).
export function paramValue(param: ProperParam, measurements: Record<string, string>): MeasureValue {
  const raw = measurements[param.code]
  if (raw === undefined || raw === "") return null
  if (param.kind === "checklist") return raw === "true"
  const n = Number(raw)
  return Number.isNaN(n) ? null : n
}

// Evaluate a param against its entered value, returning "empty" when no data.
export function evaluate(param: ProperParam, measurements: Record<string, string>): { value: MeasureValue; status: EvalResult } {
  const value = paramValue(param, measurements)
  if (value === null) return { value: null, status: "empty" }
  return { value, status: evaluateParam(param, value) }
}

// Hook: live measurements for the current industry (now reactive to Supabase Data Hub).
export function useMeasurements(industryId: string): Record<string, string> {
  const [values, setValues] = useState<Record<string, string>>({})
  const siteId = useSiteId()
  
  useEffect(() => {
    if (!industryId || !siteId || typeof window === "undefined") {
      setValues({})
      return
    }
    
    getMeasurementsFromHub(siteId, industryId).then(setValues).catch(console.error)
  }, [industryId, siteId])

  return values
}

/* ---------- Ingestion log (no demo data; only real imports recorded) ---------- */

export type ImportSource = "manual" | "excel" | "iot" | "erp"
export type ImportStatus = "success" | "failed" | "processing"

export interface ImportLogEntry {
  id: string
  source: ImportSource
  file: string
  module: string
  by: string
  time: string
  status: ImportStatus
  count: number
}

const LOG_PREFIX = "enspr_import_log_"

export function getImportLog(industryId: string | null): ImportLogEntry[] {
  if (!industryId || typeof window === "undefined") return []
  const stored = localStorage.getItem(LOG_PREFIX + industryId)
  if (!stored) return []
  try {
    return JSON.parse(stored) as ImportLogEntry[]
  } catch {
    return []
  }
}

export function recordImport(industryId: string, entry: Omit<ImportLogEntry, "id" | "time">) {
  const log = getImportLog(industryId)
  const now = new Date()
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  log.unshift({ ...entry, id: String(now.getTime()), time })
  localStorage.setItem(LOG_PREFIX + industryId, JSON.stringify(log.slice(0, 50)))
}

// Hook: live import log for the current industry.
export function useImportLog(industryId: string): ImportLogEntry[] {
  const [log, setLog] = useState<ImportLogEntry[]>([])

  useEffect(() => {
    if (!industryId) {
      setLog([])
      return
    }
    const update = () => setLog(getImportLog(industryId))
    update()
    window.addEventListener("storage", update)
    const interval = setInterval(update, 1000)
    return () => {
      window.removeEventListener("storage", update)
      clearInterval(interval)
    }
  }, [industryId])

  return log
}
