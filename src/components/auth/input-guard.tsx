import { redirect } from "next/navigation"
import { getRoleFromCookie } from "@/lib/role"

export default async function InputPageGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const role = await getRoleFromCookie()
  if (!role || role === "viewer") redirect("/select-role")
  return <>{children}</>
}
