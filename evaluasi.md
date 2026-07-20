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

## 8. Kesiapan Enterprise BUMN (KS / Pertamina)

**Konteks:** Untuk pabrik padat modal & audit KLHK ketat seperti **Krakatau Steel (KS)** dan
**Pertamina**, pendekatan platform harus beda jauh dari pabrik tekstil/kulit menengah.

**Temuan / gap terhadap kebutuhan BUMN**
- **Skala & profil industri:** KS (peleburan baja — blast furnace, coke oven) & Pertamina
  (refinery, petrokimia) punya emisi & limbah B3 raksasa. `EMISSION_PROFILES` saat ini (hanya
  batubara/biomassa/gas/minyak boiler kecil) **kurang** — butuh profil pembangkit, furnace,
  dan refinery unit dengan baku mutu spesifik (RKL-RPL + izin lingkungan, bukan cuma Permen
  LH 7/2007 umum). `LCA_PARAMS` (GWP/water/eutro/recycled) terlalu generik → butuh LCA baja &
  LCA produk migas.
- **Kebutuhan sesungguhnya:** bukan sekadar "tahu rank PROPER" (mereka sudah punya tim EHS).
  Yang mereka mau: (a) otomatisasi lapor ke KLHK (e-RKL-RPL, Profil Lingkungan); (b) early
  warning pelanggaran baku mutu dari CEMS/DCS; (c) simulasi "ganti bahan bakar/teknologi →
  rank naik ke Hijau/Emas?"; (d) perhitungan **Karbon Kredit beneran** untuk dijual.
- **Integrasi data:** mereka **tidak manual input Excel**. Data dari CEMS/SCADA/DCS/ERP (SAP)
  → harus lewat **API/streaming ke server**, bukan localStorage. Supabase (atau bahkan
  Kafka/timeseries DB seperti InfluxDB) **wajib**. `useIndustryId` saat ini single-tenant →
  butuh **multi-tenant** (tiap site industri beda).
- **Privasi & audit:** data emisi BUMN sensitif & bisa diaudit hukum. AI API cloud (OpenAI/
  Gemini) = data keluar negeri → risiko. Lebih aman **on-prem / private LLM (Ollama/Qwen di
  server mereka)** atau Gemini Enterprise dengan data residency. Audit trail harus
  **tamper-proof** (server-authoritative + signature).
- **Positioning jualan:** jangan jual "aplikasi PROPER" (mereka sudah punya). Jual **"Sistem
  LCA + Command Center kepatuhan yang nyambung langsung ke CEMS/ERP, lengkap simulasi rank
  PROPER & perhitungan Karbon Kredit otomatis."** LCA tetap core (butuh ISO 14040 / report
  ESG ke investor), PROPER + Karbon Kredit = value-add.

**Syarat arsitektur untuk level enterprise**
1. **Multi-tenant + server-based** (Supabase wajib; localStorage tidak cukup).
2. **Profil industri spesifik** (baja, refinery), bukan cuma tekstil/kulit.
3. **Real-time dari CEMS/ERP**, bukan manual.
4. **Private AI** (on-prem LLM) demi privasi & audit.
5. Fokus ke **simulasi + lapor otomatis + karbon kredit**, bukan sekadar lihat rank.

**Kesimpulan:** Arsitektur saat ini (client-only, single industry, localStorage) **baru cocok
untuk pilot/demo ke pabrik menengah**. Untuk KS/Pertamina harus naik ke **enterprise
multi-tenant backend**.

---

## 9. Arah Bisnis & Target User

**Keputusan arah**
- **Jangan jadikan KLHK sebagai target utama (B2G sulit danannya).** Tender pemerintah =
  proses lambat, DP susah, bayar telat, budget KLHK terbatas.
- **Duit dari pabrik & konsultan (B2B), bukan dari pemerintah.** KS, Pertamina, pabrik
  tekstil/kulit punya budget EHS & sustainability yang bisa bayar langganan cepat.
- **KLHK cukup jadi "efek samping" gratis/soft:** pabrik yang pakai EnsPR otomatis menghasilkan
  laporan compatible format KLHK → regulator menikmati data tanpa lo tagih. Atau masuk lewat
  program/pendampingan (CSR, donor, asosiasi seperti APINDO/KADIN) yang **mereka yang bayar**,
  bukan APBN langsung.
- **Jangan buang energi bangun sistem regulator yang berat** kalau dananya tidak jelas. Fokus
  bangun **EnsPR Factory (pabrik)** sebagai produk utama yang dijual.

**Produk inti yang dijual:** EnsPR Factory — sistem LCA + PROPER ranking + Karbon Kredit untuk
pabrik naungan KLHK (B2B SaaS).

---

## 10. Model Harga (SaaS Berlangganan)

**Prinsip:** pakai langganan bulanan/tahunan, bukan sekali bayar — butuh duit rutin untuk
server/AI, dan pabrik lebih terbiasa langganan daripada lisensi. Harga dibuat "enak" karena
pabrik sudah punya budget EHS/CSR besar; tools ini ibarat asuransi murah vs denda PROPER.

### Kisaran harga (IDR, B2B pabrik)

| Tier | Target | Harga/bulan | Isi |
|---|---|---|---|
| **Starter** | Pabrik kecil (tekstil, kulit, makanan) | Rp 3–5 jt | 1 site, manual/Excel, LCA + PROPER dasar |
| **Pro** | Pabrik menengah | Rp 8–15 jt | multi-user, CEMS/ERP ingest, karbon kredit, AI insights |
| **Enterprise** | KS, Pertamina, grup | Rp 30–80 jt | multi-site, private AI, profil industri khusus, SLA |

- **Setup/onboarding sekali:** Rp 5–20 jt (migrasi data, training tim EHS).
- **Freemium demo:** gratis untuk 1 pabrik, data terbatas (KS/Pertamina bisa coba tanpa commit).
- **Langganan tahunan:** diskon 2 bulan → cashflow lebih stabil.
- **Add-on Karbon Kredit:** persen dari nilai kredit yang dijual (mis. 10–15%) → ikut cuan
  kalau pabrik jual offset.
- **Alternatif per laporan:** Rp 2–5 jt/lapor KLHK (cocok pabrik kecil yang males langganan).

### Pendekatan pabrik gede (KS/Pertamina)
Jangan pakai list price. **Nego enterprise + pilot gratis 3–6 bulan untuk 1 site**; kalau
terbukti naik rank/hemat lapor, baru kontrak tahunan besar.

> Catatan: angka di atas perkiraan pasar; harga final tergantung cost operasional (server,
> Supabase, API AI, dev). Perlu dihitung break-even & margin setelah cost diketahui.

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
