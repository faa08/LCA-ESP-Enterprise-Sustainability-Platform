"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2, Users, Key, Link2, Shield, ChevronRight, Check,
  Settings2, Database, Cpu, Lock, Info, ArrowRight, Sparkles, CheckCircle2,
} from "lucide-react"

export default function Settings() {
  const [apiKeyGroq, setApiKeyGroq] = useState("gsk_************************************************")
  const [apiKeyGemini, setApiKeyGemini] = useState("AIza***********************************")
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
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
      status: "Supabase & API Ready",
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
          <p className="font-bold text-blue-900">Pembaruan Arsitektur 13 Modul GreenLCA</p>
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
    </div>
  )
}
