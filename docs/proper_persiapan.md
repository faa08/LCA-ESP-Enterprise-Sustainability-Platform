# Checklist Persiapan — Sistem PROPER (ensPR)

Panduan persiapan data dan parameter baku mutu agar platform pemantauan PROPER
(Emisi Cerobong / Air Limbah / Limbah B3 / Dokumen Hijau LCA) siap ditawarkan ke pabrik naungan KLHK.

---

## 1. Data Baku Mutu (PALING KRITIS)

Sistem membandingkan nilai pabrik ke baku mutu nasional (PermenLHK).
Tanpa angka ini, sistem hanya menggunakan angka acuan/placeholder.

### 1A. Air Limbah (SP PL) — Per Jenis Industri
> Format: Parameter | Satuan | Kadar Maksimum
> Status: ✅ = Sudah ada di library, ❌ = Belum

- [x] **Penyamakan Kulit**
  - pH 6–9, BOD 30, COD 200, NH₃-N 2, TKN 30, Krom 0,6, Minyak&Lemak 5, Sulfida 0,8, TSS 60, Volume 40 m³/ton
- [x] **Minyak Goreng (proses basah)** — Permen LH 5/2014
  - pH 6–9, BOD 75, COD 150, TSS 60, Minyak&Lemak 5, MBAS 3, Fosfat 2
- [x] **Tekstil / Pencelupan** — Permen LH 5/2014 Lampiran XLII (P.16/2019)
  - pH 6–9, BOD 60, COD 150, TSS 50, Fenol 0,5, Cr 1,0, NH₃-N 8, Sulfida 0,3, Minyak&Lemak 3
- [ ] Kertas / Pulp & Paper
- [ ] Kimia / Petrokimia
- [ ] Semen
- [ ] Logam / Baja
- [ ] Lainnya

> Rujukan: PermenLHK No. 5/2014 + perubahannya, atau Peraturan Gubernur setempat.

### 1B. Emisi Cerobong (SP Parmen) — Per Sektor Sumber
> Parameter umum: TSP/Partikulat, SO₂, NOx, CO, HCl, HF, NH₃, Opasitas (%)
> Status: ❌ = Butuh angka spesifik per sektor

- [ ] Boiler / Ketel uap
- [ ] Pembangkit Listrik (PLTU / Genset)
- [ ] Industri Semen
- [ ] Industri Baja
- [ ] Industri Pupuk
- [ ] Pulp & Paper
- [ ] Petrokimia

> Rujukan: Permen LH 7/2007. Baku mutu berbeda berdasarkan jenis bahan bakar
> (Batubara: TSP 230 / SO₂ 850 / NOx 400; Gas: SO₂ 150 / NOx 650; Minyak: SO₂ 850 / NOx 450; Biomassa: TSP 300).

### 1C. Limbah B3 (SP LB3) — Checklist Kepatuhan Operational
> Status admin & operasional (✅/❌)

- [x] TPS B3 memiliki izin resmi KLHK / Pemda
- [x] Label limbah B3 sesuai ketentuan
- [x] Simbol B3 dipasang lengkap
- [x] Manifest limbah B3 (Festronik KLHK) lengkap
- [x] Pengangkutan sesuai aturan transporter berizin
- [x] Penyimpanan (Masa simpan ≤ 90 hari)
- [x] Pemanfaatan / daur ulang berizin
- [x] Pengolahan & penimbunan akhir

> Rujukan: PP No. 22 Tahun 2021 (Pasal 274 dst, menggantikan PP 101/2014 yang telah dicabut) + Permen LHK No. 6 Tahun 2021 tentang Tata Cara dan Persyaratan Pengelolaan Limbah B3.

### 1D. Life Cycle Assessment (LCA) — 11 Kategori Dampak Wajib PROPER Hijau/Emas
> Syarat mutlak Dokumen Hijau PROPER sejak 2018 (ISO 14040 / 14044)

- [x] Global Warming Potential (GWP - kg CO₂-eq)
- [x] Ozone Depletion Potential (ODP - kg CFC-11-eq)
- [x] Acidification Potential / Hujan Asam (AP - kg SO₂-eq)
- [x] Eutrophication Potential (EP - kg PO₄-eq)
- [x] Photochemical Oxidant Creation Potential (POCP - kg C₂H₄-eq)
- [x] Abiotic Depletion - Fossil & Non-fossil (MJ)
- [x] Penurunan Sumber Daya Biotik (kg)
- [x] Potensi Karsinogenik (CTUh)
- [x] Toxicity (Human & Eco Toxicity - CTUe)
- [x] Water Footprint (m³)
- [x] Land Use Change (m²-yr)

---

## 2. Profil Pabrik (Account Setup Sekali Saat Register)

Tiap pabrik diset 1x pada menu Settings/Profil Akun:

- [x] Nama perusahaan / pabrik (contoh: *PT Krakatau Steel Plant Cilegon*)
- [x] Jenis industri (Pilihan industri utama)
- [x] Lokasi (provinsi/kota) — untuk override Peraturan Gubernur setempat
- [x] Izin lingkungan (No. UKL-UPL / AMDAL)
- [x] Nama unit titik uji (Nama Cerobong, IPAL, & TPS B3)

---

## 3. Sumber Data Ingestion di Data Hub (Satu Pintu)

- [x] **Form Manual Terstruktur** — Input per kategori (Air/Emisi/B3/Energi/LCA)
- [x] **Template Excel/CSV** — Download template resmi, drag & drop, preview tabel
- [x] **IoT / CEMS / ERP** — Koneksi live stream telemetri SISPEK/CEMS
- [x] **AI OCR PDF Reader** — Scan otomatis Laporan Hasil Uji (LHU) dari lab eksternal

---

## 4. Catatan

- Baku mutu default = NASIONAL (PermenLHK). Perda/Gubernur bisa di-override di Settings.
- Data saat ini masih terhubung ke fallback `localStorage` sampai wiring Supabase selesai.

Landasan Hukum Utama Penilaian PROPER KLHK
Undang-Undang Acuan Utama:

UU No. 32 Tahun 2009 tentang Perlindungan dan Pengelolaan Lingkungan Hidup (PPLH).
PP No. 22 Tahun 2021 tentang Penyelenggaraan Perlindungan dan Pengelolaan Lingkungan Hidup (turunan UU Cipta Kerja).
Peraturan Menteri LHK (Pedoman Resmi PROPER):

Permen LHK No. 1 Tahun 2021 tentang Program Penilaian Peringkat Kinerja Perusahaan Dalam Pengelolaan Lingkungan Hidup (Ini adalah "kitab utama" / juknis penilaian PROPER dari Merah sampai Emas).
Peraturan Sektoral Baku Mutu (Diacu untuk Peringkat Biru/Ketaatan):

Air Limbah (SP PL): Permen LHK No. 5 Tahun 2014 tentang Baku Mutu Air Limbah (beserta revisi per industrinya).
Emisi Udara (SP Parmen): Permen LHK No. 7 Tahun 2007 (Emisi Sumber Tidak Bergerak), Permen LHK No. 15/2019 (Emisi Pembangkit Termal), & Permen LHK No. 13/2021 (Sistem Pemantauan Emisi Realltime - SISPEK).
Limbah B3 (SP LB3): Permen LHK No. 6 Tahun 2021 tentang Tata Cara dan Persyaratan Pengelolaan Limbah B3 (termasuk Festronik/Manifest elektronik).
Standar Beyond Compliance (Diacu untuk Peringkat Hijau & Emas):

LCA (Life Cycle Assessment): Standar ISO 14040 & ISO 14044 yang disyaratkan dalam Permen LHK No. 1/2021.
Sistem Manajemen Lingkungan: Standar ISO 14001.
