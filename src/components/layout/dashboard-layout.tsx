"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
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
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role={role} locale={locale} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header locale={locale} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
