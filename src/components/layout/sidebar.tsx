"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { clearRole } from "@/app/actions/role"
import { t, type Locale } from "@/lib/i18n"
import { id } from "@/locales/id"
import { en } from "@/locales/en"
import { type Role, ROLE_LABELS } from "@/lib/role"
import { useBoundary, isScopeActive, type GHGScope } from "@/lib/boundary-context"
import {
  LayoutDashboard,
  Cpu,
  BarChart3,
  Leaf,
  Zap,
  Droplets,
  Recycle,
  ShieldCheck,
  FolderOpen,
  BadgeDollarSign,
  Lightbulb,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Database,
  PencilLine,
  Target,
  Building2,
  Package,
  Truck,
  RefreshCcw,
  Globe2,
  ClipboardList,
  FileOutput,
  type LucideIcon,
} from "lucide-react"

const dicts: Record<Locale, Record<string, string>> = { id, en }

type NavItem = {
  labelKey: string
  href: string
  icon: LucideIcon
  allowedRoles?: Role[]
  /** Jika true, item hanya muncul setelah Goal & Scope dikonfigurasi */
  requiresConfigured?: boolean
  /** Jika true, item hanya muncul setelah Hitung diklik di Data Hub */
  requiresCalculated?: boolean
  /** Jika diisi, item hanya muncul saat scope ini aktif */
  requiredScope?: GHGScope
}

type NavGroup = {
  label: string
  allowedRoles?: Role[]
  /** Jika true, seluruh grup hanya muncul setelah Goal & Scope dikonfigurasi */
  requiresConfigured?: boolean
  /** Jika true, seluruh grup hanya muncul setelah Hitung diklik di Data Hub */
  requiresCalculated?: boolean
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: "EXECUTIVE",
    items: [
      { labelKey: "sidebar.executive_overview", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "FONDASI LCA",
    items: [
      { labelKey: "sidebar.goal_scope", href: "/dashboard/goal-scope", icon: Target },
      { labelKey: "sidebar.company_profile", href: "/dashboard/company-profile", icon: Building2, requiresConfigured: true },
      { labelKey: "sidebar.product_assessment", href: "/dashboard/product-assessment", icon: Package, requiresConfigured: true },
      { labelKey: "sidebar.data_hub", href: "/dashboard/data-hub", icon: Database, requiresConfigured: true, allowedRoles: ["admin", "manager", "operator"] },
    ],
  },
  {
    label: "INVENTORI & DAMPAK",
    requiresCalculated: true,
    items: [
      { labelKey: "sidebar.energy", href: "/dashboard/energy-monitoring", icon: Zap },
      { labelKey: "sidebar.waste", href: "/dashboard/waste-management", icon: Recycle },
      { labelKey: "sidebar.transportation", href: "/dashboard/transportation", icon: Truck, requiredScope: "scope3" },
      { labelKey: "sidebar.lca", href: "/dashboard/lca", icon: Cpu },
      { labelKey: "sidebar.carbon", href: "/dashboard/carbon-accounting", icon: BarChart3 },
    ],
  },
  {
    label: "PELAPORAN & KEPATUHAN",
    requiresCalculated: true,
    items: [
      { labelKey: "sidebar.circular_economy", href: "/dashboard/circular-economy", icon: RefreshCcw },
      { labelKey: "sidebar.biodiversity", href: "/dashboard/biodiversity", icon: Leaf },
      { labelKey: "sidebar.compliance", href: "/dashboard/compliance", icon: ShieldCheck },
      { labelKey: "sidebar.esg", href: "/dashboard/esg-reporting", icon: Lightbulb },
      { labelKey: "sidebar.sdgs", href: "/dashboard/sdgs", icon: Globe2 },
      { labelKey: "sidebar.audit_trail", href: "/dashboard/audit-trail", icon: ClipboardList },
      { labelKey: "sidebar.reporting", href: "/dashboard/reporting", icon: FileOutput },
    ],
  },
  {
    label: "DATA & SYSTEM",
    items: [
      { labelKey: "sidebar.settings", href: "/dashboard/settings", icon: Settings, allowedRoles: ["admin", "manager"] },
    ],
  },
]

const roleLabels: Record<Role, string> = {
  admin: "role.admin",
  manager: "role.manager",
  operator: "role.operator",
  viewer: "role.viewer",
}

const roleBadge: Record<Role, string> = {
  admin: "bg-purple-100 text-purple-700",
  manager: "bg-blue-100 text-blue-700",
  operator: "bg-emerald-100 text-emerald-700",
  viewer: "bg-slate-100 text-slate-600",
}

function isActive(href: string, pathname: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname.startsWith(href)
}

export function Sidebar({
  role,
  locale,
  collapsed,
  onToggle,
}: {
  role: Role | null
  locale: Locale
  collapsed: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const dict = dicts[locale]
  const [hovered, setHovered] = useState(false)
  const isCollapsed = collapsed && !hovered
  const { isConfigured, boundary, isCalculated } = useBoundary()

  const visibleGroups = navGroups
    .map((g) => {
      // Sembunyikan seluruh grup jika requiresConfigured & belum dikonfigurasi
      if (g.requiresConfigured && !isConfigured) {
        return { ...g, items: [] }
      }
      if (g.requiresCalculated && !isCalculated) {
        return { ...g, items: [] }
      }
      // Filter per role
      if (g.allowedRoles && role && !g.allowedRoles.includes(role)) {
        return { ...g, items: [] }
      }
      const filteredItems = g.items.filter((item) => {
        // Filter per role
        if (item.allowedRoles && role && !item.allowedRoles.includes(role)) return false
        // Sembunyikan item yang butuh Goal & Scope jika belum dikonfigurasi
        if (item.requiresConfigured && !isConfigured) return false
        if (item.requiresCalculated && !isCalculated) return false
        // Sembunyikan item yang butuh scope tertentu jika scope tidak aktif
        if (item.requiredScope && !isScopeActive(boundary, item.requiredScope)) return false
        return true
      })
      return { ...g, items: filteredItems }
    })
    .filter((g) => g.items.length > 0)

  const handleSwitch = useCallback(async () => {
    await clearRole()
    router.refresh()
  }, [router])

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: isCollapsed ? "72px" : "280px" }}
      className={cn(
        "sticky top-0 z-40 flex h-screen shrink-0 flex-col border-r bg-surface transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[width]",
        "border-token",
      )}
    >
      {/* Logo */}
      <div className={cn("flex h-16 shrink-0 items-center border-b border-token overflow-hidden", isCollapsed ? "justify-center" : "px-5")}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-emerald-600">
            <Leaf className="h-[18px] w-[18px] text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <div className="text-[15px] font-semibold leading-tight text-primary">{t(dict, "brand.name")}</div>
              <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">{t(dict, "brand.subtitle")}</div>
            </div>
          )}
        </div>
      </div>

      {/* Tagline */}
      {!isCollapsed && (
        <div className="shrink-0 border-b border-token py-2.5">
          <div className="px-5">
            <div className="text-[11px] font-medium leading-snug text-muted">{t(dict, "sidebar.subtitle")}</div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        {/* Setup Hint Banner — muncul saat Goal & Scope belum dikonfigurasi */}
        {!isConfigured && !isCollapsed && (
          <Link href="/dashboard/goal-scope" className="block mb-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[11px] text-emerald-800 hover:border-emerald-300 transition-colors">
              <p className="font-bold text-emerald-900 mb-0.5">⚡ Mulai di sini</p>
              <p className="leading-snug text-emerald-700">Lengkapi <b>Goal &amp; Scope</b> untuk membuka semua modul LCA</p>
            </div>
          </Link>
        )}
        {/* Calc Hint Banner — muncul jika sudah dikonfigurasi tapi belum dihitung */}
        {isConfigured && !isCalculated && !isCollapsed && (
          <Link href="/dashboard/data-hub" className="block mb-4">
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-[11px] text-blue-800 hover:border-blue-300 transition-colors">
              <p className="font-bold text-blue-900 mb-0.5">🚀 Hitung Data</p>
              <p className="leading-snug text-blue-700">Masukkan data operasional di <b>Data Hub</b> lalu tekan Hitung untuk membuka modul analitik M3-M14.</p>
            </div>
          </Link>
        )}
        {visibleGroups.map((group, gi) => (

          <div key={group.label} className={gi > 0 ? (isCollapsed ? "mt-3" : "mt-5") : ""}>
            {!isCollapsed && (
              <div className="mb-1.5 px-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{group.label}</div>
              </div>
            )}

            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, pathname)
                return (
                  <li key={item.href} className="group relative">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-xl py-2.5 text-sm font-medium transition-colors duration-150",
                        isCollapsed ? "justify-center" : "gap-3 px-3",
                        active
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-muted hover:bg-surface-2 hover:text-primary",
                      )}
                    >
                      <div className={cn("flex h-5 w-5 shrink-0 items-center justify-center", active ? "text-emerald-600" : "text-muted")}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      {!isCollapsed && (
                        <span>{t(dict, item.labelKey)}</span>
                      )}

                      {active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-emerald-600"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="shrink-0 border-t border-token">
        {!isCollapsed && (
          <div className="flex items-center px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold text-muted">
                {role ? role.slice(0, 2).toUpperCase() : "??"}
              </div>
              <div className="flex min-w-0 items-center gap-2">
                <div className="truncate">
                  <div className="text-sm font-medium text-primary">
                    {ROLE_LABELS[role ?? "viewer"]?.title ?? role}
                  </div>
                  {role ? (
                    <span className={cn("inline-block rounded px-1.5 py-0.5 text-[10px] font-medium", roleBadge[role])}>
                      {ROLE_LABELS[role]?.title || t(dict, roleLabels[role])}
                    </span>
                  ) : null}
                </div>
                <button
                  onClick={handleSwitch}
                  title={t(dict, "sidebar.switch_role")}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-muted"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="flex justify-center px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-bold text-muted">
              {role === "admin" ? "AD" : role === "manager" ? "MN" : role === "operator" ? "OP" : "VW"}
            </div>
          </div>
        )}

        <div className={cn("border-t border-token px-3 py-2", isCollapsed ? "flex justify-center" : "")}>
          <button
            onClick={onToggle}
            title={t(dict, isCollapsed ? "sidebar.expand" : "sidebar.collapse")}
            className={cn(
              "flex items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-muted",
              isCollapsed ? "justify-center p-2" : "gap-2 px-3 py-2 w-full",
            )}
          >
            {isCollapsed ? (
              <PanelLeft className="h-4 w-4 shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4 shrink-0" />
                <span className="text-xs font-medium">{t(dict, "sidebar.collapse")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}
