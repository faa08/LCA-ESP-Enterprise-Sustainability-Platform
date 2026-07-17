"use client"

import { usePathname } from "next/navigation"
import { Bell, Search, Maximize2 } from "lucide-react"
import type { Locale } from "@/lib/i18n"
import { id } from "@/locales/id"
import { en } from "@/locales/en"
import { t } from "@/lib/i18n"

const dicts: Record<Locale, Record<string, string>> = { id, en }

const moduleTitles: Record<string, string> = {
  "/": "sidebar.executive_overview",
  "/environmental-monitoring": "sidebar.environmental",
  "/carbon-accounting": "sidebar.carbon",
  "/lca": "sidebar.lca",
  "/waste-management": "sidebar.waste",
  "/energy-monitoring": "sidebar.energy",
  "/water-monitoring": "sidebar.water",
  "/compliance": "sidebar.compliance",
  "/ai-insights": "sidebar.ai",
  "/esg-reporting": "sidebar.esg",
  "/documents": "sidebar.documents",
  "/settings": "sidebar.settings",
}

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const dict = dicts[locale]
  const titleKey = moduleTitles[pathname]
  const title = titleKey ? t(dict, titleKey) : "SIP"

  function switchLang(lang: string) {
    document.cookie = `lang=${lang}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
    window.location.href = pathname + "?t=" + Date.now()
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-neutral-200 bg-white/80 backdrop-blur-md px-6">
      <div>
        <h1 className="text-base font-semibold text-neutral-900">{title}</h1>
        <p className="text-xs text-neutral-500">{t(dict, "header.subtitle")}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5">
          <button
            onClick={() => switchLang("id")}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              locale === "id" ? "bg-emerald-600 text-white" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            ID
          </button>
          <button
            onClick={() => switchLang("en")}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              locale === "en" ? "bg-emerald-600 text-white" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            EN
          </button>
        </div>

        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
          <Search className="h-4 w-4" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
          <Maximize2 className="h-4 w-4" />
        </button>
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
      </div>
    </header>
  )
}
