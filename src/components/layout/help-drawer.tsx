"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { X, BookOpen, ChevronRight, Info, CheckCircle2 } from "lucide-react"
import { useHelp } from "@/lib/help-context"

export function HelpDrawer() {
  const { isOpen, closeHelp } = useHelp()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Ensure hydration match
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Helper to determine module code from path
  const getContextualContent = () => {
    if (pathname.includes("/dashboard/goal-scope")) {
      return (
        <div className="space-y-4">
          <h4 className="font-bold text-neutral-900 text-lg border-b pb-2">Modul 0: Goal & Scope</h4>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Halaman ini adalah fondasi dari perhitungan LCA Anda. Di sini Anda wajib menentukan <strong>Batas Sistem (System Boundary)</strong> yang akan memengaruhi modul apa saja yang terbuka di <em>Data Hub</em>.
          </p>
          <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-100">
            <h5 className="font-semibold text-emerald-900 text-sm flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4" /> 4 Opsi Batas Sistem:
            </h5>
            <ul className="text-sm text-emerald-800 space-y-2 list-disc pl-5">
              <li><strong>Gate-to-Gate:</strong> Hanya operasional pabrik internal (Produksi, Energi, Air, Limbah).</li>
              <li><strong>Cradle-to-Gate:</strong> Termasuk dampak ekstraksi bahan baku (Material & Supplier terbuka).</li>
              <li><strong>Cradle-to-Grave:</strong> Termasuk pengiriman ke konsumen (Transportasi hilir terbuka).</li>
              <li><strong>Cradle-to-Cradle:</strong> Termasuk potensi daur ulang di masa depan.</li>
            </ul>
          </div>
          <p className="text-sm text-neutral-600">
            <strong>Langkah:</strong> Pilih batas sistem Anda, lalu klik <em>Simpan Konfigurasi</em>. Sistem akan menyesuaikan seluruh modul berikutnya secara otomatis!
          </p>
        </div>
      )
    }

    if (pathname.includes("/dashboard/data-hub")) {
      return (
        <div className="space-y-4">
          <h4 className="font-bold text-neutral-900 text-lg border-b pb-2">Data Hub (Pusat Input)</h4>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Data Hub adalah pusat pengumpulan data primer (*Primary Data*) perusahaan Anda. Modul yang tampil di halaman ini <strong>secara otomatis disesuaikan</strong> berdasarkan pilihan Batas Sistem Anda di Modul 0.
          </p>
          <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
            <h5 className="font-semibold text-blue-900 text-sm flex items-center gap-2 mb-2">
              <Info className="h-4 w-4" /> Cara Pengisian:
            </h5>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal pl-5">
              <li>Pilih tab/kategori data (misal: Energi & Listrik).</li>
              <li>Klik tombol <strong>+ Tambah Data</strong> untuk membuka formulir.</li>
              <li>Isi parameter (tanggal, jumlah pemakaian, unit).</li>
              <li>Klik <strong>Simpan</strong>. Data akan masuk ke dalam tabel ringkasan.</li>
            </ol>
          </div>
          <p className="text-sm text-neutral-600">
            <em>Tips:</em> Jika Anda mengklik mode <strong>EHS Engineer View</strong> di halaman depan, Anda akan melihat data secara lebih teknis. Data yang Anda masukkan di sini otomatis dihitung emisinya di Modul Carbon Accounting dan LCA.
          </p>
        </div>
      )
    }

    if (pathname.includes("/dashboard/carbon-accounting")) {
      return (
        <div className="space-y-4">
          <h4 className="font-bold text-neutral-900 text-lg border-b pb-2">Modul 4: Carbon Accounting</h4>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Halaman ini menampilkan kalkulasi otomatis jejak karbon (GHG) Anda berdasarkan standar <em>GHG Protocol</em>.
          </p>
          <ul className="text-sm text-neutral-600 space-y-2 list-disc pl-5">
            <li><strong>Scope 1:</strong> Emisi langsung (contoh: Genset, Boiler, Kendaraan Perusahaan).</li>
            <li><strong>Scope 2:</strong> Emisi tidak langsung dari energi yang dibeli (contoh: Listrik PLN).</li>
            <li><strong>Scope 3:</strong> Emisi rantai pasok (contoh: Transportasi Vendor, Ekstraksi Bahan Baku).</li>
          </ul>
        </div>
      )
    }

    if (pathname.includes("/dashboard/lca")) {
      return (
        <div className="space-y-4">
          <h4 className="font-bold text-neutral-900 text-lg border-b pb-2">Modul 6: Life Cycle Assessment (LCA)</h4>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Modul ini menghitung dampak lingkungan produk Anda melampaui sekadar jejak karbon. Anda dapat melihat kategori dampak seperti:
          </p>
          <ul className="text-sm text-neutral-600 space-y-2 list-disc pl-5">
            <li><strong>GWP (Global Warming Potential):</strong> Dampak terhadap perubahan iklim.</li>
            <li><strong>ODP (Ozone Depletion Potential):</strong> Penipisan lapisan ozon.</li>
            <li><strong>AP (Acidification Potential):</strong> Potensi hujan asam.</li>
            <li><strong>EP (Eutrophication Potential):</strong> Pencemaran air oleh nutrien berlebih.</li>
          </ul>
        </div>
      )
    }

    // Default Fallback Context
    return (
      <div className="space-y-4">
        <h4 className="font-bold text-neutral-900 text-lg border-b pb-2">Panduan Pengisian Umum</h4>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Selamat datang di Pusat Bantuan Kontekstual! Anda sedang berada di halaman <strong>{pathname.split('/').pop() || 'Dashboard'}</strong>.
        </p>
        <p className="text-sm text-neutral-600">
          Ikuti urutan pengisian data yang disarankan:
        </p>
        <ol className="text-sm text-neutral-600 space-y-2 list-decimal pl-5">
          <li>Atur Batas Sistem di <strong>Modul 0 (Goal & Scope)</strong>.</li>
          <li>Masukkan data primer operasional di <strong>Data Hub</strong>.</li>
          <li>Pantau hasil perhitungan emisi otomatis di <strong>Carbon Accounting</strong> dan <strong>LCA</strong>.</li>
          <li>Cetak laporan siap audit di <strong>ESG Reporting</strong>.</li>
        </ol>
      </div>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeHelp}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-neutral-50/50">
          <div className="flex items-center gap-2 text-emerald-700">
            <BookOpen className="h-5 w-5" />
            <h3 className="font-semibold">Panduan Pengisian</h3>
          </div>
          <button
            onClick={closeHelp}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {getContextualContent()}
        </div>

        {/* Footer */}
        <div className="border-t bg-neutral-50 px-6 py-4">
          <a
            href="mailto:support@lca-esp.com"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-700 border border-neutral-200 shadow-xs hover:bg-neutral-100 transition-colors"
          >
            <Info className="h-4 w-4" />
            Butuh bantuan lebih lanjut?
          </a>
        </div>
      </div>
    </>
  )
}
