-- ============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Helper: get current user's organization_id
create or replace function public.current_org_id()
returns uuid
language sql
stable
as $$
  select organization_id from profiles where id = auth.uid()
$$;

-- Helper: check if user has admin role
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select role = 'admin' from profiles where id = auth.uid()
$$;

-- Helper: check if user has manager role or above
create or replace function public.is_manager()
returns boolean
language sql
stable
as $$
  select role in ('admin', 'manager') from profiles where id = auth.uid()
$$;

-- -------------------------------------------------------
-- ORGANIZATIONS (only admins can update; all authenticated can read own org)
-- -------------------------------------------------------
alter table organizations enable row level security;

create policy "Users can view their own organization"
  on organizations for select
  using (id = public.current_org_id());

create policy "Only admins can update organization"
  on organizations for update
  using (public.is_admin());

-- -------------------------------------------------------
-- PROFILES
-- -------------------------------------------------------
alter table profiles enable row level security;

create policy "Users can view profiles in their org"
  on profiles for select
  using (organization_id = public.current_org_id());

create policy "Users can update their own profile"
  on profiles for update
  using (id = auth.uid());

create policy "Only admins can insert profiles"
  on profiles for insert
  with check (public.is_admin());

create policy "Only admins can delete profiles"
  on profiles for delete
  using (public.is_admin());

-- -------------------------------------------------------
-- FACILITIES
-- -------------------------------------------------------
alter table facilities enable row level security;

create policy "Users can view facilities in their org"
  on facilities for select
  using (organization_id = public.current_org_id());

create policy "Managers can insert facilities"
  on facilities for insert
  with check (organization_id = public.current_org_id() and public.is_manager());

create policy "Managers can update facilities"
  on facilities for update
  using (organization_id = public.current_org_id() and public.is_manager());

create policy "Only admins can delete facilities"
  on facilities for delete
  using (public.is_admin());

-- -------------------------------------------------------
-- Generic RLS for all data tables (organization-scoped)
-- Apply to: carbon_emissions, energy_consumption, water_data, waste_data,
--           air_emissions, environmental_incidents, environmental_targets,
--           compliance_items, compliance_audits, documents, ai_insights,
--           esg_reports, esg_scores, carbon_reduction_targets, carbon_offsets,
--           energy_targets, water_targets, waste_reduction_programs, lca_projects
-- -------------------------------------------------------

create or replace function apply_org_rls(table_name text) returns void as $$
begin
  execute format('
    alter table %I enable row level security;

    create policy "Users can view records in their org"
      on %I for select
      using (organization_id = public.current_org_id());

    create policy "Managers can insert records"
      on %I for insert
      with check (organization_id = public.current_org_id() and public.is_manager());

    create policy "Managers can update records"
      on %I for update
      using (organization_id = public.current_org_id() and public.is_manager());

    create policy "Only admins can delete records"
      on %I for delete
      using (public.is_admin());
  ', table_name, table_name, table_name, table_name, table_name);
end;
$$ language plpgsql;

-- Apply RLS to all org-scoped tables
select apply_org_rls('carbon_emissions');
select apply_org_rls('carbon_reduction_targets');
select apply_org_rls('carbon_offsets');
select apply_org_rls('energy_consumption');
select apply_org_rls('energy_targets');
select apply_org_rls('water_data');
select apply_org_rls('water_targets');
select apply_org_rls('waste_data');
select apply_org_rls('waste_reduction_programs');
select apply_org_rls('air_emissions');
select apply_org_rls('environmental_incidents');
select apply_org_rls('environmental_targets');
select apply_org_rls('compliance_items');
select apply_org_rls('compliance_audits');
select apply_org_rls('documents');
select apply_org_rls('ai_insights');
select apply_org_rls('esg_reports');
select apply_org_rls('esg_scores');
select apply_org_rls('lca_projects');

-- -------------------------------------------------------
-- LCA sub-tables (inherit via project/stage relationship)
-- -------------------------------------------------------
alter table lca_stages enable row level security;
create policy "Users can view stages of accessible projects"
  on lca_stages for select
  using (exists (
    select 1 from lca_projects
    where lca_projects.id = lca_stages.project_id
    and lca_projects.organization_id = public.current_org_id()
  ));

create policy "Managers can manage stages"
  on lca_stages for insert
  with check (exists (
    select 1 from lca_projects
    where lca_projects.id = lca_stages.project_id
    and lca_projects.organization_id = public.current_org_id()
    and public.is_manager()
  ));

alter table lca_impacts enable row level security;
create policy "Users can view impacts of accessible stages"
  on lca_impacts for select
  using (exists (
    select 1 from lca_stages join lca_projects on lca_projects.id = lca_stages.project_id
    where lca_stages.id = lca_impacts.stage_id
    and lca_projects.organization_id = public.current_org_id()
  ));

alter table lca_materials enable row level security;
create policy "Users can view materials of accessible stages"
  on lca_materials for select
  using (exists (
    select 1 from lca_stages join lca_projects on lca_projects.id = lca_stages.project_id
    where lca_stages.id = lca_materials.stage_id
    and lca_projects.organization_id = public.current_org_id()
  ));

-- -------------------------------------------------------
-- AUDIT SUB-TABLES
-- -------------------------------------------------------
alter table audit_findings enable row level security;
create policy "Users can view findings of accessible audits"
  on audit_findings for select
  using (exists (
    select 1 from compliance_audits
    where compliance_audits.id = audit_findings.audit_id
    and compliance_audits.organization_id = public.current_org_id()
  ));

alter table corrective_actions enable row level security;
create policy "Users can view actions of accessible findings"
  on corrective_actions for select
  using (exists (
    select 1 from audit_findings
    join compliance_audits on compliance_audits.id = audit_findings.audit_id
    where audit_findings.id = corrective_actions.finding_id
    and compliance_audits.organization_id = public.current_org_id()
  ));

-- -------------------------------------------------------
-- FACILITY HIERARCHY
-- -------------------------------------------------------
alter table facility_hierarchy enable row level security;
create policy "Users can view hierarchy of accessible facilities"
  on facility_hierarchy for select
  using (exists (
    select 1 from facilities
    where facilities.id = facility_hierarchy.parent_id
    and facilities.organization_id = public.current_org_id()
  ));

-- ============================================================================
-- 13. TRIGGERS & AUDIT TIMESTAMPS
-- ============================================================================

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated_at
  before update on profiles for each row execute function update_updated_at();

create trigger trg_facilities_updated_at
  before update on facilities for each row execute function update_updated_at();

create trigger trg_carbon_emissions_updated_at
  before update on carbon_emissions for each row execute function update_updated_at();

create trigger trg_carbon_targets_updated_at
  before update on carbon_reduction_targets for each row execute function update_updated_at();

create trigger trg_environmental_incidents_updated_at
  before update on environmental_incidents for each row execute function update_updated_at();

create trigger trg_environmental_targets_updated_at
  before update on environmental_targets for each row execute function update_updated_at();

create trigger trg_compliance_items_updated_at
  before update on compliance_items for each row execute function update_updated_at();

create trigger trg_compliance_audits_updated_at
  before update on compliance_audits for each row execute function update_updated_at();

create trigger trg_corrective_actions_updated_at
  before update on corrective_actions for each row execute function update_updated_at();

create trigger trg_documents_updated_at
  before update on documents for each row execute function update_updated_at();

create trigger trg_esg_reports_updated_at
  before update on esg_reports for each row execute function update_updated_at();

create trigger trg_lca_projects_updated_at
  before update on lca_projects for each row execute function update_updated_at();

create trigger trg_waste_programs_updated_at
  before update on waste_reduction_programs for each row execute function update_updated_at();

-- ============================================================================
-- 14. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================================

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  default_org_id uuid;
begin
  -- Create a default organization for new users
  insert into public.organizations (name, slug)
  values (
    coalesce(new.raw_user_meta_data ->> 'organization_name', 'My Company'),
    lower(regexp_replace(coalesce(new.raw_user_meta_data ->> 'organization_name', 'my-company'), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(new.id::text, 1, 8)
  )
  returning id into default_org_id;

  -- Create profile
  insert into public.profiles (id, organization_id, email, full_name, role)
  values (
    new.id,
    default_org_id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    'admin'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================================
-- 15. METRICS VIEWS (for dashboards)
-- ============================================================================

-- Carbon summary per facility per year
create or replace view v_carbon_summary as
select
  organization_id,
  facility_id,
  scope,
  date_trunc('year', period_start) as year,
  sum(co2e_value) as total_co2e,
  count(*) as record_count
from carbon_emissions
group by organization_id, facility_id, scope, date_trunc('year', period_start);

-- Energy summary per facility per month
create or replace view v_energy_summary as
select
  organization_id,
  facility_id,
  energy_type,
  date_trunc('month', period_start) as month,
  sum(value) as total_value,
  unit
from energy_consumption
group by organization_id, facility_id, energy_type, date_trunc('month', period_start), unit;

-- Compliance summary
create or replace view v_compliance_summary as
select
  organization_id,
  facility_id,
  standard_id,
  status,
  count(*) as item_count
from compliance_items
group by organization_id, facility_id, standard_id, status;

-- ESG report summary
create or replace view v_report_summary as
select
  organization_id,
  report_type,
  status,
  count(*) as report_count,
  max(created_at) as latest_report
from esg_reports
group by organization_id, report_type, status;

-- Active environmental incidents per facility
create or replace view v_active_incidents as
select
  organization_id,
  facility_id,
  severity,
  count(*) as incident_count
from environmental_incidents
where status not in ('resolved', 'closed')
group by organization_id, facility_id, severity;
