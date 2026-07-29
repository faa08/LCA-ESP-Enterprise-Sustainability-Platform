"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Bell, Search, ChevronRight, ChevronDown, User, Settings as SettingsIcon, LogOut, Printer, Briefcase, Wrench, BookOpen } from "lucide-react"
import type { Locale } from "@/lib/i18n"
import { id } from "@/locales/id"
import { en } from "@/locales/en"
import { t } from "@/lib/i18n"
import { clearRole } from "@/app/actions/role"
import { getRoleClient, ROLE_LABELS } from "@/lib/role"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { PrintableProperReportModal } from "@/components/dashboard/printable-proper-report"
import { useViewMode } from "@/lib/use-view-mode"
import { useHelp } from "@/lib/help-context"

import type { Role } from "@/lib/role"

const dicts: Record<Locale, Record<string, string>> = { id, en }

const moduleTitles: Record<string, string> = {
  "/dashboard": "sidebar.executive_overview",
  "/dashboard/data-hub": "sidebar.data_hub",
  "/dashboard/environmental-monitoring": "sidebar.environmental",
  "/dashboard/carbon-accounting": "sidebar.carbon",
  "/dashboard/lca": "sidebar.lca",
  "/dashboard/waste-management": "sidebar.waste",
  "/dashboard/energy-monitoring": "sidebar.energy",
  "/dashboard/water-monitoring": "sidebar.water",
  "/dashboard/compliance": "sidebar.compliance",
  "/dashboard/ai-insights": "sidebar.ai",
  "/dashboard/esg-reporting": "sidebar.esg",
  "/dashboard/documents": "sidebar.documents",
  "/dashboard/settings": "sidebar.settings",
}

const groupFor: Record<string, string> = {
  "/dashboard/data-hub": "sidebar.data_management",
}

const notifications: { id: number; title: string; desc: string; tone: string }[] = []

export function Header({ locale, role: propRole }: { locale: Locale; role?: Role | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const dict = dicts[locale]
  const titleKey = moduleTitles[pathname]
  const title = titleKey ? t(dict, titleKey) : "ensPR"
  const groupKey = groupFor[pathname]

  const [activeRole, setActiveRole] = useState<Role | null>(propRole ?? null)

  useEffect(() => {
    const clientRole = getRoleClient()
    if (clientRole) setActiveRole(clientRole)
    else if (propRole) setActiveRole(propRole)
  }, [propRole])

  const role = activeRole ?? propRole
  const roleLabel = role ? (ROLE_LABELS[role]?.title ?? role) : "—"
  const roleInitials = role ? role.slice(0, 2).toUpperCase() : "??"

  const [search, setSearch] = useState("")
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [viewMode, setViewMode] = useViewMode()
  const { toggleHelp } = useHelp()
  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  function switchLang(lang: string) {
    document.cookie = `lang=${lang}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
    window.location.href = pathname + "?t=" + Date.now()
  }

  async function signOut() {
    await clearRole()
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-token bg-surface/80 backdrop-blur-md px-6">
      <div className="flex min-w-0 items-center gap-3">
        <nav className="flex items-center gap-1 text-xs text-muted">
          <Link href="/dashboard" className="transition-colors hover:text-[color:var(--brand)]">
            {t(dict, "datahub.breadcrumb.home")}
          </Link>
          {groupKey && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <span>{t(dict, groupKey)}</span>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-primary">{title}</span>
        </nav>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2.5">
        {/* Role View Mode Switcher */}
        <div className="hidden items-center gap-0.5 rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 sm:flex">
          <button
            onClick={() => setViewMode("executive")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
              viewMode === "executive" ? "bg-white text-emerald-800 shadow-xs" : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            <Briefcase className="h-3.5 w-3.5" /> Exec View
          </button>
          <button
            onClick={() => setViewMode("engineer")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
              viewMode === "engineer" ? "bg-white text-emerald-800 shadow-xs" : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            <Wrench className="h-3.5 w-3.5" /> EHS View
          </button>
        </div>

        {/* Print Official PROPER & LCA Report Button */}
        <button
          onClick={() => setIsReportOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-100"
        >
          <Printer className="h-3.5 w-3.5 text-emerald-600" /> Cetak Laporan PDF
        </button>

        <div className="flex items-center gap-0.5 rounded-lg border border-token bg-surface p-0.5">
          <button
            onClick={() => switchLang("id")}
            className={cn(
              "rounded-md px-2 py-1 text-xs font-medium transition-colors",
              locale === "id"
                ? "bg-[color:var(--brand)] text-white"
                : "text-muted hover:text-primary",
            )}
          >
            ID
          </button>
          <button
            onClick={() => switchLang("en")}
            className={cn(
              "rounded-md px-2 py-1 text-xs font-medium transition-colors",
              locale === "en"
                ? "bg-[color:var(--brand)] text-white"
                : "text-muted hover:text-primary",
            )}
          >
            EN
          </button>
        </div>

        {/* Help / Tutorial Button */}
        <button
          onClick={toggleHelp}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-emerald-700 transition-colors hover:bg-emerald-100 hover:text-emerald-800"
          title="Panduan Pengisian"
        >
          <BookOpen className="h-4 w-4" />
          <span className="text-xs font-semibold hidden sm:inline">Panduan</span>
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-token bg-surface text-secondary transition-colors hover:border-[color:var(--brand-soft-border)] hover:text-[color:var(--brand)]"
          >
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-surface" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-xl border border-token bg-surface shadow-lg">
              <div className="border-b border-token px-4 py-3 text-sm font-semibold text-primary">
                {t(dict, "datahub.notifications.title")}
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-xs text-muted">
                  Tidak ada notifikasi baru
                </div>
              ) : (
                <ul className="max-h-72 divide-y divide-[color:var(--border-subtle)] overflow-y-auto">
                  {notifications.map((n) => (
                    <li key={n.id} className="flex gap-3 px-4 py-3">
                      <span
                        className={cn(
                          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                          n.tone === "success" && "bg-emerald-500",
                          n.tone === "danger" && "bg-red-500",
                          n.tone === "info" && "bg-sky-500",
                        )}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-primary">{n.title}</p>
                        <p className="truncate text-xs text-muted">{n.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-token bg-surface py-1 pl-1 pr-2 transition-colors hover:border-[color:var(--brand-soft-border)]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-xs font-semibold text-[color:var(--brand)]">
              {roleInitials}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted" />
          </button>
          {userOpen && (
            <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-token bg-surface py-1 shadow-lg">
              <div className="border-b border-token px-3 py-2">
                <p className="text-sm font-medium text-primary">{roleLabel}</p>
                <p className="text-xs text-muted">{role ?? "—"}</p>
              </div>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2 px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface-2 hover:text-primary"
              >
                <User className="h-4 w-4" /> {t(dict, "datahub.user.profile")}
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2 px-3 py-2 text-sm text-secondary transition-colors hover:bg-surface-2 hover:text-primary"
              >
                <SettingsIcon className="h-4 w-4" /> {t(dict, "datahub.user.settings")}
              </Link>
              <button
                onClick={signOut}
                className="flex w-full items-center gap-2 border-t border-token px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> {t(dict, "datahub.user.signout")}
              </button>
            </div>
          )}
        </div>
      </div>
      <PrintableProperReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </header>
  )
}
