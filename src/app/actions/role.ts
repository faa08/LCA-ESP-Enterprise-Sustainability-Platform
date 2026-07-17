"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function setManagerRole() {
  const cookieStore = await cookies()
  cookieStore.set("role", "manager", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  })
  redirect("/dashboard")
}

export async function setViewerRole() {
  const cookieStore = await cookies()
  cookieStore.set("role", "viewer", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  })
  redirect("/dashboard")
}

export async function clearRole() {
  const cookieStore = await cookies()
  cookieStore.delete("role")
  redirect("/dashboard")
}
