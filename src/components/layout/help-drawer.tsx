"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { X, BookOpen, ChevronRight, Info, CheckCircle2, ListFilter, Cpu, Target, FileText } from "lucide-react"
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

  // Custom Detail/Summary component for collapsible sections
  const Accordion = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => (
    <details className="group border border-neutral-200 rounded-lg bg-white overflow-hidden" open={defaultOpen}>
      <summary className="flex cursor-pointer items-center justify-between bg-neutral-50 px-4 py-3 font-semibold text-neutral-800 marker:content-none hover:bg-neutral-100 transition-colors">
        <span className="flex items-center gap-2">{title}</span>
        <ChevronRight className="h-4 w-4 text-neutral-500 transition duration-300 group-open:rotate-90" />
      </summary>
      <div className="px-4 py-3 text-sm text-neutral-600 border-t border-neutral-100">
        {children}
      </div>
    </details>
  )

  // Helper to determine module code from path
  const getContextualContent = () => {
    if (pathname.includes("/dashboard/goal-scope")) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Target className="h-5 w-5 text-emerald-600" />
            <h4 className="font-bold text-neutral-900 text-lg">Modul 0: Goal & Scope</h4>
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Halaman ini adalah langkah pertama dan paling krusial dalam perhitungan LCA (ISO 14040/14044). Anda harus menentukan apa yang dinilai, metode perhitungan, dan ruang lingkup batas sistem. 
          </p>

          <Accordion title="1. Memilih Metode Penilaian" defaultOpen>
            <p className="mb-2">Platform LCA-ESP mendukung beberapa standar perhitungan global:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>CML-IA Baseline:</strong> Sangat umum di Eropa, fokus pada dampak spesifik (GWP, ODP, Asidifikasi).</li>
              <li><strong>ReCiPe 2016:</strong> Metode komprehensif yang menerjemahkan dampak lingkungan ke kerusakan kesehatan manusia dan ekosistem.</li>
              <li><strong>TRACI 2.1:</strong> Standar dari EPA Amerika Serikat.</li>
              <li><strong>IPCC 2021:</strong> Fokus mutlak pada pemanasan global dan gas rumah kaca (GHG).</li>
            </ul>
          </Accordion>

          <Accordion title="2. Menentukan Batas Sistem (System Boundary)" defaultOpen>
            <p className="mb-2">Pilihan ini menentukan formulir apa yang terbuka di Data Hub:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Gate-to-Gate:</strong> Ruang lingkup tersempit. Hanya mengukur dampak dari operasional internal pabrik (contoh: konsumsi listrik pabrik, solar genset, dan limbah produksi). Form pemasok dan transportasi akan dikunci.</li>
              <li><strong>Cradle-to-Gate:</strong> Mengukur dari ekstraksi alam hingga produk jadi. Anda wajib mengisi Form Bahan Baku (BOM) dan jarak transportasi Pemasok di Data Hub.</li>
              <li><strong>Cradle-to-Grave:</strong> Siklus hidup penuh hingga produk dibuang. Anda wajib mengisi Form Transportasi Logistik ke konsumen (Downstream).</li>
              <li><strong>Cradle-to-Cradle:</strong> Sama seperti Grave, namun memasukkan variabel Daur Ulang (Sirkular Ekonomi).</li>
            </ul>
          </Accordion>

          <Accordion title="3. Alokasi Dampak & FU">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Functional Unit (FU):</strong> Satuan pengukuran produk. Misal: 1 Ton Semen, atau 1 Botol Air Mineral. Semua perhitungan akan dinormalisasi ke satuan ini.</li>
              <li><strong>Alokasi:</strong> Menentukan bagaimana emisi dibagi jika pabrik Anda memproduksi produk sampingan (Co-Product). Bisa berdasarkan Massa (berat) atau Nilai Ekonomi (harga).</li>
            </ul>
          </Accordion>
        </div>
      )
    }

    if (pathname.includes("/dashboard/data-hub")) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <ListFilter className="h-5 w-5 text-blue-600" />
            <h4 className="font-bold text-neutral-900 text-lg">Data Hub (Pusat Input Primer)</h4>
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Data Hub adalah tempat Anda menginput seluruh data operasional bulanan/tahunan. Sistem menggunakan prinsip <strong>Progressive Disclosure</strong>: form yang tidak relevan dengan <em>Goal & Scope</em> Anda akan disembunyikan.
          </p>

          <Accordion title="Form Output Produksi" defaultOpen>
            <p>Masukkan kuantitas total produk jadi yang dihasilkan oleh plant/pabrik. Data ini sangat penting karena akan menjadi <strong>angka pembagi</strong> (denominator) untuk menghitung intensitas emisi per produk (misal: kgCO2e per Ton produk).</p>
          </Accordion>

          <Accordion title="Form Energi & Listrik">
            <p className="mb-2">Mencatat konsumsi energi yang digunakan. Konversi energi ke emisi (Faktor Emisi) dihitung secara otomatis oleh mesin LCA di belakang layar.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Listrik PLN (kWh):</strong> Masuk ke Scope 2.</li>
              <li><strong>Solar / Gas Alam / Batubara:</strong> Masuk ke Scope 1 (pembakaran langsung).</li>
            </ul>
          </Accordion>

          <Accordion title="Form Bahan Baku (Material) & Pemasok">
            <p className="mb-2"><em>Hanya terbuka jika Anda memilih Cradle-to-Gate atau di atasnya.</em></p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Material:</strong> Input Bill of Materials (BOM). Berapa banyak bahan baku kimia atau mentah yang dipakai.</li>
              <li><strong>Pemasok:</strong> Masukkan lokasi penyuplai bahan baku tersebut. Sistem membutuhkan Jarak Tempuh (km) untuk menghitung emisi transportasi hulu (Upstream Scope 3).</li>
            </ul>
          </Accordion>

          <Accordion title="Form Transportasi & Logistik">
            <p className="mb-2"><em>Hanya terbuka jika Anda memilih Cradle-to-Grave atau Cradle-to-Cradle.</em></p>
            <p>Mencatat pengiriman produk jadi ke distributor atau konsumen akhir (Downstream Scope 3). Parameter yang wajib diisi: Jarak (km), Berat Kargo (Ton), dan Tipe Kendaraan (misal: Truk Diesel Besar).</p>
          </Accordion>

          <Accordion title="Form Emisi Cerobong (Stack) & Lab">
            <p>Untuk kepatuhan PROPER KLHK. Masukkan hasil uji lab parameter lingkungan fisik seperti SO2, NO2, Partikulat, dan Kualitas Air Limbah (BOD, COD, pH). Data ini akan masuk ke dashboard Environmental Monitoring.</p>
          </Accordion>
        </div>
      )
    }

    if (pathname.includes("/dashboard/carbon-accounting")) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Cpu className="h-5 w-5 text-red-600" />
            <h4 className="font-bold text-neutral-900 text-lg">Modul 4: Carbon Accounting</h4>
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Halaman ini menampilkan kalkulasi otomatis jejak karbon (GHG) Anda sesuai standar <em>GHG Protocol Corporate Standard</em>, berdasarkan data yang Anda masukkan di <strong>Data Hub</strong>.
          </p>

          <Accordion title="Memahami Scope (Cakupan Emisi)" defaultOpen>
            <ul className="list-disc pl-5 space-y-2 mb-2">
              <li><strong>Scope 1 (Emisi Langsung):</strong> Berasal dari sumber yang dimiliki atau dikendalikan oleh perusahaan. Contoh: Pembakaran solar di genset pabrik, bahan bakar kendaraan dinas, atau kebocoran freon (refrigerant).</li>
              <li><strong>Scope 2 (Emisi Tidak Langsung - Energi):</strong> Berasal dari pembangkitan listrik atau uap yang <em>dibeli</em> oleh perusahaan. Contoh: Tagihan Listrik PLN.</li>
              <li><strong>Scope 3 (Emisi Rantai Pasok):</strong> Seluruh emisi tidak langsung lainnya (hulu dan hilir). Contoh: Transportasi pemasok, perjalanan bisnis karyawan, pengolahan limbah pihak ketiga.</li>
            </ul>
          </Accordion>

          <Accordion title="Grafik & Analisis">
            <p className="mb-2">Gunakan metrik di halaman ini untuk:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Melihat komposisi penyumbang karbon terbesar (Hotspot Analysis).</li>
              <li>Mengevaluasi persentase penggunaan Energi Terbarukan (Renewable Energy).</li>
              <li>Memantau jejak karbon <em>YTD (Year-to-Date)</em> dibandingkan tahun dasar (Baseline Year).</li>
            </ul>
          </Accordion>
        </div>
      )
    }

    if (pathname.includes("/dashboard/lca")) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            <h4 className="font-bold text-neutral-900 text-lg">Modul 6: Life Cycle Assessment (LCA)</h4>
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Carbon Accounting hanya melihat "Jejak Karbon". LCA (ISO 14044) melangkah lebih jauh dengan menganalisis seluruh potensi kerusakan lingkungan lintas dimensi.
          </p>

          <Accordion title="Kategori Dampak (Impact Categories)" defaultOpen>
            <p className="mb-2">Hasil ekstraksi data Anda dikonversi menjadi kategori dampak berikut (berdasarkan metode yang dipilih di M0):</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>GWP (Pemanasan Global):</strong> Diukur dalam kgCO2-Eq. Berapa banyak panas yang terperangkap di atmosfer.</li>
              <li><strong>ODP (Penipisan Ozon):</strong> Diukur dalam kgCFC-11-Eq. Zat yang merusak lapisan ozon seperti aerosol atau freon lawas.</li>
              <li><strong>AP (Asidifikasi / Hujan Asam):</strong> Diukur dalam kgSO2-Eq. Emisi sulfur dan nitrogen yang membuat tanah/air menjadi asam. Terutama berasal dari pembakaran batubara.</li>
              <li><strong>EP (Eutrofikasi):</strong> Diukur dalam kgPO4-Eq. Pencemaran air oleh nutrien (seperti pupuk atau limbah organik) yang menyebabkan ledakan populasi alga pembunuh ikan.</li>
            </ul>
          </Accordion>

          <Accordion title="Fitur Simulasi">
            <p>Di halaman ini Anda dapat melakukan <em>Scenario Planning</em>. Coba ubah variabel energi (misal mengganti 20% listrik batu bara dengan panel surya) dan lihat seberapa signifikan penurunan GWP dan AP yang terjadi secara <em>real-time</em>.</p>
          </Accordion>
        </div>
      )
    }

    if (pathname.includes("/dashboard/esg-reporting")) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <BookOpen className="h-5 w-5 text-orange-600" />
            <h4 className="font-bold text-neutral-900 text-lg">Modul 13: ESG Reporting & Audit</h4>
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Halaman ini merangkum seluruh data (Goal & Scope, Data Hub, Emisi, dan LCA) menjadi satu laporan formal yang siap diaudit.
          </p>
          <Accordion title="Fitur Laporan" defaultOpen>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Kesesuaian POJK 51:</strong> Laporan format standar Otoritas Jasa Keuangan untuk emiten bursa.</li>
              <li><strong>Kesesuaian PROPER:</strong> Menampilkan indikator-indikator yang dibutuhkan KLHK.</li>
              <li><strong>Ekspor PDF/Excel:</strong> Menghasilkan dokumen cetak dengan stempel <em>timestamp</em> untuk diserahkan ke auditor ISO.</li>
            </ul>
          </Accordion>
        </div>
      )
    }

    // Default Fallback Context
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Info className="h-5 w-5 text-emerald-600" />
          <h4 className="font-bold text-neutral-900 text-lg">Panduan Pengisian Umum</h4>
        </div>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Selamat datang di Pusat Bantuan Kontekstual! Anda sedang berada di halaman <strong>{pathname.split('/').pop() || 'Dashboard Utama'}</strong>.
        </p>
        
        <Accordion title="Alur Kerja Standar (Workflow)" defaultOpen>
          <p className="mb-2 text-sm text-neutral-600">
            Platform LCA-ESP dirancang agar Anda mengikuti alur kerja linear berikut:
          </p>
          <ol className="text-sm text-neutral-600 space-y-3 list-decimal pl-5 font-medium">
            <li>
              <span className="text-neutral-900">Konfigurasi Batas Sistem (Modul 0)</span>
              <p className="font-normal text-xs mt-0.5 text-neutral-500">Pilih rentang perhitungan (Gate-to-Gate, Cradle-to-Gate, dsb).</p>
            </li>
            <li>
              <span className="text-neutral-900">Input Data Operasional (Data Hub)</span>
              <p className="font-normal text-xs mt-0.5 text-neutral-500">Masukkan tagihan listrik, bahan baku, transportasi, dan uji lab.</p>
            </li>
            <li>
              <span className="text-neutral-900">Validasi Lingkungan (Modul 1-3)</span>
              <p className="font-normal text-xs mt-0.5 text-neutral-500">Pantau kepatuhan batas emisi fisik (cerobong, air limbah).</p>
            </li>
            <li>
              <span className="text-neutral-900">Analisis Dampak (Modul 4-6)</span>
              <p className="font-normal text-xs mt-0.5 text-neutral-500">Lihat hasil konversi menjadi jejak karbon dan dampak LCA global.</p>
            </li>
            <li>
              <span className="text-neutral-900">Cetak Laporan ESG (Modul 13)</span>
              <p className="font-normal text-xs mt-0.5 text-neutral-500">Unduh laporan resmi PDF untuk kebutuhan audit dan PROPER.</p>
            </li>
          </ol>
        </Accordion>
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

      {/* Drawer Panel - Diperlebar menjadi max-w-lg (512px) */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-neutral-50 shadow-2xl transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-white shadow-xs z-10">
          <div className="flex items-center gap-2 text-emerald-700">
            <BookOpen className="h-5 w-5" />
            <h3 className="font-bold text-lg">Panduan Modul</h3>
          </div>
          <button
            onClick={closeHelp}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {getContextualContent()}
        </div>

        {/* Footer */}
        <div className="border-t bg-white px-6 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <a
            href="mailto:support@lca-esp.com"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 border border-neutral-300 shadow-xs hover:bg-neutral-50 transition-colors"
          >
            <Info className="h-4 w-4" />
            Hubungi Konsultan EHS
          </a>
        </div>
      </div>
    </>
  )
}
