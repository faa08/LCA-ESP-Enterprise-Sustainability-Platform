-- ====================================================================
-- DATA HUB EXTRA TABLES (TAMBAHAN)
-- Tabel untuk kategori Data Hub yang belum tercakup di schema awal:
-- production, materials, suppliers, documents, circular_economy_flows, lca_goals_scopes_extended
-- ====================================================================

-- ─── DATA HUB: PRODUKSI HARIAN ───
CREATE TABLE IF NOT EXISTS data_hub_production (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    industry_id VARCHAR(100) NOT NULL, -- misal: "semen", "tambang", "migas"
    log_date DATE NOT NULL,
    plant VARCHAR(255) NOT NULL,
    line VARCHAR(255) DEFAULT '',
    product VARCHAR(255) NOT NULL,
    qty DECIMAL(14, 4) NOT NULL DEFAULT 0,
    qty_unit VARCHAR(50) NOT NULL DEFAULT 'Ton',
    hours DECIMAL(5, 2) NOT NULL DEFAULT 0,
    reject_qty DECIMAL(14, 4) NOT NULL DEFAULT 0,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── DATA HUB: MATERIAL / BAHAN BAKU ───
CREATE TABLE IF NOT EXISTS data_hub_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    industry_id VARCHAR(100) NOT NULL,
    log_date DATE NOT NULL,
    material VARCHAR(255) NOT NULL,
    supplier VARCHAR(255) DEFAULT '',
    qty DECIMAL(14, 4) NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL DEFAULT 'Ton',
    country_of_origin VARCHAR(100) DEFAULT 'Indonesia',
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── DATA HUB: PEMASOK / SUPPLIER ───
CREATE TABLE IF NOT EXISTS data_hub_suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    industry_id VARCHAR(100) NOT NULL,
    log_date DATE NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    category VARCHAR(255) DEFAULT '',
    country VARCHAR(100) DEFAULT 'Indonesia',
    sustainability VARCHAR(100) DEFAULT 'none',
    notes TEXT DEFAULT '',
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── DATA HUB: DOKUMEN VAULT (metadata; file di Supabase Storage) ───
CREATE TABLE IF NOT EXISTS data_hub_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    industry_id VARCHAR(100) NOT NULL,
    log_date DATE NOT NULL,
    doc_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT DEFAULT '', -- Supabase Storage path
    file_size_bytes BIGINT DEFAULT 0,
    notes TEXT DEFAULT '',
    uploaded_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── DATA HUB: WATER LOGS (extended dari schema awal) ───
-- Tabel water_efficiency_logs sudah ada; buat alias view lebih simpel untuk DataHub
CREATE TABLE IF NOT EXISTS data_hub_water_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    industry_id VARCHAR(100) NOT NULL,
    log_date DATE NOT NULL,
    raw_water DECIMAL(14, 4) NOT NULL DEFAULT 0,       -- m³
    groundwater DECIMAL(14, 4) NOT NULL DEFAULT 0,      -- m³
    process_water DECIMAL(14, 4) NOT NULL DEFAULT 0,    -- m³
    wastewater DECIMAL(14, 4) NOT NULL DEFAULT 0,       -- m³
    flow_rate DECIMAL(14, 4) NOT NULL DEFAULT 0,        -- m³/h
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── DATA HUB: ENERGY LOGS (extended) ───
-- Menggantikan energy_logs yang kurang kolom
CREATE TABLE IF NOT EXISTS data_hub_energy_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    industry_id VARCHAR(100) NOT NULL,
    log_date DATE NOT NULL,
    electricity DECIMAL(14, 4) NOT NULL DEFAULT 0,   -- kWh (PLN)
    diesel DECIMAL(14, 4) NOT NULL DEFAULT 0,         -- Liter
    natural_gas DECIMAL(14, 4) NOT NULL DEFAULT 0,    -- Nm³
    coal DECIMAL(14, 4) NOT NULL DEFAULT 0,           -- Ton
    biomass DECIMAL(14, 4) NOT NULL DEFAULT 0,        -- Ton
    steam DECIMAL(14, 4) NOT NULL DEFAULT 0,          -- Ton
    lpg DECIMAL(14, 4) NOT NULL DEFAULT 0,            -- kg
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── DATA HUB: LABORATORY LOGS (extended) ───
CREATE TABLE IF NOT EXISTS data_hub_lab_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    industry_id VARCHAR(100) NOT NULL,
    test_date DATE NOT NULL,
    sample_point VARCHAR(255) NOT NULL,
    ph DECIMAL(4, 2) DEFAULT 0,
    cod DECIMAL(10, 4) DEFAULT 0,
    bod DECIMAL(10, 4) DEFAULT 0,
    tss DECIMAL(10, 4) DEFAULT 0,
    nh3 DECIMAL(10, 4) DEFAULT 0,
    oil_grease DECIMAL(10, 4) DEFAULT 0,
    phenol DECIMAL(10, 4) DEFAULT 0,
    heavy_metals_json JSONB DEFAULT '{}',
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── DATA HUB: STACK EMISSION LOGS (extended) ───
CREATE TABLE IF NOT EXISTS data_hub_stack_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    industry_id VARCHAR(100) NOT NULL,
    test_date DATE NOT NULL,
    stack_id VARCHAR(100) NOT NULL,
    tsp DECIMAL(10, 4) DEFAULT 0,        -- mg/Nm³
    so2 DECIMAL(10, 4) DEFAULT 0,        -- mg/Nm³
    nox DECIMAL(10, 4) DEFAULT 0,        -- mg/Nm³
    co DECIMAL(10, 4) DEFAULT 0,         -- mg/Nm³
    opacity DECIMAL(5, 2) DEFAULT 0,     -- %
    flow_rate DECIMAL(14, 4) DEFAULT 0,  -- Nm³/jam
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── DATA HUB: B3 WASTE LOGS (extended) ───
CREATE TABLE IF NOT EXISTS data_hub_b3_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    industry_id VARCHAR(100) NOT NULL,
    log_date DATE NOT NULL,
    waste_type VARCHAR(255) NOT NULL,
    waste_code VARCHAR(50) DEFAULT '',
    qty DECIMAL(12, 4) NOT NULL DEFAULT 0,
    storage_duration INT NOT NULL DEFAULT 0,
    manifest_no VARCHAR(100) DEFAULT '',
    recycler VARCHAR(255) DEFAULT '',
    disposal_company VARCHAR(255) DEFAULT '',
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── DATA HUB: TRANSPORT LOGS (extended) ───
CREATE TABLE IF NOT EXISTS data_hub_transport_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    industry_id VARCHAR(100) NOT NULL,
    log_date DATE NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL DEFAULT 'truck',
    fuel_type VARCHAR(100) NOT NULL DEFAULT 'diesel',
    distance DECIMAL(10, 4) NOT NULL DEFAULT 0,         -- km
    cargo_weight DECIMAL(10, 4) NOT NULL DEFAULT 0,     -- ton
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── CIRCULAR ECONOMY FLOWS ───
CREATE TABLE IF NOT EXISTS circular_economy_flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    industry_id VARCHAR(100) NOT NULL DEFAULT '',
    name VARCHAR(255) NOT NULL,
    total_kg_year DECIMAL(14, 4) NOT NULL DEFAULT 0,
    recycled_pct DECIMAL(5, 2) NOT NULL DEFAULT 0,
    reused_pct DECIMAL(5, 2) NOT NULL DEFAULT 0,
    recovered_pct DECIMAL(5, 2) NOT NULL DEFAULT 0,
    landfill_pct DECIMAL(5, 2) NOT NULL DEFAULT 100,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── GOAL & SCOPE (Extended dari lca_goals_scopes) ───
-- Menambahkan kolom yang dibutuhkan halaman Goal & Scope
ALTER TABLE lca_goals_scopes
    ADD COLUMN IF NOT EXISTS industry_id VARCHAR(100) NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS boundary VARCHAR(100) NOT NULL DEFAULT 'cradle-to-gate',
    ADD COLUMN IF NOT EXISTS allocation VARCHAR(100) NOT NULL DEFAULT 'mass',
    ADD COLUMN IF NOT EXISTS impact_categories TEXT[] DEFAULT ARRAY['Global Warming Potential (GWP)'],
    ADD COLUMN IF NOT EXISTS data_quality_reqs TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS comparative_study BOOLEAN DEFAULT FALSE;

-- ─── AUDIT TRAIL: Tambah kolom industry_id ───
ALTER TABLE audit_trail_logs
    ADD COLUMN IF NOT EXISTS industry_id VARCHAR(100) NOT NULL DEFAULT '';

-- ─── BIODIVERSITY: Tambah kolom yang dibutuhkan ───
ALTER TABLE biodiversity_logs
    ADD COLUMN IF NOT EXISTS industry_id VARCHAR(100) NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS site_name VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS shannon_index DECIMAL(5, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS buffer_zone_area_ha DECIMAL(10, 2) DEFAULT 0;

-- ─── ROW LEVEL SECURITY untuk tabel baru ───
ALTER TABLE data_hub_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_hub_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_hub_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_hub_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_hub_water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_hub_energy_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_hub_lab_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_hub_stack_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_hub_b3_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_hub_transport_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE circular_economy_flows ENABLE ROW LEVEL SECURITY;

-- ─── INDEX untuk performa query ───
CREATE INDEX IF NOT EXISTS idx_data_hub_energy_site ON data_hub_energy_logs(site_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_data_hub_water_site ON data_hub_water_logs(site_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_data_hub_lab_site ON data_hub_lab_logs(site_id, test_date DESC);
CREATE INDEX IF NOT EXISTS idx_data_hub_stack_site ON data_hub_stack_logs(site_id, test_date DESC);
CREATE INDEX IF NOT EXISTS idx_data_hub_b3_site ON data_hub_b3_logs(site_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_data_hub_transport_site ON data_hub_transport_logs(site_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_data_hub_production_site ON data_hub_production(site_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_data_hub_materials_site ON data_hub_materials(site_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_circular_economy_site ON circular_economy_flows(site_id);
CREATE INDEX IF NOT EXISTS idx_audit_trail_industry ON audit_trail_logs(industry_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_biodiversity_industry ON biodiversity_logs(industry_id);

-- ─── PERMISSIONS & RLS POLICIES FOR PUBLIC SCHEMA ───
-- Grant usage on schema public to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- Allow default public access to all data hub and module tables for anon & authenticated roles
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN
        SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS allow_all_%I ON %I;', tbl, tbl);
        EXECUTE format('CREATE POLICY allow_all_%I ON %I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);', tbl, tbl);
    END LOOP;
END $$;

