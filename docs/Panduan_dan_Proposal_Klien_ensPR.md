# ensPR — Executive Client Deck & Product Presentation

> **Enterprise Sustainability Platform:** Integrated Life Cycle Assessment (LCA), KLHK PROPER Compliance Simulation, & Carbon Credit Monetization for Manufacturing & BUMN Industries.

---

## Executive Summary

**ensPR** adalah platform *Enterprise Sustainability Software (B2B SaaS)* terintegrasi yang dirancang khusus untuk industri manufaktur dan BUMN di Indonesia. Platform ini menggabungkan tiga pilar utama:
1. **Life Cycle Assessment (LCA) ISO 14040/14044** per ton produk.
2. **Simulasi & Otomatisasi Kepatuhan PROPER KLHK** (Peringkat Emas, Hijau, Biru).
3. **Monetisasi Kredit Karbon** yang terdaftar di SRN-PPI KLHK & Bursa Karbon (IDXCarbon).

Melalui otomatisasi pemantauan emisi, simulasi keputusan *What-If*, dan ekspor dokumen resmi 1-klik, **ensPR** membantu perusahaan menghemat biaya konsultan hingga 70%, mencegah sanksi penghentian operasi oleh KLHK, serta mengubah pengelolaan lingkungan dari *cost center* menjadi *profit center*.

---

## Industry Challenges

Perusahaan manufaktur dan BUMN di Indonesia menghadapi 4 tantangan besar dalam pengelolaan lingkungan:

1. **Regulasi Ketat & Sanksi Berat:** Regulasi KLHK (Perpres 98/2021 & PermenLHK PROPER) menetapkan sanksi tegas hingga penutupan operasi pabrik jika emisi/limbah melampaui Baku Mutu.
2. **Biaya Konsultan Audit Mahal:** Pembuatan Dokumen LCA dan Dokumen Ringkasan Kinerja Pengelolaan Lingkungan (DRKPL) secara manual memerlukan biaya konsultan Rp 50–150 Juta per sekali audit.
3. **Proses Pelaporan Manual & Lambat:** Pengumpulan data emisi lewat kertas/Excel memakan waktu hingga 3 bulan tim EHS, meningkatkan risiko kesalahan manusia (*human error*).
4. **Potensi Karbon Kredit yang Terbuang:** Penghematan emisi produk belum terdokumentasi secara *tamper-proof* sehingga tidak dapat diklaim sebagai nilai ekonomi karbon di IDXCarbon.

---

## About ENSPR

**ENSPR** (Enterprise Sustainability & PROPER Platform) adalah pionir software manajemen keberlanjutan industri di Indonesia. Kami menjembatani kebutuhan teknis *Engineering EHS* pabrik dengan tuntutan regulasi *KLHK* serta transaksi pasar keuangan *Karbon Kredit*.

- **Misi:** Membantu 1.000+ industri di Indonesia mencapai status PROPER Emas/Hijau dan memonetisasi penurunan emisi karbon secara berkelanjutan.
- **Standar Internasional:** Mengadopsi standar ISO 14040/14044 (LCA), GHG Protocol Scope 1-3, Perpres 98/2021 (NEK), dan pedoman TEK KLHK.

---

## Platform Overview

**ensPR** bertindak sebagai *Central Command Center* keberlanjutan pabrik Anda dengan arsitektur multi-tenant yang aman dan mudah diakses dari perangkat apa pun.

```text
                                ┌────────────────────────────────────────┐
                                │       EXECUTIVE COMMAND CENTER         │
                                └───────────────────┬────────────────────┘
                                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│   LCA ENGINE  │           │    PROPER     │           │    CARBON     │
│  ISO 14040    │           │  COMPLIANCE   │           │    CREDIT     │
└───────┬───────┘           └───────┬───────┘           └───────┬───────┘
        │                           │                           │
        └───────────────────────────┼───────────────────────────┘
                                    │
                                ┌───┴────────────────┐
                                │ DATA HUB INGESTION │
                                └───┬─────────────┬──┘
                                    │             │
                             ┌──────┴──────┐ ┌────┴────────┐
                             │ CEMS / IoT  │ │ Excel / OCR │
                             └─────────────┘ └─────────────┘
```

---

## Core Modules

 Platform **ensPR** disederhanakan menjadi **5 Modul Inti Enterprise**:

| Modul Utama | Fungsi Utama | Nilai Tambah Bagi Pabrik |
|---|---|---|
| **📊 Executive Overview** | Ringkasan eksekutif KPI emisi, status PROPER real-time, & health check. | Direksi & GM dapat memantau kesehatan lingkungan pabrik dalam 1 layar. |
| **⚙️ LCA & Dampak Produk** | Kalkulator jejak dampak 11 indikator ISO per ton produk + What-If Simulator. | Mengidentifikasi *hotspot* emisi & simulasi ROI penggantian bahan bakar. |
| **🛡️ PROPER Compliance** | Monitoring Baku Mutu Air, Emisi, B3, & Generator Dokumen PDF KLHK 1-Klik. | Otomatisasi dokumen DRKPL PROPER Emas/Hijau & pencegahan sanksi. |
| **🪙 Karbon & Offset** | Akuntansi emisi Scope 1, 2, 3 & Kalkulator Monetisasi Karbon Kredit SRN-PPI. | Mengubah penurunan emisi produk menjadi pendapatan Karbon Kredit di IDXCarbon. |
| **📥 Data Hub (One-Stop)** | Pusat masukan data: Manual Form, Excel Importer, IoT CEMS Stream, & AI OCR. | Satu pintu *ingestion data* tanpa melempar pengguna ke halaman terpisah. |

---

## AI-Powered Features

**ensPR** dilengkapi fitur kecerdasan buatan (*Artificial Intelligence*) untuk mempercepat operasional EHS:

1. **AI OCR PDF Scanner (Scan Laporan Lab):** Pindai otomatis file PDF Laporan Hasil Uji (LHU) dari lab eksternal (Sucofindo / UPTD DLH) untuk mengekstrak angka uji (pH, COD, BOD, SO₂) tanpa diketik manual.
2. **What-If Decision Simulator:** Menggunakan algoritma prediksi untuk mensimulasikan dampak perubahan teknologi/bahan bakar terhadap Peringkat PROPER & Potensi Kredit Karbon.
3. **Automated Anomaly Detection:** Deteksi dini lonjakan emisi abnormal sebelum melampaui Baku Mutu KLHK.

---

## Dashboard Preview

Platform **ensPR** dirancang dengan UI/UX kelas dunia:
- **Clean Enterprise Aesthetics:** Menggunakan skema warna profesional, kartu KPI terstruktur, dan grafik interaktif (Recharts & Framer Motion).
- **Contextual Intelligence Widgets:** Rekomendasi tindakan perbaikan langsung muncul di konteks masalah, bukan di halaman terpisah.
- **Mobile & Tablet Responsive:** Dapat diakses oleh General Manager maupun Operator Lapangan kapan saja.

---

## How It Works

Alur operasional penggunaan platform dalam **5 Langkah Praktis**:

1. **Step 1 — Account Setup (Sekali di Awal):** Registrasi profil perusahaan, lokasi site, dan penamaan titik uji (*Cerobong Boiler, Outfall IPAL, TPS B3*).
2. **Step 2 — Data Ingestion (Bulanan / Real-time):** Masukkan data lewat Data Hub via Form Manual, Upload Excel, Stream CEMS, atau Scan PDF LHU.
3. **Step 3 — Run LCA & What-If Simulation:** Sistem mengkalkulasi 11 indikator dampak ISO dan mensimulasikan proyeksi peringkat PROPER Anda.
4. **Step 4 — Generate KLHK Reports (1-Klik):** Cetak otomatis Dokumen DRKPL PROPER Emas/Hijau & File SIMPEL KLHK siap serah.
5. **Step 5 — Claim Carbon Credits:** Daftarkan proyek penurunan emisi Anda ke SRN-PPI KLHK untuk diperdagangkan di Bursa Karbon.

---

## System Architecture

**ensPR** dibangun menggunakan arsitektur teknologi modern berstandar enterprise:

- **Frontend & App Layer:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4.
- **Database & Storage:** PostgreSQL / Supabase dengan **Row-Level Security (RLS)** untuk isolasi total data antar tenant/pabrik.
- **API & Real-time Integration:** MQTT Protocol untuk IoT CEMS telemetri & REST API untuk koneksi ERP (SAP/Oracle).
- **Deployment Options:** Shared Cloud SaaS (Vercel/Supabase) atau Dedicated On-Premise Server (Docker/Kubernetes).

---

## Integration & Data Sources

Platform mendukung **4 Metode Ingestion Data** tanpa hambatan:

1. **Form Manual Terstruktur:** Pengisian data harian/bulanan dengan sub-tab per kategori operasional.
2. **Excel & CSV Smart Importer:** Fitur download template resmi, *drag-and-drop*, pratinjau tabel, dan *auto-mapping*.
3. **Live Stream IoT CEMS & ERP:** Koneksi telemetri otomatis dari instrumen CEMS cerobong & sistem ERP pabrik.
4. **AI PDF LHU Scanner:** Ekstraksi otomatis dari sertifikat hasil uji laboratorium eksternal.

---

## Security & Compliance

Keamanan data industri Anda adalah prioritas utama kami:

- **Tenant Data Isolation:** Isolasi data ketat menggunakan Supabase Row-Level Security (RLS). Tidak ada pabrik lain yang dapat melihat data emisi Anda.
- **Bank-Grade Encryption:** Enkripsi SSL/TLS 256-bit saat data dikirim (*in-transit*) dan saat disimpan (*at-rest*).
- **Tamper-Proof Audit Trail:** Setiap masukan dan perubahan data tercatat dengan timestamp resmi sebagai bukti sah audit verifikator.
- **On-Premise Ready:** Opsi instalasi di Data Center internal perusahaan bagi BUMN dengan regulasi kerahasiaan data ketat.

---

## Pricing

Tiga pilihan paket berlangganan B2B SaaS yang disesuaikan dengan skala pabrik Anda:

| Fitur / Spesifikasi | 🟢 STARTER | 🚀 PRO (MOST POPULAR) | 🏛️ ENTERPRISE |
|---|---|---|---|
| **Harga Bulanan** | **Rp 4.900.000** / bln | **Rp 19.900.000** / bln | **Rp 49.900.000** / bln |
| **Harga Tahunan** | **Rp 49.000.000** / thn | **Rp 199.000.000** / thn | **Rp 499.000.000** / thn |
| **Fasilitas Site** | 1 Site Pabrik | Hingga 3 Site Pabrik | Unlimited Sites |
| **Jumlah Akun** | 3 Users | 10 Users | Unlimited Users |
| **Modul Fitur** | Manual/Excel, LCA, Baseline PROPER | All Starter + IoT CEMS, What-If, Karbon Kredit, AI OCR | All Pro + Private Cloud, Custom SCADA/SAP, SLA 99.9% |

---

## Implementation Roadmap

Jadwal peluncuran dan implementasi platform di pabrik Anda (Total: 2–3 Minggu):

- **Minggu 1 — Onboarding & Configuration:** Registrasi akun, setup profil pabrik, penamaan titik cerobong/IPAL, & override Baku Mutu AMDAL site.
- **Minggu 2 — Data Migration & Integration:** Impor data historis 1 tahun terakhir & pengujian koneksi CEMS IoT / API ERP.
- **Minggu 3 — Training & Go-Live:** Pelatihan tim EHS & Operator, uji coba generator PDF laporan, & platform siap digunakan penuh.

---

## Contact & Closing

Tingkatkan Peringkat PROPER KLHK dan Monetisasi Karbon Kredit Pabrik Anda Bersama ensPR.

- **Email Penawaran:** sales@enspr.id
- **Customer Support / WA:** +62 812-3456-7890
- **Website Platform:** https://enspr.id
- **Alamat Kantor:** ensPR Technology Center, Jakarta, Indonesia
