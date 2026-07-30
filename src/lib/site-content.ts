import type { Locale } from "@/lib/i18n";

export type Locale2 = Locale;

export interface NavLink {
  label: string;
  href: string;
  desc?: string;
}

export interface ModuleContent {
  slug: string;
  name: string;
  tagline: string;
  heroTitle: string;
  heroDesc: string;
  overview: string;
  benefits: { title: string; desc: string }[];
  features: { title: string; desc: string }[];
  workflow: { title: string; desc: string }[];
  integrations: string[];
  gallery: string[];
  faqs: { q: string; a: string }[];
}

export interface IndustryContent {
  slug: string;
  name: string;
  heroTitle: string;
  heroDesc: string;
  challenges: { title: string; desc: string }[];
  solutions: { title: string; desc: string }[];
  modules: string[];
  caseStudy: { quote: string; name: string; role: string; company: string; metricLabel: string; metricValue: string };
}

export interface FrameworkContent {
  key: string;
  name: string;
  full: string;
  desc: string;
  how: string;
}

export interface IndustriesLandingItem {
  slug: string;
  icon: "chemical" | "manufacturing" | "mining" | "steel" | "utilities" | "oilgas";
  name: string;
  desc: string;
  challenges: string[];
  modules: string[];
}

export interface HowWorksStep {
  icon: "database" | "shield" | "brain" | "clipboard" | "dashboard";
  title: string;
  desc: string;
  bullets: string[];
  badge: string;
}

export interface HowWorksContent {
  label: string;
  title: string;
  subtitle: string;
  steps: HowWorksStep[];
  summary: { title: string; desc: string; cta1: string; cta2: string };
}

export interface SiteContent {
  nav: {
    platform: string;
    modules: string;
    industries: string;
    compliance: string;
    about: string;
    contact: string;
    signIn: string;
    requestDemo: string;
    langLabel: string;
  };
  platform: {
    heroEyebrow: string;
    heroTitle: string;
    heroDesc: string;
    heroCta: string;
    heroCta2: string;
    introEyebrow: string;
    introTitle: string;
    introDesc: string;
    pillarsTitle: string;
    pillarsDesc: string;
    archEyebrow: string;
    archTitle: string;
    archDesc: string;
    archLayers: { title: string; desc: string }[];
    aiEyebrow: string;
    aiTitle: string;
    aiDesc: string;
    aiFeatures: { title: string; desc: string }[];
    integEyebrow: string;
    integTitle: string;
    integDesc: string;
    integList: string[];
    secEyebrow: string;
    secTitle: string;
    secDesc: string;
    secList: { title: string; desc: string }[];
    roadmapEyebrow: string;
    roadmapTitle: string;
    roadmapDesc: string;
    roadmapItems: { q: string; a: string }[];
  };
  modulesIndex: {
    eyebrow: string;
    title: string;
    desc: string;
  };
  industriesIndex: {
    eyebrow: string;
    title: string;
    desc: string;
  };
  compliancePage: {
    heroEyebrow: string;
    heroTitle: string;
    heroDesc: string;
    introEyebrow: string;
    introTitle: string;
    introDesc: string;
    autoEyebrow: string;
    autoTitle: string;
    autoDesc: string;
    autoSteps: { title: string; desc: string }[];
  };
  about: {
    heroEyebrow: string;
    heroTitle: string;
    heroDesc: string;
    missionEyebrow: string;
    missionTitle: string;
    missionDesc: string;
    storyEyebrow: string;
    storyTitle: string;
    storyDesc: string;
    valuesTitle: string;
    values: { title: string; desc: string }[];
    statsTitle: string;
    stats: { value: string; label: string }[];
    teamEyebrow: string;
    teamTitle: string;
    teamDesc: string;
  };
  contact: {
    heroEyebrow: string;
    heroTitle: string;
    heroDesc: string;
    formName: string;
    formEmail: string;
    formCompany: string;
    formRole: string;
    formMessage: string;
    formSubmit: string;
    formNote: string;
    infoTitle: string;
    infoDesc: string;
    salesLabel: string;
    salesValue: string;
    hqLabel: string;
    hqValue: string;
    regionsLabel: string;
    regionsValue: string;
  };
  footer: {
    desc: string;
    col1: string;
    col1l: string[];
    col2: string;
    col2l: string[];
    col3: string;
    col3l: string[];
    col4: string;
    col4l: string[];
    copyright: string;
    privacy: string;
    terms: string;
    security: string;
  };
  modules: Record<string, ModuleContent>;
  industries: Record<string, IndustryContent>;
  industriesLanding: IndustriesLandingItem[];
  industriesSection: { eyebrow: string; title: string; desc: string };
  industriesLandingLabels: { challenges: string; modules: string; learnMore: string };
  howWorks: HowWorksContent;
  frameworks: FrameworkContent[];
}

const en: SiteContent = {
  nav: {
    platform: "Platform",
    modules: "Modules",
    industries: "Industries",
    compliance: "Compliance",
    about: "About",
    contact: "Contact",
    signIn: "Sign in",
    requestDemo: "Request a demo",
    langLabel: "Language",
  },
  platform: {
    heroEyebrow: "Platform",
    heroTitle: "One intelligence layer for industrial sustainability.",
    heroDesc: "ensPR unifies real-time monitoring, AI analysis, life cycle assessment, and multi-framework compliance into a single system of record built for heavy industry.",
    heroCta: "Request a demo",
    heroCta2: "Explore modules",
    introEyebrow: "Overview",
    introTitle: "Built for how sustainability teams actually work.",
    introDesc: "From the factory floor to the boardroom, ensPR turns fragmented environmental data into trusted decisions — with the governance enterprise teams require.",
    pillarsTitle: "What makes the platform different",
    pillarsDesc: "Four capabilities, one source of truth.",
    archEyebrow: "Architecture",
    archTitle: "An open, enterprise-grade architecture.",
    archDesc: "ensPR ingests from any source and serves any consumer — dashboards, ERP, regulators, and auditors — through a single validated data model.",
    archLayers: [
      { title: "Connect", desc: "Meters, PLCs, SCADA, ERP, and manual entry — normalized on ingest." },
      { title: "Validate", desc: "Automated checks, lineage, and a single emissions ledger." },
      { title: "Analyze", desc: "AI root-cause, LCA, and compliance mapping in one engine." },
      { title: "Report", desc: "Board-ready disclosures and live API exports." },
    ],
    aiEyebrow: "AI Engine",
    aiTitle: "An AI engine that explains itself.",
    aiDesc: "Every insight ships with a root-cause explanation and a prioritized action — not just a number.",
    aiFeatures: [
      { title: "Anomaly detection", desc: "Continuous monitoring flags deviations the moment they appear." },
      { title: "Root-cause analysis", desc: "Trace spikes to a specific line, meter, or process." },
      { title: "Compliance forecasting", desc: "Predict audit risk months before reporting season." },
      { title: "Prioritized actions", desc: "Recommended fixes ranked by impact and effort." },
    ],
    integEyebrow: "Integrations",
    integTitle: "Connects to the systems you already run.",
    integDesc: "Pre-built connectors and a documented API keep environmental data flowing automatically.",
    integList: ["SAP ERP", "OSIsoft PI", "Siemens MindSphere", "Microsoft Fabric", "REST & GraphQL API", "CSV / SFTP ingest"],
    secEyebrow: "Security",
    secTitle: "Security and governance by design.",
    secDesc: "Enterprise controls for the data your auditors depend on.",
    secList: [
      { title: "SSO & RBAC", desc: "SAML/OIDC single sign-on with role-based access control." },
      { title: "Audit trail", desc: "Immutable lineage for every data point and disclosure." },
      { title: "Encryption", desc: "Encryption in transit and at rest, region-pinned." },
      { title: "Certifications", desc: "Aligned to ISO 27001 and SOC 2 Type II practices." },
    ],
    roadmapEyebrow: "Roadmap",
    roadmapTitle: "Where the platform is going.",
    roadmapDesc: "A transparent view of what enterprise teams can expect next.",
    roadmapItems: [
      { q: "Scope 3 supplier network", a: "Expanded supplier sustainability scoring across tier-1 and tier-2 vendors." },
      { q: "Predictive maintenance insights", a: "Linking equipment telemetry to emissions anomalies." },
      { q: "Regulator direct filing", a: "One-click submission to national PROPER and CDP portals." },
      { q: "Embedded BI", a: "Custom dashboards without leaving ensPR." },
    ],
  },
  modulesIndex: {
    eyebrow: "Modules",
    title: "A module for every sustainability workflow.",
    desc: "Each module is production-grade and composes into the workflow your operation needs.",
  },
  industriesIndex: {
    eyebrow: "Industries",
    title: "Purpose-built for heavy industry.",
    desc: "Solutions tuned to the operational complexity and compliance pressure of your sector.",
  },
  compliancePage: {
    heroEyebrow: "Compliance",
    heroTitle: "Compliance, automated end to end.",
    heroDesc: "ensPR maps operational data to framework disclosure requirements automatically — so audit season is quiet.",
    introEyebrow: "Frameworks",
    introTitle: "Aligned to the standards that matter most.",
    introDesc: "One data model, every disclosure.",
    autoEyebrow: "How it works",
    autoTitle: "How ensPR automates reporting.",
    autoDesc: "From raw readings to submitted disclosures without a spreadsheet.",
    autoSteps: [
      { title: "Ingest", desc: "Operational data flows in from meters, ERP, and manual logs." },
      { title: "Map", desc: "Each data point is tagged to framework indicators automatically." },
      { title: "Validate", desc: "Gaps and anomalies are flagged before they reach a report." },
      { title: "Generate", desc: "Disclosure-ready reports are produced with full lineage." },
      { title: "Submit", desc: "Export to CDP, GRI, and national portals in one click." },
    ],
  },
  about: {
    heroEyebrow: "About",
    heroTitle: "We make industrial sustainability operable.",
    heroDesc: "ensPR helps the world's hardest-to-abate industries measure, manage, and report their environmental performance with the rigor finance expects.",
    missionEyebrow: "Mission",
    missionTitle: "A single source of truth for industrial impact.",
    missionDesc: "We believe sustainability decisions should be built on trusted, real-time data — not annual estimates and disconnected spreadsheets.",
    storyEyebrow: "Our story",
    storyTitle: "Born from the factory floor.",
    storyDesc: "ensPR started inside a Southeast Asian petrochemical group frustrated by weeks of manual reporting. We built the system we wished we had — and now share it with industry.",
    valuesTitle: "What we value",
    values: [
      { title: "Trust through traceability", desc: "Every number is explainable, sourced, and auditable." },
      { title: "Built for operators", desc: "We design for the people who run plants, not just the boardroom." },
      { title: "Rigor over noise", desc: "Enterprise-grade accuracy, not sustainability theater." },
    ],
    statsTitle: "ensPR by the numbers",
    stats: [
      { value: "120+", label: "Factories connected" },
      { value: "14", label: "Countries" },
      { value: "85%", label: "Reporting time saved" },
      { value: "6", label: "Frameworks supported" },
    ],
    teamEyebrow: "Team",
    teamTitle: "Operators, engineers, and climate people.",
    teamDesc: "Our team blends process engineering, ESG advisory, and enterprise software.",
  },
  contact: {
    heroEyebrow: "Contact",
    heroTitle: "Talk to our enterprise team.",
    heroDesc: "Tell us about your operation and we'll show you ensPR on your own data.",
    formName: "Full name",
    formEmail: "Work email",
    formCompany: "Company",
    formRole: "Role",
    formMessage: "How can we help?",
    formSubmit: "Request a demo",
    formNote: "We typically respond within one business day.",
    infoTitle: "Enterprise sales",
    infoDesc: "For procurement, security reviews, and pilots.",
    salesLabel: "Sales",
    salesValue: "linkproductive@gmail.com",
    hqLabel: "Headquarters",
    hqValue: "Cilegon, Banten, Indonesia",
    regionsLabel: "Regions",
    regionsValue: "Asia Pacific",
  },
  footer: {
    desc: "Enterprise sustainability intelligence for industrial companies — from the factory floor to the boardroom.",
    col1: "Platform",
    col1l: ["Overview", "Modules", "AI Engine", "Integrations", "Security", "Roadmap"],
    col2: "Industries",
    col2l: ["Chemical", "Manufacturing", "Mining", "Steel & Metals", "Utilities"],
    col3: "Company",
    col3l: ["About", "Compliance", "Contact", "Careers", "Security"],
    col4: "Resources",
    col4l: ["Documentation", "API", "Status", "Changelog", "Privacy"],
    copyright: "All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
    security: "Security",
  },
  modules: {
    "environmental-monitoring": {
      slug: "environmental-monitoring",
      name: "Environmental Monitoring",
      tagline: "Real-time operational visibility",
      heroTitle: "Environmental Monitoring",
      heroDesc: "A single operational dashboard for emissions, energy, waste, and water — updated the moment data lands.",
      overview:
        "Environmental Monitoring is the live operations layer of ensPR. It normalizes readings from meters, PLCs, and ERP into one validated model so teams always see the current state of every site and process.",
      benefits: [
        { title: "Live visibility", desc: "Every KPI refreshes as data arrives — no weekly exports." },
        { title: "Fewer surprises", desc: "Threshold alerts catch drift before it becomes a violation." },
        { title: "One screen", desc: "Air, energy, water, and waste in a single operational view." },
      ],
      features: [
        { title: "Unified KPIs", desc: "Emissions, energy, waste, and water side by side." },
        { title: "Configurable thresholds", desc: "Set limits per site, line, and indicator." },
        { title: "Drill-down", desc: "Move from portfolio to a single meter in two clicks." },
        { title: "Mobile ready", desc: "Operators get alerts on the floor, not just in the office." },
      ],
      workflow: [
        { title: "Connect", desc: "Link meters, PLCs, and ERP through connectors." },
        { title: "Normalize", desc: "Map units and factors to a single model." },
        { title: "Monitor", desc: "Watch live KPIs and threshold breaches." },
        { title: "Act", desc: "Route alerts to the right owner automatically." },
      ],
      integrations: ["SAP ERP", "OSIsoft PI", "Siemens MindSphere", "REST API"],
      gallery: ["Live operations view", "Threshold alerts", "Site comparison", "Mobile alert"],
      faqs: [
        { q: "What data sources are supported?", a: "Meters, PLCs, SCADA, ERP systems, and manual entry forms." },
        { q: "How fresh is the data?", a: "Near real-time — typically synced within seconds of ingest." },
        { q: "Can I set my own thresholds?", a: "Yes, per site, line, and indicator with configurable severity." },
      ],
    },
    "carbon-accounting": {
      slug: "carbon-accounting",
      name: "Carbon Accounting",
      tagline: "Scope 1, 2, and 3 inventory",
      heroTitle: "Carbon Accounting",
      heroDesc: "Scope 1, 2, and 3 inventory with reduction pathways, target tracking, and audit-ready calculations.",
      overview:
        "Carbon Accounting produces a defensible emissions inventory across all three scopes, with the calculation lineage auditors require and the target tracking leadership expects.",
      benefits: [
        { title: "Defensible numbers", desc: "Every emission factor and conversion is traceable." },
        { title: "Target tracking", desc: "Monitor progress against SBTi-aligned reduction paths." },
        { title: "Scenario planning", desc: "Model levers like electrification before committing capital." },
      ],
      features: [
        { title: "Scope 1–3", desc: "Fuel, energy, and value-chain emissions in one ledger." },
        { title: "Factor library", desc: "Maintained emission factors per region and source." },
        { title: "Target dashboard", desc: "Track trajectory versus committed reductions." },
        { title: "Export", desc: "GHG Protocol-aligned outputs for disclosure." },
      ],
      workflow: [
        { title: "Inventory", desc: "Collect activity data across scopes." },
        { title: "Calculate", desc: "Apply regional factors automatically." },
        { title: "Track", desc: "Compare against targets and baselines." },
        { title: "Report", desc: "Export audit-ready carbon statements." },
      ],
      integrations: ["SAP ERP", "Microsoft Fabric", "CSV / SFTP", "REST API"],
      gallery: ["Emissions ledger", "Scope breakdown", "Target tracker", "Scenario model"],
      faqs: [
        { q: "Does it follow the GHG Protocol?", a: "Yes — scopes, boundaries, and calculation methods align to GHG Protocol." },
        { q: "Is Scope 3 supported?", a: "Yes, including purchased goods, transport, and use of products." },
        { q: "Can we model reduction scenarios?", a: "Yes, scenario planning compares levers before investment." },
      ],
    },
    "life-cycle-assessment": {
      slug: "life-cycle-assessment",
      name: "Life Cycle Assessment",
      tagline: "Cradle-to-grave impact",
      heroTitle: "Life Cycle Assessment",
      heroDesc: "Quantify cradle-to-grave environmental impact and compare design alternatives side by side.",
      overview:
        "Life Cycle Assessment quantifies the impact of products and processes from raw material to end of life, so teams can compare designs and suppliers with hard numbers.",
      benefits: [
        { title: "Design decisions", desc: "Compare alternatives with quantified impact." },
        { title: "Supplier insight", desc: "See upstream footprint, not just your fence line." },
        { title: "Hotspot mapping", desc: "Find the stage driving most of the impact." },
      ],
      features: [
        { title: "Cradle-to-grave", desc: "Model full lifecycle from extraction to disposal." },
        { title: "Alternative comparison", desc: "Rank designs and materials by impact." },
        { title: "Impact categories", desc: "Carbon, water, and resource use in one view." },
        { title: "Linked to data", desc: "Pulls live operational data where available." },
      ],
      workflow: [
        { title: "Define", desc: "Set goal, scope, and functional unit." },
        { title: "Inventory", desc: "Collect inputs and outputs per stage." },
        { title: "Assess", desc: "Calculate impact across categories." },
        { title: "Improve", desc: "Identify and compare reduction options." },
      ],
      integrations: ["SAP ERP", "Supplier portals", "CSV import", "REST API"],
      gallery: ["Lifecycle stages", "Impact hotspots", "Design comparison", "Supplier footprint"],
      faqs: [
        { q: "What method does it use?", a: "ISO 14040/14044-aligned LCA with standard impact categories." },
        { q: "Can I compare suppliers?", a: "Yes — upstream footprints are modeled per supplier." },
        { q: "Does it connect to live data?", a: "Where available, operational data feeds the inventory automatically." },
      ],
    },
    "waste-management": {
      slug: "waste-management",
      name: "Waste Management",
      tagline: "Track, classify, reduce",
      heroTitle: "Waste Management",
      heroDesc: "Classify, track, and reduce waste streams across sites with diversion and recycling metrics.",
      overview:
        "Waste Management gives operations teams a consistent way to record, classify, and reduce waste — turning disposal data into reduction programs.",
      benefits: [
        { title: "Consistent classification", desc: "One taxonomy across every site." },
        { title: "Diversion metrics", desc: "Track recycling and reuse versus landfill." },
        { title: "Cost visibility", desc: "Tie disposal volumes to spend." },
      ],
      features: [
        { title: "Stream taxonomy", desc: "Hazardous, recyclable, and organic streams." },
        { title: "Diversion rate", desc: "Measure landfill avoidance over time." },
        { title: "Site comparison", desc: "Benchmark plants against each other." },
        { title: "Reporting", desc: "Disclosure-ready waste metrics." },
      ],
      workflow: [
        { title: "Record", desc: "Log waste by stream and site." },
        { title: "Classify", desc: "Apply a shared taxonomy." },
        { title: "Measure", desc: "Calculate diversion and intensity." },
        { title: "Reduce", desc: "Target the largest streams." },
      ],
      integrations: ["ERP", "Weighbridge systems", "CSV import", "REST API"],
      gallery: ["Stream dashboard", "Diversion rate", "Site benchmark", "Reduction plan"],
      faqs: [
        { q: "Which waste types are tracked?", a: "Hazardous, recyclable, organic, and general streams." },
        { q: "Can we benchmark sites?", a: "Yes — intensity and diversion compare across plants." },
        { q: "Does it feed compliance?", a: "Waste metrics flow into the compliance module automatically." },
      ],
    },
    "water-monitoring": {
      slug: "water-monitoring",
      name: "Water Monitoring",
      tagline: "Stewardship and intensity",
      heroTitle: "Water Monitoring",
      heroDesc: "Track withdrawal, discharge, and intensity with watershed context and regulatory limits.",
      overview:
        "Water Monitoring helps sites manage withdrawal and discharge against limits and local context, supporting water-stewardship commitments.",
      benefits: [
        { title: "Limit compliance", desc: "Track discharge against permit thresholds." },
        { title: "Intensity insight", desc: "Normalize use by production volume." },
        { title: "Risk context", desc: "Flag stress in high-water-risk watersheds." },
      ],
      features: [
        { title: "Withdrawal & discharge", desc: "Volume and quality in one view." },
        { title: "Permit limits", desc: "Alerts when approaching regulatory caps." },
        { title: "Watershed risk", desc: "Context for localized scarcity." },
        { title: "Intensity KPIs", desc: "Use per unit of output." },
      ],
      workflow: [
        { title: "Connect", desc: "Link meters and lab results." },
        { title: "Monitor", desc: "Watch limits and intensity." },
        { title: "Alert", desc: "Notify on threshold breaches." },
        { title: "Report", desc: "Disclose water metrics." },
      ],
      integrations: ["SCADA", "Lab systems", "CSV import", "REST API"],
      gallery: ["Water balance", "Discharge limits", "Watershed risk", "Intensity KPI"],
      faqs: [
        { q: "Does it track discharge quality?", a: "Yes — link lab results to discharge volumes." },
        { q: "Can it show water risk?", a: "Yes — watershed context highlights local scarcity." },
        { q: "Is it permit-aware?", a: "Alerts trigger as you approach permit caps." },
      ],
    },
    "compliance-management": {
      slug: "compliance-management",
      name: "Compliance Management",
      tagline: "Audit-ready, always",
      heroTitle: "Compliance Management",
      heroDesc: "Live alignment to ISO 14001, GRI, CDP, TCFD, SBTi, and PROPER — with gap detection.",
      overview:
        "Compliance Management maps your operational data to framework requirements and flags gaps before audit season, so disclosure is continuous rather than annual.",
      benefits: [
        { title: "Always audit-ready", desc: "Evidence lined up the moment auditors ask." },
        { title: "Gap detection", desc: "See missing indicators in real time." },
        { title: "One mapping", desc: "A single data model serves every framework." },
      ],
      features: [
        { title: "Framework library", desc: "ISO 14001, GRI, CDP, TCFD, SBTi, PROPER." },
        { title: "Gap dashboard", desc: "Open items with owners and due dates." },
        { title: "Evidence trail", desc: "Lineage for every disclosed metric." },
        { title: "Export", desc: "Disclosure-ready outputs per framework." },
      ],
      workflow: [
        { title: "Map", desc: "Tag data to framework indicators." },
        { title: "Monitor", desc: "Watch coverage and gaps." },
        { title: "Remediate", desc: "Assign and close open items." },
        { title: "Disclose", desc: "Export aligned reports." },
      ],
      integrations: ["CDP portal", "GRI templates", "ERP", "REST API"],
      gallery: ["Framework grid", "Gap dashboard", "Evidence trail", "Report export"],
      faqs: [
        { q: "Which frameworks are supported?", a: "ISO 14001, GRI, CDP, TCFD, SBTi, and PROPER." },
        { q: "How are gaps found?", a: "The engine checks coverage against each framework continuously." },
        { q: "Is evidence preserved?", a: "Every metric carries full lineage for auditors." },
      ],
    },
    "ai-insights": {
      slug: "ai-insights",
      name: "AI Insights",
      tagline: "Explainable intelligence",
      heroTitle: "AI Insights",
      heroDesc: "Anomaly detection, root-cause analysis, and prioritized actions — explained in plain language.",
      overview:
        "AI Insights is the reasoning layer of ensPR. It detects anomalies, explains likely causes, forecasts compliance risk, and recommends fixes your team can act on.",
      benefits: [
        { title: "Faster answers", desc: "Root cause in minutes, not weeks." },
        { title: "Less risk", desc: "Catch compliance drift early." },
        { title: "Actionable", desc: "Recommendations ranked by impact." },
      ],
      features: [
        { title: "Anomaly detection", desc: "Continuous statistical monitoring." },
        { title: "Root-cause", desc: "Trace to line, meter, or process." },
        { title: "Forecasting", desc: "Predict audit and target risk." },
        { title: "Narratives", desc: "Plain-language explanations." },
      ],
      workflow: [
        { title: "Detect", desc: "Flag deviations automatically." },
        { title: "Explain", desc: "Surface likely root cause." },
        { title: "Forecast", desc: "Project forward risk." },
        { title: "Recommend", desc: "Rank corrective actions." },
      ],
      integrations: ["All ensPR modules", "Slack", "Microsoft Teams", "Email"],
      gallery: ["Anomaly feed", "Root-cause card", "Risk forecast", "Action list"],
      faqs: [
        { q: "Is the AI explainable?", a: "Yes — every insight includes a root-cause explanation." },
        { q: "Where does it read from?", a: "All ensPR modules share one data model." },
        { q: "Can it notify my team?", a: "Alerts route to Slack, Teams, and email." },
      ],
    },
  },
  industries: {
    chemical: {
      slug: "chemical",
      name: "Chemical Manufacturing",
      heroTitle: "Sustainability for chemical plants.",
      heroDesc: "Hazardous emissions tracking, multi-permit compliance, and process-level accounting in one system.",
      challenges: [
        { title: "Hazardous emissions", desc: "Stack, fugitive, and effluent streams under tight limits." },
        { title: "Multi-permit complexity", desc: "Dozens of permits across sites and regulators." },
        { title: "Process intensity", desc: "Emissions tied to specific reactions and lines." },
      ],
      solutions: [
        { title: "Emissions ledger", desc: "Every stream mapped to a single validated model." },
        { title: "Permit tracking", desc: "Limit alerts per permit and regulator." },
        { title: "Process accounting", desc: "Attribute impact to specific reactions." },
      ],
      modules: ["environmental-monitoring", "carbon-accounting", "compliance-management", "ai-insights"],
      caseStudy: {
        quote: "ensPR reduced our annual sustainability report from six weeks of manual work to under four days — with a clean audit trail.",
        name: "Reza Hartono",
        role: "Sustainability Manager",
        company: "PT Petrokimia Gresik",
        metricLabel: "Reporting time saved",
        metricValue: "85%",
      },
    },
    utilities: {
      slug: "utilities",
      name: "Power Generation",
      heroTitle: "Sustainability for utilities.",
      heroDesc: "Power plant compliance and energy mix reporting with confidence and full traceability.",
      challenges: [
        { title: "Generation mix", desc: "Renewable and thermal reporting side by side." },
        { title: "Grid emissions", desc: "Complex allocation rules." },
        { title: "Regulator filing", desc: "Recurring, high-scrutiny submissions." },
      ],
      solutions: [
        { title: "Mix reporting", desc: "Renewable share with full lineage." },
        { title: "Grid allocation", desc: "Transparent emission factors." },
        { title: "Filing export", desc: "Disclosure-ready outputs." },
      ],
      modules: ["environmental-monitoring", "carbon-accounting", "compliance-management", "ai-insights"],
      caseStudy: {
        quote: "Regulator submissions that used to take a month now close in days with clean evidence.",
        name: "Budi Santoso",
        role: "Compliance Manager",
        company: "PLN Energi",
        metricLabel: "Filing time",
        metricValue: "-70%",
      },
    },
    oilgas: {
      slug: "oilgas",
      name: "Oil & Gas",
      heroTitle: "Sustainability for oil & gas.",
      heroDesc: "Methane anomaly detection, flaring and venting accounting, and fugitive emissions validation under tightening regulation.",
      challenges: [
        { title: "Methane leaks", desc: "Fugitive and vented emissions hard to locate." },
        { title: "Flaring & venting", desc: "High-volume, tightly regulated releases." },
        { title: "Asset sprawl", desc: "Wells, plants, and pipelines across regions." },
      ],
      solutions: [
        { title: "Methane detection", desc: "Anomalies flagged against sensor and satellite data." },
        { title: "Flaring accounting", desc: "Volume and intensity captured per asset." },
        { title: "Framework validation", desc: "Reported against methane programs." },
      ],
      modules: ["environmental-monitoring", "carbon-accounting", "compliance-management", "ai-insights"],
      caseStudy: {
        quote: "ensPR turned scattered methane spreadsheets into one defensible record our auditors accepted without follow-up.",
        name: "Putra Mahendra",
        role: "HSE Manager",
        company: "Medco E&P",
        metricLabel: "Audit findings",
        metricValue: "-90%",
      },
    },
  },
  industriesLanding: [
    {
      slug: "chemical",
      icon: "chemical",
      name: "Chemical Manufacturing",
      desc: "Track hazardous emissions, wastewater quality, and process-level environmental performance.",
      challenges: ["Hazardous emissions", "Wastewater treatment", "Multi-site compliance"],
      modules: ["environmental-monitoring", "carbon-accounting", "compliance-management"],
    },
    {
      slug: "utilities",
      icon: "utilities",
      name: "Power Generation",
      desc: "Report generation mix and grid-level emissions with full traceability and lineage.",
      challenges: ["Generation mix", "Grid emissions", "Regulator filing"],
      modules: ["environmental-monitoring", "carbon-accounting", "compliance-management"],
    },
    {
      slug: "oilgas",
      icon: "oilgas",
      name: "Oil & Gas",
      desc: "Detect methane anomalies and validate flaring, venting, and fugitive emissions.",
      challenges: ["Methane leaks", "Flaring & venting", "Asset sprawl"],
      modules: ["environmental-monitoring", "carbon-accounting", "compliance-management"],
    },
  ],
  industriesSection: {
    eyebrow: "Industries",
    title: "Built for the operational complexity of heavy industry.",
    desc: "Purpose-built modules for the sectors with the hardest sustainability problems.",
  },
  industriesLandingLabels: {
    challenges: "Primary Challenges",
    modules: "Modules",
    learnMore: "Learn More",
  },
  howWorks: {
    label: "HOW ENVI WORKS",
    title: "From Operational Data to Sustainability Intelligence.",
    subtitle: "ENVI transforms environmental data from multiple industrial sources into actionable insights, automated reporting, and regulatory compliance through one unified platform.",
    steps: [
      {
        icon: "database",
        title: "Collect Data",
        desc: "Collect environmental information from every operational source across the facility.",
        bullets: ["IoT Sensors", "SCADA Systems", "ERP", "Excel Upload", "Manual Inspection", "Laboratory Results"],
        badge: "Real-time Collection",
      },
      {
        icon: "shield",
        title: "Validate",
        desc: "Automatically validate incoming operational data to ensure consistency, accuracy, and traceability.",
        bullets: ["AI Data Validation", "Missing Data Detection", "Approval Workflow", "Audit Trail"],
        badge: "Verified Data",
      },
      {
        icon: "brain",
        title: "Analyze",
        desc: "Transform operational data into environmental intelligence using advanced sustainability analytics.",
        bullets: ["Carbon Accounting", "Life Cycle Assessment", "Waste Management", "Water Monitoring", "Energy Monitoring"],
        badge: "AI Powered",
      },
      {
        icon: "clipboard",
        title: "Compliance",
        desc: "Automatically prepare sustainability information according to global reporting frameworks.",
        bullets: ["ISO 14001", "GRI", "CDP", "TCFD", "PROPER"],
        badge: "Compliance Ready",
      },
      {
        icon: "dashboard",
        title: "Executive Dashboard",
        desc: "Visualize KPIs, environmental performance, trends, risks, and AI recommendations in one executive platform.",
        bullets: ["Real-time KPI", "Carbon Trend", "Compliance Status", "AI Insights", "Executive Reports"],
        badge: "Live Dashboard",
      },
    ],
    summary: {
      title: "One Connected Sustainability Platform",
      desc: "Instead of managing environmental monitoring, carbon accounting, life cycle assessment, waste management, compliance, and reporting through separate spreadsheets, ENVI centralizes every sustainability workflow into one integrated enterprise platform.",
      cta1: "Explore Platform",
      cta2: "View Dashboard",
    },
  },
  frameworks: [
    { key: "iso14001", name: "ISO 14001", full: "Environmental Management", desc: "The global standard for environmental management systems.", how: "ensPR maintains certified EMS alignment with audit-ready evidence for every control." },
    { key: "gri", name: "GRI", full: "Global Reporting Initiative", desc: "Universal standards for sustainability disclosure.", how: "Operational data maps automatically to GRI disclosures with full lineage." },
    { key: "cdp", name: "CDP", full: "Carbon Disclosure Project", desc: "Climate, water, and forests questionnaires.", how: "ensPR pre-fills CDP questionnaires and exports them for submission." },
    { key: "tcfd", name: "TCFD", full: "Task Force on Climate", desc: "Climate-related financial risk disclosure.", how: "Risks and metrics are organized to TCFD recommendations automatically." },
    { key: "sbti", name: "SBTi", full: "Science Based Targets", desc: "Validated emissions reduction pathways.", how: "Targets and progress track against SBTi-validated pathways." },
    { key: "proper", name: "PROPER", full: "National (Indonesia)", desc: "Environmental performance rating program.", how: "Site performance is compiled into PROPER-ready submissions." },
  ],
};

const id: SiteContent = {
  nav: {
    platform: "Platform",
    modules: "Modul",
    industries: "Industri",
    compliance: "Kepatuhan",
    about: "Tentang",
    contact: "Kontak",
    signIn: "Masuk",
    requestDemo: "Minta demo",
    langLabel: "Bahasa",
  },
  platform: {
    heroEyebrow: "Platform",
    heroTitle: "Satu lapisan kecerdasan untuk keberlanjutan industri.",
    heroDesc: "ensPR menyatukan pemantauan waktu nyata, analisis AI, life cycle assessment, dan kepatuhan multi-framework ke dalam satu sistem pencatatan yang dibangun untuk industri berat.",
    heroCta: "Minta demo",
    heroCta2: "Jelajahi modul",
    introEyebrow: "Ikhtisar",
    introTitle: "Dirancang untuk cara kerja tim keberlanjutan.",
    introDesc: "Dari lantai pabrik hingga ruang direksi, ensPR mengubah data lingkungan yang terpecah menjadi keputusan terpercaya — dengan tata kelola yang dibutuhkan tim enterprise.",
    pillarsTitle: "Apa yang membedakan platform ini",
    pillarsDesc: "Empat kapabilitas, satu sumber kebenaran.",
    archEyebrow: "Arsitektur",
    archTitle: "Arsitektur tingkat enterprise yang terbuka.",
    archDesc: "ensPR menyerap dari sumber mana pun dan melayani konsumen mana pun — dashboard, ERP, regulator, dan auditor — melalui satu model data tervalidasi.",
    archLayers: [
      { title: "Hubungkan", desc: "Meter, PLC, SCADA, ERP, dan entri manual — dinormalisasi saat masuk." },
      { title: "Validasi", desc: "Pemeriksaan otomatis, silsilah, dan satu ledger emisi." },
      { title: "Analisis", desc: "Akar masalah AI, LCA, dan pemetaan kepatuhan dalam satu mesin." },
      { title: "Lapor", desc: "Pengungkapan siap direksi dan ekspor API langsung." },
    ],
    aiEyebrow: "Mesin AI",
    aiTitle: "Mesin AI yang menjelaskan dirinya.",
    aiDesc: "Setiap insight dilengkapi penjelasan akar masalah dan tindakan terprioritas — bukan sekadar angka.",
    aiFeatures: [
      { title: "Deteksi anomali", desc: "Pemantauan berkelanjutan menandai penyimpangan saat muncul." },
      { title: "Analisis akar masalah", desc: "Lacak lonjakan ke lini, meter, atau proses tertentu." },
      { title: "Prediksi kepatuhan", desc: "Prediksi risiko audit berbulan-bulan sebelum pelaporan." },
      { title: "Tindakan terprioritas", desc: "Perbaikan yang diranking berdasarkan dampak dan upaya." },
    ],
    integEyebrow: "Integrasi",
    integTitle: "Terhubung dengan sistem yang sudah Anda jalankan.",
    integDesc: "Konektor siap pakai dan API terdokumentasi menjaga data lingkungan mengalir otomatis.",
    integList: ["SAP ERP", "OSIsoft PI", "Siemens MindSphere", "Microsoft Fabric", "REST & GraphQL API", "Ingest CSV / SFTP"],
    secEyebrow: "Keamanan",
    secTitle: "Keamanan dan tata kelola sejak awal.",
    secDesc: "Kontrol enterprise untuk data yang diandalkan auditor Anda.",
    secList: [
      { title: "SSO & RBAC", desc: "Single sign-on SAML/OIDC dengan kontrol akses berbasis peran." },
      { title: "Jejak audit", desc: "Silsilah kekal untuk setiap titik data dan pengungkapan." },
      { title: "Enkripsi", desc: "Enkripsi saat transit dan saat disimpan, dipatok per region." },
      { title: "Sertifikasi", desc: "Selaras dengan praktik ISO 27001 dan SOC 2 Type II." },
    ],
    roadmapEyebrow: "Peta jalan",
    roadmapTitle: "Ke mana platform ini melangkah.",
    roadmapDesc: "Tampilan transparan tentang yang akan diharapkan tim enterprise berikutnya.",
    roadmapItems: [
      { q: "Jaringan supplier Scope 3", a: "Skor keberlanjutan supplier diperluas ke vendor tier-1 dan tier-2." },
      { q: "Insight pemeliharaan prediktif", a: "Menghubungkan telemetri peralatan ke anomali emisi." },
      { q: "Pengajuan langsung regulator", a: "Submit satu klik ke portal nasional PROPER dan CDP." },
      { q: "BI tertanam", a: "Dashboard kustom tanpa meninggalkan ensPR." },
    ],
  },
  modulesIndex: {
    eyebrow: "Modul",
    title: "Satu modul untuk setiap alur kerja keberlanjutan.",
    desc: "Setiap modul setara produksi dan menyatu menjadi alur kerja yang operasi Anda butuhkan.",
  },
  industriesIndex: {
    eyebrow: "Industri",
    title: "Dirancang khusus untuk industri berat.",
    desc: "Solusi yang disetel untuk kompleksitas operasional dan tekanan kepatuhan sektor Anda.",
  },
  compliancePage: {
    heroEyebrow: "Kepatuhan",
    heroTitle: "Kepatuhan, otomatis dari ujung ke ujung.",
    heroDesc: "ensPR memetakan data operasional ke persyaratan pengungkapan framework secara otomatis — sehingga musim audit tenang.",
    introEyebrow: "Framework",
    introTitle: "Selaras dengan standar yang paling penting.",
    introDesc: "Satu model data, setiap pengungkapan.",
    autoEyebrow: "Cara kerja",
    autoTitle: "Bagaimana ensPR mengotomatisasi pelaporan.",
    autoDesc: "Dari bacaan mentah hingga pengungkapan yang diajukan tanpa spreadsheet.",
    autoSteps: [
      { title: "Serap", desc: "Data operasional mengalir dari meter, ERP, dan log manual." },
      { title: "Petakan", desc: "Setiap titik data ditandai ke indikator framework otomatis." },
      { title: "Validasi", desc: "Celah dan anomali ditandai sebelum mencapai laporan." },
      { title: "Hasilkan", desc: "Laporan siap pengungkapan dihasilkan dengan silsilah penuh." },
      { title: "Ajukan", desc: "Ekspor ke CDP, GRI, dan portal nasional dalam satu klik." },
    ],
  },
  about: {
    heroEyebrow: "Tentang",
    heroTitle: "Kami membuat keberlanjutan industri dapat dioperasikan.",
    heroDesc: "ensPR membantu industri dengan emisi paling sulit dikurangi untuk mengukur, mengelola, dan melaporkan kinerja lingkungan mereka dengan rigor yang diharapkan keuangan.",
    missionEyebrow: "Misi",
    missionTitle: "Satu sumber kebenaran untuk dampak industri.",
    missionDesc: "Kami percaya keputusan keberlanjutan harus dibangun di atas data terpercaya waktu nyata — bukan estimasi tahunan dan spreadsheet yang terpisah.",
    storyEyebrow: "Cerita kami",
    storyTitle: "Lahir dari lantai pabrik.",
    storyDesc: "ensPR bermula di dalam grup petrokimia Asia Tenggara yang frustrasi dengan pekan pelaporan manual. Kami membangun sistem yang kami inginkan — dan kini membagikannya ke industri.",
    valuesTitle: "Yang kami hargai",
    values: [
      { title: "Kepercayaan lewat ketertelusuran", desc: "Setiap angka dapat dijelaskan, bersumber, dan diaudit." },
      { title: "Dibangun untuk operator", desc: "Kami merancang untuk orang yang menjalankan pabrik, bukan hanya ruang direksi." },
      { title: "Rigor di atas noise", desc: "Akurasi setara enterprise, bukan teater keberlanjutan." },
    ],
    statsTitle: "ensPR dalam angka",
    stats: [
      { value: "120+", label: "Pabrik terhubung" },
      { value: "14", label: "Negara" },
      { value: "85%", label: "Waktu laporan hemat" },
      { value: "6", label: "Framework didukung" },
    ],
    teamEyebrow: "Tim",
    teamTitle: "Operator, engineer, dan pejuang iklim.",
    teamDesc: "Tim kami memadukan engineering proses, advisory ESG, dan perangkat lunak enterprise.",
  },
  contact: {
    heroEyebrow: "Kontak",
    heroTitle: "Bicara dengan tim enterprise kami.",
    heroDesc: "Ceritakan operasi Anda dan kami akan menunjukkan ensPR pada data Anda sendiri.",
    formName: "Nama lengkap",
    formEmail: "Email kerja",
    formCompany: "Perusahaan",
    formRole: "Peran",
    formMessage: "Apa yang bisa kami bantu?",
    formSubmit: "Minta demo",
    formNote: "Kami biasanya merespons dalam satu hari kerja.",
    infoTitle: "Penjualan enterprise",
    infoDesc: "Untuk pengadaan, ulasan keamanan, dan pilot.",
    salesLabel: "Penjualan",
    salesValue: "linkproductive@gmail.com",
    hqLabel: "Kantor pusat",
    hqValue: "Cilegon, Banten, Indonesia",
    regionsLabel: "Region",
    regionsValue: "Asia Pasifik",
  },
  footer: {
    desc: "Intelijen keberlanjutan enterprise untuk perusahaan industri — dari lantai pabrik hingga ruang direksi.",
    col1: "Platform",
    col1l: ["Ikhtisar", "Modul", "Mesin AI", "Integrasi", "Keamanan", "Peta jalan"],
    col2: "Industri",
    col2l: ["Manufaktur Kimia", "Pembangkit Listrik", "Minyak dan Gas"],
    col3: "Perusahaan",
    col3l: ["Tentang", "Kepatuhan", "Kontak", "Karier", "Keamanan"],
    col4: "Sumber daya",
    col4l: ["Dokumentasi", "API", "Status", "Catatan rilis", "Privasi"],
    copyright: "Hak cipta dilindungi.",
    privacy: "Privasi",
    terms: "Syarat",
    security: "Keamanan",
  },
  modules: {
    "environmental-monitoring": {
      slug: "environmental-monitoring",
      name: "Pemantauan Lingkungan",
      tagline: "Visibilitas operasional waktu nyata",
      heroTitle: "Pemantauan Lingkungan",
      heroDesc: "Satu dashboard operasional untuk emisi, energi, limbah, dan air — diperbarui saat data masuk.",
      overview:
        "Pemantauan Lingkungan adalah lapisan operasional langsung ensPR. Ini menormalisasi bacaan dari meter, PLC, dan ERP ke dalam satu model tervalidasi sehingga tim selalu melihat keadaan terkini setiap situs dan proses.",
      benefits: [
        { title: "Visibilitas langsung", desc: "Setiap KPI menyegarkan saat data tiba — tanpa ekspor mingguan." },
        { title: "Lebih sedikit kejutan", desc: "Alert ambang menangkap penyimpangan sebelum menjadi pelanggaran." },
        { title: "Satu layar", desc: "Udara, energi, air, dan limbah dalam satu tampilan operasional." },
      ],
      features: [
        { title: "KPI terpadu", desc: "Emisi, energi, limbah, dan air berdampingan." },
        { title: "Ambang dapat diatur", desc: "Tetapkan batas per situs, lini, dan indikator." },
        { title: "Drill-down", desc: "Pindah dari portofolio ke satu meter dalam dua klik." },
        { title: "Siap mobile", desc: "Operator mendapat alert di lantai, bukan hanya di kantor." },
      ],
      workflow: [
        { title: "Hubungkan", desc: "Tautkan meter, PLC, dan ERP melalui konektor." },
        { title: "Normalisasi", desc: "Petakan unit dan faktor ke satu model." },
        { title: "Pantau", desc: "Awasi KPI langsung dan pelanggaran ambang." },
        { title: "Tindak", desc: "Arahkan alert ke pemilik yang tepat otomatis." },
      ],
      integrations: ["SAP ERP", "OSIsoft PI", "Siemens MindSphere", "REST API"],
      gallery: ["Tampilan operasional", "Alert ambang", "Perbandingan situs", "Alert mobile"],
      faqs: [
        { q: "Sumber data apa yang didukung?", a: "Meter, PLC, SCADA, sistem ERP, dan form entri manual." },
        { q: "Seberapa segar datanya?", a: "Hampir waktu nyata — biasanya disinkron dalam hitungan detik." },
        { q: "Dapatkah saya mengatur ambang sendiri?", a: "Ya, per situs, lini, dan indikator dengan tingkat keparahan dapat diatur." },
      ],
    },
    "carbon-accounting": {
      slug: "carbon-accounting",
      name: "Akuntansi Karbon",
      tagline: "Inventori Scope 1, 2, dan 3",
      heroTitle: "Akuntansi Karbon",
      heroDesc: "Inventori Scope 1, 2, dan 3 dengan jalur reduksi, pelacakan target, dan perhitungan siap audit.",
      overview:
        "Akuntansi Karbon menghasilkan inventori emisi yang dapat dipertahankan di ketiga scope, dengan silsilah perhitungan yang dibutuhkan auditor dan pelacakan target yang diharapkan kepemimpinan.",
      benefits: [
        { title: "Angka dapat dipertahankan", desc: "Setiap faktor emisi dan konversi dapat dilacak." },
        { title: "Pelacakan target", desc: "Awasi progres terhadap jalur reduksi selaras SBTi." },
        { title: "Perencanaan skenario", desc: "Modelkan tuas seperti elektrifikasi sebelum komitmen modal." },
      ],
      features: [
        { title: "Scope 1–3", desc: "Emisi bahan bakar, energi, dan rantai nilai dalam satu ledger." },
        { title: "Pustaka faktor", desc: "Faktor emisi terpelihara per region dan sumber." },
        { title: "Dashboard target", desc: "Lacak trajektori versus reduksi yang dikomitmenkan." },
        { title: "Ekspor", desc: "Keluaran selaras GHG Protocol untuk pengungkapan." },
      ],
      workflow: [
        { title: "Inventori", desc: "Kumpulkan data aktivitas di semua scope." },
        { title: "Hitung", desc: "Terapkan faktor regional otomatis." },
        { title: "Lacak", desc: "Bandingkan terhadap target dan baseline." },
        { title: "Lapor", desc: "Ekspor pernyataan karbon siap audit." },
      ],
      integrations: ["SAP ERP", "Microsoft Fabric", "CSV / SFTP", "REST API"],
      gallery: ["Ledger emisi", "Rincian scope", "Pelacak target", "Model skenario"],
      faqs: [
        { q: "Apakah mengikuti GHG Protocol?", a: "Ya — scope, batasan, dan metode perhitungan selaras GHG Protocol." },
        { q: "Apakah Scope 3 didukung?", a: "Ya, termasuk barang dibeli, transportasi, dan penggunaan produk." },
        { q: "Dapatkah kami modelkan skenario reduksi?", a: "Ya, perencanaan skenario membandingkan tuas sebelum investasi." },
      ],
    },
    "life-cycle-assessment": {
      slug: "life-cycle-assessment",
      name: "Life Cycle Assessment",
      tagline: "Dampak lahir hingga akhir",
      heroTitle: "Life Cycle Assessment",
      heroDesc: "Kuantifikasi dampak lingkungan lahir-hingga-akhir dan bandingkan alternatif desain berdampingan.",
      overview:
        "Life Cycle Assessment mengkuantifikasi dampak produk dan proses dari bahan baku hingga akhir masa pakai, sehingga tim dapat membandingkan desain dan supplier dengan angka pasti.",
      benefits: [
        { title: "Keputusan desain", desc: "Bandingkan alternatif dengan dampak terkuantifikasi." },
        { title: "Wawasan supplier", desc: "Lihat jejak hulu, bukan hanya pagar pabrik Anda." },
        { title: "Pemetaan hotspot", desc: "Temukan tahap yang menyumbang dampak terbesar." },
      ],
      features: [
        { title: "Lahir-hingga-akhir", desc: "Model lifecycle penuh dari ekstraksi ke pembuangan." },
        { title: "Perbandingan alternatif", desc: "Ranking desain dan material berdasarkan dampak." },
        { title: "Kategori dampak", desc: "Karbon, air, dan penggunaan sumber daya dalam satu tampilan." },
        { title: "Terkait data", desc: "Menarik data operasional langsung bila tersedia." },
      ],
      workflow: [
        { title: "Definisikan", desc: "Tetapkan tujuan, cakupan, dan unit fungsional." },
        { title: "Inventori", desc: "Kumpulkan input dan output per tahap." },
        { title: "Nilai", desc: "Hitung dampak lintas kategori." },
        { title: "Perbaiki", desc: "Identifikasi dan bandingkan opsi reduksi." },
      ],
      integrations: ["SAP ERP", "Portal supplier", "Impor CSV", "REST API"],
      gallery: ["Tahap lifecycle", "Hotspot dampak", "Perbandingan desain", "Jejak supplier"],
      faqs: [
        { q: "Metode apa yang digunakan?", a: "LCA selaras ISO 14040/14044 dengan kategori dampak standar." },
        { q: "Dapatkah membandingkan supplier?", a: "Ya — jejak hulu dimodelkan per supplier." },
        { q: "Apakah terhubung ke data langsung?", a: "Bila tersedia, data operasional mengisi inventori otomatis." },
      ],
    },
    "waste-management": {
      slug: "waste-management",
      name: "Manajemen Limbah",
      tagline: "Lacak, klasifikasi, kurangi",
      heroTitle: "Manajemen Limbah",
      heroDesc: "Klasifikasi, lacak, dan kurangi aliran limbah di seluruh situs dengan metrik diversi dan daur ulang.",
      overview:
        "Manajemen Limbah memberi tim operasi cara konsisten untuk mencatat, mengklasifikasi, dan mengurangi limbah — mengubah data pembuangan menjadi program reduksi.",
      benefits: [
        { title: "Klasifikasi konsisten", desc: "Satu taksonomi di semua situs." },
        { title: "Metrik diversi", desc: "Lacak daur ulang dan reuse versus landfill." },
        { title: "Visibilitas biaya", desc: "Kaitkan volume pembuangan ke pengeluaran." },
      ],
      features: [
        { title: "Taksonomi aliran", desc: "Aliran berbahaya, dapat didaur ulang, dan organik." },
        { title: "Tingkat diversi", desc: "Ukur penghindaran landfill dari waktu ke waktu." },
        { title: "Perbandingan situs", desc: "Bandikan pabrik satu sama lain." },
        { title: "Pelaporan", desc: "Metrik limbah siap pengungkapan." },
      ],
      workflow: [
        { title: "Catat", desc: "Log limbah per aliran dan situs." },
        { title: "Klasifikasi", desc: "Terapkan taksonomi bersama." },
        { title: "Ukur", desc: "Hitung diversi dan intensitas." },
        { title: "Kurangi", desc: "Targetkan aliran terbesar." },
      ],
      integrations: ["ERP", "Sistem jembatan timbang", "Impor CSV", "REST API"],
      gallery: ["Dashboard aliran", "Tingkat diversi", "Bandikan situs", "Rencana reduksi"],
      faqs: [
        { q: "Jenis limbah apa yang dilacak?", a: "Aliran berbahaya, dapat didaur ulang, organik, dan umum." },
        { q: "Dapatkah membandingkan situs?", a: "Ya — intensitas dan diversi dibandingkan antar pabrik." },
        { q: "Apakah menyuplai kepatuhan?", a: "Metrik limbah mengalir ke modul kepatuhan otomatis." },
      ],
    },
    "water-monitoring": {
      slug: "water-monitoring",
      name: "Pemantauan Air",
      tagline: "Pengelolaan dan intensitas",
      heroTitle: "Pemantauan Air",
      heroDesc: "Lacak penarikan, pembuangan, dan intensitas dengan konteks DAS dan batas regulasi.",
      overview:
        "Pemantauan Air membantu situs mengelola penarikan dan pembuangan terhadap batas dan konteks lokal, mendukung komitmen pengelolaan air.",
      benefits: [
        { title: "Kepatuhan batas", desc: "Lacak pembuangan terhadap ambang izin." },
        { title: "Wawasan intensitas", desc: "Normalisasi penggunaan per volume produksi." },
        { title: "Konteks risiko", desc: "Tandai tekanan di DAS berisiko tinggi." },
      ],
      features: [
        { title: "Penarikan & pembuangan", desc: "Volume dan kualitas dalam satu tampilan." },
        { title: "Batas izin", desc: "Alert saat mendekati kapasitas regulasi." },
        { title: "Risiko DAS", desc: "Konteks untuk kelangkaan lokal." },
        { title: "KPI intensitas", desc: "Penggunaan per unit output." },
      ],
      workflow: [
        { title: "Hubungkan", desc: "Tautkan meter dan hasil lab." },
        { title: "Pantau", desc: "Awasi batas dan intensitas." },
        { title: "Alert", desc: "Beri tahu saat pelanggaran ambang." },
        { title: "Lapor", desc: "Ungkap metrik air." },
      ],
      integrations: ["SCADA", "Sistem lab", "Impor CSV", "REST API"],
      gallery: ["Neraca air", "Batas pembuangan", "Risiko DAS", "KPI intensitas"],
      faqs: [
        { q: "Apakah melacak kualitas pembuangan?", a: "Ya — tautkan hasil lab ke volume pembuangan." },
        { q: "Dapatkah menampilkan risiko air?", a: "Ya — konteks DAS menyoroti kelangkaan lokal." },
        { q: "Apakah sadar izin?", a: "Alert dipicu saat mendekati kapasitas izin." },
      ],
    },
    "compliance-management": {
      slug: "compliance-management",
      name: "Manajemen Kepatuhan",
      tagline: "Selalu siap audit",
      heroTitle: "Manajemen Kepatuhan",
      heroDesc: "Keselarasan langsung dengan ISO 14001, GRI, CDP, TCFD, SBTi, dan PROPER — dengan deteksi celah.",
      overview:
        "Manajemen Kepatuhan memetakan data operasional Anda ke persyaratan framework dan menandai celah sebelum musim audit, sehingga pengungkapan berkelanjutan bukan tahunan.",
      benefits: [
        { title: "Selalu siap audit", desc: "Bukti tersusun saat auditor bertanya." },
        { title: "Deteksi celah", desc: "Lihat indikator yang hilang secara waktu nyata." },
        { title: "Satu pemetaan", desc: "Satu model data melayani setiap framework." },
      ],
      features: [
        { title: "Pustaka framework", desc: "ISO 14001, GRI, CDP, TCFD, SBTi, PROPER." },
        { title: "Dashboard celah", desc: "Item terbuka dengan pemilik dan tenggat." },
        { title: "Jejak bukti", desc: "Silsilah untuk setiap metrik yang diungkapkan." },
        { title: "Ekspor", desc: "Keluaran siap pengungkapan per framework." },
      ],
      workflow: [
        { title: "Petakan", desc: "Tandai data ke indikator framework." },
        { title: "Pantau", desc: "Awasi cakupan dan celah." },
        { title: "Remediasi", desc: "Tugaskan dan tutup item terbuka." },
        { title: "Ungkap", desc: "Ekspor laporan selaras." },
      ],
      integrations: ["Portal CDP", "Template GRI", "ERP", "REST API"],
      gallery: ["Grid framework", "Dashboard celah", "Jejak bukti", "Ekspor laporan"],
      faqs: [
        { q: "Framework apa yang didukung?", a: "ISO 14001, GRI, CDP, TCFD, SBTi, dan PROPER." },
        { q: "Bagaimana celah ditemukan?", a: "Mesin memeriksa cakupan terhadap setiap framework terus-menerus." },
        { q: "Apakah bukti terjaga?", a: "Setiap metrik membawa silsilah penuh untuk auditor." },
      ],
    },
    "ai-insights": {
      slug: "ai-insights",
      name: "Insight AI",
      tagline: "Kecerdasan yang dapat dijelaskan",
      heroTitle: "Insight AI",
      heroDesc: "Deteksi anomali, analisis akar masalah, dan tindakan terprioritas — dijelaskan dengan bahasa sederhana.",
      overview:
        "Insight AI adalah lapisan penalaran ensPR. Ini mendeteksi anomali, menjelaskan kemungkinan penyebab, memprediksi risiko kepatuhan, dan merekomendasikan perbaikan yang bisa ditindaklanjuti tim Anda.",
      benefits: [
        { title: "Jawaban lebih cepat", desc: "Akar masalah dalam menit, bukan minggu." },
        { title: "Risiko lebih kecil", desc: "Tangkap drift kepatuhan sejak dini." },
        { title: "Dapat ditindak", desc: "Rekomendasi diranking berdasarkan dampak." },
      ],
      features: [
        { title: "Deteksi anomali", desc: "Pemantauan statistik berkelanjutan." },
        { title: "Akar masalah", desc: "Lacak ke lini, meter, atau proses." },
        { title: "Peramalan", desc: "Prediksi risiko audit dan target." },
        { title: "Naratif", desc: "Penjelasan dengan bahasa sederhana." },
      ],
      workflow: [
        { title: "Deteksi", desc: "Tandai penyimpangan otomatis." },
        { title: "Jelaskan", desc: "Tampilkan kemungkinan akar masalah." },
        { title: "Prediksi", desc: "Proyeksikan risiko ke depan." },
        { title: "Rekomendasikan", desc: "Ranking tindakan perbaikan." },
      ],
      integrations: ["Semua modul ensPR", "Slack", "Microsoft Teams", "Email"],
      gallery: ["Feed anomali", "Kartu akar masalah", "Prediksi risiko", "Daftar tindakan"],
      faqs: [
        { q: "Apakah AI dapat dijelaskan?", a: "Ya — setiap insight menyertakan penjelasan akar masalah." },
        { q: "Dari mana ia membaca?", a: "Semua modul ensPR berbagi satu model data." },
        { q: "Dapatkah memberi tahu tim saya?", a: "Alert diarahkan ke Slack, Teams, dan email." },
      ],
    },
  },
  industries: {
    chemical: {
      slug: "chemical",
      name: "Manufaktur Kimia",
      heroTitle: "Keberlanjutan untuk pabrik kimia.",
      heroDesc: "Pelacakan emisi berbahaya, kepatuhan multi-izin, dan akuntansi level proses dalam satu sistem.",
      challenges: [
        { title: "Emisi berbahaya", desc: "Aliran stack, fugitif, dan effluent di bawah batas ketat." },
        { title: "Kompleksitas multi-izin", desc: "Puluhan izin di berbagai situs dan regulator." },
        { title: "Intensitas proses", desc: "Emisi terikat pada reaksi dan lini tertentu." },
      ],
      solutions: [
        { title: "Ledger emisi", desc: "Setiap aliran dipetakan ke satu model tervalidasi." },
        { title: "Pelacakan izin", desc: "Alert batas per izin dan regulator." },
        { title: "Akuntansi proses", desc: "Kaitkan dampak ke reaksi tertentu." },
      ],
      modules: ["environmental-monitoring", "carbon-accounting", "compliance-management", "ai-insights"],
      caseStudy: {
        quote: "ensPR memangkas laporan keberlanjutan tahunan kami dari enam minggu kerja manual menjadi di bawah empat hari — dengan jejak audit yang rapi.",
        name: "Reza Hartono",
        role: "Manajer Keberlanjutan",
        company: "PT Petrokimia Gresik",
        metricLabel: "Waktu laporan hemat",
        metricValue: "85%",
      },
    },

    utilities: {
      slug: "utilities",
      name: "Pembangkit Listrik",
      heroTitle: "Keberlanjutan untuk utilitas.",
      heroDesc: "Kepatuhan pembangkit listrik dan pelaporan bauran energi dengan percaya diri dan ketertelusuran penuh.",
      challenges: [
        { title: "Bauran pembangkitan", desc: "Pelaporan renewable dan thermal berdampingan." },
        { title: "Emisi grid", desc: "Aturan alokasi kompleks." },
        { title: "Pengajuan regulator", desc: "Pengiriman berulang dengan pengawasan tinggi." },
      ],
      solutions: [
        { title: "Pelaporan bauran", desc: "Porsi renewable dengan silsilah penuh." },
        { title: "Alokasi grid", desc: "Faktor emisi transparan." },
        { title: "Ekspor pengajuan", desc: "Keluaran siap pengungkapan." },
      ],
      modules: ["environmental-monitoring", "carbon-accounting", "compliance-management", "ai-insights"],
      caseStudy: {
        quote: "Pengajuan regulator yang dulu sebulan kini selesai dalam hari dengan bukti yang rapi.",
        name: "Budi Santoso",
        role: "Manajer Kepatuhan",
        company: "PLN Energi",
        metricLabel: "Waktu pengajuan",
        metricValue: "-70%",
      },
    },
    oilgas: {
      slug: "oilgas",
      name: "Minyak dan Gas",
      heroTitle: "Keberlanjutan untuk minyak & gas.",
      heroDesc: "Deteksi anomali metana, pencatatan flaring dan venting, serta validasi emisi fugitif di bawah regulasi yang makin ketat.",
      challenges: [
        { title: "Kebocoran metana", desc: "Emisi fugitif dan vented sulit dilacak." },
        { title: "Flaring & venting", desc: "Lepasan volum besar dengan regulasi ketat." },
        { title: "Aset tersebar", desc: "Sumur, pabrik, dan pipa lintas wilayah." },
      ],
      solutions: [
        { title: "Deteksi metana", desc: "Anomali ditandai dari sensor dan data satelit." },
        { title: "Pencatatan flaring", desc: "Volume dan intensitas per aset." },
        { title: "Validasi framework", desc: "Dilaporkan sesuai program metana." },
      ],
      modules: ["environmental-monitoring", "carbon-accounting", "compliance-management", "ai-insights"],
      caseStudy: {
        quote: "ensPR mengubah lembar sebar metana yang tersebar menjadi satu catatan defensif yang diterima auditor tanpa tindak lanjut.",
        name: "Putra Mahendra",
        role: "Manajer HSE",
        company: "Medco E&P",
        metricLabel: "Temuan audit",
        metricValue: "-90%",
      },
    },
  },
  industriesLanding: [
    {
      slug: "chemical",
      icon: "chemical",
      name: "Manufaktur Kimia",
      desc: "Pantau emisi berbahaya, kualitas air limbah, dan kinerja lingkungan tingkat proses.",
      challenges: ["Emisi berbahaya", "Pengolahan limbah cair", "Kepatuhan multi-site"],
      modules: ["environmental-monitoring", "carbon-accounting", "compliance-management"],
    },
    {
      slug: "utilities",
      icon: "utilities",
      name: "Pembangkit Listrik",
      desc: "Laporkan bauran pembangkitan dan emisi tingkat grid dengan ketertelusuran penuh.",
      challenges: ["Bauran pembangkitan", "Emisi grid", "Pengajuan regulator"],
      modules: ["environmental-monitoring", "carbon-accounting", "compliance-management"],
    },
    {
      slug: "oilgas",
      icon: "oilgas",
      name: "Minyak dan Gas",
      desc: "Deteksi anomali metana serta validasi flaring, venting, dan emisi fugitif.",
      challenges: ["Kebocoran metana", "Flaring & venting", "Aset tersebar"],
      modules: ["environmental-monitoring", "carbon-accounting", "compliance-management"],
    },
  ],
  industriesSection: {
    eyebrow: "Industri",
    title: "Dirancang untuk kompleksitas operasional industri berat.",
    desc: "Modul khusus untuk sektor dengan masalah keberlanjutan tersulit.",
  },
  industriesLandingLabels: {
    challenges: "Tantangan Utama",
    modules: "Modul",
    learnMore: "Pelajari",
  },
  howWorks: {
    label: "BAGAIMANA ENVI BEKERJA",
    title: "Dari Data Operasional menjadi Kecerdasan Keberlanjutan.",
    subtitle: "ENVI mengubah data lingkungan dari berbagai sumber industri menjadi wawasan yang dapat ditindaklanjuti, pelaporan otomatis, dan kepatuhan regulasi melalui satu platform terpadu.",
    steps: [
      {
        icon: "database",
        title: "Kumpulkan Data",
        desc: "Kumpulkan informasi lingkungan dari setiap sumber operasional di seluruh fasilitas.",
        bullets: ["Sensor IoT", "Sistem SCADA", "ERP", "Unggah Excel", "Inspeksi Manual", "Hasil Laboratorium"],
        badge: "Pengumpulan Waktu Nyata",
      },
      {
        icon: "shield",
        title: "Validasi",
        desc: "Validasi data operasional yang masuk secara otomatis untuk memastikan konsistensi, akurasi, dan ketertelusuran.",
        bullets: ["Validasi Data AI", "Deteksi Data Hilang", "Alur Persetujuan", "Jejak Audit"],
        badge: "Data Terverifikasi",
      },
      {
        icon: "brain",
        title: "Analisis",
        desc: "Ubah data operasional menjadi kecerdasan lingkungan menggunakan analitik keberlanjutan tingkat lanjut.",
        bullets: ["Akuntansi Karbon", "Life Cycle Assessment", "Manajemen Limbah", "Pemantauan Air", "Pemantauan Energi"],
        badge: "Didukung AI",
      },
      {
        icon: "clipboard",
        title: "Kepatuhan",
        desc: "Siapkan informasi keberlanjutan secara otomatis sesuai kerangka pelaporan global.",
        bullets: ["ISO 14001", "GRI", "CDP", "TCFD", "PROPER"],
        badge: "Siap Kepatuhan",
      },
      {
        icon: "dashboard",
        title: "Dasbor Eksekutif",
        desc: "Visualisasikan KPI, kinerja lingkungan, tren, risiko, dan rekomendasi AI dalam satu platform eksekutif.",
        bullets: ["KPI Waktu Nyata", "Tren Karbon", "Status Kepatuhan", "Insight AI", "Laporan Eksekutif"],
        badge: "Dasbor Langsung",
      },
    ],
    summary: {
      title: "Satu Platform Keberlanjutan Terhubung",
      desc: "Alih-alih mengelola pemantauan lingkungan, akuntansi karbon, life cycle assessment, manajemen limbah, kepatuhan, dan pelaporan melalui spreadsheet terpisah, ENVI memusatkan setiap alur kerja keberlanjutan ke dalam satu platform enterprise terintegrasi.",
      cta1: "Jelajahi Platform",
      cta2: "Lihat Dasbor",
    },
  },
  frameworks: [
    { key: "iso14001", name: "ISO 14001", full: "Manajemen Lingkungan", desc: "Standar global untuk sistem manajemen lingkungan.", how: "ensPR menjaga keselarasan EMS tersertifikasi dengan bukti siap audit untuk setiap kontrol." },
    { key: "gri", name: "GRI", full: "Global Reporting Initiative", desc: "Standar universal untuk pengungkapan keberlanjutan.", how: "Data operasional memetakan otomatis ke pengungkapan GRI dengan silsilah penuh." },
    { key: "cdp", name: "CDP", full: "Carbon Disclosure Project", desc: "Kuesioner iklim, air, dan hutan.", how: "ensPR pra-mengisi kuesioner CDP dan mengekspornya untuk pengajuan." },
    { key: "tcfd", name: "TCFD", full: "Task Force on Climate", desc: "Pengungkapan risiko finansial terkait iklim.", how: "Risiko dan metrik diatur ke rekomendasi TCFD secara otomatis." },
    { key: "sbti", name: "SBTi", full: "Science Based Targets", desc: "Jalur reduksi emisi tervalidasi.", how: "Target dan progres melacak jalur tervalidasi SBTi." },
    { key: "proper", name: "PROPER", full: "Nasional (Indonesia)", desc: "Program pemeringkat kinerja lingkungan.", how: "Kinerja situs disusun menjadi pengajuan siap PROPER." },
  ],
};

export const siteContent: { en: SiteContent; id: SiteContent } = { en, id };

export function getSite(locale: Locale): SiteContent {
  return siteContent[locale] ?? siteContent.id;
}

export const moduleSlugs = Object.keys(en.modules);
export const industrySlugs = Object.keys(en.industries);
