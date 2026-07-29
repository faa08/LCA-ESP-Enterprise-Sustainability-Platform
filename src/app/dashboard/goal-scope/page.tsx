"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Target, CheckCircle2, Lock, Info,
  Beaker, Globe2, ArrowRight, ChevronDown, ChevronUp, Loader2,
} from "lucide-react"
import { useIndustryId } from "@/lib/use-industry-id"
import { useSiteId } from "@/lib/use-site-id"
import { getGoalScope, saveGoalScope } from "@/lib/supabase/data-service"
import { useBoundary, getActiveScopes, BOUNDARY_SCOPE_MAP, BOUNDARY_CATEGORY_MAP, type SystemBoundary as SBType } from "@/lib/boundary-context"

type SystemBoundary = "cradle-to-gate" | "cradle-to-grave" | "gate-to-gate" | "cradle-to-cradle"
type AllocationMethod = "mass" | "economic" | "system-expansion" | "physical"

const BOUNDARY_OPTIONS: { value: SystemBoundary; label: string; desc: string }[] = [
  { value: "cradle-to-gate", label: "Cradle-to-Gate", desc: "Dari ekstraksi bahan baku hingga pintu pabrik. Tidak mencakup distribusi & penggunaan." },
  { value: "cradle-to-grave", label: "Cradle-to-Grave", desc: "Siklus hidup penuh: dari ekstraksi bahan baku hingga pembuangan akhir." },
  { value: "gate-to-gate", label: "Gate-to-Gate", desc: "Hanya proses di dalam fasilitas produksi. Lingkup paling sempit." },
  { value: "cradle-to-cradle", label: "Cradle-to-Cradle", desc: "Sistem tertutup dengan pemulihan & daur ulang penuh di akhir masa pakai." },
]

const ALLOCATION_OPTIONS: { value: AllocationMethod; label: string; ref: string }[] = [
  { value: "mass", label: "Alokasi Massa", ref: "ISO 14044 §4.3.4.2" },
  { value: "economic", label: "Alokasi Ekonomi", ref: "ISO 14044 §4.3.4.2" },
  { value: "system-expansion", label: "Perluasan Sistem", ref: "ISO 14044 §4.3.4.3" },
  { value: "physical", label: "Alokasi Fisik (Energi)", ref: "ISO 14044 §4.3.4.2" },
]

const IMPACT_CATEGORIES = [
  "Global Warming Potential (GWP)", "Acidification Potential (AP)", "Eutrophication Potential (EP)",
  "Ozone Depletion Potential (ODP)", "Photochemical Ozone Creation (POCP)", "Water Footprint",
  "Land Use", "Resource Depletion (Minerals)", "Human Toxicity", "Ecotoxicity",
]

export default function GoalScopePage() {
  const industryId = useIndustryId()
  const siteId = useSiteId()
  const { refreshBoundary } = useBoundary()

  const [dbId, setDbId] = useState<string | undefined>(undefined)
  const [studyGoal, setStudyGoal] = useState("")
  const [functionalUnit, setFunctionalUnit] = useState("")
  const [boundary, setBoundary] = useState<SystemBoundary>("cradle-to-gate")
  const [allocation, setAllocation] = useState<AllocationMethod>("mass")
  const [selectedImpacts, setSelectedImpacts] = useState<string[]>(["Global Warming Potential (GWP)"])
  const [dataQualityReqs, setDataQualityReqs] = useState("")
  const [comparativeStudy, setComparativeStudy] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const LOCAL_KEY = "enspr_goal_scope"

  const refresh = useCallback(async () => {
    if (!siteId) return
    setLoading(true)
    const data = await getGoalScope(siteId, industryId)
    if (data && (data.studyGoal || data.functionalUnit)) {
      setDbId(data.id)
      setStudyGoal(data.studyGoal)
      setFunctionalUnit(data.functionalUnit)
      setBoundary((data.boundary as SystemBoundary) || "cradle-to-gate")
      setAllocation((data.allocation as AllocationMethod) || "mass")
      setSelectedImpacts(data.impactCategories || ["Global Warming Potential (GWP)"])
      setDataQualityReqs(data.dataQualityReqs)
      setComparativeStudy(data.comparativeStudy)
      setIsLocked(data.isLocked)
    } else if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setStudyGoal(parsed.studyGoal || "")
          setFunctionalUnit(parsed.functionalUnit || "")
          setBoundary(parsed.boundary || "cradle-to-gate")
          setAllocation(parsed.allocation || "mass")
          setSelectedImpacts(parsed.impactCategories || ["Global Warming Potential (GWP)"])
          setDataQualityReqs(parsed.dataQualityReqs || "")
          setComparativeStudy(Boolean(parsed.comparativeStudy))
          setIsLocked(Boolean(parsed.isLocked))
        } catch {}
      }
    }
    setLoading(false)
  }, [siteId, industryId])

  useEffect(() => { refresh() }, [refresh])

  const toggleImpact = (cat: string) =>
    setSelectedImpacts(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])

  const isComplete = studyGoal.trim().length > 0 || functionalUnit.trim().length > 0

  const handleSave = async () => {
    setSaving(true)
    const record = {
      id: dbId,
      studyGoal,
      functionalUnit,
      boundary,
      allocation,
      impactCategories: selectedImpacts,
      dataQualityReqs,
      comparativeStudy,
      isLocked: true,
    }
    await saveGoalScope(siteId, industryId, record)
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(record))
    }
    setIsLocked(true)
    setSaving(false)
    setSaved(true)
    // Refresh boundary context so all other modules update
    await refreshBoundary()
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" className="text-[10px] font-bold tracking-wider">ISO 14040/14044</Badge>
            <Badge variant="neutral" className="text-[10px]">Modul 0</Badge>
            {isLocked && <Badge variant="success" className="text-[10px]">Scope Terkunci di Database</Badge>}
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Goal & Scope Definition</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Fondasi metodologi LCA. Tersimpan secara permanen di database untuk audit pihak ketiga.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
            {saving ? "Menyimpan..." : saved ? "Tersimpan!" : "Simpan Scope"}
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12 text-sm text-neutral-400 gap-2">
          <Loader2 className="h-5 w-5 animate-spin" /> Memuat definisi Goal & Scope...
        </div>
      )}

      {!loading && (
        <>
          <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Mengapa Modul Ini Wajib?</p>
              <p className="mt-0.5 text-xs text-blue-700">
                ISO 14040 §4.2 mengharuskan setiap studi LCA mendefinisikan tujuan dan ruang lingkup secara eksplisit.
                Tanpa ini, hasil perhitungan tidak dapat diklaim sebagai LCA yang sah dan tidak dapat diaudit pihak ketiga (SUCOFINDO, TÜV, KAP).
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><Target className="h-4 w-4" /></div>
                  <div><CardTitle>1. Tujuan Studi</CardTitle><p className="text-xs text-neutral-500 mt-0.5">ISO 14040 §4.2.1</p></div>
                </div>
              </CardHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Tujuan Studi LCA <span className="text-red-500">*</span></label>
                  <textarea value={studyGoal} onChange={e => setStudyGoal(e.target.value)} rows={3}
                    placeholder="Contoh: Menghitung dampak lingkungan produksi semen OPC per ton untuk mendukung laporan PROPER EMAS dan pengurangan emisi Scope 1 sebesar 20% pada 2030..."
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 resize-none" />
                  <p className="mt-1 text-[11px] text-neutral-400">{studyGoal.length} karakter</p>
                </div>
                <label className="flex items-center gap-3 rounded-lg border border-neutral-100 p-3 cursor-pointer hover:bg-neutral-50">
                  <input type="checkbox" id="comparative" checked={comparativeStudy} onChange={e => setComparativeStudy(e.target.checked)} className="h-4 w-4 accent-emerald-600" />
                  <span className="text-sm text-neutral-700">Studi Komparatif (≥2 sistem produk) <span className="text-[11px] text-neutral-400">→ Wajib review eksternal (ISO 14044 §6)</span></span>
                </label>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600"><Beaker className="h-4 w-4" /></div>
                  <div><CardTitle>2. Unit Fungsional</CardTitle><p className="text-xs text-neutral-500 mt-0.5">ISO 14044 §4.2.3 — Dasar normalisasi semua data LCI</p></div>
                </div>
              </CardHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Definisi Unit Fungsional <span className="text-red-500">*</span></label>
                  <input type="text" value={functionalUnit} onChange={e => setFunctionalUnit(e.target.value)}
                    placeholder="Contoh: 1 ton semen OPC diproduksi, atau 1 kWh listrik dihasilkan"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
                </div>
                <div className="rounded-lg bg-neutral-50 px-3 py-2.5 text-xs text-neutral-500 border border-neutral-100">
                  <p className="font-semibold text-neutral-700 mb-1">Contoh per Sektor</p>
                  <ul className="space-y-0.5">
                    <li>Manufaktur: 1 ton produk / 1 unit produk</li>
                    <li>Energi: 1 MWh listrik / 1 GJ panas</li>
                    <li>Logistik: 1 ton·km barang terangkut</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600"><Globe2 className="h-4 w-4" /></div>
                  <div><CardTitle>3. Batas Sistem</CardTitle><p className="text-xs text-neutral-500 mt-0.5">ISO 14044 §4.2.3.3 — Mendefinisikan proses mana yang masuk dalam perhitungan</p></div>
                </div>
                <button onClick={() => setGuideOpen(!guideOpen)} className="text-neutral-400 hover:text-neutral-600">
                  {guideOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </CardHeader>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {BOUNDARY_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setBoundary(opt.value)}
                  className={`rounded-xl border p-4 text-left transition-all ${boundary === opt.value ? "border-emerald-400 bg-emerald-50 shadow-sm" : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-bold ${boundary === opt.value ? "text-emerald-800" : "text-neutral-800"}`}>{opt.label}</span>
                    {boundary === opt.value && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                  </div>
                  <p className={`text-xs leading-relaxed ${boundary === opt.value ? "text-emerald-700" : "text-neutral-500"}`}>{opt.desc}</p>
                </button>
              ))}
            </div>
            {guideOpen && (
              <div className="mt-4 rounded-lg border border-dashed border-neutral-200 p-4 text-xs text-neutral-500">
                <p className="font-semibold text-neutral-700 mb-1">Panduan</p>
                <p>PROPER KLHK: gunakan <b>Cradle-to-Gate</b> (minimal) atau <b>Cradle-to-Grave</b> untuk Beyond Compliance.</p>
                <p className="mt-1">POJK 51/2017: minimal mencakup Scope 1 + Scope 2 (minimum Cradle-to-Gate).</p>
              </div>
            )}
          </Card>

          {/* Boundary Impact Preview */}
          <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
            <p className="text-sm font-semibold text-orange-900 mb-2">Dampak Batas Sistem: {BOUNDARY_OPTIONS.find(b => b.value === boundary)?.label}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-orange-800 mb-1">Scope GHG yang aktif:</p>
                <div className="flex flex-wrap gap-1.5">
                  {BOUNDARY_SCOPE_MAP[boundary as SBType].map(scope => (
                    <span key={scope} className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                      ✅ {scope.replace("scope", "Scope ")}
                    </span>
                  ))}
                  {["scope1", "scope2", "scope3"].filter(s => !BOUNDARY_SCOPE_MAP[boundary as SBType].includes(s as "scope1" | "scope2" | "scope3")).map(scope => (
                    <span key={scope} className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-400 border border-neutral-200 line-through">
                      {scope.replace("scope", "Scope ")}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-orange-800 mb-1">Kategori Data Hub yang tersedia:</p>
                <p className="text-[11px] text-orange-700">
                  {BOUNDARY_CATEGORY_MAP[boundary as SBType].length} dari 10 kategori aktif.
                  {!BOUNDARY_CATEGORY_MAP[boundary as SBType].includes("transport") && <span className="ml-1">❌ Transport disembunyikan.</span>}
                  {!BOUNDARY_CATEGORY_MAP[boundary as SBType].includes("materials") && <span className="ml-1">❌ Materials disembunyikan.</span>}
                  {!BOUNDARY_CATEGORY_MAP[boundary as SBType].includes("supplier") && <span className="ml-1">❌ Supplier disembunyikan.</span>}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>4. Metode Alokasi</CardTitle><p className="text-xs text-neutral-500 mt-0.5">ISO 14044 §4.3.4</p></CardHeader>
              <div className="space-y-2">
                {ALLOCATION_OPTIONS.map(opt => (
                  <label key={opt.value} className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${allocation === opt.value ? "border-emerald-300 bg-emerald-50" : "border-neutral-100 hover:bg-neutral-50"}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="allocation" value={opt.value} checked={allocation === opt.value} onChange={() => setAllocation(opt.value)} className="h-4 w-4 accent-emerald-600" />
                      <span className={`text-sm font-medium ${allocation === opt.value ? "text-emerald-900" : "text-neutral-700"}`}>{opt.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">{opt.ref}</span>
                  </label>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader><CardTitle>5. Kategori Dampak Lingkungan</CardTitle><p className="text-xs text-neutral-500 mt-0.5">ISO 14044 §4.4.1 — GWP wajib untuk PROPER</p></CardHeader>
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {IMPACT_CATEGORIES.map(cat => (
                  <label key={cat} className={`flex items-center gap-3 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${selectedImpacts.includes(cat) ? "border-emerald-200 bg-emerald-50" : "border-neutral-100 hover:bg-neutral-50"}`}>
                    <input type="checkbox" checked={selectedImpacts.includes(cat)} onChange={() => toggleImpact(cat)} className="h-4 w-4 accent-emerald-600" />
                    <span className={`text-xs ${selectedImpacts.includes(cat) ? "font-medium text-emerald-900" : "text-neutral-700"}`}>{cat}</span>
                  </label>
                ))}
                <p className="pt-1 text-[11px] text-neutral-400">{selectedImpacts.length} / {IMPACT_CATEGORIES.length} dipilih</p>
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>6. Persyaratan Kualitas Data</CardTitle><p className="text-xs text-neutral-500 mt-0.5">ISO 14044 §4.2.3.5</p></CardHeader>
            <textarea value={dataQualityReqs} onChange={e => setDataQualityReqs(e.target.value)} rows={3}
              placeholder="Contoh: Data primer dari pengukuran langsung diutamakan. Data sekunder dari database ecoinvent v3.9 dapat digunakan untuk bahan baku dengan kontribusi < 1% terhadap total dampak GWP..."
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 resize-none" />
          </Card>

          <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-4 border border-emerald-200">
            <div>
              <p className="text-sm font-semibold text-emerald-900">Simpan Konfigurasi Scope</p>
              <p className="text-xs text-emerald-700 mt-0.5">Batas sistem: <b>{BOUNDARY_OPTIONS.find(b => b.value === boundary)?.label}</b> · Alokasi: <b>{ALLOCATION_OPTIONS.find(a => a.value === allocation)?.label}</b> · {selectedImpacts.length} kategori dampak</p>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Simpan ke Database <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
