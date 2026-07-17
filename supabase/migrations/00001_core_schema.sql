-- ============================================================================
-- SIP (Sustainability Intelligence Platform) - Database Schema
-- ============================================================================

-- 0. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. CORE SCHEMA
-- ============================================================================

-- 1a. ORGANIZATIONS (multi-tenant root)
create table organizations (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  logo_url    text,
  industry    text,
  country     text,
  timezone    text default 'UTC',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 1b. PROFILES (extends Supabase auth.users)
create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  email           text not null,
  full_name       text,
  role            text not null default 'viewer'
                    check (role in ('admin', 'manager', 'viewer')),
  avatar_url      text,
  phone           text,
  job_title       text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 1c. FACILITIES
create table facilities (
  id              uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name            text not null,
  code            text,
  type            text,
  location        text,
  latitude        numeric(10,7),
  longitude       numeric(10,7),
  country         text,
  region          text,
  status          text not null default 'active'
                    check (status in ('active', 'inactive', 'maintenance')),
  area_sqm        numeric,
  employee_count  integer,
  operating_hours text,
  naics_code      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 1d. FACILITY HIERARCHY (for parent-child facility relationships)
create table facility_hierarchy (
  id              uuid primary key default uuid_generate_v4(),
  parent_id       uuid not null references facilities(id) on delete cascade,
  child_id        uuid not null references facilities(id) on delete cascade,
  relationship    text not null default 'contains'
                    check (relationship in ('contains', 'manages', 'reports-to')),
  created_at      timestamptz not null default now(),
  unique(parent_id, child_id)
);

-- Indexes
create index idx_profiles_org on profiles(organization_id);
create index idx_facilities_org on facilities(organization_id);
create index idx_facility_hierarchy_parent on facility_hierarchy(parent_id);
create index idx_facility_hierarchy_child on facility_hierarchy(child_id);
