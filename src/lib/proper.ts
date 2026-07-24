// PROPER reference data.
// Baku mutu mengacu pada Permen LHK (Permen LH 5/2014 + P.16/2019, Permen LH 7/2007, PP 101/2014).
// Air limbah: Penyamakan Kulit (PDF user), Minyak Goreng & Tekstil (Permen LH 5/2014) = RIIL.
// Emisi boiler: masih MOCK, menunggu input jenis bahan bakar (lihat komentar emisiBoiler).

export type ProperCategory = "emisi" | "air_limbah" | "limbah_b3" | "lainnya"

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

// --- Kelapa Sawit (CPO): Permen LH 5/2014 Lampiran III ---
const kelapaSawit: IndustryProfile = {
  id: "kelapa_sawit",
  name: "Industri Kelapa Sawit (CPO)",
  isMock: false,
  params: [
    { code: "ph", name: "pH", unit: "-", kind: "range", category: "air_limbah", min: 6, max: 9, mock: 7.2 },
    { code: "bod", name: "BOD", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 100, mock: 70 },
    { code: "cod", name: "COD", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 350, mock: 250 },
    { code: "tss", name: "TSS", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 250, mock: 150 },
    { code: "oil_fat", name: "Minyak dan Lemak", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 50, mock: 30 },
    { code: "nitrogen", name: "Nitrogen Total", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 50, mock: 30 },
  ],
}

// --- Pulp & Paper: Permen LH 5/2014 Lampiran I ---
const pulpPaper: IndustryProfile = {
  id: "pulp_paper",
  name: "Industri Pulp & Kertas",
  isMock: false,
  params: [
    { code: "ph", name: "pH", unit: "-", kind: "range", category: "air_limbah", min: 6, max: 9, mock: 7.5 },
    { code: "bod", name: "BOD", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 150, mock: 100 },
    { code: "cod", name: "COD", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 400, mock: 300 },
    { code: "tss", name: "TSS", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 100, mock: 80 },
    { code: "ao", name: "Senyawa Organik Terhalogenasi (AOX)", unit: "mg/L", kind: "numeric", category: "air_limbah", max: 2, mock: 1.5 },
  ],
}

// --- Emisi cerobong (boiler) ---
export const EMISSION_PROFILES: Record<string, { label: string; limits: Record<string, number> }> = {
  batubara: { label: "Batubara", limits: { tsp: 230, so2: 850, nox: 400, co: 150, opacity: 20 } },
  biomassa: { label: "Biomassa (serabut/cangkang)", limits: { tsp: 300, so2: 850, nox: 400, co: 150, opacity: 20 } },
  gas: { label: "Gas", limits: { tsp: 230, so2: 150, nox: 650, co: 150, opacity: 20 } },
  minyak: { label: "Minyak", limits: { tsp: 230, so2: 850, nox: 450, co: 150, opacity: 20 } },
}

/**
 * Kembalikan daftar ProperParam emisi sesuai jenis bahan bakar yang dipilih.
 * Gunakan ini di Compliance page agar batas emisi dinamis per pabrik.
 * @param fuelType - salah satu key dari EMISSION_PROFILES (default: "batubara")
 */
export function getEmissionParams(fuelType: string = "batubara"): ProperParam[] {
  const profile = EMISSION_PROFILES[fuelType] ?? EMISSION_PROFILES.batubara
  const limits = profile.limits
  return [
    { code: "tsp",     name: "Partikulat (TSP)", unit: "mg/Nm³", kind: "numeric", category: "emisi", max: limits.tsp,     mock: Math.round(limits.tsp     * 0.52) },
    { code: "so2",     name: "SO₂",              unit: "mg/Nm³", kind: "numeric", category: "emisi", max: limits.so2,     mock: Math.round(limits.so2     * 0.71) },
    { code: "nox",     name: "NOx",              unit: "mg/Nm³", kind: "numeric", category: "emisi", max: limits.nox,     mock: Math.round(limits.nox     * 0.75) },
    { code: "co",      name: "CO",               unit: "mg/Nm³", kind: "numeric", category: "emisi", max: limits.co,      mock: Math.round(limits.co      * 0.60) },
    { code: "opacity", name: "Opasitas",          unit: "%",       kind: "numeric", category: "emisi", max: limits.opacity, mock: Math.round(limits.opacity * 0.60) },
  ]
}

// --- Limbah B3: Data Operasional Riil (Permen LHK No. 6/2021) ---
const limbahB3: ProperParam[] = [
  { code: "b3_storage_days", name: "Lama Masa Simpan B3 di TPS", unit: "Hari", kind: "numeric", category: "limbah_b3", max: 90, mock: 45 },
  { code: "b3_permit_days", name: "Masa Berlaku Izin TPS B3 (Sisa)", unit: "Hari", kind: "numeric", category: "limbah_b3", min: 1, mock: 180 },
  { code: "b3_festronik_pct", name: "Kelengkapan Festronik KLHK", unit: "%", kind: "numeric", category: "limbah_b3", min: 100, mock: 100 },
  { code: "b3_recycle_pct", name: "Tingkat Pemanfaatan / Daur Ulang B3", unit: "%", kind: "numeric", category: "limbah_b3", mock: 65 },
  { code: "b3_tonnage", name: "Total Generasi Limbah B3", unit: "Ton/bulan", kind: "numeric", category: "limbah_b3", mock: 12 },
]

export const INDUSTRIES: IndustryProfile[] = [
  penyamakanKulit,
  makananMinuman,
  tekstil,
  kelapaSawit,
  pulpPaper,
]

export const LIMBAH_B3_PARAMS: ProperParam[] = limbahB3

// --- Modul pendukung (11 LCA Categories) ---
export const CARBON_PARAMS: ProperParam[] = [
  { code: "ghg_scope1", name: "Emisi Gas Rumah Kaca Scope 1", unit: "tCO₂e/tahun", kind: "numeric", category: "lainnya", mock: 0 },
  { code: "ghg_scope2", name: "Emisi Gas Rumah Kaca Scope 2", unit: "tCO₂e/tahun", kind: "numeric", category: "lainnya", mock: 0 },
  { code: "ghg_scope3", name: "Emisi Gas Rumah Kaca Scope 3", unit: "tCO₂e/tahun", kind: "numeric", category: "lainnya", mock: 0 },
]

export const LCA_PARAMS: ProperParam[] = [
  { code: "gwp", name: "Global Warming Potential", unit: "kg CO₂e", kind: "numeric", category: "lainnya", mock: 0 },
  { code: "odp", name: "Ozone Depletion Potential", unit: "kg CFC-11e", kind: "numeric", category: "lainnya", mock: 0 },
  { code: "ap", name: "Acidification Potential", unit: "kg SO₂e", kind: "numeric", category: "lainnya", mock: 0 },
  { code: "ep", name: "Eutrophication Potential", unit: "kg PO₄e", kind: "numeric", category: "lainnya", mock: 0 },
  { code: "pocp", name: "Photochemical Ozone Creation", unit: "kg NMVOCe", kind: "numeric", category: "lainnya", mock: 0 },
  { code: "adpe", name: "Abiotic Depletion (elements)", unit: "kg Sbe", kind: "numeric", category: "lainnya", mock: 0 },
  { code: "adpf", name: "Abiotic Depletion (fossil)", unit: "MJ", kind: "numeric", category: "lainnya", mock: 0 },
  { code: "wud", name: "Water Use Depletion", unit: "m³", kind: "numeric", category: "lainnya", mock: 0 },
  { code: "ht", name: "Human Toxicity", unit: "kg 1,4-DBe", kind: "numeric", category: "lainnya", mock: 0 },
  { code: "fet", name: "Freshwater Ecotoxicity", unit: "kg 1,4-DBe", kind: "numeric", category: "lainnya", mock: 0 },
  { code: "pm", name: "Particulate Matter", unit: "kg PM2.5e", kind: "numeric", category: "lainnya", mock: 0 },
]

export const ENERGY_PARAMS: ProperParam[] = [
  { code: "energy_total",     name: "Total Energi",          unit: "MWh/tahun",      kind: "numeric", category: "lainnya", mock: 0 },
  { code: "energy_renewable", name: "Energi Terbarukan",     unit: "MWh/tahun",      kind: "numeric", category: "lainnya", mock: 0 },
  { code: "energy_intensity", name: "Intensitas Energi",     unit: "kWh/unit produk", kind: "numeric", category: "lainnya", mock: 0 },
]

export const OTHER_PARAMS: ProperParam[] = [...CARBON_PARAMS, ...LCA_PARAMS, ...ENERGY_PARAMS]

// Backward-compat exports — digunakan oleh halaman yang belum menggunakan getEmissionParams().
// Default = Batubara (paling umum). Halaman yang butuh dinamis gunakan getEmissionParams(fuelType).
export const EMISSIONS_PARAMS: ProperParam[] = getEmissionParams("batubara")

export function getIndustry(id: string | null): IndustryProfile | null {
  if (!id) return null
  return INDUSTRIES.find((i) => i.id === id) ?? null
}

export type ComplianceStatus = "ok" | "warn" | "fail"

export function evaluateParam(p: ProperParam, value: number | boolean): ComplianceStatus {
  if (p.kind === "checklist") return value ? "ok" : "fail"
  const v = value as number
  if (p.kind === "range") {
    if (v < p.min || v > p.max) return "fail"
    const span = p.max - p.min
    if (v <= p.min + span * 0.05 || v >= p.max - span * 0.05) return "warn"
    return "ok"
  }
  if (p.min !== undefined && p.max === undefined) {
    if (v < p.min) return "fail"
    if (v < p.min * 1.1) return "warn"
    return "ok"
  }
  if (p.max === undefined) return "ok"
  if (v > p.max) return "fail"
  if (v > p.max * 0.9) return "warn"
  return "ok"
}

export type ProperRank = "Emas" | "Hijau" | "Biru" | "Merah" | "Hitam"

export function predictRank(
  emisiFails: number,
  airFails: number,
  b3Fails: number,
  lcaFilledCount: number = 0,
): ProperRank {
  const total = emisiFails + airFails + b3Fails
  if (total >= 4) return "Hitam"
  if (total >= 1) return "Merah"
  // Taat sempurna (0 fail di semua kategori) → cek LCA untuk beyond compliance
  // Emas: semua 11 indikator LCA diisi (ISO 14040/14044 terpenuhi penuh)
  if (lcaFilledCount >= 11) return "Emas"
  // Hijau: minimal 3 dari 11 indikator LCA diisi (beyond compliance partial)
  if (lcaFilledCount >= 3) return "Hijau"
  // Taat tapi belum beyond compliance
  return "Biru"
}
