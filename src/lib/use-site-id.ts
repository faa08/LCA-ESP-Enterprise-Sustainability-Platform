"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

// SSR-safe hook untuk get site_id dari user_profiles di Supabase.
// Fallback ke DEMO_SITE_ID jika user belum punya site (pengembangan lokal).
export const DEMO_SITE_ID = "00000000-0000-0000-0000-000000000001"

export function useSiteId(): string {
  const [siteId, setSiteId] = useState<string>(DEMO_SITE_ID)

  useEffect(() => {
    const fetchSiteId = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          const { data } = await supabase
            .from("user_profiles")
            .select("site_id")
            .eq("id", user.id)
            .single()

          if (data?.site_id) {
            setSiteId(data.site_id)
            return
          }
        }

        // Cari site pertama dari tabel sites
        const { data: sites } = await supabase
          .from("sites")
          .select("id")
          .limit(1)

        if (sites && sites.length > 0) {
          setSiteId(sites[0].id)
        } else {
          // Buat baris demo site otomatis jika tabel sites kosong
          await supabase.from("sites").upsert({
            id: DEMO_SITE_ID,
            name: "Pabrik Utama Ciwandan",
            code: "SITE-CIWANDAN",
            city: "Cilegon",
            province: "Banten",
          }, { onConflict: "id" })
        }
      } catch {
        // Fallback ke DEMO_SITE_ID
      }
    }
    fetchSiteId()
  }, [])

  return siteId
}
