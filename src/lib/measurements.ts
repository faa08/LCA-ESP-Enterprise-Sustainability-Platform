"use client"

import { useEffect, useState } from "react"
import type { ProperParam } from "@/lib/proper"

const STORAGE_PREFIX = "enspr_measurements_"

// Read user-entered measurements for an industry, falling back to the
// demo (mock) value on each parameter when nothing has been saved yet.
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

// Resolve the effective value for a param: user input if present, else demo value.
export function paramValue(param: ProperParam, measurements: Record<string, string>): number | boolean {
  const raw = measurements[param.code]
  if (raw === undefined || raw === "") {
    return (param as { mock: number | boolean }).mock
  }
  if (param.kind === "checklist") return raw === "true"
  const n = Number(raw)
  return Number.isNaN(n) ? (param as { mock: number }).mock : n
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
