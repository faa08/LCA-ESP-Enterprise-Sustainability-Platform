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
