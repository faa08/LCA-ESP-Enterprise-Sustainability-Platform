export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: { id: string; name: string; slug: string; logo_url: string | null; industry: string | null; country: string | null; timezone: string; created_at: string; updated_at: string }
        Insert: { id?: string; name: string; slug: string; logo_url?: string | null; industry?: string | null; country?: string | null; timezone?: string; created_at?: string; updated_at?: string }
        Update: { id?: string; name?: string; slug?: string; logo_url?: string | null; industry?: string | null; country?: string | null; timezone?: string; created_at?: string; updated_at?: string }
      }
      profiles: {
        Row: { id: string; organization_id: string; email: string; full_name: string | null; role: "admin" | "manager" | "viewer"; avatar_url: string | null; phone: string | null; job_title: string | null; created_at: string; updated_at: string }
        Insert: { id: string; organization_id: string; email: string; full_name?: string | null; role?: "admin" | "manager" | "viewer"; avatar_url?: string | null; phone?: string | null; job_title?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; organization_id?: string; email?: string; full_name?: string | null; role?: "admin" | "manager" | "viewer"; avatar_url?: string | null; phone?: string | null; job_title?: string | null; created_at?: string; updated_at?: string }
      }
      facilities: {
        Row: { id: string; organization_id: string; name: string; code: string | null; type: string | null; location: string | null; latitude: number | null; longitude: number | null; country: string | null; region: string | null; status: "active" | "inactive" | "maintenance"; area_sqm: number | null; employee_count: number | null; operating_hours: string | null; naics_code: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; organization_id: string; name: string; code?: string | null; type?: string | null; location?: string | null; latitude?: number | null; longitude?: number | null; country?: string | null; region?: string | null; status?: "active" | "inactive" | "maintenance"; area_sqm?: number | null; employee_count?: number | null; operating_hours?: string | null; naics_code?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; organization_id?: string; name?: string; code?: string | null; type?: string | null; location?: string | null; latitude?: number | null; longitude?: number | null; country?: string | null; region?: string | null; status?: "active" | "inactive" | "maintenance"; area_sqm?: number | null; employee_count?: number | null; operating_hours?: string | null; naics_code?: string | null; created_at?: string; updated_at?: string }
      }
      facility_hierarchy: {
        Row: { id: string; parent_id: string; child_id: string; relationship: string; created_at: string }
        Insert: { id?: string; parent_id: string; child_id: string; relationship?: string; created_at?: string }
        Update: { id?: string; parent_id?: string; child_id?: string; relationship?: string; created_at?: string }
      }
      carbon_emissions: {
        Row: { id: string; organization_id: string; facility_id: string | null; scope: "scope1" | "scope2" | "scope3"; category: string; subcategory: string | null; activity_data: number; activity_unit: string; emission_factor: number | null; co2e_value: number; co2_value: number; ch4_value: number; n2o_value: number; biogenic_co2: number; unit: string; period_start: string; period_end: string; methodology: string | null; data_quality: string | null; notes: string | null; created_by: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; organization_id: string; facility_id?: string | null; scope: "scope1" | "scope2" | "scope3"; category: string; subcategory?: string | null; activity_data: number; activity_unit: string; emission_factor?: number | null; co2e_value: number; co2_value?: number; ch4_value?: number; n2o_value?: number; biogenic_co2?: number; unit?: string; period_start: string; period_end: string; methodology?: string | null; data_quality?: string | null; notes?: string | null; created_by?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; organization_id?: string; facility_id?: string | null; scope?: "scope1" | "scope2" | "scope3"; category?: string; subcategory?: string | null; activity_data?: number; activity_unit?: string; emission_factor?: number | null; co2e_value?: number; co2_value?: number; ch4_value?: number; n2o_value?: number; biogenic_co2?: number; unit?: string; period_start?: string; period_end?: string; methodology?: string | null; data_quality?: string | null; notes?: string | null; created_by?: string | null; created_at?: string; updated_at?: string }
      }
      carbon_reduction_targets: {
        Row: { id: string; organization_id: string; facility_id: string | null; title: string; description: string | null; base_year: number; base_emission: number; target_year: number; target_emission: number; reduction_pct: number; scope: string | null; sbti_aligned: boolean; status: string; created_at: string; updated_at: string }
        Insert: { id?: string; organization_id: string; facility_id?: string | null; title: string; description?: string | null; base_year: number; base_emission: number; target_year: number; target_emission: number; reduction_pct: number; scope?: string | null; sbti_aligned?: boolean; status?: string; created_at?: string; updated_at?: string }
        Update: { id?: string; organization_id?: string; facility_id?: string | null; title?: string; description?: string | null; base_year?: number; base_emission?: number; target_year?: number; target_emission?: number; reduction_pct?: number; scope?: string | null; sbti_aligned?: boolean; status?: string; created_at?: string; updated_at?: string }
      }
      carbon_offsets: {
        Row: { id: string; organization_id: string; project_name: string; registry: string | null; certificate_id: string | null; retirement_id: string | null; vintage: number | null; quantity: number; unit: string; offset_type: string | null; status: string; retirement_date: string | null; created_at: string }
        Insert: { id?: string; organization_id: string; project_name: string; registry?: string | null; certificate_id?: string | null; retirement_id?: string | null; vintage?: number | null; quantity: number; unit?: string; offset_type?: string | null; status?: string; retirement_date?: string | null; created_at?: string }
        Update: { id?: string; organization_id?: string; project_name?: string; registry?: string | null; certificate_id?: string | null; retirement_id?: string | null; vintage?: number | null; quantity?: number; unit?: string; offset_type?: string | null; status?: string; retirement_date?: string | null; created_at?: string }
      }
      emission_factors: {
        Row: { id: string; category: string; subcategory: string | null; scope: string; unit: string; co2e_factor: number; ch4_factor: number; n2o_factor: number; source: string | null; valid_from: string | null; valid_until: string | null; region: string | null; created_at: string }
        Insert: { id?: string; category: string; subcategory?: string | null; scope: string; unit: string; co2e_factor: number; ch4_factor?: number; n2o_factor?: number; source?: string | null; valid_from?: string | null; valid_until?: string | null; region?: string | null; created_at?: string }
        Update: { id?: string; category?: string; subcategory?: string | null; scope?: string; unit?: string; co2e_factor?: number; ch4_factor?: number; n2o_factor?: number; source?: string | null; valid_from?: string | null; valid_until?: string | null; region?: string | null; created_at?: string }
      }
      energy_consumption: {
        Row: { id: string; organization_id: string; facility_id: string | null; energy_type: string; source: string | null; value: number; unit: string; renewable: boolean; co2_emission: number | null; period_start: string; period_end: string; interval_type: string; notes: string | null; created_at: string }
        Insert: { id?: string; organization_id: string; facility_id?: string | null; energy_type: string; source?: string | null; value: number; unit: string; renewable?: boolean; co2_emission?: number | null; period_start: string; period_end: string; interval_type?: string; notes?: string | null; created_at?: string }
        Update: { id?: string; organization_id?: string; facility_id?: string | null; energy_type?: string; source?: string | null; value?: number; unit?: string; renewable?: boolean; co2_emission?: number | null; period_start?: string; period_end?: string; interval_type?: string; notes?: string | null; created_at?: string }
      }
      energy_targets: {
        Row: { id: string; organization_id: string; facility_id: string | null; title: string; energy_type: string | null; baseline_value: number | null; baseline_period: string | null; target_value: number; target_unit: string; target_year: number; status: string; created_at: string }
        Insert: { id?: string; organization_id: string; facility_id?: string | null; title: string; energy_type?: string | null; baseline_value?: number | null; baseline_period?: string | null; target_value: number; target_unit: string; target_year: number; status?: string; created_at?: string }
        Update: { id?: string; organization_id?: string; facility_id?: string | null; title?: string; energy_type?: string | null; baseline_value?: number | null; baseline_period?: string | null; target_value?: number; target_unit?: string; target_year?: number; status?: string; created_at?: string }
      }
      equipment_efficiency: {
        Row: { id: string; facility_id: string; equipment_name: string; equipment_type: string | null; efficiency_pct: number; target_pct: number | null; energy_input: number | null; energy_output: number | null; unit: string | null; recorded_at: string; notes: string | null; created_at: string }
        Insert: { id?: string; facility_id: string; equipment_name: string; equipment_type?: string | null; efficiency_pct: number; target_pct?: number | null; energy_input?: number | null; energy_output?: number | null; unit?: string | null; recorded_at: string; notes?: string | null; created_at?: string }
        Update: { id?: string; facility_id?: string; equipment_name?: string; equipment_type?: string | null; efficiency_pct?: number; target_pct?: number | null; energy_input?: number | null; energy_output?: number | null; unit?: string | null; recorded_at?: string; notes?: string | null; created_at?: string }
      }
      water_data: {
        Row: { id: string; organization_id: string; facility_id: string | null; water_type: string; source: string | null; value: number; unit: string; quality_ph: number | null; quality_tss: number | null; quality_cod: number | null; quality_bod: number | null; temperature_c: number | null; period_start: string; period_end: string; interval_type: string; notes: string | null; created_at: string }
        Insert: { id?: string; organization_id: string; facility_id?: string | null; water_type: string; source?: string | null; value: number; unit?: string; quality_ph?: number | null; quality_tss?: number | null; quality_cod?: number | null; quality_bod?: number | null; temperature_c?: number | null; period_start: string; period_end: string; interval_type?: string; notes?: string | null; created_at?: string }
        Update: { id?: string; organization_id?: string; facility_id?: string | null; water_type?: string; source?: string | null; value?: number; unit?: string; quality_ph?: number | null; quality_tss?: number | null; quality_cod?: number | null; quality_bod?: number | null; temperature_c?: number | null; period_start?: string; period_end?: string; interval_type?: string; notes?: string | null; created_at?: string }
      }
      water_targets: {
        Row: { id: string; organization_id: string; facility_id: string | null; title: string; water_type: string | null; baseline_value: number | null; target_value: number; target_unit: string; target_year: number; status: string; created_at: string }
        Insert: { id?: string; organization_id: string; facility_id?: string | null; title: string; water_type?: string | null; baseline_value?: number | null; target_value: number; target_unit: string; target_year: number; status?: string; created_at?: string }
        Update: { id?: string; organization_id?: string; facility_id?: string | null; title?: string; water_type?: string | null; baseline_value?: number | null; target_value?: number; target_unit?: string; target_year?: number; status?: string; created_at?: string }
      }
      water_leak_events: {
        Row: { id: string; facility_id: string; location: string; detected_at: string; resolved_at: string | null; estimated_loss: number | null; loss_unit: string; severity: string | null; status: string; root_cause: string | null; action_taken: string | null; created_at: string }
        Insert: { id?: string; facility_id: string; location: string; detected_at: string; resolved_at?: string | null; estimated_loss?: number | null; loss_unit?: string; severity?: string | null; status?: string; root_cause?: string | null; action_taken?: string | null; created_at?: string }
        Update: { id?: string; facility_id?: string; location?: string; detected_at?: string; resolved_at?: string | null; estimated_loss?: number | null; loss_unit?: string; severity?: string | null; status?: string; root_cause?: string | null; action_taken?: string | null; created_at?: string }
      }
      waste_data: {
        Row: { id: string; organization_id: string; facility_id: string | null; waste_category: string; waste_type: string | null; value: number; unit: string; hazardous: boolean; recycled: boolean; disposal_method: string | null; waste_code: string | null; vendor: string | null; cost_amount: number | null; cost_currency: string; period_start: string; period_end: string; notes: string | null; created_at: string }
        Insert: { id?: string; organization_id: string; facility_id?: string | null; waste_category: string; waste_type?: string | null; value: number; unit?: string; hazardous?: boolean; recycled?: boolean; disposal_method?: string | null; waste_code?: string | null; vendor?: string | null; cost_amount?: number | null; cost_currency?: string; period_start: string; period_end: string; notes?: string | null; created_at?: string }
        Update: { id?: string; organization_id?: string; facility_id?: string | null; waste_category?: string; waste_type?: string | null; value?: number; unit?: string; hazardous?: boolean; recycled?: boolean; disposal_method?: string | null; waste_code?: string | null; vendor?: string | null; cost_amount?: number | null; cost_currency?: string; period_start?: string; period_end?: string; notes?: string | null; created_at?: string }
      }
      waste_reduction_programs: {
        Row: { id: string; organization_id: string; facility_id: string | null; name: string; description: string | null; waste_category: string | null; baseline_amount: number | null; target_amount: number | null; target_unit: string; start_date: string | null; end_date: string | null; status: string; savings_amount: number | null; savings_unit: string; created_at: string; updated_at: string }
        Insert: { id?: string; organization_id: string; facility_id?: string | null; name: string; description?: string | null; waste_category?: string | null; baseline_amount?: number | null; target_amount?: number | null; target_unit?: string; start_date?: string | null; end_date?: string | null; status?: string; savings_amount?: number | null; savings_unit?: string; created_at?: string; updated_at?: string }
        Update: { id?: string; organization_id?: string; facility_id?: string | null; name?: string; description?: string | null; waste_category?: string | null; baseline_amount?: number | null; target_amount?: number | null; target_unit?: string; start_date?: string | null; end_date?: string | null; status?: string; savings_amount?: number | null; savings_unit?: string; created_at?: string; updated_at?: string }
      }
      lca_projects: {
        Row: { id: string; organization_id: string; name: string; description: string | null; product_name: string; product_unit: string; functional_unit: string | null; lca_standard: string | null; status: string; created_by: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; organization_id: string; name: string; description?: string | null; product_name: string; product_unit?: string; functional_unit?: string | null; lca_standard?: string | null; status?: string; created_by?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; organization_id?: string; name?: string; description?: string | null; product_name?: string; product_unit?: string; functional_unit?: string | null; lca_standard?: string | null; status?: string; created_by?: string | null; created_at?: string; updated_at?: string }
      }
      lca_stages: {
        Row: { id: string; project_id: string; stage_order: number; stage_name: string; description: string | null; input_mass: number | null; output_mass: number | null; energy_use: number | null; energy_unit: string; created_at: string }
        Insert: { id?: string; project_id: string; stage_order: number; stage_name: string; description?: string | null; input_mass?: number | null; output_mass?: number | null; energy_use?: number | null; energy_unit?: string; created_at?: string }
        Update: { id?: string; project_id?: string; stage_order?: number; stage_name?: string; description?: string | null; input_mass?: number | null; output_mass?: number | null; energy_use?: number | null; energy_unit?: string; created_at?: string }
      }
      lca_impacts: {
        Row: { id: string; stage_id: string; impact_category: string; value: number; unit: string; methodology: string | null; created_at: string }
        Insert: { id?: string; stage_id: string; impact_category: string; value: number; unit: string; methodology?: string | null; created_at?: string }
        Update: { id?: string; stage_id?: string; impact_category?: string; value?: number; unit?: string; methodology?: string | null; created_at?: string }
      }
      lca_materials: {
        Row: { id: string; stage_id: string; material_name: string; quantity: number; unit: string; origin: string | null; recycled_content_pct: number | null; co2e_per_unit: number | null; created_at: string }
        Insert: { id?: string; stage_id: string; material_name: string; quantity: number; unit: string; origin?: string | null; recycled_content_pct?: number | null; co2e_per_unit?: number | null; created_at?: string }
        Update: { id?: string; stage_id?: string; material_name?: string; quantity?: number; unit?: string; origin?: string | null; recycled_content_pct?: number | null; co2e_per_unit?: number | null; created_at?: string }
      }
      air_emissions: {
        Row: { id: string; organization_id: string; facility_id: string | null; pollutant: string; value: number; unit: string; limit_value: number | null; limit_unit: string | null; exceedance: boolean; source: string | null; period_start: string; period_end: string; notes: string | null; created_at: string }
        Insert: { id?: string; organization_id: string; facility_id?: string | null; pollutant: string; value: number; unit: string; limit_value?: number | null; limit_unit?: string | null; exceedance?: boolean; source?: string | null; period_start: string; period_end: string; notes?: string | null; created_at?: string }
        Update: { id?: string; organization_id?: string; facility_id?: string | null; pollutant?: string; value?: number; unit?: string; limit_value?: number | null; limit_unit?: string | null; exceedance?: boolean; source?: string | null; period_start?: string; period_end?: string; notes?: string | null; created_at?: string }
      }
      environmental_incidents: {
        Row: { id: string; organization_id: string; facility_id: string; incident_type: string; title: string; description: string | null; severity: "low" | "medium" | "high" | "critical"; status: string; reported_by: string | null; reported_at: string; resolved_at: string | null; root_cause: string | null; corrective_action: string | null; financial_impact: number | null; created_at: string; updated_at: string }
        Insert: { id?: string; organization_id: string; facility_id: string; incident_type: string; title: string; description?: string | null; severity: "low" | "medium" | "high" | "critical"; status?: string; reported_by?: string | null; reported_at?: string; resolved_at?: string | null; root_cause?: string | null; corrective_action?: string | null; financial_impact?: number | null; created_at?: string; updated_at?: string }
        Update: { id?: string; organization_id?: string; facility_id?: string; incident_type?: string; title?: string; description?: string | null; severity?: "low" | "medium" | "high" | "critical"; status?: string; reported_by?: string | null; reported_at?: string; resolved_at?: string | null; root_cause?: string | null; corrective_action?: string | null; financial_impact?: number | null; created_at?: string; updated_at?: string }
      }
      environmental_targets: {
        Row: { id: string; organization_id: string; facility_id: string | null; category: string; indicator: string; baseline_value: number | null; target_value: number; target_unit: string; target_date: string | null; status: string; created_at: string; updated_at: string }
        Insert: { id?: string; organization_id: string; facility_id?: string | null; category: string; indicator: string; baseline_value?: number | null; target_value: number; target_unit: string; target_date?: string | null; status?: string; created_at?: string; updated_at?: string }
        Update: { id?: string; organization_id?: string; facility_id?: string | null; category?: string; indicator?: string; baseline_value?: number | null; target_value?: number; target_unit?: string; target_date?: string | null; status?: string; created_at?: string; updated_at?: string }
      }
      compliance_standards: {
        Row: { id: string; code: string; name: string; description: string | null; category: string | null; created_at: string }
        Insert: { id?: string; code: string; name: string; description?: string | null; category?: string | null; created_at?: string }
        Update: { id?: string; code?: string; name?: string; description?: string | null; category?: string | null; created_at?: string }
      }
      compliance_items: {
        Row: { id: string; organization_id: string; standard_id: string; facility_id: string | null; requirement: string; description: string | null; status: "compliant" | "non-compliant" | "pending" | "not-applicable"; priority: string; due_date: string | null; assigned_to: string | null; notes: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; organization_id: string; standard_id: string; facility_id?: string | null; requirement: string; description?: string | null; status?: "compliant" | "non-compliant" | "pending" | "not-applicable"; priority?: string; due_date?: string | null; assigned_to?: string | null; notes?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; organization_id?: string; standard_id?: string; facility_id?: string | null; requirement?: string; description?: string | null; status?: "compliant" | "non-compliant" | "pending" | "not-applicable"; priority?: string; due_date?: string | null; assigned_to?: string | null; notes?: string | null; created_at?: string; updated_at?: string }
      }
      compliance_audits: {
        Row: { id: string; organization_id: string; facility_id: string | null; standard_id: string; title: string; auditor: string | null; audit_date: string; score: number | null; max_score: number | null; status: string; notes: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; organization_id: string; facility_id?: string | null; standard_id: string; title: string; auditor?: string | null; audit_date: string; score?: number | null; max_score?: number | null; status?: string; notes?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; organization_id?: string; facility_id?: string | null; standard_id?: string; title?: string; auditor?: string | null; audit_date?: string; score?: number | null; max_score?: number | null; status?: string; notes?: string | null; created_at?: string; updated_at?: string }
      }
      audit_findings: {
        Row: { id: string; audit_id: string; title: string; description: string | null; severity: string; status: string; created_at: string }
        Insert: { id?: string; audit_id: string; title: string; description?: string | null; severity: string; status?: string; created_at?: string }
        Update: { id?: string; audit_id?: string; title?: string; description?: string | null; severity?: string; status?: string; created_at?: string }
      }
      corrective_actions: {
        Row: { id: string; finding_id: string; description: string; assigned_to: string | null; due_date: string | null; completed_at: string | null; status: string; evidence_url: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; finding_id: string; description: string; assigned_to?: string | null; due_date?: string | null; completed_at?: string | null; status?: string; evidence_url?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; finding_id?: string; description?: string; assigned_to?: string | null; due_date?: string | null; completed_at?: string | null; status?: string; evidence_url?: string | null; created_at?: string; updated_at?: string }
      }
      documents: {
        Row: { id: string; organization_id: string; facility_id: string | null; folder: string; name: string; description: string | null; file_url: string; file_type: string | null; file_size: number | null; version: number; status: string; expiration_date: string | null; tags: string[] | null; uploaded_by: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; organization_id: string; facility_id?: string | null; folder: string; name: string; description?: string | null; file_url: string; file_type?: string | null; file_size?: number | null; version?: number; status?: string; expiration_date?: string | null; tags?: string[] | null; uploaded_by?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; organization_id?: string; facility_id?: string | null; folder?: string; name?: string; description?: string | null; file_url?: string; file_type?: string | null; file_size?: number | null; version?: number; status?: string; expiration_date?: string | null; tags?: string[] | null; uploaded_by?: string | null; created_at?: string; updated_at?: string }
      }
      ai_insights: {
        Row: { id: string; organization_id: string; facility_id: string | null; insight_type: string; title: string; description: string; severity: string; category: string; metric_name: string | null; metric_value: number | null; metric_unit: string | null; recommendation: string | null; potential_savings: number | null; savings_unit: string | null; status: string; created_at: string; resolved_at: string | null }
        Insert: { id?: string; organization_id: string; facility_id?: string | null; insight_type: string; title: string; description: string; severity: string; category: string; metric_name?: string | null; metric_value?: number | null; metric_unit?: string | null; recommendation?: string | null; potential_savings?: number | null; savings_unit?: string | null; status?: string; created_at?: string; resolved_at?: string | null }
        Update: { id?: string; organization_id?: string; facility_id?: string | null; insight_type?: string; title?: string; description?: string; severity?: string; category?: string; metric_name?: string | null; metric_value?: number | null; metric_unit?: string | null; recommendation?: string | null; potential_savings?: number | null; savings_unit?: string | null; status?: string; created_at?: string; resolved_at?: string | null }
      }
      ai_insight_logs: {
        Row: { id: string; insight_id: string | null; source_table: string | null; source_record: string | null; detection_rule: string | null; raw_data: Json | null; confidence: number | null; created_at: string }
        Insert: { id?: string; insight_id?: string | null; source_table?: string | null; source_record?: string | null; detection_rule?: string | null; raw_data?: Json | null; confidence?: number | null; created_at?: string }
        Update: { id?: string; insight_id?: string | null; source_table?: string | null; source_record?: string | null; detection_rule?: string | null; raw_data?: Json | null; confidence?: number | null; created_at?: string }
      }
      esg_reports: {
        Row: { id: string; organization_id: string; title: string; report_type: string; framework: string | null; period_start: string; period_end: string; status: string; data: Json | null; file_url: string | null; created_by: string | null; published_at: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; organization_id: string; title: string; report_type: string; framework?: string | null; period_start: string; period_end: string; status?: string; data?: Json | null; file_url?: string | null; created_by?: string | null; published_at?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; organization_id?: string; title?: string; report_type?: string; framework?: string | null; period_start?: string; period_end?: string; status?: string; data?: Json | null; file_url?: string | null; created_by?: string | null; published_at?: string | null; created_at?: string; updated_at?: string }
      }
      esg_scores: {
        Row: { id: string; organization_id: string; rating_agency: string; score: string; score_numeric: number | null; max_score: number | null; assessment_date: string; notes: string | null; created_at: string }
        Insert: { id?: string; organization_id: string; rating_agency: string; score: string; score_numeric?: number | null; max_score?: number | null; assessment_date: string; notes?: string | null; created_at?: string }
        Update: { id?: string; organization_id?: string; rating_agency?: string; score?: string; score_numeric?: number | null; max_score?: number | null; assessment_date?: string; notes?: string | null; created_at?: string }
      }
    }
    Views: {
      v_carbon_summary: { Row: { organization_id: string | null; facility_id: string | null; scope: string | null; year: string | null; total_co2e: number | null; record_count: number | null } }
      v_energy_summary: { Row: { organization_id: string | null; facility_id: string | null; energy_type: string | null; month: string | null; total_value: number | null; unit: string | null } }
      v_compliance_summary: { Row: { organization_id: string | null; facility_id: string | null; standard_id: string | null; status: string | null; item_count: number | null } }
      v_report_summary: { Row: { organization_id: string | null; report_type: string | null; status: string | null; report_count: number | null; latest_report: string | null } }
      v_active_incidents: { Row: { organization_id: string | null; facility_id: string | null; severity: string | null; incident_count: number | null } }
    }
    Functions: {
      auth_current_org_id: { Args: Record<string, never>; Returns: string }
      auth_is_admin: { Args: Record<string, never>; Returns: boolean }
      auth_is_manager: { Args: Record<string, never>; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
