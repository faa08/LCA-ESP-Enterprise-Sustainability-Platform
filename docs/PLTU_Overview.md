# SIP untuk PLTU (Pembangkit Listrik Tenaga Uap)

## Pendahuluan

Dokumen ini berisi penjelasan tentang SIP (Sustainability Intelligence Platform) dari sudut pandang pemilik pabrik PLTU yang ingin membeli/menggunakan platform ini.

---

## 1. Apa itu SIP?

SIP adalah satu dashboard untuk mengelola semua urusan lingkungan perusahaan manufaktur, termasuk PLTU. Data yang tadinya tersebar di berbagai Excel, laporan, dan catatan, digabung jadi satu platform.

**Tiga cara data masuk ke SIP:**
1. **Input manual** — staf isi form di web (belum tersedia)
2. **Import Excel** — upload spreadsheet yang sudah ada (belum tersedia)
3. **Integrasi otomatis** — sensor IoT atau sistem lain kirim data langsung (belum tersedia)

**Status saat ini:** Dashboard dengan 12 modul sudah selesai. Database schema (28 tabel) sudah siap. Form input, import Excel, dan integrasi IoT masih dalam pengembangan.

---

## 2. Fitur yang Paling Cocok untuk PLTU

### 2.1 Carbon Accounting — PRIORITAS #1

PLTU adalah penghasil emisi terbesar. Fitur ini menghitung dan melacak semua emisi GRK.

**Scope 1 (Emisi Langsung):**
- **Pembakaran batu bara** — sumber emisi utama PLTU, dihitung berdasarkan jumlah dan kualitas batu bara (kalori, ash content)
- **Fuel Combustion** — solar untuk boiler start-up, diesel untuk fire pump
- **Company Vehicles** — kendaraan operasional tambang/plant
- **Generators** — genset darurat

**Scope 2 (Emisi Tidak Langsung):**
- **Purchased Electricity** — listrik dari PLN untuk operasional kantor & auxiliary
- **Purchased Steam** — jika ada pembelian steam dari pihak ketiga

**Scope 3 (Rantai Pasok):**
- **Transportasi batu bara** — dari tambang ke PLTU (ton.km)
- **Suppliers** — emisi dari pemasok utama (batu bara, spare parts, chemicals)
- **Business Travel** — perjalanan dinas karyawan
- **Waste Disposal** — pembuangan limbah (fly ash, bottom ash, limbah B3)
- **Employee Commuting** — transportasi karyawan harian

**Target & Tracking:**
- Carbon reduction targets (SBTi-aligned)
- Carbon offsets (VER, CER, carbon credits)
- Grafik tren emisi bulanan/tahunan
- 9 kategori detail dengan perubahan YoY

**Database Tables:** `carbon_emissions`, `carbon_reduction_targets`, `carbon_offsets`, `emission_factors`

### 2.2 Air Emissions (Environmental Monitoring)

PLTU diawasi ketat soal cerobong asap oleh Kementerian Lingkungan.

**Parameter yang dipantau:**
- SO₂ (sulfur dioksida) — dari pembakaran batu bara
- NOx (nitrogen oksida) — dari suhu pembakaran tinggi
- Partikulat (debu, fly ash) — dari cerobong
- Merkuri (Hg) — kandungan dalam batu bara
- VOC — jika relevan

**Fitur:**
- Perbandingan dengan baku mutu (limit_value vs actual)
- Peringatan otomatis jika melebihi ambang batas (exceedance flag)
- Data per cerobong (stack/source)
- Tracking hasil uji emisi berkala (3 atau 6 bulanan)

**Database Tables:** `air_emissions`, `environmental_incidents`, `environmental_targets`

### 2.3 Water Monitoring

PLTU membutuhkan banyak air pendingin (cooling water).

**Yang dipantau:**
- **Intake** — air dari sungai/laut untuk pendingin
- **Consumption** — air yang terpakai (evaporasi cooling tower)
- **Discharge** — air buangan (wastewater treatment outlet)
- **Recycling** — air yang didaur ulang

**Kualitas Air:**
- pH, TSS, COD, BOD — parameter wajib lapor ke Kemen LHK
- Suhu air buangan — kritis untuk PLTU (thermal pollution)

**Deteksi Kebocoran:**
- Pipeline, cooling tower, storage tank — severity & status tracking

**Database Tables:** `water_data`, `water_targets`, `water_leak_events`

### 2.4 Waste Management

Limbah utama PLTU dan cara pelacakannya.

**Limbah Padat:**
| Jenis Limbah | Jumlah (contoh) | Status |
|-------------|----------------|--------|
| Fly Ash | 50.000 t/tahun | B3 (dapat dimanfaatkan) |
| Bottom Ash | 10.000 t/tahun | Non-B3 |
| Gypsum FGD | 15.000 t/tahun | Non-B3 (jika ada FGD) |
| Limbah B3 lainnya | 500 t/tahun | B3 (oli bekas, kimia lab) |

**Fitur:**
- Tracking per kategori limbah
- Manifest limbah B3 (nomor dokumen)
- Vendor disposal & biaya
- Tingkat daur ulang (fly ash untuk semen, gypsum untuk bahan bangunan)
- Program pengurangan limbah

**Database Tables:** `waste_data`, `waste_reduction_programs`

### 2.5 Compliance Management

PLTU terkena aturan lingkungan yang sangat ketat.

**Standar & Regulasi:**
| Standar | Keterangan |
|---------|------------|
| PROPER | Program Kemen LHK — peringkat warna (Emas/Hijau/Biru/Merah/Hitam) |
| Baku Mutu Emisi | Permen LHK No. 15/2019 (dan update) |
| Baku Mutu Air Limbah | Permen LHK untuk air pendingin & limbah |
| ISO 14001 | Sistem manajemen lingkungan |
| AMDAL/UKL-UPL | Dokumen izin lingkungan |
| Izin Pembuangan Air Limbah | IPLC |
| Izin Emisi | Izin cerobong |

**Fitur:**
- Compliance score otomatis (94/100 contoh)
- Audit management (internal & eksternal)
- Tracking findings & corrective actions
- Deadline calendar (perpanjangan izin, jadwal audit)
- Status per standar (certified/compliant/submitted/pending)

**Database Tables:** `compliance_standards`, `compliance_items`, `compliance_audits`, `audit_findings`, `corrective_actions`

### 2.6 ESG Reporting

Generate laporan untuk berbagai kebutuhan.

**Jenis Laporan untuk PLTU:**
- **Laporan PROPER** — tahunan ke Kemen LHK
- **CDP Climate Change** — untuk investor global
- **TCFD Report** — climate-related financial disclosures
- **Laporan Keberlanjutan** — tahunan untuk publik & pemangku kepentingan
- **GRI Content Index** — indeks indikator GRI

**Fitur:**
- Report generator (pilih framework + data range)
- Export PDF & Excel
- Tracking ESG score historis (S&P Global, DJSI, dll)
- 142/147 GRI Indicators reported (contoh)

**Database Tables:** `esg_reports`, `esg_scores`, `v_report_summary`

---

## 3. Cara Kerja AI

### 3.1 Prinsip Kerja

AI di SIP bertugas sebagai **asisten yang memantau data 24 jam** dan memberi tahu jika ada sesuatu yang perlu diperhatikan.

Cara kerjanya:
```
Data masuk → AI membandingkan dengan data historis → Jika ada anomali → Muncul notifikasi + rekomendasi
```

### 3.2 Contoh di PLTU

**Skenario 1:** Pemakaian batu bara minggu ini naik 12%, tapi listrik yang dihasilkan sama.
- AI mendeteksi ketidakwajaran
- Notifikasi: "Cek efisiensi boiler A, ada potensi masalah"
- Manfaat: Masalah diketahui sebelum jadi denda PROPER atau kerusakan alat

**Skenario 2:** Suhu air buangan naik 3°C dalam seminggu.
- AI membandingkan dengan data historis
- Notifikasi: "Thermal discharge mendekati batas — periksa cooling tower"
- Manfaat: Mencegah pelanggaran baku mutu

**Skenario 3:** Deadline sertifikasi ISO 14001 tinggal 30 hari.
- AI-based predictive warning
- Notifikasi: "Sertifikasi ISO 14001 akan expired — siapkan audit"
- Manfaat: Tidak ada izin yang terlewat

### 3.3 Kapan AI Aktif?

Setelah data rutin masuk minimal 2-3 bulan. Semakin banyak data, semakin akurat rekomendasinya. AI bersifat opsional — bisa diaktifkan kapan saja.

### 3.4 Database AI
| Table | Fungsi |
|-------|--------|
| `ai_insights` | Menyimpan insight yang dihasilkan (severity, category, recommendation, potential_savings) |
| `ai_insight_logs` | Log deteksi (source table, source record, detection rule, confidence score) |

---

## 4. Alur Kerja SIP

### 4.1 Alur Harian/Mingguan/Bulanan

| Frekuensi | Aktivitas | Durasi |
|-----------|-----------|--------|
| **Bulanan** | Staf input data (energi, air, limbah, emisi) | 5-10 menit per modul |
| **Mingguan** | Manajer buka dashboard, lihat grafik, cek anomali | 15 menit |
| **Bulanan** | Review KPI, bandingkan target vs aktual | 30 menit |
| **Kuartalan** | Review compliance, target pengurangan, persiapan audit | 1-2 jam |
| **Tahunan** | Generate laporan ESG otomatis, tinggal unduh PDF/Excel | 1 hari |

### 4.2 Siapa yang Menggunakan?

| Peran | Fokus Utama | Modul |
|-------|-------------|-------|
| **Direktur Pabrik** | Semua KPI dalam satu layar | Executive Overview |
| **Manager HSE** | Emisi, compliance, insiden | Environmental, Carbon, Compliance |
| **Engineer Lingkungan** | Data detail per shift/hari | Air, Water, Waste |
| **Manager Operasi** | Efisiensi energi, equipment | Energy Monitoring |
| **Tim ESG** | Laporan tahunan, rating | ESG Reporting, LCA |
| **Admin/IT** | Konfigurasi platform | Settings |

---

## 5. Status Pengembangan Saat Ini

### Sudah Selesai (✅)
| Komponen | Detail |
|----------|--------|
| Dashboard dengan 12 modul | Semua halaman sudah berfungsi dengan data contoh |
| Executive Overview | 8 KPI cards, 2 charts, KPI progress, issues list |
| Halaman per modul | Carbon (9 kategori), LCA (5 stages), Waste (5 kategori), dll |
| UI Components | Card, StatCard, KPI Progress, Badge (5 variants) |
| Database schema | 28 tables, 5 views, 3 functions |
| TypeScript types | Database types, shared interfaces |

### Ditunda (⏸️)
| Komponen | Alasan |
|----------|--------|
| RLS (Row-Level Security) | Akan diaktifkan setelah ada data real |

### Belum (📝)
| Komponen | Prioritas |
|----------|-----------|
| Form input data | **Tinggi** — diperlukan agar user bisa memasukkan data sendiri |
| Import Excel | **Tinggi** — memudahkan migrasi data dari Excel |
| Integrasi IoT/API | **Sedang** — untuk koneksi sensor real-time |
| AI Insights aktif | **Rendah** — butuh data historis 2-3 bulan |

---

## 6. Istilah Penting

| Istilah | Arti |
|---------|------|
| **Scope 1** | Emisi langsung dari sumber perusahaan (contoh: cerobong PLTU) |
| **Scope 2** | Emisi dari listrik yang dibeli (PLN) |
| **Scope 3** | Emisi dari rantai pasok (transportasi batu bara, supplier, dll) |
| **CO₂e** | Carbon dioxide equivalent — semua GRK dikonversi ke CO₂ |
| **PROPER** | Program Penilaian Peringkat Kinerja Perusahaan (Kemen LHK) |
| **SBTi** | Science Based Targets initiative — target pengurangan emisi berbasis ilmu |
| **LCA** | Life Cycle Assessment — dampak lingkungan dari awal sampai akhir |
| **ESG** | Environmental, Social, Governance — laporan keberlanjutan |
| **KPI** | Key Performance Indicator — indikator kinerja utama |
| **FGD** | Flue Gas Desulfurization — alat pengurang SO₂ di PLTU |
| **GWP** | Global Warming Potential — potensi pemanasan global |
| **B3** | Bahan Berbahaya dan Beracun — limbah yang perlu penanganan khusus |
| **RLS** | Row-Level Security — keamanan data per perusahaan di database |
| **AMDAL** | Analisis Mengenai Dampak Lingkungan — dokumen izin utama |
| **UKL-UPL** | Upaya Pengelolaan Lingkungan - Upaya Pemantauan Lingkungan |

---

## 7. FAQ

### Q: Apakah harus pakai AI? Gimana kalau tidak mau?
A: Bisa. AI sifatnya opsional dan bisa diaktifkan nanti setelah data terkumpul.

### Q: Data sekarang masih di Excel, bagaimana?
A: Bisa import langsung lewat fitur upload Excel yang akan segera tersedia. Format yang paling mudah: Excel per modul dengan kolom bulan, parameter, nilai, satuan.

### Q: Apa bedanya dengan sistem yang sudah ada?
A: Sekarang data terpisah-pisah (Excel terpisah untuk emisi, air, limbah, compliance). SIP menggabungkan semuanya dalam satu dashboard sehingga:
- Tidak perlu rekap manual dari berbagai sumber
- Semua data terkait bisa dianalisis bersama
- Laporan bisa di-generate otomatis

### Q: Berapa lama implementasinya?
A: Tergantung kesiapan data:
- **Jika data sudah rapi** dalam Excel: 1-2 minggu untuk setup dan pelatihan staf
- **Jika data perlu dikumpulkan** dari berbagai sumber: 1-2 bulan

### Q: Apakah integrasi dengan IoT/PLC bisa?
A: Bisa melalui API. Ini untuk tahap lanjutan. Beberapa parameter yang bisa diintegrasikan:
- Pemakaian listrik real-time dari meteran digital
- Suhu & tekanan dari sensor PLC
- Emisi kontinu dari CEMS (Continuous Emission Monitoring System)

### Q: Bagaimana dengan keamanan data?
A: Setiap perusahaan punya database terpisah (multi-tenant via organization_id). RLS siap diaktifkan untuk memastikan pengguna hanya bisa melihat data perusahaannya sendiri.

### Q: Apakah bisa tracking multiple PLTU dalam satu akun?
A: Bisa. Fitur Facility Management memungkinkan pengelolaan banyak fasilitas dalam satu organisasi. Ada hierarchy facility (parent-child) untuk struktur kompleks.
