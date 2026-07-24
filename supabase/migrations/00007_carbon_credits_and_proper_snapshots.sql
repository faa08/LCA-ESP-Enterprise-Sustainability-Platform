-- ============================================================================
-- 8. CARBON CREDITS, PROPER SNAPSHOTS, & MEASUREMENTS ADAPTER
-- ============================================================================

-- 8a. CARBON CREDITS (Monetisasi Karbon & Registrasi SRN-PPI)
create table if not exists carbon_credits (
  id                      uuid primary key default uuid_generate_v4(),
  organization_id         uuid not null references organizations(id) on delete cascade,
  facility_id             uuid references facilities(id) on delete set null,
  project_name            text not null,
  methodology             text default 'Perpres 98/2021 & Pedoman TEK KLHK',
  baseline_emissions_co2e  numeric not null default 0,
  actual_emissions_co2e    numeric not null default 0,
  claimed_credits_co2e    numeric not null default 0,
  monetary_value_idr      numeric default 0,
  srn_ppi_registry_id     text,
  verification_status     text not null default 'draft'
                            check (verification_status in ('draft', 'registered', 'verified', 'traded', 'retired')),
  vintage_year            integer not null default extract(year from current_date),
  notes                   text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- 8b. PROPER EVALUATIONS (Snapshot Penilaian PROPER KLHK)
create table if not exists proper_evaluations (
  id                      uuid primary key default uuid_generate_v4(),
  organization_id         uuid not null references organizations(id) on delete cascade,
  facility_id             uuid references facilities(id) on delete set null,
  evaluation_period       date not null default current_date,
  air_limbah_status       text not null default 'pass' check (air_limbah_status in ('pass', 'fail', 'warn')),
  emisi_cerobong_status   text not null default 'pass' check (emisi_cerobong_status in ('pass', 'fail', 'warn')),
  limbah_b3_status        text not null default 'pass' check (limbah_b3_status in ('pass', 'fail', 'warn')),
  lca_score_status        text not null default 'pass' check (lca_score_status in ('pass', 'fail', 'na')),
  predicted_rank          text not null default 'biru' check (predicted_rank in ('emas', 'hijau', 'biru', 'merah', 'hitam')),
  notes                   text,
  evaluated_at            timestamptz not null default now()
);

-- 8c. INDUSTRY MEASUREMENTS (Storage Adapter Data Hub)
create table if not exists industry_measurements (
  id                      uuid primary key default uuid_generate_v4(),
  organization_id         uuid not null references organizations(id) on delete cascade,
  industry_id             text not null,
  period_date             date not null default current_date,
  param_code              text not null,
  param_value             text not null,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  constraint unique_org_industry_period_param unique (organization_id, industry_id, period_date, param_code)
);

-- Indexes
create index if not exists idx_carbon_credits_org on carbon_credits(organization_id);
create index if not exists idx_carbon_credits_status on carbon_credits(verification_status);
create index if not exists idx_proper_evaluations_org on proper_evaluations(organization_id);
create index if not exists idx_proper_evaluations_rank on proper_evaluations(predicted_rank);
create index if not exists idx_industry_measurements_lookup on industry_measurements(organization_id, industry_id, period_date);

-- Enable RLS
alter table carbon_credits enable row level security;
alter table proper_evaluations enable row level security;
alter table industry_measurements enable row level security;

-- RLS Policies
create policy "Users can view carbon_credits in their org"
  on carbon_credits for select
  using (organization_id in (select organization_id from profiles where id = auth.uid()));

create policy "Users can manage carbon_credits in their org"
  on carbon_credits for all
  using (organization_id in (select organization_id from profiles where id = auth.uid()));

create policy "Users can view proper_evaluations in their org"
  on proper_evaluations for select
  using (organization_id in (select organization_id from profiles where id = auth.uid()));

create policy "Users can manage proper_evaluations in their org"
  on proper_evaluations for all
  using (organization_id in (select organization_id from profiles where id = auth.uid()));

create policy "Users can view industry_measurements in their org"
  on industry_measurements for select
  using (organization_id in (select organization_id from profiles where id = auth.uid()));

create policy "Users can manage industry_measurements in their org"
  on industry_measurements for all
  using (organization_id in (select organization_id from profiles where id = auth.uid()));
