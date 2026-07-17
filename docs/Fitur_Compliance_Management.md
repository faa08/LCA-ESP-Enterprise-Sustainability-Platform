# Compliance Management — Dokumentasi Detail

## 1. Deskripsi

Modul Compliance Management adalah pusat manajemen kepatuhan lingkungan perusahaan. Memastikan perusahaan mematuhi semua standar dan regulasi sustainability nasional maupun internasional.

---

## 2. Struktur Database (5 Tables + 1 View)

```
compliance_standards    → Daftar standar/referensi (ISO 14001, GRI, TCFD, CDP, PROPER, SBTi, dll)
compliance_items        → Checklist item per standar (requirement yg harus dipenuhi)
compliance_audits       → Data audit (internal/eksternal)
audit_findings          → Temuan dari audit
corrective_actions      → Tindak lanjut dari temuan
v_compliance_summary    → View ringkasan jumlah item per status
```

### 2.1 `compliance_standards` (Reference Table)

| Kolom | Tipe | Contoh |
|-------|------|--------|
| id | UUID | auto |
| code | TEXT (unique) | `ISO-14001`, `GRI`, `TCFD`, `CDP`, `PROPER`, `SBTi` |
| name | TEXT | `ISO 14001`, `Global Reporting Initiative` |
| description | TEXT | `Environmental Management System` |
| category | TEXT | null |
| created_at | TIMESTAMPTZ | auto |

**Seed data (9 standar):**
- ISO 14001 — Environmental Management System
- GRI — Global Reporting Initiative
- TCFD — Task Force on Climate-related Financial Disclosures
- CDP — Carbon Disclosure Project
- PROPER — Program Penilaian Peringkat Kinerja Perusahaan
- SBTi — Science Based Targets initiative
- GHG Protocol — Greenhouse Gas Accounting Standard
- EU Taxonomy — EU Sustainable Activities Classification
- ISCC — International Sustainability & Carbon Certification

### 2.2 `compliance_items` (Checklist)

Setiap item adalah satu requirement yang harus dipenuhi untuk suatu standar.

| Kolom | Tipe | Contoh |
|-------|------|--------|
| id | UUID | auto |
| organization_id | UUID (FK → organizations) | - |
| standard_id | UUID (FK → compliance_standards) | ISO 14001 |
| facility_id | UUID (FK → facilities, nullable) | Plant A |
| requirement | TEXT | `Lakukan internal audit tahunan` |
| description | TEXT | `Audit minimal 1x per tahun oleh auditor internal tersertifikasi` |
| status | ENUM | `compliant`, `non-compliant`, `pending`, `not-applicable` |
| priority | ENUM | `low`, `medium`, `high`, `critical` |
| due_date | DATE | `2026-12-31` |
| assigned_to | UUID (FK → profiles) | ID user |
| notes | TEXT | - |
| created_at / updated_at | TIMESTAMPTZ | auto |

**Status values:**
- `compliant` — sudah terpenuhi
- `non-compliant` — belum/tidak terpenuhi
- `pending` — masih dalam proses
- `not-applicable` — tidak relevan untuk perusahaan ini

### 2.3 `compliance_audits`

| Kolom | Tipe | Contoh |
|-------|------|--------|
| id | UUID | auto |
| organization_id | UUID (FK) | - |
| facility_id | UUID (FK, nullable) | Plant A |
| standard_id | UUID (FK) | ISO 14001 |
| title | TEXT | `Surveillance Audit 2026` |
| auditor | TEXT | `SGS Indonesia` |
| audit_date | DATE | `2026-03-15` |
| score | NUMERIC | `85` |
| max_score | NUMERIC | `100` |
| status | ENUM | `scheduled`, `in-progress`, `completed`, `overdue`, `cancelled` |
| notes | TEXT | - |
| created_at / updated_at | TIMESTAMPTZ | auto |

### 2.4 `audit_findings`

| Kolom | Tipe | Contoh |
|-------|------|--------|
| id | UUID | auto |
| audit_id | UUID (FK → compliance_audits) | - |
| title | TEXT | `Dokumentasi tidak lengkap` |
| description | TEXT | `Prosedur tanggap darurat belum diupdate` |
| severity | ENUM | `observation`, `minor`, `major`, `critical` |
| status | ENUM | `open`, `in-progress`, `resolved`, `closed` |
| created_at | TIMESTAMPTZ | auto |

**Severity levels:**
- `observation` — catatan perbaikan ringan
- `minor` — ketidaksesuaian kecil
- `major` — ketidaksesuaian signifikan
- `critical` — risiko tinggi / pelanggaran hukum

### 2.5 `corrective_actions`

| Kolom | Tipe | Contoh |
|-------|------|--------|
| id | UUID | auto |
| finding_id | UUID (FK → audit_findings) | - |
| description | TEXT | `Update SOP tanggap darurat dan lakukan training` |
| assigned_to | UUID (FK → profiles) | ID user |
| due_date | DATE | `2026-04-15` |
| completed_at | TIMESTAMPTZ | `2026-04-10` |
| status | ENUM | `open`, `in-progress`, `completed`, `overdue` |
| evidence_url | TEXT | Link file bukti penyelesaian |
| created_at / updated_at | TIMESTAMPTZ | auto |

### 2.6 `v_compliance_summary` (View)

```sql
create or replace view v_compliance_summary as
select
  organization_id,
  facility_id,
  standard_id,
  status,
  count(*) as item_count
from compliance_items
group by organization_id, facility_id, standard_id, status;
```

View ini memudahkan dashboard menampilkan jumlah item compliance per status tanpa query kompleks.

---

## 3. Halaman Dashboard (Compliance Page)

**Route:** `/compliance`
**File:** `src/app/(dashboard)/compliance/page.tsx`

### 3.1 Stat Cards

| KPI | Value | Sumber Data |
|-----|-------|-------------|
| Compliance Score | 94/100 (+2 pts) | Rata-rata dari compliance_items |
| Open Findings | 12 requiring action | audit_findings WHERE status = 'open' |
| Audits This Year | 8 (4 completed, 4 scheduled) | compliance_audits |
| Upcoming Deadlines | 5 (next 30 days) | compliance_items.due_date & corrective_actions.due_date |

### 3.2 Compliance Standards Overview

| Standard | Status | Score | Next Audit |
|----------|--------|-------|------------|
| ISO 14001 | ✅ Certified | 100% | Q3 2026 |
| GRI | ✅ Compliant | 95% | Q4 2026 |
| TCFD | ✅ Compliant | 92% | Q1 2027 |
| CDP | ✅ Submitted | A- | Q1 2027 |
| PROPER | ✅ Compliant | 88% | Q2 2026 |
| SBTi | ⏳ Pending | - | Q4 2026 |

---

## 4. Alur Kerja Compliance

```
                      ┌──────────────────┐
                      │  Compliance       │
                      │  Standards        │
                      │  (9 standar)      │
                      └────────┬─────────┘
                               │
                               ▼
                      ┌──────────────────┐
                      │  Compliance       │
                      │  Items            │
                      │  (per requirement)│
                      └────────┬─────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
      ┌─────────────────┐             ┌─────────────────┐
      │  Audit           │             │  Auto-score     │
      │  (scheduled)     │             │  per standard   │
      └────────┬────────┘             └─────────────────┘
               ▼
      ┌─────────────────┐
      │  Findings        │
      │  (severity)      │
      └────────┬────────┘
               ▼
      ┌─────────────────┐
      │  Corrective      │
      │  Actions         │
      │  (with due date) │
      └─────────────────┘
```

---

## 5. Koneksi dengan Modul Lain

| Modul | Hubungan |
|-------|----------|
| **Documents** | Dokumen izin, sertifikat, dan laporan audit disimpan di `documents` dan direferensi via `evidence_url` di corrective_actions |
| **Executive Overview** | Compliance Score dan Open Issues ditampilkan di halaman utama |
| **AI Insights** | AI bisa mendeteksi compliance risk (deadline approaching, status non-compliant) |

---

## 6. Indeks Database

```sql
create index idx_compliance_org    on compliance_items(organization_id);
create index idx_compliance_std    on compliance_items(standard_id);
create index idx_compliance_status on compliance_items(status);
create index idx_audit_org         on compliance_audits(organzation_id);
create index idx_audit_status      on compliance_audits(status);
create index idx_finding_audit     on audit_findings(audit_id);
create index idx_action_finding    on corrective_actions(finding_id);
```

---

## 7. Yang Sudah vs Belum

| Komponen | Status | Keterangan |
|----------|--------|------------|
| Database schema (5 tables + view) | ✅ Selesai | Semua tabel, constraint, index siap |
| Halaman dashboard | ✅ Selesai | Stat cards + standards overview table |
| Compliance score otomatis | ✅ Siap | Via query aggregation dari compliance_items |
| Checklist input form | 📝 Belum | Perlu form CRUD untuk compliance_items |
| Audit management form | 📝 Belum | Perlu form untuk input audit, findings, actions |
| Deadline notifications | 📝 Belum | Notifikasi untuk due_date yang mendekat |
| RLS policies | ⏸️ Ditunda | Row-level security untuk multi-tenant |
