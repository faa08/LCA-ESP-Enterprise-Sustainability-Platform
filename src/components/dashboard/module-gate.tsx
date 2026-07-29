"use client"

import Link from "next/link"
import { Lock, ArrowRight, AlertCircle, Target } from "lucide-react"
import { useBoundary, isScopeActive, getBoundaryLabel, type GHGScope } from "@/lib/boundary-context"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

interface ModuleGateProps {
  children: ReactNode
  /** Scope yang harus aktif agar modul ini tersedia. Jika tidak diisi, hanya cek isConfigured. */
  requiredScope?: GHGScope
  /** Label nama modul untuk pesan error yang informatif */
  moduleName?: string
}

/**
 * ModuleGate — Progressive disclosure wrapper untuk semua halaman modul dashboard.
 *
 * Render logic:
 * 1. isLoading → spinner
 * 2. !isConfigured → layar "Lengkapi Goal & Scope dahulu"
 * 3. requiredScope && !isScopeActive → layar "Modul tidak tersedia untuk boundary ini"
 * 4. Semua kondisi terpenuhi → tampilkan children
 */
export function ModuleGate({ children, requiredScope, moduleName }: ModuleGateProps) {
  const { boundary, isConfigured, isLoading } = useBoundary()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    )
  }

  // Gate 1: Goal & Scope belum dikonfigurasi
  if (!isConfigured) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
          <Lock className="h-8 w-8 text-neutral-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-neutral-800">Modul Belum Tersedia</h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-500 leading-relaxed">
            Selesaikan konfigurasi <b>Goal &amp; Scope (M0)</b> terlebih dahulu — termasuk tujuan studi,
            unit fungsional, dan pilihan batas sistem. Modul ini akan terbuka secara otomatis setelah disimpan.
          </p>
        </div>
        <Link href="/dashboard/goal-scope">
          <Button className="gap-2">
            <Target className="h-4 w-4" />
            Buka Goal &amp; Scope
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <p className="text-xs text-neutral-400">ISO 14040 §4.2 — Tujuan &amp; Ruang Lingkup wajib ditetapkan sebelum studi LCA dimulai</p>
      </div>
    )
  }

  // Gate 2: Scope yang dibutuhkan tidak aktif untuk boundary yang dipilih
  if (requiredScope && !isScopeActive(boundary, requiredScope)) {
    const scopeLabel = requiredScope.replace("scope", "Scope ")
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 border border-orange-200">
          <AlertCircle className="h-8 w-8 text-orange-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-neutral-800">
            {moduleName ? `${moduleName} — ` : ""}Modul Tidak Dihitung
          </h2>
          <p className="mt-2 max-w-md text-sm text-neutral-500 leading-relaxed">
            Modul ini memerlukan <b>{scopeLabel}</b> yang saat ini tidak aktif.
            Batas sistem yang dipilih adalah <b>{getBoundaryLabel(boundary)}</b>, yang hanya mencakup{" "}
            {boundary === "gate-to-gate" ? "Scope 1" : "Scope 1 + Scope 2"}.
          </p>
          <p className="mt-1.5 text-xs text-neutral-400">
            Untuk mengaktifkan modul ini, ubah batas sistem ke <b>Cradle-to-Grave</b> atau <b>Cradle-to-Cradle</b>.
          </p>
        </div>
        <Link href="/dashboard/goal-scope">
          <Button variant="secondary" className="gap-2">
            <Target className="h-4 w-4" />
            Ubah Batas Sistem di Goal &amp; Scope
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
