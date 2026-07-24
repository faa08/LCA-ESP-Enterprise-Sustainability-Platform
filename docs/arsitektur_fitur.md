# Arsitektur & Modul Fitur — ensPR (LCA + PROPER + Karbon Kredit)

Dokumen ini menjelaskan arsitektur 5 modul utama platform ensPR setelah penyederhanaan (*feature bloat reduction*).

---

## 1. Arsitektur Modul Utama (5 Core Modules)

```text
📁 PLATFORM ESP / ENSPR
│
├── 📊 Executive Overview       (Bird's-eye view, Health Check Pabrik, & Stat Card Real)
├── ⚙️ LCA & Dampak Produk     (Kalkulator LCA ISO 14040/14044 + What-If Decision Simulator)
├── 🛡️ PROPER Compliance        (Snapshot Baku Mutu KLHK + 1-Click PDF Report + Early Warning)
├── 🪙 Karbon & Offset          (Carbon Accounting Scope 1-3 + Monetisasi Karbon Kredit SRN-PPI)
└── 📥 Data Hub (One-Stop)      (4 Metode Ingestion: Manual Form, Excel Smart Importer, Live CEMS IoT, & AI OCR PDF)
```

---

## 2. Detail Modul & Fitur

### 📊 1. Executive Overview (`/dashboard`)
- **Fungsi:** Dashboard ringkasan eksekutif untuk Direktur & Plant Manager.
- **Metrik Utama:** Status PROPER Rank terkini, Total Emisi Karbon (tCO₂e), Efisiensi Air & Energi, dan Tiket Insiden Lingkungan.
- **Visualisasi:** Health Check Status, Trend Emisi Bulanan, dan Peringatan Dini.

### ⚙️ 2. LCA & Dampak Produk (`/dashboard/lca`)
- **Fungsi:** Mesin utama kalkulasi jejak lingkungan per unit produk (ton baja, ton minyak goreng, ton kain).
- **Standar ISO 14040/14044 (11 Kategori Dampak PROPER KLHK):**
  1. *Global Warming Potential (GWP)* (`kg CO₂-eq`)
  2. *Ozone Depletion Potential (ODP)* (`kg CFC-11-eq`)
  3. *Acidification Potential (AP / Hujan Asam)* (`kg SO₂-eq`)
  4. *Eutrophication Potential (EP)* (`kg PO₄-eq`)
  5. *Photochemical Oxidant Creation (POCP)* (`kg C₂H₄-eq`)
  6. *Abiotic Depletion - Fossil & Non-Fossil* (`MJ`)
  7. *Penurunan Sumber Daya Biotik* (`kg`)
  8. *Potensi Karsinogenik* (`CTUh`)
  9. *Toxicity (Human & Eco)* (`CTUe`)
  10. *Water Footprint* (`m³`)
  11. *Land Use Change* (`m²-yr`)
- **What-If Decision Simulator:** Slider simulasi penggantian bahan bakar (contoh: batubara ➔ biomassa) untuk menghitung penurunan emisi, Kenaikan Rank PROPER, dan Potensi Karbon Kredit.
- **YoY Delta Comparison (Bukti PROPER Emas):** Fitur pembanding tren penurunan dampak dibanding studi LCA tahun sebelumnya sebagai bukti fisik *beyond compliance* bagi asesor KLHK.

### 🛡️ 3. PROPER Compliance (`/dashboard/compliance`)
- **Fungsi:** Pusat kepatuhan baku mutu KLHK (Emisi Cerobong Permen LH 7/2007, Air Limbah Permen LH 5/2014, & Limbah B3 PP 101/2014).
- **Resolusi Baku Mutu Berlapis (*Layered Standards*):** Otomatis membandingkan Baku Mutu Nasional KLHK, Perda Gubernur, dan Izin AMDAL Site — sistem menegakkan nilai yang **paling ketat** sebagai acuan penataan.
- **Engine Rank:** Prediksi peringkat otomatis (Hitam, Merah, Biru, Hijau, Emas).
- **1-Click Official Report Generator:** Cetak PDF Dokumen DRKPL (PROPER Emas/Hijau) & File Format SIMPEL KLHK (e-RKL-RPL).
- **Early Warning & Action Ticket:** Alert WhatsApp/Telegram & tiket rekomendasi tindakan pencegahan saat parameter mendekati baku mutu.

### 🪙 4. Karbon & Offset (`/dashboard/carbon-accounting` & `/dashboard/carbon-credit`)
- **Fungsi:** Akuntansi Emisi Karbon Scope 1, Scope 2, dan Scope 3 sekaligus kalkulator Monetisasi Karbon Kredit.
- **Kredit Karbon Riil:** Dihitung otomatis dari selisih emisi baseline vs emisi hasil LCA.
- **SRN-PPI & IDXCarbon Ready:** Dokumentasi Audit Trail tamper-proof untuk pendaftaran proyek penurunan emisi ke Sistem Registri Nasional KLHK.

### 📥 5. Data Hub (One-Stop Ingestion) (`/dashboard/data-hub`)
- **Fungsi:** Satu pintu tempat masuknya seluruh data operasional tanpa melempar pengguna ke halaman terpisah.
- **Matriks Konversi Satuan Standar:** Normalisasi otomatis satuan data LCI (Massa: kg/ton; Energi: kWh/MJ; Volume: m³/liter; Transportasi: ton-km).
- **4 Metode Ingestion:**
  1. *Form Manual Terstruktur* (Sub-tab Air, Emisi, B3, Energi, LCA).
  2. *Excel Smart Importer* (Download Template Resmi, Drag & Drop, Preview Tabel).
  3. *Live Stream IoT CEMS & ERP API* (Status Online + Realtime Stream Log Ticker).
  4. *AI PDF & OCR Parser* (Scan Laporan Hasil Uji Lab Sucofindo/DLH).

---

## 3. Fitur yang Didepresiasi / Diintegrasikan

- **Input Manual (`/dashboard/input`)** ➔ Di-merge ke Tab Form Manual di Data Hub.
- **Energy, Water, Waste Monitoring** ➔ Di-merge sebagai sub-tab di Data Hub & Compliance.
- **AI Insights (`/dashboard/ai-insights`)** ➔ Di-merge sebagai widget rekomendasi di LCA & PROPER.
- **Documents (`/dashboard/documents`)** ➔ Di-merge sebagai Tab Audit Berkas di PROPER Compliance.
