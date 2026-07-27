"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Plus, Trash2, CheckCircle2, Weight, Factory, Loader2, AlertCircle } from "lucide-react"
import { useIndustryId } from "@/lib/use-industry-id"
import { useSiteId } from "@/lib/use-site-id"
import {
  getProductAssessments, saveProductAssessment, deleteProductAssessment,
  type ProductAssessmentRecord, type BOMItemRecord,
} from "@/lib/supabase/data-service"

function genId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === "x" ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const emptyBOM = (): BOMItemRecord => ({
  id: genId(), material: "", supplier: "", massKg: 0, recycledPct: 0, origin: "",
})

const emptyProduct = (): ProductAssessmentRecord => ({
  id: genId(), name: "", category: "", massKg: 0, unit: "unit", bom: [emptyBOM()],
})

export default function ProductAssessmentPage() {
  const industryId = useIndustryId()
  const siteId = useSiteId()

  const [products, setProducts] = useState<ProductAssessmentRecord[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!siteId) return
    setLoading(true)
    const data = await getProductAssessments(siteId, industryId)
    if (data.length > 0) {
      setProducts(data)
      setActiveId((prev) => data.find(p => p.id === prev) ? prev : data[0].id)
    } else {
      const initial = emptyProduct()
      setProducts([initial])
      setActiveId(initial.id)
    }
    setLoading(false)
  }, [siteId, industryId])

  useEffect(() => { refresh() }, [refresh])

  const active = products.find(p => p.id === activeId) ?? products[0]

  const updateProduct = (id: string, field: keyof Omit<ProductAssessmentRecord, "bom" | "id">, value: string) =>
    setProducts(prev => prev.map(p => p.id === id ? {
      ...p,
      [field]: field === "massKg" ? parseFloat(value) || 0 : value,
    } : p))

  const addBOM = (pid: string) =>
    setProducts(prev => prev.map(p => p.id === pid ? { ...p, bom: [...p.bom, emptyBOM()] } : p))

  const removeBOM = (pid: string, bid: string) =>
    setProducts(prev => prev.map(p => p.id === pid ? { ...p, bom: p.bom.filter(b => b.id !== bid) } : p))

  const updateBOM = (pid: string, bid: string, field: keyof Omit<BOMItemRecord, "id">, value: string) =>
    setProducts(prev => prev.map(p => p.id === pid ? {
      ...p,
      bom: p.bom.map(b => b.id === bid ? {
        ...b,
        [field]: (field === "massKg" || field === "recycledPct") ? parseFloat(value) || 0 : value,
      } : b),
    } : p))

  const addProduct = () => {
    const np = emptyProduct()
    setProducts(prev => [...prev, np])
    setActiveId(np.id)
  }

  const removeProduct = async (id: string) => {
    // Only delete from Supabase if it exists there (has been saved before)
    const isNew = products.find(p => p.id === id)?.name === "" && products.find(p => p.id === id)?.bom.every(b => !b.material)
    if (!isNew) await deleteProductAssessment(id)
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id)
      if (activeId === id && next.length > 0) setActiveId(next[0].id)
      return next
    })
  }

  const handleSave = async () => {
    if (!siteId) return
    setSaving(true)
    setError(null)
    let hasError = false
    for (const product of products) {
      const result = await saveProductAssessment(siteId, industryId, product)
      if (result.error) {
        setError(result.error)
        hasError = true
        break
      }
    }
    setSaving(false)
    if (!hasError) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-sm text-neutral-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        Memuat data produk dari database...
      </div>
    )
  }

  const totalMass = active?.bom.reduce((s, b) => s + (b.massKg || 0), 0) ?? 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="neutral" className="text-[10px]">Modul 2</Badge>
            <Badge variant="neutral" className="text-[10px] font-bold">ISO 14040 — Life Cycle Inventory</Badge>
          </div>
          <h1 className="text-xl font-bold text-neutral-900">Product Assessment</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Data produk &amp; Bill of Material (BOM) sebagai dasar perhitungan Life Cycle Inventory (LCI). Tersimpan di database.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={addProduct}><Plus className="mr-1.5 h-4 w-4" />Produk Baru</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</>
              : saved
                ? <><CheckCircle2 className="mr-2 h-4 w-4" />Tersimpan</>
                : "Simpan Inventori"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Gagal menyimpan: {error}. Pastikan tabel <code>product_assessments</code> sudah dibuat di Supabase.</span>
        </div>
      )}

      {/* Product Tabs */}
      <div className="flex flex-wrap gap-2">
        {products.map(p => (
          <button key={p.id} onClick={() => setActiveId(p.id)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${activeId === p.id ? "border-emerald-400 bg-emerald-50 text-emerald-800" : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"}`}>
            <Package className="h-3.5 w-3.5" />
            {p.name || "Produk Baru"}
            {products.length > 1 && (
              <span onClick={e => { e.stopPropagation(); removeProduct(p.id) }} className="ml-1 text-neutral-300 hover:text-red-500">×</span>
            )}
          </button>
        ))}
      </div>

      {/* Product Detail */}
      {active && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><Package className="h-4 w-4" /></div>
                <CardTitle>Data Produk</CardTitle>
              </div>
            </CardHeader>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Nama Produk <span className="text-red-500">*</span></label>
                <input type="text" value={active.name} onChange={e => updateProduct(active.id, "name", e.target.value)}
                  placeholder="Semen OPC Type I, Pupuk Urea, dll."
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Kategori Produk</label>
                <input type="text" value={active.category} onChange={e => updateProduct(active.id, "category", e.target.value)}
                  placeholder="Bahan konstruksi, Pupuk, dll."
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Massa Produk Jadi</label>
                <div className="flex gap-2">
                  <input type="number" value={active.massKg || ""} onChange={e => updateProduct(active.id, "massKg", e.target.value)}
                    placeholder="1000"
                    className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
                  <select value={active.unit} onChange={e => updateProduct(active.id, "unit", e.target.value)}
                    className="rounded-lg border border-neutral-200 px-2 py-2 text-sm bg-white focus:border-emerald-400 focus:outline-none">
                    <option value="unit">unit</option>
                    <option value="kg">kg</option>
                    <option value="ton">ton</option>
                    <option value="liter">liter</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* BOM Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Factory className="h-4 w-4" /></div>
                  <div>
                    <CardTitle>Bill of Material (BOM)</CardTitle>
                    <p className="text-xs text-neutral-500 mt-0.5">Daftar bahan baku &amp; komponen penyusun produk — dasar Life Cycle Inventory (LCI)</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => addBOM(active.id)} className="w-full sm:w-auto shrink-0">
                  <Plus className="mr-1.5 h-3.5 w-3.5" />Tambah Material
                </Button>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Material / Komponen</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Supplier</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Massa (kg)</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">% Daur Ulang</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Asal</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">% Massa</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {active.bom.map(b => {
                    const massPct = totalMass > 0 ? ((b.massKg || 0) / totalMass * 100).toFixed(1) : "—"
                    return (
                      <tr key={b.id} className="border-b border-neutral-100">
                        <td className="px-3 py-2">
                          <input type="text" value={b.material}
                            onChange={e => updateBOM(active.id, b.id, "material", e.target.value)}
                            placeholder="Batu kapur, Besi, Plastik PET..."
                            className="w-full rounded border border-neutral-200 px-2 py-1 text-sm focus:border-emerald-400 focus:outline-none" />
                        </td>
                        <td className="px-3 py-2">
                          <input type="text" value={b.supplier}
                            onChange={e => updateBOM(active.id, b.id, "supplier", e.target.value)}
                            placeholder="PT Supplier"
                            className="w-full rounded border border-neutral-200 px-2 py-1 text-sm focus:border-emerald-400 focus:outline-none" />
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" value={b.massKg || ""}
                            onChange={e => updateBOM(active.id, b.id, "massKg", e.target.value)}
                            placeholder="0"
                            className="w-24 rounded border border-neutral-200 px-2 py-1 text-sm focus:border-emerald-400 focus:outline-none" />
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" min={0} max={100} value={b.recycledPct || ""}
                            onChange={e => updateBOM(active.id, b.id, "recycledPct", e.target.value)}
                            className="w-20 rounded border border-neutral-200 px-2 py-1 text-sm focus:border-emerald-400 focus:outline-none" />
                        </td>
                        <td className="px-3 py-2">
                          <input type="text" value={b.origin}
                            onChange={e => updateBOM(active.id, b.id, "origin", e.target.value)}
                            placeholder="Lokal / Impor"
                            className="w-24 rounded border border-neutral-200 px-2 py-1 text-sm focus:border-emerald-400 focus:outline-none" />
                        </td>
                        <td className="px-3 py-2 font-mono text-xs text-neutral-500">{massPct}%</td>
                        <td className="px-3 py-2">
                          {active.bom.length > 1 && (
                            <button onClick={() => removeBOM(active.id, b.id)} className="text-neutral-300 hover:text-red-500 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-neutral-200 bg-neutral-50">
                    <td className="px-3 py-2 text-xs font-bold text-neutral-700" colSpan={2}>Total BOM</td>
                    <td className="px-3 py-2 font-bold text-neutral-900 font-mono text-sm">{totalMass.toLocaleString("id-ID")} kg</td>
                    <td colSpan={4} />
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="mt-3 text-xs italic text-neutral-400">Data BOM ini akan digunakan sebagai input Life Cycle Inventory (LCI) di Modul 6 — LCIA.</p>
          </Card>
        </>
      )}
    </div>
  )
}
