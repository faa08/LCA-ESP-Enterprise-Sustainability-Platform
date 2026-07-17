-- ============================================================================
-- 4. WATER MONITORING
-- ============================================================================

-- 4a. WATER DATA
create table water_data (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id     uuid references facilities(id) on delete set null,
  water_type      text not null check (water_type in ('intake', 'consumption', 'discharge', 'recycling', 'rainwater-harvest')),
  source          text,
  value           numeric not null,
  unit            text not null default 'm³',
  quality_ph      numeric,
  quality_tss     numeric,
  quality_cod     numeric,
  quality_bod     numeric,
  temperature_c   numeric,
  period_start    date not null,
  period_end      date not null,
  interval_type   text default 'monthly' check (interval_type in ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  notes           text,
  created_at      timestamptz not null default now()
);

-- 4b. WATER TARGETS
create table water_targets (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id     uuid references facilities(id) on delete set null,
  title           text not null,
  water_type      text,
  baseline_value  numeric,
  target_value    numeric not null,
  target_unit     text not null,
  target_year     integer not null,
  status          text default 'active' check (status in ('active', 'achieved', 'missed', 'cancelled')),
  created_at      timestamptz not null default now()
);

-- 4c. WATER LEAK EVENTS
create table water_leak_events (
  id              uuid primary key default uuid_generate_v4(),
  facility_id     uuid not null references facilities(id) on delete cascade,
  location        text not null,
  detected_at     timestamptz not null,
  resolved_at     timestamptz,
  estimated_loss  numeric,
  loss_unit       text default 'm³',
  severity        text check (severity in ('low', 'medium', 'high', 'critical')),
  status          text default 'open' check (status in ('open', 'investigating', 'resolved', 'closed')),
  root_cause      text,
  action_taken    text,
  created_at      timestamptz not null default now()
);

-- ============================================================================
-- 5. WASTE MANAGEMENT
-- ============================================================================

-- 5a. WASTE DATA
create table waste_data (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id     uuid references facilities(id) on delete set null,
  waste_category  text not null,
  waste_type      text,
  value           numeric not null,
  unit            text not null default 't',
  hazardous       boolean not null default false,
  recycled        boolean default false,
  disposal_method text check (disposal_method in ('landfill', 'incineration', 'recycling', 'composting', 'anaerobic-digestion', 'waste-to-energy', 'other')),
  waste_code      text,
  vendor          text,
  cost_amount     numeric,
  cost_currency   text default 'USD',
  period_start    date not null,
  period_end      date not null,
  notes           text,
  created_at      timestamptz not null default now()
);

-- 5b. WASTE REDUCTION PROGRAMS
create table waste_reduction_programs (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id     uuid references facilities(id) on delete set null,
  name            text not null,
  description     text,
  waste_category  text,
  baseline_amount numeric,
  target_amount   numeric,
  target_unit     text default 't',
  start_date      date,
  end_date        date,
  status          text default 'active' check (status in ('active', 'completed', 'cancelled')),
  savings_amount  numeric,
  savings_unit    text default 'USD',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Indexes
create index idx_water_org      on water_data(organization_id);
create index idx_water_facility on water_data(facility_id);
create index idx_water_type     on water_data(water_type);
create index idx_water_period   on water_data(period_start, period_end);
create index idx_waste_org      on waste_data(organization_id);
create index idx_waste_facility on waste_data(facility_id);
create index idx_waste_category on waste_data(waste_category);
create index idx_waste_hazardous on waste_data(hazardous);
create index idx_leak_status    on water_leak_events(status);
