# Fitur SIP (Sustainability Intelligence Platform)

Dokumen ini menjelaskan 12 fitur utama yang ada di sidebar dashboard SIP secara detail, termasuk data yang ditampilkan, database tables yang mendukung, dan nilai bisnis dari setiap fitur.

---

## 1. Executive Overview

**Ikon:** LayoutDashboard
**Route:** `/`

### Deskripsi
Halaman utama dashboard yang memberikan gambaran cepat (bird's-eye view) kondisi sustainability perusahaan dalam satu layar. Ini adalah halaman pertama yang dilihat oleh direktur dan manajer setiap hari.

### Metrik Utama
| KPI | Contoh Data | Sumber Database |
|-----|-------------|-----------------|
| Total Carbon Emissions | 2,847 tCO₂e YTD | `v_carbon_summary` view |
| Energy Consumption | 18,420 MWh YTD | `energy_consumption` table |
| Water Consumption | 92,500 m³ YTD | `water_data` table |
| Waste Recycled | 64.2% recycling rate | `waste_data` table |
| Compliance Score | 94/100 | `compliance_items` table |
| ESG Score | A- (S&P Global) | `esg_scores` table |
| Active Facilities | 12 across 3 regions | `facilities` table |
| Open Issues | 8 (3 critical, 5 high) | `environmental_incidents` table |

### Visualisasi
- **Weekly Environmental Trend** — Line chart (CO₂, Energy, Water) 7 hari
- **Carbon Emissions by Scope** — Stacked bar chart per bulan (Scope 1/2/3)
- **Sustainability KPI Progress** — 5 progress bar (Carbon, Renewable Energy, Water, Waste, Compliance)
- **Recent Environmental Issues** — List 5 isu terbaru dengan severity badge

### Untuk Siapa
Direktur, Manager, semua level — butuh gambaran cepat tanpa detail teknis.

### Database Tables Terkait
`organizations`, `facilities`, `carbon_emissions`, `energy_consumption`, `water_data`, `waste_data`, `compliance_items`, `environmental_incidents`, `esg_scores`, `v_carbon_summary`, `v_energy_summary`, `v_active_incidents`

---

## 2. Environmental Monitoring

**Ikon:** Leaf
**Route:** `/environmental-monitoring`

### Deskripsi
Memantau kinerja lingkungan secara detail di seluruh fasilitas. Modul ini menjadi pusat monitoring untuk semua parameter lingkungan yang diawasi oleh Kementerian Lingkungan Hidup.

### Metrik Utama
| KPI | Contoh Data |
|-----|-------------|
| Air Emissions | 126 t YTD (-5% vs target) |
| Water Consumption | 92,500 m³ YTD (+2% vs target) |
| Waste Generated | 1,240 t YTD (-8% vs target) |
| Environmental Incidents | 12 this year (+3 vs last year) |

### Fitur Detail
- **Air Emissions** — SOx, NOx, partikulat, VOC, merkuri, perbandingan dengan baku mutu
- **Water Quality** — pH, TSS, COD, BOD, suhu air buangan
- **Waste Generation** — Total waste, limbah B3, non-B3 per fasilitas
- **Environmental Incidents** — Tracking incident (tumpahan, kebocoran, kecelakaan lingkungan)
- **Environmental Targets** — Target dengan status (on-track / at-risk / behind) dan deadline
- **Monthly Performance** — Grafik performa lingkungan bulanan

### Database Tables Terkait
`air_emissions`, `water_data`, `waste_data`, `environmental_incidents`, `environmental_targets`, `facilities`

### Untuk Siapa
HSE Manager, Environmental Engineer — perlu data detail untuk operasional harian.

---

## 3. Carbon Accounting

**Ikon:** BarChart3
**Route:** `/carbon-accounting`

### Deskripsi
Modul paling penting (Priority #1 untuk PLTU). Menghitung dan melacak emisi gas rumah kaca (GRK) perusahaan berdasarkan protokol GHG Protocol. Mendukung perhitungan Scope 1, 2, dan 3 dengan emission factors yang dapat dikonfigurasi.

### Cakupan Emisi

**Scope 1 — Emisi Langsung (1,240 tCO₂e)**
| Kategori | Contoh | Database Column |
|----------|--------|-----------------|
| Fuel Combustion | 680 tCO₂e (-8% YoY) | `carbon_emissions.category="fuel_combustion"` |
| Company Vehicles | 320 tCO₂e (-5% YoY) | `carbon_emissions.category="company_vehicles"` |
| Generators | 240 tCO₂e (+2% YoY) | `carbon_emissions.category="generators"` |

**Scope 2 — Emisi Tidak Langsung (1,180 tCO₂e)**
| Kategori | Contoh | Database Column |
|----------|--------|-----------------|
| Purchased Electricity | 980 tCO₂e (-10% YoY) | `carbon_emissions.category="purchased_electricity"` |
| Purchased Steam | 200 tCO₂e (-3% YoY) | `carbon_emissions.category="purchased_steam"` |

**Scope 3 — Rantai Pasok (427 tCO₂e)**
| Kategori | Contoh | Database Column |
|----------|--------|-----------------|
| Transportation | 180 tCO₂e (+5% YoY) | `carbon_emissions.category="transportation"` |
| Suppliers | 120 tCO₂e (-2% YoY) | `carbon_emissions.category="suppliers"` |
| Business Travel | 67 tCO₂e (+15% YoY) | `carbon_emissions.category="business_travel"` |
| Waste Disposal | 60 tCO₂e (-12% YoY) | `carbon_emissions.category="waste_disposal"` |

### Fitur Tambahan
- Carbon Reduction Targets (SBTi-aligned) — `carbon_reduction_targets` table
- Carbon Offsets tracking — `carbon_offsets` table
- Emission Factors library — `emission_factors` table (IPCC, DEFRA, dll)
- Emission trend chart (placeholder untuk data real)
- Perhitungan CO₂, CH₄, N₂O, biogenic CO₂ terpisah

### Database Tables Terkait
`carbon_emissions`, `carbon_reduction_targets`, `carbon_offsets`, `emission_factors`, `v_carbon_summary`

### Untuk Siapa
HSE Manager, Sustainability Manager, Compliance Officer — fokus pada target pengurangan emisi dan pelaporan.

---

## 4. Life Cycle Assessment (LCA)

**Ikon:** Cpu
**Route:** `/lca`

### Deskripsi
Menghitung dampak lingkungan dari suatu produk dari awal sampai akhir (cradle-to-grave). Berguna untuk eco-design, klaim ramah lingkungan, dan persyaratan pelanggan.

### Metrik Utama
| KPI | Contoh Data |
|-----|-------------|
| Active LCA Projects | 8 (3 completed this quarter) |
| Products Analyzed | 24 across all categories |
| Global Warming Potential | 4.2 kg CO₂e/kg (rata-rata) |
| Water Footprint | 120 L/kg (rata-rata) |

### Tahapan Life Cycle
| Stage | GWP Contribution | Database Table |
|-------|------------------|----------------|
| 1. Raw Material | 1.8 kg CO₂e (43%) | `lca_materials` |
| 2. Manufacturing | 1.2 kg CO₂e (29%) | `lca_stages` |
| 3. Distribution | 0.5 kg CO₂e (12%) | `lca_stages` |
| 4. Product Use | 0.3 kg CO₂e (7%) | `lca_stages` |
| 5. End of Life | 0.4 kg CO₂e (9%) | `lca_stages` |

### Kategori Dampak
- Global Warming Potential (GWP) — potensi pemanasan global
- Water Footprint — jejak air
- Energy Demand — kebutuhan energi
- Acidification — pengasaman
- Eutrophication — eutrofikasi

### Database Tables Terkait
`lca_projects`, `lca_stages`, `lca_impacts`, `lca_materials`

### Untuk Siapa
Environmental Engineer, R&D, Product Development — untuk eco-design dan klaim lingkungan produk.

---

## 5. Waste Management

**Ikon:** Recycle
**Route:** `/waste-management`

### Deskripsi
Mengelola data limbah perusahaan dari hulu ke hilir. Mencakup limbah B3 (berbahaya) dan non-B3, tracking biaya, vendor disposal, dan program pengurangan limbah.

### Metrik Utama
| KPI | Contoh Data |
|-----|-------------|
| Total Waste Generated | 1,240 t YTD (-8% YoY) |
| Recycling Rate | 64.2% (target 75%) |
| Waste Cost | $184,500 YTD (-12% YoY) |
| Hazardous Waste | 86 t YTD (-3% YoY) |

### Breakdown Kategori
| Kategori | Jumlah | Recycled | Biaya |
|----------|--------|----------|-------|
| General Waste | 520 t | 45% | $78,000 |
| Recyclable Materials | 380 t | 95% | $12,000 |
| Organic Waste | 180 t | 100% | $8,500 |
| Hazardous Waste (B3) | 86 t | 30% | $62,000 |
| Construction Debris | 74 t | 80% | $24,000 |

### Fitur Detail
- Waste Inventory per kategori
- Manifest limbah B3 (nomor manifest, vendor)
- Disposal method tracking (landfill, incineration, recycle, etc.)
- Waste Reduction Programs — `waste_reduction_programs` table
- Biaya pembuangan per vendor

### Database Tables Terkait
`waste_data`, `waste_reduction_programs`, `facilities`

### Untuk Siapa
HSE Manager, Environmental Engineer — perlu tracking limbah untuk laporan PROPER dan izin lingkungan.

---

## 6. Energy Monitoring

**Ikon:** Zap
**Route:** `/energy-monitoring`

### Deskripsi
Memantau konsumsi energi di seluruh fasilitas untuk mengidentifikasi pemborosan dan peluang efisiensi. Mencakup listrik, gas, steam, dan bahan bakar.

### Metrik Utama
| KPI | Contoh Data |
|-----|-------------|
| Electricity | 12,400 MWh YTD (+2% YoY) |
| Natural Gas | 3,800 MWh YTD (-8% YoY) |
| Steam Usage | 1,520 MWh YTD (-3% YoY) |
| Fuel Usage | 700 MWh YTD (+5% YoY) |

### Fitur Detail
- Energy Intensity chart (placeholder) — kWh per unit produksi
- Equipment Efficiency monitoring:
  | Equipment | Efficiency | Status |
  |-----------|-----------|--------|
  | Boiler A | 87% | ✅ Good |
  | Chiller 2 | 72% | ⚠️ Needs attention |
  | Compressor 1 | 91% | ✅ Good |
  | Furnace B | 65% | ⚠️ Needs attention |
  | Cooling Tower | 83% | ✅ Good |
- Renewable energy tracking (kolom `renewable` di `energy_consumption`)
- Energy reduction targets — `energy_targets` table
- Deteksi pemborosan energi

### Database Tables Terkait
`energy_consumption`, `energy_targets`, `equipment_efficiency`, `v_energy_summary`

### Untuk Siapa
Plant Manager, Energy Manager, Maintenance Manager — fokus pada efisiensi operasional dan pengurangan biaya energi.

---

## 7. Water Monitoring

**Ikon:** Droplets
**Route:** `/water-monitoring`

### Deskripsi
Memantau pemakaian dan kualitas air di seluruh fasilitas. Mencakup intake, konsumsi, discharge, recycling, dan deteksi kebocoran.

### Metrik Utama
| KPI | Contoh Data |
|-----|-------------|
| Water Intake | 115,000 m³ YTD (-5% YoY) |
| Water Consumption | 92,500 m³ YTD (+2% YoY) |
| Water Discharge | 22,500 m³ YTD (-8% YoY) |
| Water Recycling | 15,200 m³ (13.2% recycled) |

### Fitur Detail
- Water quality tracking: pH, TSS, COD, BOD, suhu — langsung di `water_data` table
- Water Leak Detection:
  | Lokasi | Severity | Status |
  |--------|----------|--------|
  | Plant A - Pipeline 3 | High | Active |
  | Plant B - Cooling Tower | Medium | Resolved |
  | Plant C - Storage Tank | Low | Active |
- Water efficiency chart (placeholder)
- Water reduction targets — `water_targets` table
- Interval tracking: per shift/hari/bulan

### Database Tables Terkait
`water_data`, `water_targets`, `water_leak_events`, `facilities`

### Untuk Siapa
Environmental Engineer, Plant Manager — untuk kepatuhan baku mutu air limbah dan efisiensi pemakaian air.

---

## 8. Compliance Management

**Ikon:** ShieldCheck
**Route:** `/compliance`

### Deskripsi
Memastikan perusahaan mematuhi semua peraturan lingkungan dan standar sustainability. Memberikan skor kepatuhan otomatis, tracking audit, dan manajemen temuan.

### Metrik Utama
| KPI | Contoh Data |
|-----|-------------|
| Compliance Score | 94/100 (+2 pts) |
| Open Findings | 12 requiring action |
| Audits This Year | 8 (4 completed, 4 scheduled) |
| Upcoming Deadlines | 5 in next 30 days |

### Standar yang Dicakup
| Standar | Status | Score | Next Audit |
|---------|--------|-------|------------|
| ISO 14001 | ✅ Certified | 100% | Q3 2026 |
| GRI | ✅ Compliant | 95% | Q4 2026 |
| TCFD | ✅ Compliant | 92% | Q1 2027 |
| CDP | ✅ Submitted | A- | Q1 2027 |
| PROPER | ✅ Compliant | 88% | Q2 2026 |
| SBTi | ⏳ Pending | - | Q4 2026 |

### Fitur Detail
- Compliance checklist per standar — `compliance_items` table
- Audit management — `compliance_audits` table dengan score & max_score
- Audit findings & corrective actions — `audit_findings` + `corrective_actions`
- Due dates & compliance calendar
- Skor kepatuhan otomatis berdasarkan status compliance items

### Database Tables Terkait
`compliance_standards`, `compliance_items`, `compliance_audits`, `audit_findings`, `corrective_actions`, `v_compliance_summary`

### Untuk Siapa
Compliance Officer, HSE Manager, Legal — untuk persiapan audit dan pelaporan kepatuhan.

---

## 9. AI Insights

**Ikon:** Lightbulb
**Route:** `/ai-insights`

### Deskripsi
Memberikan rekomendasi cerdas berdasarkan analisis data sustainability secara real-time. AI bertugas sebagai asisten yang memantau data 24 jam dan memberi notifikasi jika ada anomali.

### Cara Kerja
```
Data masuk → AI bandingkan dengan data historis → Jika anomali → Notifikasi + Rekomendasi
```

### Contoh Insight
| Insight | Severity | Impact | Kategori |
|---------|----------|--------|----------|
| Plant A konsumsi listrik naik 15% — optimalkan jadwal produksi | Warning | High | Energy |
| Plant B pemakaian air 8% di atas target — cek kebocoran | Warning | Medium | Water |
| Emisi karbon turun 12% — on track SBTi | Positive | High | Carbon |
| Furnace B efisiensi 65% (benchmark 85%) — perlu maintenance | Warning | High | Energy |
| Recycling rate naik ke 64.2% (+5% YoY) — program sukses | Positive | Medium | Waste |
| Deadline CDP tinggal 45 hari — siapkan data | Info | High | Compliance |

### Tipe Insight
- **Anomaly Detection** — Deteksi keanehan data (pemakaian naik drastis, efisiensi turun)
- **Trend Analysis** — Analisis tren positif/negatif
- **Predictive Warning** — Peringatan prediktif (deadline mendekat, potensi masalah)
- **Opportunity Identification** — Identifikasi peluang penghematan

### Database Tables Terkait
`ai_insights`, `ai_insight_logs`

### Catatan
AI membutuhkan data rutin minimal 2-3 bulan untuk memberikan rekomendasi yang akurat. Semakin banyak data, semakin akurat rekomendasinya. Fitur AI bersifat opsional.

### Untuk Siapa
Semua level — dari operator hingga direktur.

---

## 10. ESG Reporting

**Ikon:** FileText
**Route:** `/esg-reporting`

### Deskripsi
Membuat laporan ESG dan keberlanjutan untuk berbagai framework (GRI, TCFD, CDP) serta laporan kustom. Mendukung ekspor PDF dan Excel.

### Metrik Utama
| KPI | Contoh Data |
|-----|-------------|
| ESG Score | A- (S&P Global, upgraded from BBB) |
| Reports Generated | 24 YTD |
| GRI Indicators | 142/147 reported |
| TCFD Metrics | 9/11 disclosed |

### Jenis Laporan
| Laporan | Format | Status |
|---------|--------|--------|
| Sustainability Report 2025 | PDF | ✅ Published |
| GRI Content Index | Excel | ✅ Published |
| CDP Climate Change Response | PDF | 📝 Draft |
| TCFD Report 2025 | PDF | ✅ Published |
| ESG Data Pack | Excel | 📝 Draft |

### Fitur Detail
- Report Generator — pilih data range & framework, generate otomatis
- Export PDF — laporan siap distribusi
- Export Excel — data mentah untuk analisis lanjutan
- Score tracking — riwayat skor ESG per rating agency — `esg_scores` table
- Data laporan disimpan sebagai JSON di `esg_reports.data` — fleksibel untuk berbagai framework

### Database Tables Terkait
`esg_reports`, `esg_scores`, `v_report_summary`

### Untuk Siapa
ESG Team, Sustainability Manager, Corporate Communication — untuk laporan tahunan dan tanggapan investor.

---

## 11. Documents

**Ikon:** FolderOpen
**Route:** `/documents`

### Deskripsi
Central repository untuk semua dokumen lingkungan perusahaan. Mendukung upload, download, kategorisasi, versioning, dan tracking status dokumen.

### Kategori Dokumen
| Kategori | Jumlah | Ikon |
|----------|--------|------|
| Environmental Permits | 12 | FileCheck |
| SOPs | 24 | BookOpen |
| Audit Documents | 18 | FileText |
| Certificates | 9 | Award |
| Policies | 15 | ScrollText |
| Uploaded Reports | 32 | FolderOpen |

### Fitur Detail
- Upload & download file — file_url, file_type, file_size
- Kategorisasi per folder — kolom `folder` di tabel `documents`
- Versioning — kolom `version` (auto-increment)
- Tracking status: active / expired / draft
- Expiration date — untuk izin dan sertifikat yang perlu diperbarui
- Tags — array string untuk pencarian fleksibel
- Upload button di halaman utama

### Database Tables Terkait
`documents`

### Untuk Siapa
Semua pengguna (akses sesuai role) — dari operator hingga manajer.

---

## 12. Settings

**Ikon:** Settings
**Route:** `/settings`

### Deskripsi
Konfigurasi platform untuk admin dan IT. Mengelola profil perusahaan, fasilitas, pengguna, izin akses, integrasi, dan keamanan.

### Bagian Settings
| Section | Deskripsi | Database Table |
|---------|-----------|----------------|
| Company Profile | Nama, logo, industri, negara, timezone | `organizations` |
| Facility Management | Tambah/edit/nonaktifkan fasilitas | `facilities` |
| Users & Roles | Kelola anggota tim & jabatan | `profiles` (role: admin/manager/viewer) |
| Permissions | Konfigurasi izin berbasis peran | RLS policies |
| Notification Settings | Konfigurasi alert & notifikasi | - |
| Integrations | Hubungkan dengan sistem eksternal | - |
| API Keys | Kelola token akses API | - |
| Security | Password, 2FA, session management | - |

### Role Pengguna
| Role | Akses |
|------|-------|
| Admin | Full akses — semua modul + settings |
| Manager | Semua moduk + input data, tidak bisa settings |
| Viewer | Read-only — lihat dashboard saja |

### Database Tables Terkait
`organizations`, `profiles`, `facilities`, `facility_hierarchy`

### Untuk Siapa
Admin, IT — mengelola platform dan pengguna.

---

## Ringkasan Database

| Modul | Tables Utama | Total Tables |
|-------|-------------|--------------|
| Organization & Users | `organizations`, `profiles`, `facilities`, `facility_hierarchy` | 4 |
| Carbon Accounting | `carbon_emissions`, `carbon_reduction_targets`, `carbon_offsets`, `emission_factors` | 4 |
| Energy Monitoring | `energy_consumption`, `energy_targets`, `equipment_efficiency` | 3 |
| Water Monitoring | `water_data`, `water_targets`, `water_leak_events` | 3 |
| Waste Management | `waste_data`, `waste_reduction_programs` | 2 |
| LCA | `lca_projects`, `lca_stages`, `lca_impacts`, `lca_materials` | 4 |
| Environmental | `air_emissions`, `environmental_incidents`, `environmental_targets` | 3 |
| Compliance | `compliance_standards`, `compliance_items`, `compliance_audits`, `audit_findings`, `corrective_actions` | 5 |
| AI Insights | `ai_insights`, `ai_insight_logs` | 2 |
| ESG Reporting | `esg_reports`, `esg_scores` | 2 |
| Documents | `documents` | 1 |

**Total: 28 tables + 5 views + 3 fungsi database**
