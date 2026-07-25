export type Role = "admin" | "manager" | "operator" | "viewer"

export const ROLE_LABELS: Record<Role, { title: string; subtitle: string; color: string }> = {
  admin: { title: "Admin Korporat", subtitle: "Full Control: Pengaturan Grup Entitas & Kunci Parameter Metodologi ISO", color: "bg-purple-100 text-purple-800 border-purple-200" },
  manager: { title: "Sustainability Manager", subtitle: "Analisis LCA, Penetapan Target Net Zero & Pelaporan OJK/PROPER", color: "bg-blue-100 text-blue-800 border-blue-200" },
  operator: { title: "Operator Site / Staff Input Data", subtitle: "Pusat Ingest Data Operasional (Data Hub: Energi, Limbah, Lab, Berkas)", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  viewer: { title: "Auditor Eksternal / Viewer", subtitle: "Akses Read-Only: Pemantauan Dashboard, Jejak Audit & Ekspor Data Laporan", color: "bg-neutral-100 text-neutral-800 border-neutral-200" },
}

export async function getRoleFromCookie(): Promise<Role | null> {
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()
  const role = cookieStore.get("role")?.value
  if (role === "admin" || role === "manager" || role === "operator" || role === "viewer") return role as Role
  return null
}

export function getRoleClient(): Role | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(/(?:^|;\s*)role=([^;]*)/)
  const role = match?.[1]
  if (role === "admin" || role === "manager" || role === "operator" || role === "viewer") return role as Role
  return null
}

export function canEdit(role: Role | undefined | null): boolean {
  return role === "admin" || role === "manager" || role === "operator"
}

export function canConfigureMethodology(role: Role | undefined | null): boolean {
  return role === "admin" || role === "manager"
}

export function canInputOperationalData(role: Role | undefined | null): boolean {
  return role === "admin" || role === "manager" || role === "operator"
}

export function canManageUsers(role: Role | undefined | null): boolean {
  return role === "admin"
}

export function isReadOnly(role: Role | undefined | null): boolean {
  return role === "viewer" || !role
}


