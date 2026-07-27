"use client"

import { useState, useEffect } from "react"
import { useSiteId } from "@/lib/use-site-id"
import { getSiteIndustry } from "@/lib/supabase/data-service"

// SSR-safe hook untuk get industryId.
// Source of truth: Supabase (kolom industry_type di tabel sites).
// localStorage digunakan sebagai cache instan untuk menghindari flash kosong.
export function useIndustryId(): string {
  const siteId = useSiteId()
  const [industryId, setIndustryId] = useState<string>("")

  useEffect(() => {
    // Load from cache first for instant UI update
    const cached = localStorage.getItem("enspr_industry")
    if (cached) setIndustryId(cached)

    if (!siteId) return

    // Fetch dari Supabase, update state & cache localStorage
    getSiteIndustry(siteId).then(industry => {
      if (industry) setIndustryId(industry)
    })
  }, [siteId])

  return industryId
}
