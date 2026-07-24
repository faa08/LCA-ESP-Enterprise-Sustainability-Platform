"use client"

import { useState, useEffect } from "react"

export type ViewMode = "executive" | "engineer"

export function useViewMode() {
  const [viewMode, setViewModeState] = useState<ViewMode>("executive")

  useEffect(() => {
    const stored = localStorage.getItem("enspr_view_mode") as ViewMode | null
    if (stored === "engineer" || stored === "executive") {
      setViewModeState(stored)
    }

    const handler = () => {
      const current = localStorage.getItem("enspr_view_mode") as ViewMode | null
      if (current) setViewModeState(current)
    }

    window.addEventListener("storage", handler)
    window.addEventListener("view_mode_changed", handler)
    return () => {
      window.removeEventListener("storage", handler)
      window.removeEventListener("view_mode_changed", handler)
    }
  }, [])

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode)
    localStorage.setItem("enspr_view_mode", mode)
    window.dispatchEvent(new Event("view_mode_changed"))
  }

  return [viewMode, setViewMode] as const
}
