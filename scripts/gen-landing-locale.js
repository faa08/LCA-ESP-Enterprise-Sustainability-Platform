const fs = require("fs");

// Nested structure: [en, id]
const S = (en, id) => ({ en, id });

const data = {
  nav: {
    platform: S("Platform", "Platform"),
    modules: S("Modules", "Modul"),
    how: S("How it works", "Cara kerja"),
    industries: S("Industries", "Industri"),
    compliance: S("Compliance", "Kepatuhan"),
    signin: S("Sign in", "Masuk"),
    requestDemo: S("Request a demo", "Minta demo"),
  },
  hero: {
    badge: S("Now with AI compliance alerts", "Kini dengan alert kepatuhan AI"),
    announce: S("Now with AI compliance alerts", "Kini dengan alert kepatuhan AI"),
    headlinePre: S("The enterprise platform for ", "Platform enterprise untuk "),
    headlineHi: S("sustainability", "keberlanjutan"),
    headlinePost: S(" performance.", " perusahaan."),
    desc: S(
      "ensPR unifies emissions monitoring, life cycle assessment, and multi-framework compliance into a single source of truth — so sustainability, HSE, and ESG teams move from spreadsheets to real-time intelligence.",
      "ensPR menyatukan pemantauan emisi, analisis life cycle, dan kepatuhan multi-framework ke dalam satu sumber kebenaran — sehingga tim keberlanjutan, HSE, dan ESG beralih dari spreadsheet ke intelijen waktu nyata."
    ),
    ctaDemo: S("Request a demo", "Minta demo"),
    ctaExplore: S("Explore the platform", "Jelajahi platform"),
    kpi1Label: S("Reporting time saved", "Waktu laporan hemat"),
    kpi2Label: S("Factories connected", "Pabrik terhubung"),
    kpi3Label: S("Countries", "Negara"),
  },
  problem: {
    eyebrow: S("The problem", "Masalah"),
    title: S("Industrial sustainability has outgrown spreadsheets.", "Keberlanjutan industri sudah melampaui spreadsheet."),
    desc: S(
      "Environmental teams are asked to do more — with more scrutiny — on tooling built for a simpler era.",
      "Tim lingkungan diminta melakukan lebih banyak — dengan pengawasan lebih ketat — menggunakan alat yang dibuat untuk era yang lebih sederhana."
    ),
    t1: S("Fragmented data infrastructure", "Infrastruktur data terpecah"),
    d1: S(
      "Emissions, energy, waste, and water live in disconnected spreadsheets and departmental systems that no one fully trusts.",
      "Emisi, energi, limbah, dan air tersebar di spreadsheet dan sistem departemen yang terpisah serta tidak sepenuhnya dipercaya."
    ),
    t2: S("Growing regulatory exposure", "Paparan regulasi yang meningkat"),
    d2: S(
      "Compliance spans GRI, TCFD, ISO 14001, CDP, and national regulations — each with different, shifting requirements.",
      "Kepatuhan mencakup GRI, TCFD, ISO 14001, CDP, dan regulasi nasional — masing-masing dengan persyaratan yang berbeda dan berubah."
    ),
    t3: S("Slow, high-risk reporting", "Pelaporan lambat dan berisiko"),
    d3: S(
      "Annual sustainability reports take weeks to compile manually, with error-prone handoffs and no audit trail.",
      "Laporan keberlanjutan tahunan memakan waktu berminggu-minggu disusun manual, dengan serah-terima rawan salah dan tanpa jejak audit."
    ),
    t4: S("Data without intelligence", "Data tanpa kecerdasan"),
    d4: S(
      "Environmental data is collected but rarely analyzed for root causes, trends, or corrective actions.",
      "Data lingkungan dikumpulkan namun jarang dianalisis untuk akar masalah, tren, atau tindakan perbaikan."
    ),
  },
  platform: {
    eyebrow: S("The platform", "Platform"),
    title: S("One intelligence layer for industrial sustainability.", "Satu lapisan kecerdasan untuk keberlanjutan industri."),
    desc: S(
      "ensPR integrates monitoring, analysis, compliance, and reporting into a single system of record.",
      "ensPR mengintegrasikan pemantauan, analisis, kepatuhan, dan pelaporan ke dalam satu sistem pencatatan."
    ),
    seeAll: S("See all modules", "Lihat semua modul"),
    t1: S("Unified visibility", "Visibilitas terpadu"),
    d1: S(
      "A single operational dashboard for emissions, energy, waste, water, and compliance scores — in real time.",
      "Satu dashboard operasional untuk emisi, energi, limbah, air, dan skor kepatuhan — secara waktu nyata."
    ),
    t2: S("Life cycle intelligence", "Kecerdasan life cycle"),
    d2: S(
      "End-to-end impact analysis across products and processes, from raw material to end of life.",
      "Analisis dampak ujung-ke-ujung pada produk dan proses, dari bahan baku hingga akhir masa pakai."
    ),
    t3: S("AI that explains", "AI yang menjelaskan"),
    d3: S(
      "Root-cause analysis, predictive compliance alerts, and prioritized recommendations you can act on.",
      "Analisis akar masalah, alert kepatuhan prediktif, dan rekomendasi terprioritas yang bisa ditindaklanjuti."
    ),
    t4: S("Audit-ready reporting", "Pelaporan siap audit"),
    d4: S(
      "Automated GRI, TCFD, CDP, and ISO 14001-aligned disclosures with a full data lineage.",
      "Pengungkapan otomatis selaras GRI, TCFD, CDP, dan ISO 14001 dengan silsilah data lengkap."
    ),
  },
  how: {
    eyebrow: S("How it works", "Cara kerja"),
    title: S("From the factory floor to the boardroom.", "Dari lantai pabrik hingga ruang direksi."),
    desc: S(
      "A continuous loop that turns raw operational data into trusted sustainability decisions.",
      "Siklus berkelanjutan yang mengubah data operasional mentah menjadi keputusan keberlanjutan yang terpercaya."
    ),
    s1: S("Factory", "Pabrik"),
    d1: S("Connect meters, PLCs, ERP, and manual logs from every site and process.", "Hubungkan meter, PLC, ERP, dan log manual dari setiap situs dan proses."),
    s2: S("Data collection", "Pengumpulan data"),
    d2: S("Normalize emissions, energy, waste, and water into one validated model.", "Normalisasi emisi, energi, limbah, dan air ke dalam satu model tervalidasi."),
    s3: S("AI analysis", "Analisis AI"),
    d3: S("Detect anomalies, find root causes, and forecast compliance risk.", "Deteksi anomali, temukan akar masalah, dan prediksi risiko kepatuhan."),
    s4: S("Life cycle assessment", "Life cycle assessment"),
    d4: S("Quantify cradle-to-grave impact across products and supply chain.", "Kuantifikasi dampak dari lahir hingga akhir pada produk dan rantai pasok."),
    s5: S("Compliance validation", "Validasi kepatuhan"),
    d5: S("Map data to frameworks and flag gaps before audit season.", "Petakan data ke framework dan tandai celah sebelum musim audit."),
    s6: S("ESG reporting", "Pelaporan ESG"),
    d6: S("Publish board-ready disclosures with full traceability.", "Terbitkan pengungkapan siap direksi dengan ketertelusuran penuh."),
  },
  showcase: {
    eyebrow: S("Product tour", "Tur produk"),
    title: S("Six dashboards. One source of truth.", "Enam dashboard. Satu sumber kebenaran."),
    desc: S(
      "Every screen is built for daily use by sustainability, HSE, and ESG teams — not just for the annual report.",
      "Setiap layar dibangun untuk pemakaian harian tim keberlanjutan, HSE, dan ESG — bukan hanya untuk laporan tahunan."
    ),
    r1t: S("Executive dashboard", "Dashboard eksekutif"),
    r1d: S("A board-ready view of emissions, energy, compliance, and risk — updated the moment data lands.", "Tampilan siap direksi untuk emisi, energi, kepatuhan, dan risiko — diperbarui saat data masuk."),
    r2t: S("Environmental dashboard", "Dashboard lingkungan"),
    r2d: S("Operational KPIs across air, energy, water, and waste with configurable thresholds and alerts.", "KPI operasional untuk udara, energi, air, dan limbah dengan ambang dan alert yang dapat diatur."),
    r3t: S("Carbon accounting", "Akuntansi karbon"),
    r3d: S("Scope 1, 2, and 3 inventory with reduction pathways and target tracking.", "Inventori Scope 1, 2, dan 3 dengan jalur reduksi dan pelacakan target."),
    r4t: S("Life cycle assessment", "Life cycle assessment"),
    r4d: S("Quantify cradle-to-grave impact and compare design alternatives side by side.", "Kuantifikasi dampak lahir-akhir dan bandingkan alternatif desain berdampingan."),
    r5t: S("Compliance dashboard", "Dashboard kepatuhan"),
    r5d: S("Live alignment to every framework you report against, with gap detection.", "Keselarasan langsung dengan setiap framework yang Anda laporkan, dengan deteksi celah."),
    r6t: S("AI insights", "Insight AI"),
    r6d: S("Anomaly detection, root-cause explanations, and prioritized actions — explained in plain language.", "Deteksi anomali, penjelasan akar masalah, dan tindakan terprioritas — dijelaskan dengan bahasa sederhana."),
  },
  modules: {
    eyebrow: S("Feature modules", "Modul fitur"),
    title: S("Purpose-built for how sustainability teams actually work.", "Dirancang khusus untuk cara kerja tim keberlanjutan."),
    desc: S(
      "Each module is production-grade — not a demo. Compose them into the workflow your operation needs.",
      "Setiap modul setara produksi — bukan demo. Susun menjadi alur kerja yang operasi Anda butuhkan."
    ),
    t1: S("Environmental dashboard", "Dashboard lingkungan"),
    d1: S("Real-time operational overview of emissions, energy, waste, and compliance scores.", "Ikhtisar operasional waktu nyata untuk emisi, energi, limbah, dan skor kepatuhan."),
    t2: S("Life cycle assessment", "Life cycle assessment"),
    d2: S("End-to-end environmental impact analysis across product and process lifecycles.", "Analisis dampak lingkungan ujung-ke-ujung pada lifecycle produk dan proses."),
    t3: S("AI sustainability analysis", "Analisis keberlanjutan AI"),
    d3: S("Root-cause analysis, predictive compliance alerts, and prioritized recommendations.", "Analisis akar masalah, alert kepatuhan prediktif, dan rekomendasi terprioritas."),
    t4: S("Carbon management", "Manajemen karbon"),
    d4: S("Scope 1, 2, and 3 tracking, target setting, and reduction pathways.", "Pelacakan Scope 1, 2, dan 3, penargetan, dan jalur reduksi."),
    t5: S("Supplier sustainability", "Keberlanjutan supplier"),
    d5: S("Assess, monitor, and score supplier environmental performance at scale.", "Nilai, pantau, dan skor kinerja lingkungan supplier dalam skala besar."),
    t6: S("Compliance & reporting", "Kepatuhan & pelaporan"),
    d6: S("Automated GRI, TCFD, CDP, and ISO 14001-aligned reports.", "Laporan otomatis selaras GRI, TCFD, CDP, dan ISO 14001."),
  },
  industries: {
    eyebrow: S("Industries", "Industri"),
    title: S("Built for the operational complexity of heavy industry.", "Dirancang untuk kompleksitas operasional industri berat."),
    desc: S(
      "Purpose-built modules for the sectors with the hardest sustainability problems.",
      "Modul khusus untuk sektor dengan masalah keberlanjutan tersulit."
    ),
    keyChallenge: S("Key challenge", "Tantangan utama"),
    i1: S("Chemical", "Kimia"),
    d1: S("Map every reaction and effluent stream to a single emissions ledger.", "Petakan setiap reaksi dan aliran buangan ke satu ledger emisi."),
    c1: S("Hazardous emissions tracking, multi-permit compliance, and process-level accounting.", "Pelacakan emisi berbahaya, kepatuhan multi-izin, dan akuntansi level proses."),
    i2: S("Mining", "Pertambangan"),
    d2: S("Track land, water, and energy across remote, distributed sites.", "Lacak lahan, air, dan energi di situs terpencil yang terdistribusi."),
    c2: S("Site-level impact monitoring, biodiversity compliance, and tailings management.", "Pemantauan dampak level situs, kepatuhan keanekaragaman hayati, dan manajemen tailing."),
    i3: S("Steel & metals", "Baja & logam"),
    d3: S("Attribute emissions to specific lines and reduce intensity over time.", "Kaitkan emisi ke lini tertentu dan kurangi intensitas dari waktu ke waktu."),
    c3: S("High-volume emissions management with blast-furnace-level granularity.", "Manajemen emisi volume tinggi dengan granularitas level tanur tinggi."),
    i4: S("Manufacturing", "Manufaktur"),
    d4: S("Connect shop-floor meters to corporate ESG reporting automatically.", "Hubungkan meter lantai produksi ke pelaporan ESG korporat secara otomatis."),
    c4: S("Production-integrated emissions tracking and multi-site compliance.", "Pelacakan emisi terintegrasi produksi dan kepatuhan multi-situs."),
    i5: S("Food & beverage", "Makanan & minuman"),
    d5: S("Quantify upstream farm impact and downstream packaging footprint.", "Kuantifikasi dampak hulu pertanian dan jejak kemasan hilir."),
    c5: S("Agricultural LCA, water intensity tracking, and packaging scoring.", "LCA pertanian, pelacakan intensitas air, dan penilaian kemasan."),
    i6: S("Utilities", "Utilitas"),
    d6: S("Report generation mix and grid-level emissions with confidence.", "Laporkan bauran pembangkitan dan emisi level grid dengan percaya diri."),
    c6: S("Power plant compliance and energy mix reporting.", "Kepatuhan pembangkit listrik dan pelaporan bauran energi."),
    i7: S("Oil & gas", "Minyak & gas"),
    d7: S("Detect methane anomalies and validate against methane frameworks.", "Deteksi anomali metana dan validasi terhadap framework metana."),
    c7: S("Flaring, venting, and fugitive emissions under tightening regulation.", "Pembakaran, venting, dan emisi fugitif di bawah regulasi yang ketat."),
  },
  compliance: {
    eyebrow: S("Compliance", "Kepatuhan"),
    title: S("Built to meet the standards that matter most.", "Dirancang memenuhi standar yang paling penting."),
    desc: S(
      "ensPR maps operational data to framework disclosure requirements automatically — so audit season is quiet.",
      "ensPR memetakan data operasional ke persyaratan pengungkapan framework secara otomatis — sehingga musim audit tenang."
    ),
    aligned: S("Aligned", "Selaras"),
    f1: S("ISO 14001", "ISO 14001"),
    full1: S("Environmental Management", "Manajemen Lingkungan"),
    cd1: S("Certified EMS alignment with audit-ready evidence.", "Keselarasan EMS tersertifikasi dengan bukti siap audit."),
    f2: S("GRI", "GRI"),
    full2: S("Global Reporting Initiative", "Global Reporting Initiative"),
    cd2: S("Universal standards for sustainability disclosure.", "Standar universal untuk pengungkapan keberlanjutan."),
    f3: S("CDP", "CDP"),
    full3: S("Carbon Disclosure Project", "Carbon Disclosure Project"),
    cd3: S("Climate, water, and forests questionnaires.", "Kuesioner iklim, air, dan hutan."),
    f4: S("TCFD", "TCFD"),
    full4: S("Task Force on Climate", "Task Force on Climate"),
    cd4: S("Climate-related financial risk disclosure.", "Pengungkapan risiko finansial terkait iklim."),
    f5: S("SBTi", "SBTi"),
    full5: S("Science Based Targets", "Science Based Targets"),
    cd5: S("Validated emissions reduction pathways.", "Jalur reduksi emisi tervalidasi."),
    f6: S("PROPER", "PROPER"),
    full6: S("National (Indonesia)", "Nasional (Indonesia)"),
    cd6: S("Environmental performance rating program.", "Program pemeringkat kinerja lingkungan."),
  },
  testimonials: {
    eyebrow: S("Case studies", "Studi kasus"),
    title: S("How sustainability leaders run on ensPR.", "Bagaimana pemimpin keberlanjutan berjalan di ensPR."),
    desc: S(
      "Real operational outcomes from teams managing some of the hardest footprints in industry.",
      "Hasil operasional nyata dari tim yang mengelola jejak industri tersulit."
    ),
    before: S("Before", "Sebelum"),
    after: S("After", "Sesudah"),
    c1company: S("PT Petrokimia Gresik", "PT Petrokimia Gresik"),
    c1quote: S("ensPR reduced our annual sustainability report from six weeks of manual work to under four days — with a clean audit trail.", "ensPR memangkas laporan keberlanjutan tahunan kami dari enam minggu kerja manual menjadi di bawah empat hari — dengan jejak audit yang rapi."),
    c1name: S("Reza Hartono", "Reza Hartono"),
    c1role: S("Sustainability Manager", "Manajer Keberlanjutan"),
    c1before: S("6 weeks manual", "6 minggu manual"),
    c1after: S("4 days automated", "4 hari otomatis"),
    c1s1l: S("Reporting time saved", "Waktu laporan hemat"),
    c1s2l: S("Audit traceability", "Ketertelusuran audit"),
    c2company: S("Krakatau Steel", "Krakatau Steel"),
    c2quote: S("The LCA module gave us a granular view of our process footprint we simply did not have before.", "Modul LCA memberi kami pandangan granular atas jejak proses yang sebelumnya tidak kami miliki."),
    c2name: S("Sandra Wijaya", "Sandra Wijaya"),
    c2role: S("Environmental Engineer", "Engineer Lingkungan"),
    c2before: S("Estimate only", "Hanya estimasi"),
    c2after: S("Line-level LCA", "LCA level lini"),
    c2s1l: S("Footprint clarity", "Kejelasan jejak"),
    c2s2l: S("Faster analysis", "Analisis lebih cepat"),
    c3company: S("Indocement", "Indocement"),
    c3quote: S("Our last ISO 14001 audit was the cleanest we have had in a decade. The data just lined up.", "Audit ISO 14001 terakhir kami adalah yang paling rapi dalam satu dekade. Datanya langsung selaras."),
    c3name: S("Ahmad Prasetyo", "Ahmad Prasetyo"),
    c3role: S("HSE Director", "Direktur HSE"),
    c3before: S("Audit stress", "Stres audit"),
    c3after: S("Zero findings", "Nol temuan"),
    c3s1l: S("Compliance score", "Skor kepatuhan"),
    c3s2l: S("Major findings", "Temuan mayor"),
  },
  faq: {
    eyebrow: S("FAQ", "FAQ"),
    title: S("Questions, answered.", "Pertanyaan, terjawab."),
    desc: S("Everything teams ask before they roll ensPR out across sites.", "Semua yang ditanyakan tim sebelum menerapkan ensPR di seluruh situs."),
    q1: S("What is Life Cycle Assessment (LCA)?", "Apa itu Life Cycle Assessment (LCA)?"),
    a1: S(
      "LCA quantifies the environmental impact of a product or process from raw material extraction through manufacturing, use, and end of life. ensPR automates LCA using your operational data so you can compare design alternatives without a consultant.",
      "LCA mengkuantifikasi dampak lingkungan produk atau proses dari ekstraksi bahan baku melalui manufaktur, pemakaian, hingga akhir masa pakai. ensPR mengotomatisasi LCA menggunakan data operasional Anda sehingga dapat membandingkan alternatif desain tanpa konsultan."
    ),
    q2: S("How is data collected?", "Bagaimana data dikumpulkan?"),
    a2: S(
      "ensPR connects to meters, PLCs, SCADA, ERP systems, and manual entry forms. Data is normalized, validated, and mapped to a single emissions model — with full lineage for audit.",
      "ensPR terhubung ke meter, PLC, SCADA, sistem ERP, dan form entri manual. Data dinormalisasi, divalidasi, dan dipetakan ke satu model emisi — dengan silsilah penuh untuk audit."
    ),
    q3: S("Can ensPR integrate with our ERP?", "Bisakah ensPR terintegrasi dengan ERP kami?"),
    a3: S(
      "Yes. ensPR integrates with common ERP and data platforms through connectors and APIs, so environmental data flows automatically from the systems you already run.",
      "Ya. ensPR terintegrasi dengan ERP dan platform data umum melalui konektor dan API, sehingga data lingkungan mengalir otomatis dari sistem yang sudah Anda jalankan."
    ),
    q4: S("Does ensPR support ISO 14001?", "Apakah ensPR mendukung ISO 14001?"),
    a4: S(
      "Yes. Compliance dashboards map your operational data to ISO 14001 (and GRI, TCFD, CDP, SBTi, PROPER) requirements and flag gaps before audit season.",
      "Ya. Dashboard kepatuhan memetakan data operasional Anda ke persyaratan ISO 14001 (dan GRI, TCFD, CDP, SBTi, PROPER) serta menandai celah sebelum musim audit."
    ),
    q5: S("How does the AI work?", "Bagaimana cara kerja AI?"),
    a5: S(
      "ensPR's AI detects anomalies in environmental data, explains likely root causes, forecasts compliance risk, and prioritizes corrective actions — all in plain language your team can act on.",
      "AI ensPR mendeteksi anomali pada data lingkungan, menjelaskan kemungkinan akar masalah, memprediksi risiko kepatuhan, dan memprioritaskan tindakan perbaikan — semua dalam bahasa sederhana yang bisa ditindaklanjuti tim Anda."
    ),
  },
  cta: {
    eyebrow: S("Get started", "Mulai"),
    title: S("Ready to take control of your sustainability operations?", "Siap mengambil kendali operasi keberlanjutan Anda?"),
    desc: S(
      "Schedule a 30-minute walkthrough with our enterprise team and see ensPR on your own data.",
      "Jadwalkan tutorial 30 menit dengan tim enterprise kami dan lihat ensPR pada data Anda sendiri."
    ),
    demo: S("Request a demo", "Minta demo"),
    download: S("Download overview", "Unduh ringkasan"),
    chip1: S("Emissions −8.4%", "Emisi −8,4%"),
    chip2: S("ISO 14001 · ready", "ISO 14001 · siap"),
    chip3: S("Live · synced 2s", "Live · sinkron 2dtk"),
  },
  footer: {
    desc: S(
      "Enterprise sustainability intelligence for industrial companies — from the factory floor to the boardroom.",
      "Intelijen keberlanjutan enterprise untuk perusahaan industri — dari lantai pabrik hingga ruang direksi."
    ),
    col1: S("Platform", "Platform"),
    col1l1: S("Overview", "Ikhtisar"),
    col1l2: S("Dashboard", "Dashboard"),
    col1l3: S("Life Cycle Assessment", "Life Cycle Assessment"),
    col1l4: S("AI Analysis", "Analisis AI"),
    col1l5: S("Compliance & Reporting", "Kepatuhan & Pelaporan"),
    col2: S("Industries", "Industri"),
    col2l1: S("Chemical", "Kimia"),
    col2l2: S("Petrochemical", "Petrokimia"),
    col2l3: S("Manufacturing", "Manufaktur"),
    col2l4: S("Steel & Metals", "Baja & Logam"),
    col2l5: S("Mining & Extraction", "Pertambangan & Ekstraksi"),
    col3: S("Company", "Perusahaan"),
    col3l1: S("About ensPR", "Tentang ensPR"),
    col3l2: S("Resources", "Sumber daya"),
    col3l3: S("Contact", "Kontak"),
    col3l4: S("Careers", "Karier"),
    col3l5: S("Security", "Keamanan"),
    copyright: S("All rights reserved.", "Hak cipta dilindungi."),
    privacy: S("Privacy", "Privasi"),
    terms: S("Terms", "Syarat"),
    security: S("Security", "Keamanan"),
  },
};

function flatten(obj, prefix) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix + "." + k;
    if (v && typeof v === "object" && v.en !== undefined) {
      out[key] = v;
    } else {
      Object.assign(out, flatten(v, key));
    }
  }
  return out;
}

const flat = flatten(data, "landing");

function buildBlock(locale) {
  let lines = "";
  for (const [k, v] of Object.entries(flat)) {
    const val = v[locale].replace(/"/g, '\\"');
    lines += `  "${k}": "${val}",\n`;
  }
  return "\n  // Landing page (ENVI redesign)\n" + lines;
}

function insert(file, block) {
  let c = fs.readFileSync(file, "utf8");
  const idx = c.lastIndexOf("}");
  c = c.slice(0, idx) + block + "}\n";
  fs.writeFileSync(file, c);
}

insert("src/locales/en.ts", buildBlock("en"));
insert("src/locales/id.ts", buildBlock("id"));
console.log("Inserted", Object.keys(flat).length, "keys into en.ts and id.ts");
