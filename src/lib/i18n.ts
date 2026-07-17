import { id } from "@/locales/id"
import { en } from "@/locales/en"

export type Locale = "id" | "en"

const dictionaries: Record<Locale, Record<string, string>> = { id, en }

export async function getDictionary(locale: Locale): Promise<Record<string, string>> {
  return dictionaries[locale] ?? id
}

export async function getLocaleFromCookie(): Promise<Locale> {
  const { cookies } = await import("next/headers")
  const cookieStore = await cookies()
  const lang = cookieStore.get("lang")?.value
  if (lang === "en" || lang === "id") return lang
  return "id"
}

export function t(dict: Record<string, string>, key: string, fallback?: string): string {
  return dict[key] ?? fallback ?? key
}

export function getLocaleClient(): Locale {
  if (typeof document === "undefined") return "id"
  const match = document.cookie.match(/(?:^|;\s*)lang=([^;]*)/)
  const lang = match?.[1]
  if (lang === "en" || lang === "id") return lang
  return "id"
}
