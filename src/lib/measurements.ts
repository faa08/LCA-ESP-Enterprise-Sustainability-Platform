"use client"

import { useEffect, useState } from "react"
import { evaluateParam, type ComplianceStatus, type ProperParam } from "@/lib/proper"

export type EvalResult = "empty" | ComplianceStatus

const STORAGE_PREFIX = "enspr_measurements_"

// Read user-entered measurements for an industry.
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

// Hook: live measurements for the current industry (reactive to storage changes).
export function useMeasurements(industryId: string): Record<string, string> {
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!industryId) {
      setValues({})
      return
    }
    const stored = localStorage.getItem(STORAGE_PREFIX + industryId)
    setValues(stored ? JSON.parse(stored) : {})
  }, [industryId])

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
