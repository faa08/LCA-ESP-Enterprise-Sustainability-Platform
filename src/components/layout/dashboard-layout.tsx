"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { BoundaryProvider } from "@/lib/boundary-context"
import { HelpProvider } from "@/lib/help-context"
import { NotificationProvider } from "@/lib/notification-context"
import { HelpDrawer } from "@/components/layout/help-drawer"
import type { ReactNode } from "react"
import type { Role } from "@/lib/role"
import type { Locale } from "@/lib/i18n"

interface DashboardLayoutProps {
  children: ReactNode
  role: Role | null
  locale: Locale
}

export function DashboardLayout({ children, role, locale }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <NotificationProvider>
      <HelpProvider>
        <BoundaryProvider>
        <div className="flex min-h-screen bg-app">
          <Sidebar role={role} locale={locale} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
          <div className="flex min-w-0 flex-1 flex-col">
            <Header locale={locale} role={role} />
          <main className="flex-1 space-y-6 p-6">
            {role === "viewer" && (
              <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 shadow-2xs">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-200">
                  <span className="font-bold text-xs text-neutral-700">READ</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900">Akses Read-Only Auditor / Viewer Eksternal</p>
                  <p className="text-[11px] text-neutral-500">Anda masuk sebagai Auditor Eksternal / Viewer. Fitur input data operasional dan konfigurasi dinonaktifkan. Akses terbatas untuk pemantauan data, verifikasi jejak audit (Modul 12), dan ekspor laporan PDF (Modul 13).</p>
                </div>
              </div>
            )}
            {children}
          </main>
        </div>
        <HelpDrawer />
      </div>
      </BoundaryProvider>
      </HelpProvider>
    </NotificationProvider>
  )
}

