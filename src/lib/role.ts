export type Role = "admin" | "manager" | "viewer"

export async function getRoleFromCookie(): Promise<Role | null> {
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()
  const role = cookieStore.get("role")?.value
  if (role === "admin" || role === "manager" || role === "viewer") return role as Role
  return null
}

export function canEdit(role: Role | undefined | null): boolean {
  return role === "admin" || role === "manager"
}
