import {
  resetAllData,
  saveCompanyProfile,
  saveSiteIndustry,
  saveGoalScope,
  saveProductAssessment,
  saveHubEntry,
  saveBiodiversityRecord,
  upsertCircularFlow,
  saveSDGProgress,
  type EntityRecord,
  type ProductionEntry,
  type MaterialEntry,
  type EnergyEntry,
  type WaterEntry,
  type LabEntry,
  type StackEntry,
  type B3Entry,
  type TransportEntry,
} from "@/lib/supabase/data-service"

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for environments without crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

// Generate months for the last 12 months
function getLast12Months() {
  const dates = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    d.setDate(15) // middle of the month
    dates.push(d.toISOString().split("T")[0])
  }
  return dates
}

export async function seedLautanOtsukaData(siteId: string) {
  const industryId = "kimia" // Manufaktur Kimia

  // 1. Reset all existing data for the site
  await resetAllData(siteId)

  // 2. Modul 1: Company Profile
  const korporatId = generateId()
  const subholdingId = generateId()
  
  const entities: EntityRecord[] = [
    {
      id: korporatId,
      level: "korporat",
      name: "Otsuka Chemical Co., Ltd.",
      location: "Osaka, Japan",
      industry: "kimia",
      employees: 5000,
      parentId: null,
    },
    {
      id: subholdingId,
      level: "subholding",
      name: "PT Lautan Luas Tbk",
      location: "Jakarta, Indonesia",
      industry: "kimia",
      employees: 2500,
      parentId: korporatId,
    },
    {
      id: siteId, // This is the active site
      level: "site",
      name: "PT. Lautan Otsuka Chemical",
      location: "Cilegon, Banten",
      province: "Banten",
      city: "Cilegon",
      industry: "kimia",
      employees: 350,
      parentId: subholdingId,
    }
  ]
  await saveCompanyProfile(siteId, entities)
  await saveSiteIndustry(siteId, industryId)

  // 3. Modul 0: Goal & Scope
  await saveGoalScope(siteId, industryId, {
    studyGoal: "Menghitung jejak lingkungan (LCA) dan emisi karbon dari produksi Azodicarbonamide (Blowing Agent) untuk kepatuhan PROPER dan pelaporan ESG.",
    functionalUnit: "1 Ton Azodicarbonamide (ADCA)",
    boundary: "cradle-to-grave",
    allocation: "mass",
    impactCategories: [
      "Global Warming Potential (GWP)",
      "Acidification Potential (AP)",
      "Eutrophication Potential (EP)",
      "Photochemical Ozone Creation (POCP)",
      "Human Toxicity (HT)"
    ],
    dataQualityReqs: "Data primer operasional 2023-2024. Data sekunder ecoinvent 3.9 untuk bahan baku.",
    comparativeStudy: false,
    isLocked: true,
  })

  // 4. Modul 2: Product Assessment (BOM)
  await saveProductAssessment(siteId, industryId, {
    id: generateId(),
    name: "Azodicarbonamide (ADCA)",
    category: "Chemical Blowing Agent",
    massKg: 1000,
    unit: "ton",
    bom: [
      { id: generateId(), material: "Hydrazine Hydrate", supplier: "PT Alam Kimia", massKg: 550, recycledPct: 0, origin: "Indonesia" },
      { id: generateId(), material: "Urea", supplier: "PT Pupuk Kaltim", massKg: 420, recycledPct: 0, origin: "Indonesia" },
      { id: generateId(), material: "Chlorine Gas", supplier: "PT Asahimas Chemical", massKg: 200, recycledPct: 0, origin: "Indonesia" },
      { id: generateId(), material: "Sodium Hydroxide", supplier: "Local Supplier", massKg: 150, recycledPct: 0, origin: "Indonesia" },
      { id: generateId(), material: "Paper Bags with Liner", supplier: "Packaging Co.", massKg: 15, recycledPct: 20, origin: "Indonesia" }
    ]
  })

  // 5. Data Hub (Operational Data for the last 12 months)
  const dates = getLast12Months()
  
  for (const date of dates) {
    // A. Production (Monthly output ~1,200 tons)
    const qty = 1100 + Math.random() * 200
    await saveHubEntry<ProductionEntry>("production", siteId, industryId, {
      id: generateId(),
      date,
      plant: "Plant Cilegon",
      line: "Line 1 (ADCA)",
      product: "Azodicarbonamide",
      qty: Math.round(qty),
      qtyUnit: "Ton",
      hours: 720,
      rejectQty: Math.round(qty * 0.015), // 1.5% reject
    })

    // B. Materials (Raw material inputs proportional to production)
    const factor = qty / 1000
    const materials = [
      { name: "Hydrazine Hydrate", qty: 550 * factor, unit: "Ton", supplier: "PT Alam Kimia" },
      { name: "Urea", qty: 420 * factor, unit: "Ton", supplier: "PT Pupuk Kaltim" },
      { name: "Chlorine Gas", qty: 200 * factor, unit: "Ton", supplier: "PT Asahimas Chemical" }
    ]
    for (const mat of materials) {
      await saveHubEntry<MaterialEntry>("materials", siteId, industryId, {
        id: generateId(),
        date,
        material: mat.name,
        supplier: mat.supplier,
        qty: Math.round(mat.qty),
        unit: mat.unit,
        countryOfOrigin: "Indonesia"
      })
    }

    // C. Energy (High energy intensity for chemical synthesis)
    await saveHubEntry<EnergyEntry>("energy", siteId, industryId, {
      id: generateId(),
      date,
      electricity: Math.round(1500000 + Math.random() * 100000), // 1.5M kWh/month
      diesel: Math.round(5000 + Math.random() * 1000), // 5,000 L/month for backup/forklifts
      naturalGas: Math.round(300000 + Math.random() * 20000), // 300k Nm3 for heating/boilers
      coal: 0,
      biomass: 0,
      steam: 0,
      lpg: 0,
    })

    // D. Water (Large cooling and process water requirement)
    await saveHubEntry<WaterEntry>("water", siteId, industryId, {
      id: generateId(),
      date,
      rawWater: 0,
      groundwater: 0,
      processWater: Math.round(50000 + Math.random() * 5000), // from municipal/industrial estate
      wastewater: Math.round(40000 + Math.random() * 4000),
      flowRate: 50,
    })

    // E. Laboratory (WWTP output - Chemical wastewater)
    await saveHubEntry<LabEntry>("laboratory", siteId, industryId, {
      id: generateId(),
      date,
      samplePoint: "Outlet WWTP",
      ph: 6.8 + Math.random() * 0.5,
      cod: 40 + Math.random() * 15,
      bod: 20 + Math.random() * 5,
      tss: 30 + Math.random() * 10,
      nh3: 1.5 + Math.random() * 1.0,
      oilGrease: 2.0 + Math.random() * 1.0,
      phenol: 0.05 + Math.random() * 0.02,
      heavyMetals: { "Cu": 0.1, "Zn": 0.5 }
    })

    // F. Stack Emissions (Gas Boilers)
    await saveHubEntry<StackEntry>("stack", siteId, industryId, {
      id: generateId(),
      date,
      stackId: "Boiler Gas 1",
      tsp: 15 + Math.random() * 5,
      so2: 10 + Math.random() * 5,
      nox: 150 + Math.random() * 30, // Gas boilers have higher NOx
      co: 45 + Math.random() * 10,
      opacity: 5,
      flowRate: 15.5
    })

    // G. B3 Waste (Sludge IPAL from WWTP and used packaging)
    await saveHubEntry<B3Entry>("b3", siteId, industryId, {
      id: generateId(),
      date,
      wasteType: "Sludge IPAL Kimia",
      wasteCode: "B351-1",
      qty: Math.round(25 + Math.random() * 5), // 25 tons/month
      storageDuration: 30, // Days in TPS
      manifestNo: `MNF-B3-${date.split("-")[0]}-${date.split("-")[1]}`,
      recycler: "PT PPLI",
      disposalCompany: "PT PPLI"
    })

    // H. Transport (Scope 3 downstream: shipping ADCA to customers)
    await saveHubEntry<TransportEntry>("transport", siteId, industryId, {
      id: generateId(),
      date,
      vehicleType: "truck",
      fuelType: "diesel",
      distance: 120, // avg 120km to customers
      cargoWeight: 20, // 20 tons per trip
      direction: "downstream",
      frequencyPerYear: Math.round(qty / 20) // number of trips needed
    })
  }

  // 6. Modul 9: Biodiversity (Conservation around Cilegon site)
  await saveBiodiversityRecord(siteId, industryId, {
    id: generateId(),
    siteName: "Cilegon Industrial Area Green Zone",
    conservationAreaHa: 2.5,
    protectedFloraCount: 15,
    protectedFaunaCount: 5,
    rehabilitationStatus: "In Progress (Tree Planting)",
    shannonIndex: 1.8,
    partnerInstitution: "DLH Banten & Univ. Sultan Ageng Tirtayasa",
  })

  // 7. Modul 8: Circular Economy (Recycling paper bags & wooden pallets)
  await upsertCircularFlow(siteId, industryId, {
    id: generateId(),
    name: "Paper Bags & Wooden Pallets",
    totalKgYear: 150000, // 150 tons
    recycledPct: 85,
    reusedPct: 10,
    recoveredPct: 0,
    landfillPct: 5,
  })

  // 8. Modul 12: SDG Progress (Focus on Goal 6, 9, 12, 13)
  const sdgData = [
    { sdgId: 6, indicatorStates: [true, true, true, false] }, // Clean Water & Sanitation
    { sdgId: 9, indicatorStates: [true, true, false, false] }, // Industry & Innovation
    { sdgId: 12, indicatorStates: [true, true, true, true] }, // Responsible Consumption
    { sdgId: 13, indicatorStates: [true, true, false, false] }, // Climate Action
  ]
  await saveSDGProgress(siteId, industryId, sdgData)

  return { success: true }
}
