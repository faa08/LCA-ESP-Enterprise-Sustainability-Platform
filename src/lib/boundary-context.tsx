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
  setBoundary: (b: SystemBoundary) => void
  refreshBoundary: () => Promise<void>
}

const BoundaryContext = createContext<BoundaryContextType>({
  boundary: "cradle-to-gate",
  isLoading: true,
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

  const refreshBoundary = useCallback(async () => {
    if (!siteId) return
    setIsLoading(true)
    try {
      const data = await getGoalScope(siteId, industryId)
      if (data?.boundary) {
        setBoundary(data.boundary as SystemBoundary)
      } else if (typeof window !== "undefined") {
        // fallback: read from localStorage if DB not yet saved
        const stored = localStorage.getItem("enspr_goal_scope")
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed?.boundary) setBoundary(parsed.boundary as SystemBoundary)
        }
      }
    } catch (err) {
      console.warn("[BoundaryContext] Failed to fetch boundary:", err)
      // fallback to localStorage on error
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("enspr_goal_scope")
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (parsed?.boundary) setBoundary(parsed.boundary as SystemBoundary)
          } catch {}
        }
      }
    }
    setIsLoading(false)
  }, [siteId, industryId])


  useEffect(() => {
    refreshBoundary()
  }, [refreshBoundary])

  return (
    <BoundaryContext.Provider value={{ boundary, isLoading, setBoundary, refreshBoundary }}>
      {children}
    </BoundaryContext.Provider>
  )
}
