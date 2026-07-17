-- ============================================================================
-- 8. COMPLIANCE MANAGEMENT
-- ============================================================================

-- 8a. COMPLIANCE STANDARDS (reference/lookup)
create table compliance_standards (
  id              uuid primary key default uuid_generate_v4(),
  code            text not null unique,
  name            text not null,
  description     text,
  category        text,
  created_at      timestamptz not null default now()
);

-- Seed standards
insert into compliance_standards (code, name, description) values
  ('ISO-14001', 'ISO 14001', 'Environmental Management System'),
  ('GRI', 'Global Reporting Initiative', 'Sustainability reporting standards'),
  ('TCFD', 'Task Force on Climate-related Financial Disclosures', 'Climate disclosure framework'),
  ('CDP', 'CDP Disclosure', 'Carbon Disclosure Project'),
  ('PROPER', 'PROPER', 'Environmental performance rating program'),
  ('SBTi', 'Science Based Targets initiative', 'Emissions reduction targets'),
  ('GHG-PROTOCOL', 'GHG Protocol', 'Greenhouse gas accounting standard'),
  ('EU-TAXONOMY', 'EU Taxonomy', 'EU sustainable activities classification'),
  ('ISCC', 'ISCC', 'International Sustainability & Carbon Certification');

-- 8b. COMPLIANCE ITEMS (checklist items per standard)
create table compliance_items (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  standard_id     uuid not null references compliance_standards(id) on delete cascade,
  facility_id     uuid references facilities(id) on delete set null,
  requirement     text not null,
  description     text,
  status          text not null default 'pending' check (status in ('compliant', 'non-compliant', 'pending', 'not-applicable')),
  priority        text default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  due_date        date,
  assigned_to     uuid references profiles(id),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 8c. COMPLIANCE AUDITS
create table compliance_audits (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id     uuid references facilities(id) on delete set null,
  standard_id     uuid not null references compliance_standards(id) on delete cascade,
  title           text not null,
  auditor         text,
  audit_date      date not null,
  score           numeric,
  max_score       numeric,
  status          text default 'scheduled' check (status in ('scheduled', 'in-progress', 'completed', 'overdue', 'cancelled')),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 8d. AUDIT FINDINGS
create table audit_findings (
  id              uuid primary key default uuid_generate_v4(),
  audit_id        uuid not null references compliance_audits(id) on delete cascade,
  title           text not null,
  description     text,
  severity        text not null check (severity in ('observation', 'minor', 'major', 'critical')),
  status          text default 'open' check (status in ('open', 'in-progress', 'resolved', 'closed')),
  created_at      timestamptz not null default now()
);

-- 8e. CORRECTIVE ACTIONS
create table corrective_actions (
  id              uuid primary key default uuid_generate_v4(),
  finding_id      uuid not null references audit_findings(id) on delete cascade,
  description     text not null,
  assigned_to     uuid references profiles(id),
  due_date        date,
  completed_at    timestamptz,
  status          text default 'open' check (status in ('open', 'in-progress', 'completed', 'overdue')),
  evidence_url    text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================================
-- 9. DOCUMENTS
-- ============================================================================

create table documents (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id     uuid references facilities(id) on delete set null,
  folder          text not null check (folder in (
    'environmental-permits', 'sop', 'audit-documents', 'certificates',
    'policies', 'reports', 'training', 'other'
  )),
  name            text not null,
  description     text,
  file_url        text not null,
  file_type       text,
  file_size       integer,
  version         integer default 1,
  status          text default 'active' check (status in ('active', 'expired', 'draft', 'archived')),
  expiration_date date,
  tags            text[],
  uploaded_by     uuid references profiles(id),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================================
-- 10. AI INSIGHTS
-- ============================================================================

-- 10a. AI INSIGHTS / RECOMMENDATIONS
create table ai_insights (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  facility_id     uuid references facilities(id) on delete set null,
  insight_type    text not null check (insight_type in (
    'energy-anomaly', 'water-exceedance', 'carbon-trend', 'efficiency-gap',
    'compliance-risk', 'waste-opportunity', 'predictive-alert', 'recommendation'
  )),
  title           text not null,
  description     text not null,
  severity        text not null check (severity in ('positive', 'info', 'warning', 'critical')),
  category        text not null,
  metric_name     text,
  metric_value    numeric,
  metric_unit     text,
  recommendation  text,
  potential_savings numeric,
  savings_unit    text,
  status          text default 'open' check (status in ('open', 'dismissed', 'actioned', 'resolved')),
  created_at      timestamptz not null default now(),
  resolved_at     timestamptz
);

-- 10b. AI INSIGHT LOGS (raw detection events)
create table ai_insight_logs (
  id              uuid primary key default uuid_generate_v4(),
  insight_id      uuid references ai_insights(id) on delete set null,
  source_table    text,
  source_record   uuid,
  detection_rule  text,
  raw_data        jsonb,
  confidence      numeric,
  created_at      timestamptz not null default now()
);

-- ============================================================================
-- 11. ESG REPORTING
-- ============================================================================

-- 11a. ESG REPORTS
create table esg_reports (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  title           text not null,
  report_type     text not null check (report_type in (
    'sustainability-report', 'gri', 'tcfd', 'cdp', 'esg-data-pack', 'custom'
  )),
  framework       text,
  period_start    date not null,
  period_end      date not null,
  status          text default 'draft' check (status in ('draft', 'in-review', 'published', 'archived')),
  data            jsonb,
  file_url        text,
  created_by      uuid references profiles(id),
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 11b. ESG SCORES / RATINGS (historical tracking)
create table esg_scores (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  rating_agency   text not null,
  score           text not null,
  score_numeric   numeric,
  max_score       numeric,
  assessment_date date not null,
  notes           text,
  created_at      timestamptz not null default now()
);

-- Indexes
create index idx_compliance_org   on compliance_items(organization_id);
create index idx_compliance_std   on compliance_items(standard_id);
create index idx_compliance_status on compliance_items(status);
create index idx_audit_org        on compliance_audits(organization_id);
create index idx_audit_status     on compliance_audits(status);
create index idx_finding_audit    on audit_findings(audit_id);
create index idx_action_finding   on corrective_actions(finding_id);
create index idx_doc_org          on documents(organization_id);
create index idx_doc_folder       on documents(folder);
create index idx_insight_org      on ai_insights(organization_id);
create index idx_insight_status   on ai_insights(status);
create index idx_esg_report_org   on esg_reports(organization_id);
create index idx_esg_report_type  on esg_reports(report_type);
