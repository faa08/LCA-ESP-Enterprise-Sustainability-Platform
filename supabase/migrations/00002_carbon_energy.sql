-- ============================================================================
-- 2. CARBON ACCOUNTING
-- ============================================================================

-- 2a. EMISSION FACTORS (reference data)
create table emission_factors (
  id              uuid primary key default uuid_generate_v4(),
  category        text not null,
  subcategory     text,
  scope           text not null check (scope in ('scope1', 'scope2', 'scope3')),
  unit            text not null,
  co2e_factor     numeric not null,
  ch4_factor      numeric default 0,
  n2o_factor      numeric default 0,
  source          text,
  valid_from      date,
  valid_until     date,
  region          text,
  created_at      timestamptz not null default now()
);

-- 2b. CARBON EMISSIONS (transactional records)
create table carbon_emissions (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id     uuid references facilities(id) on delete set null,
  scope           text not null check (scope in ('scope1', 'scope2', 'scope3')),
  category        text not null,
  subcategory     text,
  activity_data   numeric not null,
  activity_unit   text not null,
  emission_factor numeric,
  co2e_value      numeric not null,
  co2_value       numeric default 0,
  ch4_value       numeric default 0,
  n2o_value       numeric default 0,
  biogenic_co2    numeric default 0,
  unit            text not null default 'tCO₂e',
  period_start    date not null,
  period_end      date not null,
  methodology     text,
  data_quality    text check (data_quality in ('measured', 'estimated', 'calculated', 'referenced')),
  notes           text,
  created_by      uuid references profiles(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 2c. CARBON REDUCTION TARGETS
create table carbon_reduction_targets (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id     uuid references facilities(id) on delete set null,
  title           text not null,
  description     text,
  base_year       integer not null,
  base_emission   numeric not null,
  target_year     integer not null,
  target_emission numeric not null,
  reduction_pct   numeric not null,
  scope           text check (scope in ('scope1', 'scope2', 'scope3', 'all')),
  sbti_aligned    boolean default false,
  status          text default 'active' check (status in ('active', 'achieved', 'missed', 'cancelled')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 2d. CARBON OFFSETS
create table carbon_offsets (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  project_name    text not null,
  registry        text,
  certificate_id  text,
  retirement_id   text,
  vintage         integer,
  quantity        numeric not null,
  unit            text not null default 'tCO₂e',
  offset_type     text check (offset_type in ('renewable-energy', 'forestry', 'methane-capture', 'direct-air-capture', 'other')),
  status          text default 'retired' check (status in ('purchased', 'retired', 'cancelled')),
  retirement_date date,
  created_at      timestamptz not null default now()
);

-- ============================================================================
-- 3. ENERGY MONITORING
-- ============================================================================

-- 3a. ENERGY CONSUMPTION
create table energy_consumption (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id     uuid references facilities(id) on delete set null,
  energy_type     text not null check (energy_type in ('electricity', 'natural-gas', 'steam', 'diesel', 'gasoline', 'coal', 'biomass', 'solar', 'wind', 'other')),
  source          text,
  value           numeric not null,
  unit            text not null,
  renewable       boolean default false,
  co2_emission    numeric,
  period_start    date not null,
  period_end      date not null,
  interval_type   text default 'monthly' check (interval_type in ('hourly', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  notes           text,
  created_at      timestamptz not null default now()
);

-- 3b. ENERGY TARGETS
create table energy_targets (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id     uuid references facilities(id) on delete set null,
  title           text not null,
  energy_type     text,
  baseline_value  numeric,
  baseline_period text,
  target_value    numeric not null,
  target_unit     text not null,
  target_year     integer not null,
  status          text default 'active' check (status in ('active', 'achieved', 'missed', 'cancelled')),
  created_at      timestamptz not null default now()
);

-- 3c. EQUIPMENT EFFICIENCY
create table equipment_efficiency (
  id              uuid primary key default uuid_generate_v4(),
  facility_id     uuid not null references facilities(id) on delete cascade,
  equipment_name  text not null,
  equipment_type  text,
  efficiency_pct  numeric not null,
  target_pct      numeric,
  energy_input    numeric,
  energy_output   numeric,
  unit            text,
  recorded_at     date not null,
  notes           text,
  created_at      timestamptz not null default now()
);

-- Indexes
create index idx_carbon_org        on carbon_emissions(organization_id);
create index idx_carbon_facility   on carbon_emissions(facility_id);
create index idx_carbon_period     on carbon_emissions(period_start, period_end);
create index idx_carbon_scope      on carbon_emissions(scope);
create index idx_energy_org        on energy_consumption(organization_id);
create index idx_energy_facility   on energy_consumption(facility_id);
create index idx_energy_period     on energy_consumption(period_start, period_end);
create index idx_energy_type       on energy_consumption(energy_type);
