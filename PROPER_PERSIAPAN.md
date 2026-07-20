# Checklist Persiapan — Sistem PROPER (ensPR)

Panduan buat Fachry: apa saja yang perlu disiapkan agar platform monitoring PROPER
(Emisi Cerobong / Air Limbah / Limbah B3) bisa jalan akurat dan siap ditawarkan ke pabrik.

---

## 1. Data Baku Mutu (PALING KRITIS)

Sistem membandingkan nilai pabrik ke baku mutu nasional (PermenLHK).
Tanpa angka ini, sistem cuma bisa pakai placeholder.

### 1A. Air Limbah (SP PL) — per jenis industri
> Format: Parameter | Satuan | Kadar Maksimum
> Status: ✅ = sudah ada, ❌ = belum

- [x] **Penyamakan Kulit** (sudah dari PDF lu)
  - pH 6–9, BOD 30, COD 200, NH₃-N 2, TKN 30, Krom 0,6, Minyak&Lemak 5, Sulfida 0,8, TSS 60, Volume 40 m³/ton
- [x] **Minyak Goreng (proses basah)** — Permen LH 5/2014
  - pH 6–9, BOD 75, COD 150, TSS 60, Minyak&Lemak 5, MBAS 3, Fosfat 2
- [x] **Tekstil / Pencelupan** — Permen LH 5/2014 Lampiran XLII (P.16/2019)
  - pH 6–9, BOD 60, COD 150, TSS 50, Fenol 0,5, Cr 1,0, NH₃-N 8, Sulfida 0,3, Minyak&Lemak 3
- [ ] Kertas / Pulp & Paper
- [ ] Kimia / Petrokimia
- [ ] Semen
- [ ] Logam / Baja
- [ ] Lainnya (sebutkan)

> Rujukan: PermenLHK No. 5/2014 + perubahannya, atau Peraturan Gubernur setempat.

### 1B. Emisi Cerobong (SP Parmen) — per sektor sumber
> Parameter umum: TSP/Partikulat, SO₂, NOx, CO, HCl, HF, NH₃, Opasitas (%)
> Status: ❌ = butuh angka per sektor

- [ ] Boiler / Ketel uap
- [ ] Pembangkit Listrik
- [ ] Industri Semen
- [ ] Industri Baja
- [ ] Industri Pupuk
- [ ] Pulp & Paper
- [ ] Petrokimia
- [ ] Industri lain (sebutkan)

> Rujukan: Permen LH 7/2007 (bukan 13/2010 — itu untuk migas). Baku mutu beda per bahan bakar
> (batubara: TSP 230 / SO₂ 850 / NOx 400; gas: SO₂ 150 / NOx 650; minyak: SO₂ 850 / NOx 450; biomassa: TSP 300).

### 1C. Limbah B3 (SP LB3) — checklist kepatuhan
> Bukan angka, tapi status admin/operasional (✅/❌)

- [x] TPS B3 memiliki izin
- [x] Label sesuai ketentuan
- [x] Simbol B3 lengkap
- [x] Manifest limbah B3 lengkap
- [x] Pengangkutan sesuai aturan
- [x] Penyimpanan (masa simpan ≤ 90 hari)
- [x] Pemanfaatan/daur ulang
- [x] Pengolahan & penimbunan akhir

> Rujukan: PP No. 101/2014 + PermenLHK terkait.

---

## 2. Profil Pabrik (Client Input)

Tiap pabrik isi sendiri saat daftar:

- [ ] Nama perusahaan / pabrik
- [ ] Jenis industri (dropdown dari library di atas)
- [ ] Lokasi (provinsi/kota) — untuk banding ke Peraturan Gubernur bila ada
- [ ] Izin lingkungan (No. UKL-UPL / AMDAL)
- [ ] Nama PIC & kontak

---

## 3. Sumber Data Pabrik (Cara Input)

Prioritas kemudahan client:

- [ ] **Template Excel/CSV** — gw buat kolom: Tanggal | Parameter | Nilai | Satuan
      Client isi & upload di Data Hub. (REKOMENDASI)
- [ ] **Manual entry terpandu** — dropdown pilih parameter (bukan ketik bebas)
- [ ] **IoT/CEMS** — koneksi otomatis (nomor 3 di Data Hub, opsional)

---

## 4. Yang Sudah Dibangun di Web (progress)

- [x] Data Hub (Manual / Excel / IoT) — sumber ingestion tunggal
- [x] Modul read-only: LCA, Carbon, Energy, Water, Waste, Env, Compliance, AI
- [x] Carbon Credit page + sidebar
- [x] LCA methodology (ISO + SNI + Perpres 98/2021 + Pedoman TEK)
- [ ] Library baku mutu (`src/lib/proper.ts`) — BELUM
- [ ] Setup profil pabrik + pilih industri — BELUM
- [ ] PROPER Snapshot (Emisi / Air Limbah / Limbah B3 + prediksi peringkat) — BELUM
- [ ] Environmental & Waste diselaraskan ke kategori PROPER — BELUM

---

## 5. Cara Kirim Data ke Gw

- PDF / foto halaman baku mutu → gw transcribe manual ke kode.
- Atau copy-paste tabel dari PDF ke chat.
- Satu industri per kali boleh, bertahap tidak masalah.

---

## 6. Catatan

- Baku mutu default = NASIONAL (PermenLHK). Perda/Gubernur bisa beda, nanti bisa override.
- Sistem umum: tiap pabrik pilih industrinya → dapat parameter + baku mutu sendiri
  (berasa "pribadi" tapi engine satu).
- Data saat ini masih DEMO/placeholder sampai angka riil dari lu masuk.
