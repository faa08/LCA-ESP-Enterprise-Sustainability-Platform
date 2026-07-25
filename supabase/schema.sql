-- ====================================================================
-- GREENLCA ENTERPRISE DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- Standard Compliance: ISO 14040/14044, GHG Protocol, POJK 51/2017, PROPER KLHK
-- UU No. 27/2022 (Pelindungan Data Pribadi & Audit Lineage)
-- ====================================================================

-- ─── 1. EXTENSIONS & TYPES ───
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('admin', 'manager', 'operator', 'viewer');
CREATE TYPE system_boundary AS ENUM ('cradle_to_gate', 'cradle_to_grave', 'gate_to_gate');
CREATE TYPE allocation_method AS ENUM ('mass', 'economic', 'energy', 'none');
CREATE TYPE proper_rank AS ENUM ('EMAS', 'HIJAU', 'BIRU', 'MERAH', 'HITAM');

-- ─── 2. HIERARKI MULTI-ENTITAS & TATA KELOLA (MODUL 1) ───
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    industry_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subholdings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subholding_id UUID REFERENCES subholdings(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    province VARCHAR(100),
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── 3. USER PROFILES & RBAC ───
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'operator',
    company_id UUID REFERENCES companies(id),
    site_id UUID REFERENCES sites(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── 4. GOAL & SCOPE DEFINITION (MODUL 0 - ISO 14040/14044) ───
CREATE TABLE IF NOT EXISTS lca_goals_scopes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    study_goal TEXT NOT NULL,
    functional_unit VARCHAR(255) NOT NULL, -- Contoh: 1 Ton Semen Portland
    system_boundary system_boundary NOT NULL DEFAULT 'cradle_to_gate',
    allocation_method allocation_method NOT NULL DEFAULT 'mass',
    is_locked BOOLEAN DEFAULT FALSE,
    locked_by UUID REFERENCES user_profiles(id),
    locked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── 5. PRODUCT ASSESSMENT & LCI (MODUL 2) ───
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    unit VARCHAR(50) NOT NULL DEFAULT 'Ton',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bill_of_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    material_name VARCHAR(255) NOT NULL,
    mass_qty DECIMAL(12, 4) NOT NULL,
    unit VARCHAR(50) NOT NULL DEFAULT 'kg',
    mass_percentage DECIMAL(5, 2) NOT NULL,
    country_of_origin VARCHAR(100) DEFAULT 'Indonesia',
    supplier_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── 6. DATA HUB - OPERATIONAL INGESTION (SINGLE SOURCE OF TRUTH) ───
CREATE TABLE IF NOT EXISTS energy_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    energy_source VARCHAR(100) NOT NULL, -- electricity_pln, diesel, natural_gas, coal, biomass
    quantity DECIMAL(14, 4) NOT NULL,
    unit VARCHAR(50) NOT NULL, -- kWh, Liter, Nm3, Ton
    is_renewable BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS waste_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    waste_type VARCHAR(255) NOT NULL,
    waste_code VARCHAR(50), -- Misal: B105d untuk limbah B3
    is_b3 BOOLEAN DEFAULT FALSE,
    quantity DECIMAL(12, 4) NOT NULL,
    unit VARCHAR(50) DEFAULT 'Ton',
    storage_duration_days INT DEFAULT 0,
    manifest_number VARCHAR(100), -- Festronik KLHK
    disposal_method VARCHAR(100), -- 3R, Incineration, Landfill
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transport_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL, -- truck, ship, rail, air
    fuel_type VARCHAR(100) NOT NULL, -- diesel, cng, electric
    distance_km DECIMAL(10, 2) NOT NULL,
    cargo_weight_ton DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lab_test_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    test_date DATE NOT NULL,
    sample_point VARCHAR(255) NOT NULL, -- Outlet IPAL
    ph_value DECIMAL(4, 2),
    cod_mg_l DECIMAL(10, 2),
    bod_mg_l DECIMAL(10, 2),
    tss_mg_l DECIMAL(10, 2),
    heavy_metals_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stack_emission_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    test_date DATE NOT NULL,
    stack_id VARCHAR(100) NOT NULL, -- Stack-01 Boiler A
    tsp_mg_nm3 DECIMAL(10, 2),
    so2_mg_nm3 DECIMAL(10, 2),
    nox_mg_nm3 DECIMAL(10, 2),
    co_mg_nm3 DECIMAL(10, 2),
    opacity_pct DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS document_vault (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- lab_report, manifest_b3, iplc_permit, amdal
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT,
    uploaded_by UUID REFERENCES user_profiles(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── 7. LCIA & CARBON & COMPLIANCE METRICS (MODUL 6, 7, 8, 9, 10, 11) ───
CREATE TABLE IF NOT EXISTS lcia_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    period_year INT NOT NULL,
    gwp_kg_co2e DECIMAL(14, 4) NOT NULL, -- Global Warming Potential
    ap_kg_so2e DECIMAL(14, 4) NOT NULL,  -- Acidification Potential
    ep_kg_po4e DECIMAL(14, 4) NOT NULL,  -- Eutrophication Potential
    odp_kg_cfc11e DECIMAL(14, 6),        -- Ozone Depletion
    wud_m3 DECIMAL(14, 4),               -- Water Depletion
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carbon_footprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    reporting_year INT NOT NULL,
    scope1_tco2e DECIMAL(14, 4) NOT NULL,
    scope2_tco2e DECIMAL(14, 4) NOT NULL,
    scope3_tco2e DECIMAL(14, 4) NOT NULL,
    total_tco2e DECIMAL(14, 4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS compliance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    reporting_year INT NOT NULL,
    pojk51_score DECIMAL(5, 2),
    proper_rank proper_rank NOT NULL DEFAULT 'BIRU',
    gri_coverage_pct DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── 8. IMMUTABLE AUDIT TRAIL (MODUL 12) ───
CREATE TABLE IF NOT EXISTS audit_trail_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    site_id UUID REFERENCES sites(id),
    module_code VARCHAR(50) NOT NULL, -- M0, M1, M2, DataHub, etc.
    action_type VARCHAR(50) NOT NULL, -- CREATE, UPDATE, LOCK, DELETE
    payload_snapshot JSONB NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─── 9. ROW LEVEL SECURITY (RLS) & PRIVASI UU PDP ───
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE subholdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail_logs ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS Dasar: User hanya bisa membaca/menulis data entitas perusahaannya
CREATE POLICY site_access_policy ON sites
    FOR ALL USING (
        subholding_id IN (
            SELECT s.id FROM subholdings s
            JOIN user_profiles up ON up.company_id = s.company_id
            WHERE up.id = auth.uid()
        )
    );
