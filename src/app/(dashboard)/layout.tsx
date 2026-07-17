import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getRoleFromCookie } from "@/lib/role"
import { getLocaleFromCookie } from "@/lib/i18n"
import { RolePicker } from "@/components/auth/role-picker"
import type { ReactNode } from "react"

export default async function Layout({ children }: { children: ReactNode }) {
  const role = await getRoleFromCookie()
  const locale = await getLocaleFromCookie()

  if (!role) {
    return <RolePicker locale={locale} />
  }

  return (
    <DashboardLayout role={role} locale={locale}>
      {children}
    </DashboardLayout>
  )
}
