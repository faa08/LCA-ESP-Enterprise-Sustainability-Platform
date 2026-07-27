# Penjelasan Pengisian Data: PT. Lautan Otsuka Chemical

Dokumen ini menjelaskan secara lengkap bagaimana data untuk **Modul 0-2 (Setup & Product Assessment)** serta **Data Hub (Modul 3-7)** diisi pada sistem GreenLCA berdasarkan skenario *mock data* PT. Lautan Otsuka Chemical.

## Modul 0-1: Company Profile & Goal Scope
Bagian ini mengatur identitas dasar pabrik dan batasan studi *Life Cycle Assessment* (LCA).

1. **Company Profile (Modul 1)**:
   - **Nama Entitas**: PT. Lautan Otsuka Chemical
   - **Lokasi**: Cilegon, Banten.
   - **Sektor Industri**: Manufaktur Kimia.
   - *Penjelasan*: Pengisian profil ini menginformasikan ke dalam sistem *calc-engine* untuk menggunakan faktor emisi dan *baseline* kepatuhan (PROPER) yang sesuai dengan regulasi pabrik kimia di Indonesia.

2. **Goal & Scope (Modul 0)**:
   - **Functional Unit**: 1 Ton Azodicarbonamide (ADCA)
   - **Batas Sistem (Boundary)**: *Cradle-to-Gate* (Mulai dari ekstraksi bahan baku dari *supplier* hingga produk siap keluar dari gerbang pabrik di Cilegon).
   - *Penjelasan*: Ini adalah batasan perhitungan jejak karbon dan dampak lingkungan lainnya. Semua energi dan material yang dimasukkan selanjutnya akan dihitung emisinya lalu dibagi dengan total produksi untuk mendapatkan emisi per 1 Ton produk.

---

## Modul 2: Product Assessment (Bill of Materials)
Modul ini mencatat bahan baku (*raw material*) apa saja yang digunakan untuk memproduksi 1 Ton Azodicarbonamide (ADCA). Berdasarkan proses sintesis kimia aktual, komposisinya adalah:

- **Hydrazine Hydrate**: 550 kg (Bahan aktif utama pembentuk ikatan kimia).
- **Urea**: 420 kg (Bahan baku sekunder reaktan).
- **Klorin (Chlorine Gas)**: 200 kg (Agen pengoksidasi).
- **NaOH (Sodium Hydroxide)**: 150 kg (Penetralisir pH).
- **Karung Kertas (Paper Bags)**: 15 kg (Bahan kemasan produk jadi).

*Penjelasan*: Angka-angka di atas dimasukkan ke modul Product Assessment. Sistem (melalui database perhitungan internal) akan mencocokkan setiap material dengan faktor emisinya masing-masing untuk menghitung **Scope 3 (Upstream)** atau emisi jejak karbon dari rantai pasok.

---

## Modul 3-7: Data Hub (Pusat Data Operasional)
Data Hub adalah tempat di mana data metrik operasional riil bulanan dimasukkan (dalam skenario ini di-generate untuk 12 bulan terakhir).

### 1. Produksi (Modul Input Produksi)
- Diisi dengan **1.200 Ton** per bulan (jumlah total ADCA yang diproduksi). Angka ini menjadi pembagi utama dalam perhitungan LCA bulanan.

### 2. Konsumsi Energi
- **Listrik (PLN)**: ~1.500.000 kWh / bulan. 
  - *Penggunaan*: Reaktor, pendingin, dan fasilitas umum. Menghasilkan emisi Scope 2.
- **Gas Bumi**: ~300.000 Nm³ / bulan. 
  - *Penggunaan*: Pembakaran pada *Boiler* untuk mengeringkan ADCA bubuk. Menghasilkan emisi Scope 1.
- **Diesel**: ~5.000 Liter / bulan. 
  - *Penggunaan*: Kendaraan operasional pabrik dan forklift.
- **Batubara & Biomassa**: 0. 
  - *Alasan*: Pabrik ini menggunakan Gas Bumi untuk boilernya (lebih bersih), sehingga dikosongkan.

### 3. Penggunaan Air & Air Limbah
- **Air Proses (Process Water)**: ~50.000 m³ / bulan.
  - *Sumber*: Disuplai dari kawasan industri (Krakatau Tirta Industri), bukan dari tanah/sungai. Karenanya Air Baku dan Air Tanah diisi `0`.
- **Air Limbah (Wastewater)**: ~40.000 m³ / bulan.
  - *Output*: Masuk ke Instalasi Pengolahan Air Limbah (IPAL) kimia internal.

### 4. Limbah B3
- **Jenis**: *Sludge IPAL Kimia* (B351-1). Endapan sisa dari proses pengolahan air limbah kimia.
- **Kuantitas**: ~25.000 kg / bulan.
- *Penjelasan*: Limbah ini dicatat masa simpannya di TPS B3 agar dievaluasi kepatuhannya (maksimal 90 hari sesuai Permen LHK).

### 5. Baku Mutu (Laboratorium & Cerobong)
- Data hasil ukur *lab* IPAL seperti pH (7.0), COD (45 mg/L), dan Amonia dimasukkan setiap bulan.
- Data emisi udara (*stack*) dari cerobong Boiler Gas seperti NOx (160 mg/Nm³) dan SO2 dimasukkan setiap bulan.
- *Penjelasan*: Angka-angka ini akan dievaluasi otomatis di Modul PROPER Compliance. Jika melebihi baku mutu lingkungan yang berlaku, indikator statusnya akan berubah menjadi gagal (*fail*).
