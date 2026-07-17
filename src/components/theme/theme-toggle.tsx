"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { t, type Locale } from "@/lib/i18n"
import { id } from "@/locales/id"
import { en } from "@/locales/en"

const dicts: Record<Locale, Record<string, string>> = { id, en }

export function ThemeToggle({ locale }: { locale: Locale }) {
  const { theme, toggle } = useTheme()
  const dict = dicts[locale]
  const next = theme === "dark" ? t(dict, "sidebar.theme.light") : t(dict, "sidebar.theme.dark")

  return (
    <button
      onClick={toggle}
      title={next}
      aria-label={next}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-token bg-surface text-secondary transition-colors hover:border-[color:var(--brand-soft-border)] hover:text-[color:var(--brand)]"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
