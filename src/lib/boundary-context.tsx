"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { getGoalScope } from "@/lib/supabase/data-service"
import { useSiteId } from "@/lib/use-site-id"
import { useIndustryId } from "@/lib/use-industry-id"

// ─── Types ───

export type SystemBoundary = "cradle-to-gate" | "cradle-to-grave" | "gate-to-gate" | "cradle-to-cradle"
export type GHGScope = "scope1" | "scope2" | "scope3"
export type HubCategoryKey = "production" | "materials" | "energy" | "water" | "laboratory" | "stack" | "b3" | "transport" | "supplier" | "documents"

// ─── Boundary → Scope Mapping ───

export const BOUNDARY_SCOPE_MAP: Record<SystemBoundary, GHGScope[]> = {
  "gate-to-gate":      ["scope1"],
  "cradle-to-gate":    ["scope1", "scope2"],
  "cradle-to-grave":   ["scope1", "scope2", "scope3"],
  "cradle-to-cradle":  ["scope1", "scope2", "scope3"],
}

// ─── Boundary → Data Hub Category Visibility ───

const ALWAYS_VISIBLE: HubCategoryKey[] = ["production", "energy", "water", "laboratory", "stack", "b3", "documents"]

export const BOUNDARY_CATEGORY_MAP: Record<SystemBoundary, HubCategoryKey[]> = {
  "gate-to-gate":     [...ALWAYS_VISIBLE],
  "cradle-to-gate":   [...ALWAYS_VISIBLE, "materials", "supplier"],
  "cradle-to-grave":  [...ALWAYS_VISIBLE, "materials", "supplier", "transport"],
  "cradle-to-cradle": [...ALWAYS_VISIBLE, "materials", "supplier", "transport"],
}

// ─── Helper Functions ───

export function isScopeActive(boundary: SystemBoundary, scope: GHGScope): boolean {
  return BOUNDARY_SCOPE_MAP[boundary].includes(scope)
}

export function isCategoryVisible(boundary: SystemBoundary, category: HubCategoryKey): boolean {
  return BOUNDARY_CATEGORY_MAP[boundary].includes(category)
}

export function getBoundaryLabel(boundary: SystemBoundary): string {
  const labels: Record<SystemBoundary, string> = {
    "gate-to-gate": "Gate-to-Gate",
    "cradle-to-gate": "Cradle-to-Gate",
    "cradle-to-grave": "Cradle-to-Grave",
    "cradle-to-cradle": "Cradle-to-Cradle",
  }
  return labels[boundary]
}

export function getActiveScopes(boundary: SystemBoundary): string {
  const scopes = BOUNDARY_SCOPE_MAP[boundary]
  return scopes.map(s => s.replace("scope", "Scope ")).join(" + ")
}

// ─── Context ───

interface BoundaryContextType {
  boundary: SystemBoundary
  isLoading: boolean
  /** true setelah Goal & Scope (M0) tersimpan — digunakan untuk progressive sidebar disclosure */
  isConfigured: boolean
  setBoundary: (b: SystemBoundary) => void
  refreshBoundary: () => Promise<void>
}

const BoundaryContext = createContext<BoundaryContextType>({
  boundary: "cradle-to-gate",
  isLoading: true,
  isConfigured: false,
  setBoundary: () => {},
  refreshBoundary: async () => {},
})

export function useBoundary() {
  return useContext(BoundaryContext)
}

// ─── Provider ───

export function BoundaryProvider({ children }: { children: ReactNode }) {
  const siteId = useSiteId()
  const industryId = useIndustryId()
  const [boundary, setBoundary] = useState<SystemBoundary>("cradle-to-gate")
  const [isLoading, setIsLoading] = useState(true)
  const [isConfigured, setIsConfigured] = useState(false)

  const refreshBoundary = useCallback(async () => {
    if (!siteId) return
    setIsLoading(true)
    let configured = false
    try {
      const data = await getGoalScope(siteId, industryId)
      if (data?.boundary) {
        setBoundary(data.boundary as SystemBoundary)
      } else if (typeof window !== "undefined") {
        const stored = localStorage.getItem("enspr_goal_scope")
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed?.boundary) setBoundary(parsed.boundary as SystemBoundary)
        }
      }
      // isConfigured: true jika studyGoal atau functionalUnit sudah diisi
      if (data?.studyGoal || data?.functionalUnit) {
        configured = true
      } else if (typeof window !== "undefined") {
        const stored = localStorage.getItem("enspr_goal_scope")
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (parsed?.studyGoal || parsed?.functionalUnit) configured = true
          } catch {}
        }
      }
    } catch (err) {
      console.warn("[BoundaryContext] Failed to fetch boundary:", err)
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("enspr_goal_scope")
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (parsed?.boundary) setBoundary(parsed.boundary as SystemBoundary)
            if (parsed?.studyGoal || parsed?.functionalUnit) configured = true
          } catch {}
        }
      }
    }
    setIsConfigured(configured)
    setIsLoading(false)
  }, [siteId, industryId])


  useEffect(() => {
    refreshBoundary()
  }, [refreshBoundary])

  return (
    <BoundaryContext.Provider value={{ boundary, isLoading, isConfigured, setBoundary, refreshBoundary }}>
      {children}
    </BoundaryContext.Provider>
  )
}
