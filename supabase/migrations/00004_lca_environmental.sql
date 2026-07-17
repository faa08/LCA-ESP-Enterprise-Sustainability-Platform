-- ============================================================================
-- 6. LIFE CYCLE ASSESSMENT (LCA)
-- ============================================================================

-- 6a. LCA PROJECTS
create table lca_projects (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name            text not null,
  description     text,
  product_name    text not null,
  product_unit    text default 'kg',
  functional_unit text,
  lca_standard    text check (lca_standard in ('iso-14040', 'iso-14044', 'ghg-protocol', 'pcf', 'epd', 'other')),
  status          text not null default 'draft' check (status in ('draft', 'active', 'completed', 'archived')),
  created_by      uuid references profiles(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 6b. LCA STAGES
create table lca_stages (
  id              uuid primary key default uuid_generate_v4(),
  project_id      uuid not null references lca_projects(id) on delete cascade,
  stage_order     integer not null,
  stage_name      text not null check (stage_name in ('raw-material', 'manufacturing', 'distribution', 'product-use', 'end-of-life', 'transportation', 'packaging')),
  description     text,
  input_mass      numeric,
  output_mass     numeric,
  energy_use      numeric,
  energy_unit     text default 'MJ',
  created_at      timestamptz not null default now()
);

-- 6c. LCA IMPACT ASSESSMENT
create table lca_impacts (
  id              uuid primary key default uuid_generate_v4(),
  stage_id        uuid not null references lca_stages(id) on delete cascade,
  impact_category text not null check (impact_category in (
    'global-warming-potential', 'water-footprint', 'energy-demand',
    'acidification', 'eutrophication', 'ozone-depletion',
    'photochemical-oxidation', 'abiotic-depletion', 'land-use', 'ecotoxicity'
  )),
  value           numeric not null,
  unit            text not null,
  methodology     text,
  created_at      timestamptz not null default now()
);

-- 6d. LCA MATERIALS (BOM input)
create table lca_materials (
  id              uuid primary key default uuid_generate_v4(),
  stage_id        uuid not null references lca_stages(id) on delete cascade,
  material_name   text not null,
  quantity        numeric not null,
  unit            text not null,
  origin          text,
  recycled_content_pct numeric,
  co2e_per_unit   numeric,
  created_at      timestamptz not null default now()
);

-- ============================================================================
-- 7. ENVIRONMENTAL MONITORING
-- ============================================================================

-- 7a. AIR EMISSIONS
create table air_emissions (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id     uuid references facilities(id) on delete set null,
  pollutant       text not null,
  value           numeric not null,
  unit            text not null,
  limit_value     numeric,
  limit_unit      text,
  exceedance      boolean default false,
  source          text,
  period_start    date not null,
  period_end      date not null,
  notes           text,
  created_at      timestamptz not null default now()
);

-- 7b. ENVIRONMENTAL INCIDENTS
create table environmental_incidents (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id     uuid not null references facilities(id) on delete cascade,
  incident_type   text not null,
  title           text not null,
  description     text,
  severity        text not null check (severity in ('low', 'medium', 'high', 'critical')),
  status          text not null default 'open' check (status in ('open', 'investigating', 'resolved', 'closed')),
  reported_by     uuid references profiles(id),
  reported_at     timestamptz not null default now(),
  resolved_at     timestamptz,
  root_cause      text,
  corrective_action text,
  financial_impact  numeric,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 7c. ENVIRONMENTAL TARGETS
create table environmental_targets (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id     uuid references facilities(id) on delete set null,
  category        text not null check (category in ('air-emissions', 'water', 'waste', 'energy', 'carbon', 'biodiversity', 'compliance', 'other')),
  indicator       text not null,
  baseline_value  numeric,
  target_value    numeric not null,
  target_unit     text not null,
  target_date     date,
  status          text default 'on-track' check (status in ('on-track', 'at-risk', 'behind', 'achieved', 'cancelled')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Indexes
create index idx_lca_project_org   on lca_projects(organization_id);
create index idx_lca_stage_project on lca_stages(project_id);
create index idx_lca_impact_stage  on lca_impacts(stage_id);
create index idx_air_facility      on air_emissions(facility_id);
create index idx_air_pollutant     on air_emissions(pollutant);
create index idx_incident_facility on environmental_incidents(facility_id);
create index idx_incident_status   on environmental_incidents(status);
create index idx_incident_severity on environmental_incidents(severity);
create index idx_env_target_org    on environmental_targets(organization_id);
