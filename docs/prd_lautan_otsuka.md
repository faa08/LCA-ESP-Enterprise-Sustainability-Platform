# PRD: Skenario Data Demo PT. Lautan Otsuka Chemical

Dokumen ini menjelaskan narasi, rasionalisasi, dan pemetaan data *mock* (data buatan) yang diinjeksikan secara otomatis ke dalam sistem GreenLCA ketika tombol "Demo: Data PT. Lautan Otsuka" ditekan. Tujuan dari data ini adalah untuk mendemonstrasikan kapabilitas penuh 15 modul aplikasi dalam konteks **industri manufaktur kimia** secara realistis.

## 1. Profil Perusahaan (Modul 1: Company Profile)
**PT. Lautan Otsuka Chemical** merupakan perusahaan *joint venture* antara Otsuka Chemical Co., Ltd. (Jepang) dan PT Lautan Luas Tbk (Indonesia). Pabriknya berlokasi di **Cilegon, Banten**.
- **Industri**: Manufaktur Kimia (`kimia`)
- **Struktur Entitas**:
  - Korporat Induk: Otsuka Chemical Co., Ltd. (Jepang)
  - Subholding: PT Lautan Luas Tbk (Indonesia)
  - Site Aktif: PT. Lautan Otsuka Chemical (Cilegon)

## 2. Definisi Produk dan BOM (Modul 0 & 2: Goal & Scope, Product Assessment)
Perusahaan ini dikenal sebagai pabrik pertama dan terbesar di Indonesia yang memproduksi **Chemical Blowing Agent (Agen Peniup Kimia)**. Produk utama yang menjadi subjek penilaian LCA ini adalah **Azodicarbonamide (ADCA)**, yang biasa dipasarkan dengan merk seperti *UniFoam AZ*. ADCA banyak digunakan dalam industri plastik dan karet (seperti pembuatan sol sepatu, kulit sintetis, dsb) untuk membentuk struktur busa/rongga udara.

- **Functional Unit**: 1 Ton Azodicarbonamide (ADCA)
- **Batas Sistem (Boundary)**: *Cradle-to-Gate* (Dari ekstraksi bahan baku hingga produk siap di gerbang pabrik).
- **Bill of Material (BOM) per 1 Ton ADCA**:
  Pembuatan ADCA utamanya melibatkan reaksi antara Hydrazine, Urea, dan Klorin.
  1. **Hydrazine Hydrate** (550 kg): Bahan baku utama sintesis pembentukan ikatan nitrogen-nitrogen. (Supplier: PT Alam Kimia)
  2. **Urea** (420 kg): Sumber gugus karbonil dan amina sekunder. (Supplier: PT Pupuk Kaltim)
  3. **Chlorine Gas / Klorin** (200 kg): Agen pengoksidasi dalam reaksi akhir pembentukan ADCA. (Supplier: PT Asahimas Chemical)
  4. **Sodium Hydroxide / NaOH** (150 kg): Pengatur pH dan penetralisir produk samping.
  5. **Paper Bags with Liner** (15 kg): Kemasan akhir (karung kertas berlapis plastik). Diasumsikan mengandung 20% material daur ulang.

## 3. Data Operasional 12 Bulan Terakhir (Modul 3-7: Data Hub)
Skrip men-generate data historis untuk 12 bulan terakhir dengan fluktuasi normal/acak.

### A. Produksi
- **Rata-rata Produksi**: Sekitar 1.200 Ton per bulan.
- **Tingkat Kecacatan (Reject Rate)**: Diatur sekitar 1.5%.

### B. Konsumsi Energi
Sintesis kimia ini membutuhkan suhu dan tekanan tertentu, serta pencucian/pengeringan (*drying*) yang sangat padat energi.
- **Listrik Grid (PLN)**: Rata-rata 1.500.000 kWh (1.5 GWh) per bulan untuk menggerakkan reaktor, pompa, sentrifus, dan sistem pendingin. Faktor emisi jaringan nasional.
- **Gas Bumi (Natural Gas)**: Rata-rata 300.000 Nm³ per bulan. Digunakan pada *Boiler* untuk menghasilkan uap panas (Steam) yang dipakai dalam proses pengeringan ADCA (produk akhir berbentuk bubuk kuning halus).
- **Solar (Diesel)**: Rata-rata 5.000 Liter per bulan untuk kendaraan operasional pabrik (Forklift) dan genset darurat.

### C. Konsumsi dan Limbah Air
- **Pemakaian Air**: 50.000 m³ per bulan dari suplai kawasan industri (Krakatau Tirta Industri). Mayoritas digunakan untuk air pendingin (*cooling tower*) dan pelarut/pencuci dalam proses reaksi kimia.
- **Air Limbah**: 40.000 m³ per bulan yang masuk ke IPAL (Instalasi Pengolahan Air Limbah). Air limbah kimia ini dipantau secara ketat.

### D. Baku Mutu (Lab & Stack Emissions)
- **Air Limbah (Lab)**: Pengukuran pH (mendekati netral), COD (sekitar 40-55 mg/L), BOD, Amonia (tinggi potensi karena turunan Urea/Hydrazine, namun terkelola baik di angka 1.5 - 2.5 mg/L). 
- **Emisi Cerobong (Boiler Gas)**: NOx sedikit tinggi karena pembakaran gas bumi (150-180 mg/Nm³), SO2 dan Partikulat rendah. Semua didesain **memenuhi kepatuhan PROPER Biru/Hijau**.

### E. Limbah B3
- **Jenis Limbah**: *Sludge IPAL Kimia* (Kode: B351-1). Karena ini pabrik kimia, endapan dari pengolahan air limbah tergolong B3.
- **Kuantitas**: Sekitar 25-30 ton per bulan.
- **Pengelolaan**: Diserahkan kepada pihak ketiga (PT PPLI) untuk pemusnahan/landfill terkelola.

### F. Transportasi (Scope 3)
- **Distribusi Downstream**: Pengiriman ADCA menggunakan truk diesel ke pabrik-pabrik pelanggan (misal pabrik sepatu di Tangerang atau Bandung). Jarak tempuh rata-rata 120 km. Beban 20 ton per perjalanan.

## 4. Inisiatif ESG & Beyond Compliance (Modul 8-14)
- **Keanekaragaman Hayati (Biodiversity)**: Program rehabilitasi habitat (penanaman pohon) di area hijau sekitar pabrik Cilegon (2.5 Hektar) bekerjasama dengan DLH dan institusi pendidikan lokal.
- **Ekonomi Sirkular**: Palet kayu dan sisa karung kertas kemasan cacat dikumpulkan dan didaur ulang atau dipakai ulang, mencapai volume sekitar 150 Ton/tahun dengan tingkat daur ulang 85%.
- **SDG Progress**:
  - Goal 6 (Air Bersih): Pengolahan IPAL sesuai baku mutu.
  - Goal 9 (Industri & Inovasi): Pemakaian Boiler Gas efisiensi tinggi.
  - Goal 12 (Konsumsi Bertanggung Jawab): Daur ulang palet kayu dan kemasan.

## Kesimpulan
Ketika pengguna mengklik tombol demo, seluruh modul akan memuat narasi yang saling terhubung di atas: *Carbon Accounting* (Modul 7) akan didominasi oleh Scope 2 (Listrik) dan Scope 1 (Gas Boiler). LCIA (Modul 6) akan menunjukkan dampak yang kuat dari ekstraksi bahan baku Hydrazine dan Urea (Scope 3 Upstream). Kepatuhan regulasi (Modul 10) otomatis memetakan data emisi gas cerobong ke baku mutu pabrik kimia, dan *SDG dashboard* akan memvisualisasikan progres ESG perusahaan.
