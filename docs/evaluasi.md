# Evaluasi Fitur & Arsitektur — ensPR (Platform LCA + PROPER + Karbon Kredit)

> **Tujuan Produk (Kesepakatan Utama):** LCA adalah **sistem inti/mesin utama** yang ditawarkan ke pabrik naungan KLHK. Di atas LCA ditambahkan layer **PROPER** untuk mengidentifikasi peringkat pabrik (**Emas / Hijau / Biru / Merah / Hitam**) serta fitur **Karbon Kredit** yang dihitung otomatis dari hasil LCA + carbon accounting.
>
> **Filosofi Sistem:** Bertransformasi dari sekadar **"Dashboard Penghitung Pasif"** (hanya grafik & tabel) menjadi **"Sistem Operasional Berdampak Tinggi"** (What-If Simulator, 1-Click KLHK Report Generator, dan Early Warning Remediation).
>
> **Status Data Saat Ini:** 100% `localStorage` (`enspr_measurements_<industryId>`). Dependency `@supabase` + `.env.local` sudah ada, tapi **belum di-wiring ke kode**.

---

## 1. PROPER Ranking (`src/lib/proper.ts`)

**Sekarang**
- `predictRank(emisiFails, airFails, b3Fails)` hanya bisa mengembalikan **Merah / Biru / Hitam**.
- `total >= 4` → Hitam, `total >= 1` → Merah, else → **Biru** (hardcode, komentar: "butuh audit lapangan untuk Hijau/Emas").
- Tipe `ProperRank` menyebut Emas/Hijau, UI menampilkannya, tapi `predictRank` **tidak mungkin mengembalikannya** → Emas & Hijau tidak tercapai.
- `LCA_PARAMS` sudah ada (kategori `lainnya`) tapi **tidak dipakai sama sekali** dalam ranking.

**Harus Dievaluasi & Ditingkatkan**
- Tentukan rules **Emas/Hijau** (Pabrik Taat Baku Mutu 100% + Bukti Penurunan Emisi dari LCA / 3R / Efisiensi Energi).
- Hasil LCA **wajib menaikkan** peringkat dari Biru → Hijau/Emas. Ini menjadikan LCA sebagai syarat mutlak naik peringkat PROPER.

---

## 2. Transformasi: Dari Calculator Pasif ke Sistem Berdampak Tinggi

**Masalah Saat Ini:**
Aplikasi saat ini masih terasa seperti "Dashboard Penghitung Pasif" (menampilkan data & grafik tanpa memberitahu pabrik harus berbuat apa).

**3 Fitur Pengubah Permainan (High-Impact Features):**
1. **What-If Decision Simulator (Engine Simulasi Keputusan):**
   - Pabrik bisa mensimulasikan: *"Bagaimana jika persentase batu bara boiler dikurangi 20% dan diganti Biomassa Cangkang Sawit?"*
   - Sistem langsung menghitung otomatis:
     - 📉 Emisi Karbon berkurang **X%**.
     - 🟢 Proyeksi Peringkat PROPER otomatis naik dari **Biru ➔ Hijau**.
     - 💰 Potensi Karbon Kredit yang didapat = **+Rp X Juta/Tahun**.
     - ⏳ Estimasi Payback Period retrofit alat = **X Tahun**.
2. **1-Click Official KLHK Report Generator:**
   - Sekali klik, menghasilkan PDF/DOCX format resmi:
     - **Dokumen DRKPL** (Dokumen Ringkasan Kinerja Pengelolaan Lingkungan PROPER).
     - **Laporan Audit LCA ISO 14040/14044**.
     - **File Format Skema SIMPEL KLHK (e-RKL-RPL)**.
   - Menghemat waktu tim EHS dari 3 bulan pengerjaan manual menjadi **5 menit**.
3. **Early Warning & Action Ticket System:**
   - Jika sensor CEMS/IPAL mendekati 90% Baku Mutu, kirim Notifikasi Telegram/WhatsApp & buat **Tiket Remediation Otomatis** untuk engineer di lapangan sebelum terjadi insiden pencemaran/sanksi KLHK.

---

## 3. Redesain Data Hub (Unified Ingestion Engine)

**Masalah Ingestion Data Saat Ini:**
1. **Redirect Loop yang Mengganggu:** Memilih tab "Input Manual" di Data Hub hanya menampilkan deskripsi dan tombol melempar (*redirect*) pengguna ke `/dashboard/input`.
2. **Parser Excel Kaku:** Format impor Excel kaku (`code,value` teks murni), tanpa tombol download template Excel resmi dan tanpa pratinjau (*preview*) tabel sebelum simpan.
3. **Dropdown "Pilih Industri" di Halaman Input:** Memaksa pabrik memilih jenis industri di halaman data entry membuat sistem terasa seperti *kalkulator demo publik gratisan*, bukan platform internal berbayar.

**Solusi & Arsitektur Data Hub Baru (Satu Pintu Ingestion):**
- **Penghilangan Dropdown Industri di Data Entry:** Jenis industri dan profil pabrik diset **1 kali saja** saat pendaftaran/di menu Pengaturan Perusahaan. Saat akun `PT Krakatau Steel` login, seluruh Data Hub otomatis terkunci ke industri baja.
- **Nama Titik Penaatan Nyata (Custom Facilities):** Menggunakan nama lokasi nyata pabrik (*Cerobong Boiler Utama 01*, *Outfall IPAL Blok C*, *TPS B3 Gedung A*), bukan label generik.
- **Pemilih Periode Laporan (Month/Year Picker):** Memungkinkan pengisian dan riwayat historis laporan per bulan (contoh: *Laporan Juli 2026*).

**4 Metode Ingestion di Data Hub Baru:**
1. 📝 **Form Manual Terstruktur:** Sub-tab Air Limbah, Emisi, B3, Energi, dan LCA langsung di dalam Data Hub (tanpa redirect).
2. 📊 **Excel / CSV Smart Importer:** Tombol *Download Template Excel Resmi* + *Drag-and-Drop File* + *Preview Table & Auto-Mapping*.
3. 📡 **Live Stream IoT CEMS & ERP API:** Indikator koneksi online/offline real-time + *Live Data Stream Log Ticker* + *Field Mapping*.
4. 🤖 **AI PDF & OCR Parser (Nilai Tambah):** Pindai otomatis file PDF Laporan Hasil Uji (LHU) dari lab eksternal (Sucofindo / UPTD DLH) untuk mengekstrak angka uji tanpa diketik ulang.

---

## 4. Simplifikasi Arsitektur Navigasi (Penyelesaian Feature Bloat)

**Masalah Navigasi Saat Ini (14 Menu Terpecah):**
Sidebar saat ini memiliki 14 menu terpisah (`Input Manual`, `Energy`, `Water`, `Waste`, `Environmental`, `Documents`, `AI Insights`, dll) yang membuat sistem terasa *bloated* dan melelahkan (*click fatigue*).

**Arsitektur Baru (5 Modul Inti Ramping & Enterprise-Grade):**

| Modul Baru | Integrasi Halaman Lama | Alasan & Bentuk Integrasi |
|---|---|---|
| **📊 Executive Overview** | `dashboard/page.tsx` | Ringkasan Eksekutif, Health Check Pabrik, & Stat Card Terkoneksi Real. |
| **⚙️ LCA & Dampak Produk** | `dashboard/lca` + What-If Simulator | **Mesin Utama**. Kalkulasi jejak per ton produk + Simulator Keputusan Investment. |
| **🛡️ PROPER Compliance** | `compliance` + `documents` + `ai-insights` | Snapshot Baku Mutu, Dokumen PDF 1-Klik, & Widget Recommendations AI terintegrasi. |
| **🪙 Karbon & Offset** | `carbon-accounting` + `carbon-credit` | Digabung. Akuntansi emisi Scope 1-3 sekaligus Monetisasi Karbon Kredit SRN-PPI. |
| **📥 Data Hub (One-Stop)** | `data-hub` + `input` + Operasional (Air/Emisi/B3/Energi) | Satu pintu masukan data: Tab 1 (Input Form Manual), Tab 2 (Upload Excel), Tab 3 (Live IoT CEMS), Tab 4 (AI OCR PDF). |
| **⚙️ Pengaturan** | `settings` | Profil Pabrik, Pemilihan Industri, Nama Cerobong/Outfall, & Baku Mutu Perda/Gubernur. |

> **Catatan Pembersihan:**
> - Menu `Input Manual` **didepresiasi dari sidebar** ➔ masuk jadi Tab di `Data Hub`.
> - Menu `Energy`, `Water`, `Waste` **didepresiasi dari sidebar** ➔ masuk jadi Sub-Tab di `Data Hub` & `Monitoring Lingkungan`.
> - Menu `AI Insights` **didepresiasi dari sidebar** ➔ masuk sebagai Widget Rekomendasi Pintar di LCA & PROPER.
> - Menu `Documents` **didepresiasi dari sidebar** ➔ masuk jadi Tab "Berkas & Audit" di `PROPER Compliance`.

---

## 5. Data Flow & Supabase (`src/lib/measurements.ts`)

**Sekarang**
- `getMeasurements` / `saveMeasurements` / `recordImport` / `useImportLog` / `paramValue` / `evaluate` → semua baca/tulis **localStorage**.
- 3 helper Supabase ada (`src/lib/supabase/{client,server,admin}.ts`) tapi **belum di-wiring** ke kode.
- Klaim "live sync every 2s" di landing = **kosmetik**.

**Harus Dievaluasi**
- Buat **storage adapter** agar `measurements.ts` bisa menulis ke Supabase + fallback `localStorage` untuk mode demo.

---

## 6. Landing Page & Messaging

**Sekarang**
- Hero (`locales/id.ts`): *"Platform pemantauan untuk kepatuhan PROPER"* — PROPER dilebih-lebihkan, LCA dikubur.
- Carbon Credit **absen total** dari marketing (`site-content.ts`).

**Harus Dievaluasi**
- Posisikan: **"Platform LCA & Keberlanjutan Pabrik: Lolos PROPER Hijau/Emas & Monetisasi Karbon Kredit dari Efisiensi Produksi."**

---

## 7. Kesiapan Enterprise BUMN (Krakatau Steel / Pertamina)

- **Kebutuhan Utama BUMN:** Bukan sekadar "tahu rank PROPER", melainkan:
  1. Otomatisasi lapor ke KLHK (e-RKL-RPL, SIMPEL).
  2. Early warning dari CEMS/DCS/SCADA.
  3. What-if Simulator efisiensi energi.
  4. Perhitungan Karbon Kredit beneran (SRN-PPI & IDXCarbon).
- **Integrasi Data:** Harus lewat API/Streaming ke server (Supabase/Timeseries DB), bukan `localStorage`.

---

## 8. Model Bisnis (B2B SaaS Berlangganan)

- **Target Utama:** Pabrik & BUMN (B2B), **BUKAN instansi pemerintah (B2G)** karena birokrasi budget B2G lambat.
- **Produk Inti:** EnsPR Factory (SaaS berlangganan bulanan/tahunan).

### Tiering Harga (B2B Pabrik)

| Tier | Target | Harga/Bulan | Isi |
|---|---|---|---|
| **Starter** | Pabrik Kecil (Tekstil, Kulit, Makanan) | Rp 3–5 Jt | 1 Site, Manual/Excel, LCA + PROPER Baseline |
| **Pro** | Pabrik Menengah | Rp 8–15 Jt | Multi-User, CEMS Auto-Ingest, Karbon Kredit, What-If Simulator |
| **Enterprise** | KS, Pertamina, Grup Industri | Rp 30–80 Jt | Multi-Site, Private AI, Custom Profil Industri, SLA 99.9% |

> **Prinsip Tiering:** Baseline Kepatuhan PROPER = SAMA di semua tier (pabrik kecil tetap patuh). Yang dibedakan antar tier adalah **kapasitas, otomatisasi data (CEMS/ERP), dan fitur intelijensi (Simulator & Karbon Kredit)**.

---

## 9. Prioritas Eksekusi (Action Plan Terbaru)

1. 🔴 **Simplifikasi Sidebar Navigasi** ➔ Rampingkan dari 14 halaman menjadi 5 Modul Inti.
2. 🔴 **Redesain Data Hub (Satu Pintu)** ➔ Hilangkan redirect, buat Form Manual Sub-Tab, Excel Importer + Template, IoT Stream Log, & AI OCR PDF.
3. 🔴 **Penghilangan Dropdown Industri di Data Entry** ➔ Pindahkan setting industri & profil pabrik ke Settings/Company Profile.
4. 🔴 **Integrasi Kalkulasi Karbon Kredit** ➔ Dihitung riil dari selisih emisi LCA & Carbon Accounting (menghilangkan hardcode demo).
5. 🔴 **Peningkatan Engine PROPER (`predictRank`)** ➔ Masukkan logika LCA & efisiensi emisi untuk menghasilkan peringkat **Hijau** dan **EMAS**.
6. 🟠 **What-If Decision Simulator** ➔ Tambahkan slider simulasi bahan bakar/alat pada halaman LCA.
7. 🟠 **1-Click KLHK Report Generator** ➔ Buat generator PDF/DOCX untuk dokumen DRKPL & ISO LCA.
8. 🟡 **Supabase Wiring** ➔ Hubungkan storage adapter Supabase dengan fallback `localStorage`.

---

*Dokumen evaluasi ini di-update berdasarkan audit arsitektur kode & kesepakatan produk terbaru.*
