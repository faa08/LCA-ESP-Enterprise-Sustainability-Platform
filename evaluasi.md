# Evaluasi Fitur — ensPR (Platform LCA + PROPER + Karbon Kredit)

> **Tujuan produk (kesepakatan):** LCA adalah **sistem inti/awal** yang ditawarkan ke pabrik
> naungan KLHK. Di atas LCA ditambahkan layer **PROPER** untuk mengidentifikasi peringkat
> pabrik (**Emas / Hijau / Biru / Merah / Hitam**) serta fitur **Karbon Kredit** yang
> dihitung dari hasil LCA + carbon accounting.
>
> **Status data saat ini:** 100% `localStorage` (`enspr_measurements_<industryId>`).
> Dependency `@supabase` + `.env.local` sudah ada, tapi **belum di-wiring ke kode**.

---

## 1. PROPER Ranking (`src/lib/proper.ts`)

**Sekarang**
- `predictRank(emisiFails, airFails, b3Fails)` hanya bisa mengembalikan **Merah / Biru / Hitam**.
- `total >= 4` → Hitam, `total >= 1` → Merah, else → **Biru** (hardcode, komentar:
  "butuh audit lapangan untuk Hijau/Emas").
- Tipe `ProperRank` menyebut Emas/Hijau, UI menampilkannya, tapi `predictRank` **tidak
  mungkin mengembalikannya** → Emas & Hijau tidak tercapai.
- `LCA_PARAMS` sudah ada (kategori `lainnya`) tapi **tidak dipakai sama sekali** dalam ranking.

**Harus dievaluasi**
- Tentukan rules **Emas/Hijau** (mis. semua param "ok" + bukti LCA bagus / 3R / penurunan karbon).
- Putuskan apakah hasil LCA boleh **menaikkan** Biru → Hijau (sesuai niat, LCA harus berpengaruh
  ke identifikasi peringkat, bukan cuma "modul pendukung").

---

## 2. Data Flow & Supabase (`src/lib/measurements.ts`)

**Sekarang**
- `getMeasurements` / `saveMeasurements` / `recordImport` / `useImportLog` / `paramValue` /
  `evaluate` → semua baca/tulis **localStorage**, tidak ada fallback demo (baik).
- 3 helper Supabase ada (`src/lib/supabase/{client,server,admin}.ts`) tapi **nol import** ke
  `src/` mana pun. `.env.local` berisi `NEXT_PUBLIC_SUPABASE_URL` + anon key, tidak dipakai.
- Klaim "live sync every 2s" di landing = **kosmetik** (tidak ada polling/streaming).

**Harus dievaluasi**
- Putuskan apakah benar-benar pakai Supabase (data ke server → aman dari manipulasi client).
- Jika ya, buat **storage adapter** agar `measurements.ts` bisa menulis ke Supabase + fallback
  localStorage. Jika tidak, lunakkan copy "live/cloud sync" di landing.

---

## 3. Dashboard per Modul

| Modul | Path | Status | Yang harus dievaluasi |
|---|---|---|---|
| LCA | `dashboard/lca/page.tsx` | REAL (baca store) | StatCard `active_projects` / `products_analyzed` masih hardcode `0` → isi dari data / empty state |
| Carbon Accounting | `dashboard/carbon-accounting/page.tsx` | REAL | OK; chart empty-state saat belum diisi |
| **Karbon Kredit** | `dashboard/carbon-credit/page.tsx` | ❌ **DEMO / PLACEHOLDER** | `registry` + angka `2.690 / 620 / 2.070` hardcode. **Harus dihitung dari LCA + carbon accounting** (gap terbesar) |
| Emisi / Air / Limbah B3 | `environmental/water/waste-monitoring` | REAL | `water-monitoring` ada **salah mapping label↔value** (intake menampilkan `ph`, consumption menampilkan `tss`) → benerin |
| Compliance | `dashboard/compliance/page.tsx` | REAL | OK (evaluasi PROPER penuh dari store) |
| Documents | `dashboard/documents/page.tsx` | PLACEHOLDER | Belum ada store/upload → bikin atau tandai "roadmap" |
| Executive Overview | `dashboard/page.tsx` + `executive-overview.tsx` | REAL sebagian | Beberapa KPI (water/recycled/ESG/facilities/issues) hardcode `0`/`—` padahal data tersedia → sambungin |
| Data Hub | `dashboard/data-hub/page.tsx` | REAL | OK; IoT/ERP baru simpan config (belum live) |
| Input Manual | `dashboard/input/page.tsx` | REAL | OK; semua grup param (air/emisi/B3/carbon/energy/LCA) → store |
| Settings | `dashboard/settings/page.tsx` | Sebagian | Pemilihan industri jalan (`enspr_industry`); section lain (Users/Integrations/API) hardcode → bikin atau buang |

---

## 4. Landing / Messaging

**Sekarang**
- Hero (`locales/id.ts`): *"Platform pemantauan untuk kepatuhan PROPER"* — **PROPER
  dilebih-lebihkan**, LCA dikubur.
- Badge & KPI hero ketiga berpusat di PROPER.
- Carbon Credit **absen total** dari marketing (`site-content.ts` tidak punya slug karbon kredit).
- `FeatureModules.tsx` & `/platform` lebih berimbang (LCA disebut), tapi hero tetap PROPER-centric.

**Harus dievaluasi**
- Balikan narasi: **LCA = sistem inti**, PROPER + Karbon Kredit = fitur tambahan untuk pabrik KLHK
  (contoh: *"Platform LCA & keberlanjutan untuk pabrik KLHK, dengan PROPER + Karbon Kredit terintegrasi"*).
- Tambahkan **modul Carbon Credit** ke `site-content.ts` + page `/modules/carbon-credit` agar
  matching dengan dashboard.

---

## 5. Sidebar (`src/components/layout/sidebar.tsx`)

**Sekarang**
- Grup: EXECUTIVE → Executive Overview; SUSTAINABILITY → **LCA**, Carbon Accounting, **Carbon
  Credit**, Environmental Monitoring; OPERATIONS → Energy, Water, Waste; DATA MANAGEMENT → Data
  Hub, Manual Input; COMPLIANCE → **PROPER Snapshot**, **Dokumen PROPER**; INTELLIGENCE → **Asisten
  PROPER**; SYSTEM → Settings.
- LCA ada di SUSTAINABILITY (posisi oke, item pertama) tapi grup COMPLIANCE & AI **semua
  branded "PROPER"**.

**Harus dievaluasi**
- Relabel item COMPLIANCE/AI/Documents untuk meredam PROPER ("Asisten Kepatuhan", "Dokumen
  Kepatuhan") agar LCA terbaca sebagai tulang punggung.
- Pertimbangkan grouping eksplisit: LCA sebagai "Core" vs PROPER/Carbon sebagai "Modules".

---

## 6. AI Insights (`dashboard/ai-insights/page.tsx`)

**Sekarang**
- REAL tapi **rule-based**, bukan LLM. Membaca fail/warn per kategori PROPER → `predictRank`
  → saran statis dari i18n. Tidak ada pemanggilan model/API. LCA/carbon hanya disentil di
  kalimat penutup.

**Harus dievaluasi**
- Jika "AI" jadi nilai jual: integrasi LLM (butuh backend/edge fn) **atau** ganti nama jadi
  "Compliance Insights" agar tidak overclaim.
- Perluas saran ke **hotspot LCA** & peluang pengurangan karbon, bukan cuma PROPER pass/fail.

---

## 7. Settings & Auth (`dashboard/settings/page.tsx`)

**Sekarang**
- Pemilihan industri `<select>` membaca `INDUSTRIES` & simpan ke `enspr_industry` → menggerakkan
  `useIndustryId()`. **Fungsional & real.**
- Section lain (Company/Facility/Users/Permissions/Integrations/API Keys) = **placeholder tidak
  fungsional** (statik: 24 users / 12 facilities / 2.4 GB).
- **Tidak ada auth beneran** — "login" hanya role flag (cookie/localStorage), tidak terhubung
  backend mana pun.

**Harus dievaluasi**
- Jika multi-pabrik/multi-user: wiring ke Supabase auth. Atau explicit bahwa ini lokal saja.
- Implementasi atau hapus section placeholder settings (angka hardcode menyesatkan).

---

## Prioritas Eksekusi (sesuai niat)

1. 🔴 **Karbon Kredit dihitung beneran** dari LCA + carbon accounting (gap paling nyata).
2. 🔴 **Emas/Hijau di `predictRank`** + LCA berpengaruh ke peringkat.
3. 🟠 **Balikan narasi landing** ke LCA-core + tambah Carbon Credit ke marketing.
4. 🟠 **Supabase** (keamanan integritas data) — atau putuskan lokal saja.
5. 🟢 Bug kecil: label `water-monitoring`, KPI `executive-overview`, `documents`, placeholder `settings`.

---

*Dokumen ini dihasilkan dari audit kode (Next.js 16 App Router, React 19, TypeScript, Tailwind v4).
Belum ada file yang diubah — ini murni hasil evaluasi.*
