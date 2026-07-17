"use server"

import { cookies } from "next/headers"

export async function setLanguage(formData: FormData) {
  const lang = formData.get("lang") as string
  if (lang !== "id" && lang !== "en") return

  const cookieStore = await cookies()
  cookieStore.set("lang", lang, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  })
}
