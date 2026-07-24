# ensPR — Enterprise Sustainability Platform

Platform LCA (Life Cycle Assessment) & Kepatuhan Lingkungan terintegrasi dengan Penilaian PROPER KLHK dan Monetisasi Karbon Kredit untuk industri manufaktur dan BUMN.

---

## 🎯 Modul Utama (5 Core Modules)

1. **📊 Executive Overview** (`/dashboard`) — Ringkasan eksekutif kesehatan lingkungan & KPI real-time.
2. **⚙️ LCA & Dampak Produk** (`/dashboard/lca`) — Kalkulasi jejak per ton produk (ISO 14040) + What-If Decision Simulator.
3. **🛡️ PROPER Compliance** (`/dashboard/compliance`) — Snapshot Baku Mutu KLHK, Prediksi Rank (Emas/Hijau/Biru), Laporan PDF 1-Klik, & Early Warning.
4. **🪙 Karbon & Offset** (`/dashboard/carbon-accounting` & `/dashboard/carbon-credit`) — Akuntansi emisi Scope 1-3 & Monetisasi Karbon Kredit SRN-PPI.
5. **📥 Data Hub (One-Stop)** (`/dashboard/data-hub`) — Satu pintu masukan data: Form Manual, Impor Excel, Live IoT CEMS, & AI OCR PDF Scanner.

---

## 📚 Dokumentasi Lengkap (`docs/`)

Seluruh dokumen arsitektur dan panduan teknis telah dikonsolidasi di folder **[`docs/`](file:///c:/Users/FACHRY/Documents/project%20sekolah/1ab/docs/README.md)**:

- 📄 **[Evaluasi Arsitektur & Action Plan](file:///c:/Users/FACHRY/Documents/project%20sekolah/1ab/docs/evaluasi.md)**
- 📄 **[Arsitektur Modul Fitur](file:///c:/Users/FACHRY/Documents/project%20sekolah/1ab/docs/arsitektur_fitur.md)**
- 📄 **[Checklist Persiapan PROPER & Baku Mutu](file:///c:/Users/FACHRY/Documents/project%20sekolah/1ab/docs/proper_persiapan.md)**
- 📄 **[Panduan Data Operasional Pabrik](file:///c:/Users/FACHRY/Documents/project%20sekolah/1ab/docs/Data_Yang_Dibutuhkan.md)**
- 📄 **[Dokumentasi Database Compliance](file:///c:/Users/FACHRY/Documents/project%20sekolah/1ab/docs/Fitur_Compliance_Management.md)**
- 📄 **[Panduan Industri PLTU / Energi](file:///c:/Users/FACHRY/Documents/project%20sekolah/1ab/docs/PLTU_Overview.md)**

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL / Supabase
- **Icons & UI:** Lucide React, Framer Motion, Recharts
- **i18n:** Custom locale system (ID/EN)

---

## 🚀 Development Setup

```bash
npm install
npm run dev
```

Aplikasi dapat diakses di `http://localhost:3000`.
