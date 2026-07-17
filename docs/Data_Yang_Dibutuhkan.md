# Data yang Harus Disiapkan

Dokumen ini berisi daftar data yang perlu disiapkan untuk mengisi SIP (Sustainability Intelligence Platform) beserta contoh, format, sumber data, dan tabel database tujuan.

---

## Ringkasan Prioritas

| Prioritas | Modul | Data | Database Table |
|-----------|-------|------|----------------|
| 🔴 Sangat Penting | Carbon Accounting | Pemakaian bahan bakar, listrik, steam per bulan | `carbon_emissions` |
| 🔴 Sangat Penting | Compliance | Izin lingkungan, PROPER, ISO 14001 | `compliance_items`, `compliance_audits` |
| 🔴 Sangat Penting | Air Emissions | Data cerobong, baku mutu | `air_emissions` |
| 🟡 Penting | Energy Monitoring | Tagihan listrik, gas, solar per bulan | `energy_consumption` |
| 🟡 Penting | Water Monitoring | Pemakaian air, quality, buangan | `water_data` |
| 🟡 Penting | Waste Management | Limbah B3 & non-B3, vendor pembuangan | `waste_data` |
| 🟢 Tambahan | LCA | Data bahan baku produk | `lca_materials`, `lca_stages` |
| 🟢 Tambahan | ESG Reporting | Data untuk laporan tahunan | `esg_reports`, `esg_scores` |

---

## Detail per Modul

### 1. Carbon Accounting

**Database Table:** `carbon_emissions`
**Kolom penting:** `scope`, `category`, `subcategory`, `activity_data`, `activity_unit`, `emission_factor`, `co2e_value`, `period_start`, `period_end`

#### Data Scope 1 (Emisi Langsung)

| Data | Contoh | Format | Sumber Data |
|------|--------|--------|-------------|
| Pemakaian solar untuk boiler | 50.000 liter/bulan | Angka | Bagian pengadaan/bahan bakar |
| Pemakaian batu bara | 200 ton/bulan | Angka | Bagian operasional |
| Pemakaian gas alam | 10.000 m³/bulan | Angka | Tagihan PGN |
| Konsumsi BBM kendaraan operasional | 5.000 liter/bulan | Angka | Bagian transportasi/logistik |
| Pemakaian genset | 1.000 jam/bulan | Angka | Bagian maintenance |

#### Data Scope 2 (Listrik & Steam)

| Data | Contoh | Format | Sumber Data |
|------|--------|--------|-------------|
| Pemakaian listrik PLN | 500.000 kWh/bulan | Angka | Rekening PLN |
| Pemakaian listrik genset sendiri | 50.000 kWh/bulan | Angka | Meteran internal |
| Pembelian steam (jika ada) | 1.000 GJ/bulan | Angka | Tagihan supplier |

#### Data Scope 3 (Rantai Pasok)

| Data | Contoh | Format | Sumber Data |
|------|--------|--------|-------------|
| Transportasi bahan baku (ton.km) | 1.000 ton.km/bulan | Angka | Logistik |
| Perjalanan dinas (km) | 100.000 km/tahun | Angka | HR/finance |
| Limbah ke pihak ketiga | 50 ton/bulan | Angka | HSE/waste management |
| Commuting karyawan | - | Survey | HR |

#### Emission Factors

SIP menyediakan emission factors default (IPCC, DEFRA) di tabel `emission_factors`. Tapi jika perusahaan punya faktor emisi spesifik (misal: dari analisis batu bara sendiri), bisa diisi manual.

**Data batu bara (jika ada):**
| Parameter | Kegunaan |
|-----------|----------|
| Kalori (kcal/kg) | Menghitung faktor emisi spesifik |
| Ash content (%) | Mempengaruhi emisi partikulat |
| Sulfur content (%) | Mempengaruhi emisi SO₂ |

---

### 2. Air Emissions

**Database Table:** `air_emissions`
**Kolom penting:** `pollutant`, `value`, `unit`, `limit_value`, `limit_unit`, `exceedance`, `source`, `period_start`, `period_end`

#### Data emisi cerobong (stack)

| Data | Contoh | Format | Sumber Data |
|------|--------|--------|-------------|
| Debit cerobong | 50.000 Nm³/jam | Angka | CEMS/hasil uji |
| Konsentrasi SO₂ | 150 mg/Nm³ | Angka | Hasil uji emisi |
| Konsentrasi NOx | 200 mg/Nm³ | Angka | Hasil uji emisi |
| Partikulat (debu) | 50 mg/Nm³ | Angka | Hasil uji emisi |
| VOC (jika relevan) | 20 mg/Nm³ | Angka | Hasil uji emisi |
| Merkuri (Hg) | 0,01 mg/Nm³ | Angka | Hasil uji emisi (khusus PLTU) |
| Baku mutu masing-masing | Sesuai peraturan | Angka | Permen LHK |

**Sumber data:** Hasil uji emisi berkala (biasanya per 3 atau 6 bulan dari laboratorium) atau CEMS (Continuous Emission Monitoring System) jika sudah terpasang.

**Catatan untuk PLTU:** Parameter kritis yang diawasi PROPER: SO₂, NOx, partikulat. Pelanggaran baku mutu bisa menurunkan peringkat PROPER.

---

### 3. Energy Monitoring

**Database Table:** `energy_consumption`
**Kolom penting:** `energy_type`, `source`, `value`, `unit`, `renewable`, `period_start`, `period_end`, `interval_type`

| Data | Contoh | Format | Sumber Data |
|------|--------|--------|-------------|
| Tagihan listrik PLN | 500.000 kWh/bulan | Angka | Rekening PLN |
| Pemakaian solar/BBM | 50.000 liter/bulan | Angka | Pembelian bahan bakar |
| Pemakaian gas alam | 10.000 m³/bulan | Angka | Tagihan PGN |
| Kapasitas terpasang | 1.000 kVA | Angka | Data teknis |
| Produksi | 1.000 ton produk/bulan | Angka | Bagian produksi |

**Equipment Efficiency** (tabel `equipment_efficiency`):
| Data | Contoh | Format |
|------|--------|--------|
| Nama equipment | Boiler A | Teks |
| Efisiensi (%) | 87% | Angka |
| Target efisiensi | 90% | Angka |
| Energy input | 1.000 MWh | Angka |
| Energy output | 870 MWh | Angka |

**Catatan:** Untuk menghitung energy intensity, perlu data produksi (output). Contoh: kWh per ton produk.

---

### 4. Water Monitoring

**Database Table:** `water_data`
**Kolom penting:** `water_type`, `source`, `value`, `unit`, `quality_ph`, `quality_tss`, `quality_cod`, `quality_bod`, `temperature_c`, `period_start`, `period_end`

| Data | Contoh | Format | Sumber Data |
|------|--------|--------|-------------|
| Pemakaian air tanah/PDAM | 10.000 m³/bulan | Angka | Meteran air |
| Kualitas air inlet | pH: 7.2, TSS: 20 mg/L | Angka | Hasil uji lab |
| Kualitas air buangan | pH: 7.0, TSS: 30 mg/L | Angka | Hasil uji lab (wajib) |
| Debit air buangan | 5.000 m³/bulan | Angka | Meteran outlet |
| Suhu air buangan | 35°C | Angka | Thermometer/CEMS |

**Parameter Kualitas Air:**
| Parameter | Batas (contoh) | Notes |
|-----------|----------------|-------|
| pH | 6.0 - 9.0 | Standar baku mutu |
| TSS | 100 mg/L | Total Suspended Solid |
| COD | 150 mg/L | Chemical Oxygen Demand |
| BOD | 50 mg/L | Biochemical Oxygen Demand |
| NH₃-N | 10 mg/L | Amonia |
| Suhu | ±3°C dari suhu badan air | Khusus PLTU (thermal) |

**Catatan:** Pabrik kimia dan PLTU biasanya wajib lapor kualitas air buangan tiap bulan ke Kemen LHK.

**Water Leak Events** (tabel `water_leak_events`):
| Data | Contoh |
|------|--------|
| Lokasi | Plant A - Pipeline 3 |
| Detected at | 2026-01-15 |
| Estimated loss | 500 m³ |
| Severity | High |
| Root cause | Pipe corrosion |
| Action taken | Pipe replacement scheduled |

---

### 5. Waste Management

**Database Table:** `waste_data`
**Kolom penting:** `waste_category`, `waste_type`, `value`, `unit`, `hazardous`, `recycled`, `disposal_method`, `waste_code`, `vendor`, `cost_amount`

#### Limbah B3

| Data | Contoh | Format | Sumber Data |
|------|--------|--------|-------------|
| Jenis limbah B3 | Katalis bekas, solvent bekas, sludge IPAL, oli bekas | Teks | Manifest limbah |
| Kode limbah B3 | B307, B308, dll | Teks | PP 101/2014 |
| Jumlah per bulan | 5 ton/bulan | Angka | Timbangan |
| Vendor pembuangan | PT Pengolah Limbah | Teks | Kontrak |
| Biaya pembuangan | Rp 5.000.000/bulan | Angka | Invoice |
| Nomor manifest | MAN-2026-001 | Teks | Dokumen limbah |
| Metode disposal | Incineration / Landfill / Recycle | Teks | - |

#### Limbah Non-B3

| Data | Contoh | Format |
|------|--------|--------|
| Sampah kantor | 2 ton/bulan | Angka |
| Limbah kemasan | 1 ton/bulan | Angka |
| Daur ulang | 50% | Persentase |
| Limbah konstruksi | 5 ton/bulan | Angka |

**Kategori default:**
1. General Waste — sampah umum
2. Recyclable Materials — kertas, plastik, logam
3. Organic Waste — sisa organik
4. Hazardous Waste — limbah B3
5. Construction Debris — puing konstruksi

---

### 6. Compliance Management

**Database Tables:** `compliance_items`, `compliance_audits`, `audit_findings`, `corrective_actions`

#### Dokumen yang perlu disiapkan

| Dokumen | Keterangan | Database Table |
|---------|------------|----------------|
| Izin Lingkungan (AMDAL/UKL-UPL) | Dokumen utama | `documents` |
| Izin Pembuangan Air Limbah (IPLC) | Dari Kemen LHK | `documents` |
| Izin Emisi | Dari Kemen LHK / Dinas | `documents` |
| Sertifikat ISO 14001 | Jika sudah | `documents` |
| Laporan PROPER | Jika sudah dinilai | `documents` |
| RKPL/RPM | Rencana Pengelolaan Lingkungan | `documents` |
| Hasil uji emisi & air berkala | Dari lab | `documents` |
| Manifest limbah B3 | Dari pengangkutan | `documents` |

#### Data Compliance Items

| Data | Contoh |
|------|--------|
| Standard | ISO 14001 |
| Requirement | Internal audit tahunan |
| Status | compliant / non-compliant / pending |
| Due date | 2026-12-31 |
| Assigned to | HSE Manager |
| Priority | high / medium / low |

#### Data Audit

| Data | Contoh |
|------|--------|
| Standard | ISO 14001 |
| Title | Surveillance Audit 2026 |
| Auditor | SGS Indonesia |
| Audit date | 2026-03-15 |
| Score | 85 / 100 |
| Findings | 3 minor, 1 major |
| Status | completed / scheduled / in-progress |

---

### 7. LCA (Tambahan)

**Database Tables:** `lca_projects`, `lca_stages`, `lca_impacts`, `lca_materials`

| Data | Contoh | Format |
|------|--------|--------|
| Nama proyek LCA | Packaging Optimization V2 | Teks |
| Nama produk | EcoBox 500 | Teks |
| Unit produk | kg | Teks |
| **Per stage:** | | |
| Bahan baku utama | Nama & jumlah per kg produk | Angka |
| Konsumsi energi per kg produk | kWh/kg | Angka |
| Air per kg produk | m³/kg | Angka |
| Limbah per kg produk | kg/kg | Angka |
| Distribusi produk | Jarak & moda transportasi | Angka + teks |
| Material detail | Origin, recycled content % | Angka + teks |

**Kategori dampak yang dihitung:**
- Global Warming Potential (kg CO₂e)
- Water Footprint (L)
- Energy Demand (MJ)
- Acidification (kg SO₂e)
- Eutrophication (kg PO₄e)

---

### 8. ESG Reporting (Tambahan)

**Database Tables:** `esg_reports`, `esg_scores`

| Data | Contoh | Format | Sumber Data |
|------|--------|--------|-------------|
| Data kecelakaan kerja | 0 fatalities, 3 lost-time injuries | Angka | HSE |
| Jumlah karyawan | 500 (400 male, 100 female) | Angka | HR |
| Data CSR/community | Kegiatan & biaya | Teks + angka | CSR/Corp Comm |
| Sertifikasi | ISO 14001, ISO 45001, SMK3 | Teks | HSE |
| Penghargaan | PROPER Hijau 2025 | Teks | HSE |
| ESG score historis | S&P Global: A-, DJSI: 65/100 | Teks + angka | Investor relations |

---

## Format Data yang Memudahkan

### Format Excel Carbon Accounting
```
Bulan | Scope | Kategori | Subkategori | Nilai | Satuan | Catatan
Jan-26 | Scope1 | Fuel Combustion | Solar Boiler | 50000 | liter | -
Jan-26 | Scope2 | Purchased Electricity | PLN | 500000 | kWh | -
Jan-26 | Scope3 | Transportation | Truck | 1000 | ton.km | -
```

### Format Excel Air Emissions
```
Bulan | Fasilitas | Cerobong | Parameter | Nilai | Satuan | Baku Mutu
Jan-26 | Plant A | Stack 1 | SO2 | 150 | mg/Nm³ | 200
Jan-26 | Plant A | Stack 1 | NOx | 200 | mg/Nm³ | 350
```

### Format Excel Water Monitoring
```
Bulan | Fasilitas | Tipe Air | Nilai | Satuan | pH | TSS | COD | BOD | Suhu
Jan-26 | Plant A | Intake | 10000 | m³ | 7.2 | 20 | 30 | 10 | 28
Jan-26 | Plant A | Discharge | 5000 | m³ | 7.0 | 30 | 80 | 25 | 35
```

### Format Excel Waste Management
```
Bulan | Fasilitas | Kategori | Jenis | Nilai | Satuan | B3 | Recycled | Vendor | Biaya
Jan-26 | Plant A | Hazardous | Oli Bekas | 2 | ton | true | false | PT ABC | 2000000
Jan-26 | Plant A | General | Sampah Kantor | 5 | ton | false | false | - | 500000
```

### Format Excel Energy Consumption
```
Bulan | Fasilitas | Tipe Energi | Sumber | Nilai | Satuan | Renewable | Notes
Jan-26 | Plant A | Electricity | PLN | 500000 | kWh | false | -
Jan-26 | Plant A | Natural Gas | PGN | 10000 | m³ | false | -
```

---

## Tips Persiapan Data

1. **Rapikan Excel dulu** — Data yang rapi dalam Excel memudahkan import. Satu sheet per modul.
2. **Konsisten dengan satuan** — Pastikan satuan konsisten (kg vs ton, liter vs m³, kWh vs MWh).
3. **Per periode** — Data harus punya periode waktu (bulan/tahun). SIP menggunakan period_start dan period_end.
4. **Per fasilitas** — Jika punya multiple plant/fasilitas, pisahkan data per fasilitas.
5. **Dokumen pendukung** — Siapkan scan izin lingkungan, sertifikat, dan dokumen compliance untuk diupload ke modul Documents.

Kalau data sudah rapi dalam Excel, tinggal import ke SIP. Tidak perlu input manual satu-satu.
