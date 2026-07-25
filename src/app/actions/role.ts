"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function setAdminRole() {
  const cookieStore = await cookies()
  cookieStore.set("role", "admin", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  })
  redirect("/dashboard")
}

export async function setManagerRole() {
  const cookieStore = await cookies()
  cookieStore.set("role", "manager", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  })
  redirect("/dashboard")
}

export async function setOperatorRole() {
  const cookieStore = await cookies()
  cookieStore.set("role", "operator", {
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

