// PROPER reference data.
// Baku mutu mengacu pada Permen LHK (Permen LH 5/2014 + P.16/2019, Permen LH 7/2007, PP 101/2014).
// Air limbah: Penyamakan Kulit (PDF user), Minyak Goreng & Tekstil (Permen LH 5/2014) = RIIL.
// Emisi boiler: masih MOCK, menunggu input jenis bahan bakar (lihat komentar emisiBoiler).

export type ProperCategory = "emisi" | "air_limbah" | "limbah_b3"

export type ParamKind = "numeric" | "range" | "checklist"

export interface NumericParam {
  code: string
  name: string
  unit: string
  kind: "numeric"
  category: ProperCategory
  max?: number // batas maksimum (mg/L, mg/Nm3, dst)
  min?: number // batas minimum (mis. pH bawah)
  maxAllowed?: number // batas atas untuk range (mis. pH 9)
  // nilai mock default untuk demo
  mock: number
}

export interface RangeParam {
  code: string
  name: string
  unit: string
  kind: "range"
  category: ProperCategory
  min: number
  max: number // batas atas range (mis. pH 9)
  minFloor?: number // batas bawah (mis. pH 6)
  mock: number
}

export interface ChecklistParam {
  code: string
  name: string
  kind: "checklist"
  category: "limbah_b3"
  mock: boolean
}

export type ProperParam = NumericParam | RangeParam | ChecklistParam

export interface IndustryProfile {
  id: string
  name: string
  isMock: boolean
  params: ProperParam[]
}

// --- Penyamakan Kulit: ANGKA RIIL ---
const penyamakanKulit: IndustryProfile = {
  id: "penyamakan_kulit",
  name: "Industri Penyamakan Kulit",
  isMock: false,
  params: [
    { code: "ph", name: "pH (potential Hydrogen)", unit: "-", kind: "range", category: "air_limbah", min: 6, max: 9, mock: 7.5 },
    { code: "bod", name: "Biological Oxygen Demand (BOD)", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 30, mock: 22 },
    { code: "cod", name: "Chemical Oxygen Demand (COD)", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 200, mock: 150 },
    { code: "nh3n", name: "Amoniak sebagai Nitrogen (NH3-N)", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 2, mock: 1.2 },
    { code: "tkn", name: "Total Kjedal Nitrogen (TKN)", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 30, mock: 18 },
    { code: "cr", name: "Krom (Cr) Total", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 0.6, mock: 0.3 },
    { code: "oil_fat", name: "Minyak dan Lemak", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 5, mock: 3 },
    { code: "sulfide", name: "Sulfida", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 0.8, mock: 0.4 },
    { code: "tss", name: "Total Suspended Solid (TSS)", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 60, mock: 40 },
  ],
}

// --- Minyak Goreng (proses basah): RIIL, Permen LH 5/2014 Lampiran Minyak Goreng ---
const makananMinuman: IndustryProfile = {
  id: "makanan_minuman",
  name: "Industri Minyak Goreng (proses basah)",
  isMock: false,
  params: [
    { code: "ph", name: "pH", unit: "-", kind: "range", category: "air_limbah", min: 6, max: 9, mock: 7.0 },
    { code: "bod", name: "BOD", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 75, mock: 50 },
    { code: "cod", name: "COD", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 150, mock: 110 },
    { code: "tss", name: "TSS", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 60, mock: 40 },
    { code: "oil_fat", name: "Minyak dan Lemak", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 5, mock: 3 },
    { code: "mbas", name: "MBAS (Surfaktan)", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 3, mock: 1.5 },
    { code: "phosphat", name: "Fosfat (PO4)", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 2, mock: 1.0 },
  ],
}

// --- Tekstil / Pencelupan: RIIL, Permen LH 5/2014 Lampiran XLII (diubah P.16/MENLHK/2019) ---
const tekstil: IndustryProfile = {
  id: "tekstil",
  name: "Industri Tekstil / Pencelupan",
  isMock: false,
  params: [
    { code: "ph", name: "pH", unit: "-", kind: "range", category: "air_limbah", min: 6, max: 9, mock: 8.0 },
    { code: "bod", name: "BOD", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 60, mock: 45 },
    { code: "cod", name: "COD", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 150, mock: 110 },
    { code: "tss", name: "TSS", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 50, mock: 35 },
    { code: "phenol", name: "Fenol Total", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 0.5, mock: 0.2 },
    { code: "cr", name: "Krom Total (Cr)", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 1.0, mock: 0.4 },
    { code: "nh3n", name: "Amonia Total (NH3-N)", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 8.0, mock: 5.0 },
    { code: "sulfide", name: "Sulfida (S)", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 0.3, mock: 0.15 },
    { code: "oil_fat", name: "Minyak dan Lemak", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 3.0, mock: 1.5 },
  ],
}

// --- Emisi cerobong (boiler) — RIIL, Permen LH 7/2007 ---
// Baku mutu beda per bahan bakar. Default di bawah = batubara (paling umum).
// Untuk bahan bakar lain, lihat EMISSION_PROFILES (gas/minyak/biomassa).
const emisiBoiler: ProperParam[] = [
  { code: "tsp", name: "Partikulat (TSP)", unit: "mg/Nm³", kind: "numeric", category: "emisi", max: 230, mock: 120 },
  { code: "so2", name: "SO₂", unit: "mg/Nm³", kind: "numeric", category: "emisi", max: 850, mock: 600 },
  { code: "nox", name: "NOx", unit: "mg/Nm³", kind: "numeric", category: "emisi", max: 400, mock: 300 },
  { code: "co", name: "CO", unit: "mg/Nm³", kind: "numeric", category: "emisi", max: 150, mock: 90 },
  { code: "opacity", name: "Opasitas", unit: "%", kind: "numeric", category: "emisi", max: 20, mock: 12 },
]

// Baku mutu emisi per jenis bahan bakar (Permen LH 7/2007), kg/Nm³ / mg/Nm³.
// Dipakai bila nanti user memilih bahan bakar boiler di profil pabrik.
export const EMISSION_PROFILES: Record<string, { label: string; limits: Record<string, number> }> = {
  batubara: { label: "Batubara", limits: { tsp: 230, so2: 850, nox: 400, co: 150, opacity: 20 } },
  biomassa: { label: "Biomassa (serabut/cangkang)", limits: { tsp: 300, so2: 850, nox: 400, co: 150, opacity: 20 } },
  gas: { label: "Gas", limits: { tsp: 230, so2: 150, nox: 650, co: 150, opacity: 20 } },
  minyak: { label: "Minyak", limits: { tsp: 230, so2: 850, nox: 450, co: 150, opacity: 20 } },
}

// --- Limbah B3: checklist (riil, sesuai PP 101/2014) ---
const limbahB3: ProperParam[] = [
  { code: "tps_izin", name: "TPS B3 memiliki izin", kind: "checklist", category: "limbah_b3", mock: true },
  { code: "label", name: "Label sesuai ketentuan", kind: "checklist", category: "limbah_b3", mock: true },
  { code: "simbol", name: "Simbol B3 lengkap", kind: "checklist", category: "limbah_b3", mock: false },
  { code: "manifest", name: "Manifest limbah B3 lengkap", kind: "checklist", category: "limbah_b3", mock: true },
  { code: "angkut", name: "Pengangkutan sesuai aturan", kind: "checklist", category: "limbah_b3", mock: true },
  { code: "masa_simpan", name: "Masa simpan ≤ 90 hari", kind: "checklist", category: "limbah_b3", mock: false },
  { code: "pemanfaatan", name: "Pemanfaatan / daur ulang", kind: "checklist", category: "limbah_b3", mock: true },
  { code: "olahan", name: "Pengolahan & penimbunan akhir", kind: "checklist", category: "limbah_b3", mock: true },
]

export const INDUSTRIES: IndustryProfile[] = [
  penyamakanKulit,
  makananMinuman,
  tekstil,
]

export const EMISSIONS_PARAMS: ProperParam[] = emisiBoiler
export const LIMBAH_B3_PARAMS: ProperParam[] = limbahB3

export function getIndustry(id: string | null): IndustryProfile | null {
  if (!id) return null
  return INDUSTRIES.find((i) => i.id === id) ?? null
}

// Status kepatuhan vs baku mutu
export type ComplianceStatus = "ok" | "warn" | "fail"

export function evaluateParam(p: ProperParam, value: number | boolean): ComplianceStatus {
  if (p.kind === "checklist") {
    return value ? "ok" : "fail"
  }
  const v = value as number
  if (p.kind === "range") {
    if (v < p.min || v > p.max) return "fail"
    // mendekati batas (5% dari rentang) -> warn
    const span = p.max - p.min
    if (v <= p.min + span * 0.05 || v >= p.max - span * 0.05) return "warn"
    return "ok"
  }
  // numeric
  if (p.max === undefined) return "ok"
  if (v > p.max) return "fail"
  if (v > p.max * 0.9) return "warn"
  return "ok"
}

export type ProperRank = "Emas" | "Hijau" | "Biru" | "Merah" | "Hitam"

// Prediksi peringkat dari jumlah pelanggaran per kategori
export function predictRank(
  emisiFails: number,
  airFails: number,
  b3Fails: number,
): ProperRank {
  const total = emisiFails + airFails + b3Fails
  if (total >= 4) return "Hitam"
  if (total >= 1) return "Merah"
  // tanpa fail, asumsi minimal Biru (butuh audit lapangan untuk Hijau/Emas)
  return "Biru"
}
