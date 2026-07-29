"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2, Users, Key, Link2, Shield, Check,
  Settings2, Database, Cpu, Lock, Info, ArrowRight, Sparkles, CheckCircle2,
  AlertTriangle, Trash2, Loader2, RotateCcw,
} from "lucide-react"
import { useSiteId } from "@/lib/use-site-id"
import { resetAllData } from "@/lib/supabase/data-service"

export default function Settings() {
  const siteId = useSiteId()
  const [apiKeyGroq, setApiKeyGroq] = useState("gsk_************************************************")
  const [apiKeyGemini, setApiKeyGemini] = useState("AIza***********************************")
  const [saved, setSaved] = useState(false)

  // Reset state
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetConfirm, setResetConfirm] = useState("")
  const [resetting, setResetting] = useState(false)
  const [resetDone, setResetDone] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleReset = async () => {
    if (!siteId) return
    setResetting(true)
    setResetError(null)
    const { error } = await resetAllData(siteId)
    setResetting(false)
    if (error) {
      setResetError(error)
    } else {
      if (typeof window !== "undefined") {
        localStorage.removeItem("enspr_goal_scope")
        localStorage.removeItem("enspr_company_profile")
        localStorage.removeItem("enspr_product_assessment")
      }
      setResetDone(true)
      setShowResetModal(false)
      setResetConfirm("")
      setTimeout(() => {
        setResetDone(false)
        window.location.reload()
      }, 2000)
    }
  }

  const systemSections = [
    {
      icon: Users,
      name: "Tata Kelola Pengguna & Peran (RBAC)",
      desc: "Kelola 4 peran pengguna: Admin Korporat, Sustainability Manager, Operator Site, dan Auditor Eksternal.",
      color: "text-purple-600 bg-purple-50",
      status: "4 Role Aktif",
    },
    {
      icon: Key,
      name: "Manajemen AI & Failover API Keys",
      desc: "Konfigurasi Groq Cloud (Primary) & Google Gemini (Fallback) untuk rekomendasi dekarbonisasi otomatis.",
      color: "text-blue-600 bg-blue-50",
      status: "Groq + Gemini Aktif",
    },
    {
      icon: Link2,
      name: "Integrasi Sistem & Database",
      desc: "Konektor API ke sistem ERP (SAP), SCADA pabrik, CEMS cerobong, dan Festronik KLHK.",
      color: "text-emerald-600 bg-emerald-50",
      status: "Database & API Terhubung",
    },
    {
      icon: Shield,
      name: "Keamanan & Pelindungan Data (UU PDP)",
      desc: "Enkripsi data at-rest & in-transit, jejak audit otomatis, serta kedaulatan data private cloud.",
      color: "text-amber-600 bg-amber-50",
      status: "Enkripsi AES-256",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" className="text-[10px]">Data & System</Badge>
            <Badge variant="neutral" className="text-[10px] font-bold">Enterprise IT Settings</Badge>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Pengaturan Sistem & IT Enterprise</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Pusat tata kelola infrastruktur IT: Peran Pengguna (RBAC), AI Engine Failover, API Keys, dan Keamanan Data.
          </p>
        </div>
        <Button onClick={handleSave}>
          {saved ? <><CheckCircle2 className="mr-2 h-4 w-4" />Tersimpan</> : "Simpan Konfigurasi"}
        </Button>
      </div>

      {/* Migration Notice Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3.5">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        <div className="flex-1 text-xs text-blue-800">
          <p className="font-bold text-blue-900">Pembaruan Arsitektur 15 Modul Enterprise</p>
          <p className="mt-1 leading-relaxed">
            Pengaturan profil entitas pabrik dan metodologi LCA telah dipindahkan ke grup <b>FONDASI LCA</b> agar sesuai standar ISO 14040/14044:
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <Link href="/dashboard/company-profile" className="inline-flex items-center gap-1 rounded-lg border border-blue-300 bg-white px-2.5 py-1 font-semibold text-blue-700 hover:bg-blue-100 transition-colors">
              M1 · Company Profile (Hierarki Perusahaan) <ArrowRight className="h-3 w-3" />
            </Link>
            <Link href="/dashboard/goal-scope" className="inline-flex items-center gap-1 rounded-lg border border-blue-300 bg-white px-2.5 py-1 font-semibold text-blue-700 hover:bg-blue-100 transition-colors">
              M0 · Goal & Scope (Metodologi LCA) <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* AI Failover Engine Config */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Dual AI Engine Configuration (Failover Active)</CardTitle>
              <p className="text-xs text-neutral-500 mt-0.5">Strategi kolaborasi Groq Llama 3.3 70B (Utama) & Google Gemini 1.5 (Cadangan)</p>
            </div>
          </div>
        </CardHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5 flex items-center justify-between">
              <span>Groq API Key (Primary Provider)</span>
              <span className="text-[10px] text-emerald-700 font-bold">Llama 3.3 70B</span>
            </label>
            <input
              type="password"
              value={apiKeyGroq}
              onChange={(e) => setApiKeyGroq(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-mono focus:border-emerald-500 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-neutral-400">Digunakan untuk analisis respon super cepat (&lt;1 detik)</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5 flex items-center justify-between">
              <span>Google Gemini API Key (Fallback Provider)</span>
              <span className="text-[10px] text-blue-700 font-bold">Gemini 1.5 Flash</span>
            </label>
            <input
              type="password"
              value={apiKeyGemini}
              onChange={(e) => setApiKeyGemini(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-mono focus:border-emerald-500 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-neutral-400">Otomatis aktif jika Groq mencapai batas kuota / rate limit</p>
          </div>
        </div>
      </Card>

      {/* System Sections Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {systemSections.map((section, i) => (
          <Card key={i} className="group cursor-pointer hover:border-emerald-200 transition-colors">
            <div className="flex items-start gap-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${section.color}`}>
                <section.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-neutral-900">{section.name}</p>
                  <span className="shrink-0 rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600">{section.status}</span>
                </div>
                <p className="mt-1 text-xs text-neutral-500 leading-relaxed">{section.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* System Status Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs text-neutral-500">Total Pengguna Terdaftar</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">24 <span className="text-xs font-normal text-neutral-400">user</span></p>
          <p className="mt-0.5 text-xs text-emerald-600">4 Peran (RBAC Active)</p>
        </Card>
        <Card>
          <p className="text-xs text-neutral-500">Status Keamanan (UU PDP)</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">Patuh</p>
          <p className="mt-0.5 text-xs text-neutral-400">Enkripsi AES-256 Data at-Rest</p>
        </Card>
        <Card>
          <p className="text-xs text-neutral-500">Kapasitas Dokumen Audit</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">2.4 GB <span className="text-xs font-normal text-neutral-400">/ 10 GB</span></p>
          <p className="mt-0.5 text-xs text-neutral-400">Format PDF / Berkas Lab</p>
        </Card>
      </div>

      {/* ── Danger Zone ── */}
      <div className="rounded-xl border-2 border-red-200 bg-red-50/40 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-red-800">Zona Berbahaya</p>
            <p className="text-xs text-red-500">Tindakan di bawah ini bersifat permanen dan tidak dapat dibatalkan.</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-white px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-neutral-900">Reset Semua Data Operasional</p>
            <p className="mt-0.5 text-xs text-neutral-500">
              Menghapus seluruh data di Data Hub (energi, air, limbah, transportasi, dll.), Biodiversity, Circular Economy, Goal &amp; Scope, dan semua log Audit Trail untuk site ini.
            </p>
          </div>
          <Button
            className="ml-4 shrink-0 bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]"
            onClick={() => { setShowResetModal(true); setResetConfirm(""); setResetError(null) }}
          >
            <Trash2 className="mr-1.5 h-4 w-4" />
            Reset Data
          </Button>
        </div>

        {resetDone && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Semua data berhasil direset. Silakan isi ulang Data Hub dari awal.
          </div>
        )}
      </div>

      {/* ── Confirmation Modal ── */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-red-200 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-red-600 px-6 py-4 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-white" />
              <p className="text-lg font-bold text-white">Konfirmasi Reset Data</p>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-neutral-700 leading-relaxed">
                Tindakan ini akan <b className="text-red-700">menghapus permanen</b> semua data operasional di semua tabel Data Hub untuk site aktif. Data yang dihapus mencakup:
              </p>
              <ul className="text-xs text-neutral-600 space-y-1 list-disc ml-4">
                <li>Produksi, Material, Energi, Air</li>
                <li>Laboratorium, Stack Emisi, Limbah B3, Transportasi</li>
                <li>Biodiversity Records, Circular Economy Flows</li>
                <li>Goal &amp; Scope, Audit Trail Logs</li>
              </ul>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Ketik <span className="font-mono font-bold text-red-600">RESET</span> untuk mengkonfirmasi
                </label>
                <input
                  type="text"
                  value={resetConfirm}
                  onChange={(e) => setResetConfirm(e.target.value)}
                  placeholder="Ketik RESET di sini..."
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-mono focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-300"
                  autoFocus
                />
              </div>
              {resetError && (
                <p className="text-xs text-red-600 bg-red-50 rounded px-3 py-2 border border-red-200">{resetError}</p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 justify-end px-6 pb-5">
              <Button variant="secondary" onClick={() => setShowResetModal(false)} disabled={resetting}>
                Batal
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]"
                disabled={resetConfirm !== "RESET" || resetting}
                onClick={handleReset}
              >
                {resetting
                  ? <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" />Mereset...</>
                  : <><RotateCcw className="mr-1.5 h-4 w-4" />Ya, Reset Semua Data</>
                }
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
