"use client"

import { useState, useEffect } from "react"

// SSR-safe read of the selected industry from localStorage.
// Defaults to "" on both server and first client render to avoid hydration mismatch,
// then loads the real value in an effect (client-only).
export function useIndustryId(): string {
  const [industryId, setIndustryId] = useState<string>("")

  useEffect(() => {
    const stored = localStorage.getItem("enspr_industry")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setIndustryId(stored)
  }, [])

  return industryId
}
