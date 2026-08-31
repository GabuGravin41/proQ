import { Tender, CompanyProfile, HistoricalAward, MarketCategorySpend } from './types';

export const BENCHMARK_TENDERS: Tender[] = [
  {
    id: 't-001',
    ocid: 'ocds-k45-ke-ahs-2026-001',
    tenderNumber: 'AHS/T/04/2026-2027',
    title: 'Supply, Installation, Configuration and Maintenance of School Management System & ICT Infrastructure',
    description: 'Comprehensive school ERP including student records, fee automation, library system, biometric attendance, plus 40 modern desktop computers and structured local area networking for computer lab 2.',
    organization: {
      id: 'org-ahs',
      name: 'Alliance High School',
      type: 'school',
      county: 'Kiambu',
      websiteUrl: 'https://alliancehighschool.sc.ke',
      procurementUrl: 'https://alliancehighschool.sc.ke/procurement'
    },
    category: 'ICT & Software',
    subcategories: ['school management system', 'software development', 'computers', 'structured cabling', 'biometrics'],
    procurementMethod: 'Open National Tender',
    publicationDate: '2026-08-25',
    closingDate: '2026-09-18',
    budgetMin: 3500000,
    budgetMax: 7500000,
    agpoCategory: 'Youth & Women Eligible',
    county: 'Kiambu',
    status: 'Active',
    submissionMethod: 'Physical Tender Box',
    physicalSubmissionAddress: 'Tender Box, Administration Block, Alliance High School, Kikuyu',
    documentUrl: 'https://alliancehighschool.sc.ke/tenders/AHS-T-04-2026.pdf',
    mandatoryDocuments: ['Valid KRA Tax Compliance Certificate', 'CR12 Form', 'AGPO Certificate', 'NCA 7 or Higher for Structured Cabling']
  },
  {
    id: 't-002',
    ocid: 'ocds-k45-ke-jkf-2026-012',
    tenderNumber: 'JKF/T/09/2026-2027',
    title: 'Provision of Cloud-Based Digital Learning Platform & Mobile Application Development',
    description: 'Design, cloud hosting, payment integration (M-Pesa Express), and mobile app development (Android/iOS) for JKF e-publishing curriculum materials and interactive quizzes.',
    organization: {
      id: 'org-jkf',
      name: 'Jomo Kenyatta Foundation',
      type: 'parastatal',
      county: 'Nairobi',
      websiteUrl: 'https://jkf.co.ke',
      procurementUrl: 'https://jkf.co.ke/tenders'
    },
    category: 'Software Development',
    subcategories: ['mobile app', 'cloud platform', 'e-learning', 'm-pesa integration', 'web development'],
    procurementMethod: 'Open National Tender',
    publicationDate: '2026-08-28',
    closingDate: '2026-09-15',
    budgetMin: 4000000,
    budgetMax: 8000000,
    agpoCategory: 'Open',
    county: 'Nairobi',
    status: 'Active',
    submissionMethod: 'e-GP',
    egpUrl: 'https://egpkenya.go.ke/portal/tender/JKF-T-09-2026',
    documentUrl: 'https://jkf.co.ke/procurement/JKF-T-09.pdf',
    mandatoryDocuments: ['Valid KRA Tax Compliance Certificate', 'CR12 Form', 'Valid ICT Authority (ICTA) Accreditation Level 3']
  },
  {
    id: 't-003',
    ocid: 'ocds-k45-ke-ku-2026-088',
    tenderNumber: 'KU/T/21/2026-2027',
    title: 'Supply, Delivery, Testing & Commissioning of Enterprise Network Switches, Routers & Wi-Fi 6 Access Points',
    description: 'Supply and configuration of 60 managed PoE+ access switches, core routing upgrades, and 120 campus-wide outdoor/indoor Wi-Fi 6 access points for student hostels.',
    organization: {
      id: 'org-ku',
      name: 'Kenyatta University',
      type: 'university',
      county: 'Nairobi',
      websiteUrl: 'https://ku.ac.ke',
      procurementUrl: 'https://ku.ac.ke/tenders'
    },
    category: 'Networking & Telecommunications',
    subcategories: ['network switches', 'cisco/aruba routing', 'wifi access points', 'cabling', 'firewall'],
    procurementMethod: 'Open National Tender',
    publicationDate: '2026-08-20',
    closingDate: '2026-09-10',
    budgetMin: 12000000,
    budgetMax: 18000000,
    agpoCategory: 'Open',
    county: 'Nairobi',
    status: 'Active',
    submissionMethod: 'e-GP',
    egpUrl: 'https://egpkenya.go.ke/portal/tender/KU-T-21-2026',
    documentUrl: 'https://ku.ac.ke/procurement/KU-T-21.pdf',
    mandatoryDocuments: ['Valid KRA Tax Compliance Certificate', 'CR12 Form', 'Manufacturer Authorization Form (MAF)', 'KES 200,000 Tender Security Bond']
  },
  {
    id: 't-004',
    ocid: 'ocds-k45-ke-kplc-2026-301',
    tenderNumber: 'KP1/9A.2/OT/08/26-27',
    title: 'Design, Supply and Installation of Grid-Tied Solar Photovoltaic (PV) Systems with Battery Energy Storage',
    description: 'Turnkey engineering, procurement and construction of commercial solar installations across 8 regional KPLC depots including smart inverters and remote monitoring telemetry.',
    organization: {
      id: 'org-kplc',
      name: 'Kenya Power & Lighting Company (KPLC)',
      type: 'parastatal',
      county: 'Nairobi',
      websiteUrl: 'https://kplc.co.ke',
      procurementUrl: 'https://kplc.co.ke/tenders'
    },
    category: 'Solar & Electrical',
    subcategories: ['solar pv', 'battery storage', 'inverters', 'electrical engineering', 'monitoring'],
    procurementMethod: 'Open International Tender',
    publicationDate: '2026-08-15',
    closingDate: '2026-09-30',
    budgetMin: 25000000,
    budgetMax: 45000000,
    agpoCategory: 'Open',
    county: 'Nairobi',
    status: 'Active',
    submissionMethod: 'e-GP',
    egpUrl: 'https://egpkenya.go.ke/portal/tender/KP1-SOLAR-08',
    documentUrl: 'https://kplc.co.ke/procurement/KP1-SOLAR.pdf',
    mandatoryDocuments: ['EPRA Solar PV Contractor License Class V1', 'NCA 1 Electrical', 'Audited Accounts (Last 3 Years)', 'KES 500,000 Bank Guarantee']
  },
  {
    id: 't-005',
    ocid: 'ocds-k45-ke-kiambu-2026-104',
    tenderNumber: 'CGK/HEALTH/T/03/2026-2027',
    title: 'Supply and Installation of Automated Hospital Revenue Collection System and Biometric Patient Registration',
    description: 'Deployment of automated point-of-sale hospital billing software, patient queue management, and POS terminal integration for Thika Level 5 and Gatundu Level 4 hospitals.',
    organization: {
      id: 'org-cgk',
      name: 'County Government of Kiambu',
      type: 'county',
      county: 'Kiambu',
      websiteUrl: 'https://kiambu.go.ke',
      procurementUrl: 'https://kiambu.go.ke/tenders'
    },
    category: 'Software & Healthcare IT',
    subcategories: ['hospital erp', 'revenue collection', 'pos terminals', 'biometrics', 'system integration'],
    procurementMethod: 'Open National Tender',
    publicationDate: '2026-08-29',
    closingDate: '2026-09-22',
    budgetMin: 8000000,
    budgetMax: 14000000,
    agpoCategory: 'Youth & Women Eligible',
    county: 'Kiambu',
    status: 'Active',
    submissionMethod: 'e-GP',
    egpUrl: 'https://egpkenya.go.ke/portal/tender/CGK-HEALTH-T-03',
    documentUrl: 'https://kiambu.go.ke/procurement/CGK-HEALTH-T-03.pdf',
    mandatoryDocuments: ['Valid KRA Tax Compliance Certificate', 'CR12 Form', 'AGPO Certificate', 'Single Business Permit (Kiambu County)']
  },
  {
    id: 't-006',
    ocid: 'ocds-k45-ke-makueni-2026-209',
    tenderNumber: 'GOM/WATER/08/2026-2027',
    title: 'Solarization of 15 Community Boreholes with Hybrid Solar Pumping Systems',
    description: 'Supply, installation and commissioning of high-yield submersible solar water pumps, solar PV arrays (10kW each), inverter controllers and remote IoT water meter monitoring.',
    organization: {
      id: 'org-makueni',
      name: 'County Government of Makueni',
      type: 'county',
      county: 'Makueni',
      websiteUrl: 'https://makueni.go.ke',
      procurementUrl: 'https://makueni.go.ke/tenders'
    },
    category: 'Solar & Water Engineering',
    subcategories: ['solar water pumping', 'borehole solarization', 'submersible pumps', 'iot water monitoring'],
    procurementMethod: 'Open National Tender',
    publicationDate: '2026-08-22',
    closingDate: '2026-09-14',
    budgetMin: 15000000,
    budgetMax: 22000000,
    agpoCategory: 'Open',
    county: 'Makueni',
    status: 'Active',
    submissionMethod: 'Physical Tender Box',
    physicalSubmissionAddress: 'Tender Box, Department of Water & Sanitation, Wote, Makueni County HQ',
    documentUrl: 'https://makueni.go.ke/procurement/GOM-WATER-08.pdf',
    mandatoryDocuments: ['EPRA Solar License', 'NCA 6 Water Works', 'KRA Tax Compliance', 'CR12']
  }
];

export const DEMO_PROFILES: CompanyProfile[] = [
  {
    id: 'prof-1',
    companyName: 'Edurich Tech Solutions Ltd',
    capabilities: ['software development', 'school management system', 'mobile app', 'cloud platform', 'web development', 'biometrics'],
    targetIndustries: ['school', 'university', 'parastatal', 'county'],
    targetCounties: ['Nairobi', 'Kiambu', 'Nakuru', 'National'],
    minBudget: 500000,
    maxBudget: 20000000,
    agpoStatus: 'Youth'
  },
  {
    id: 'prof-2',
    companyName: 'Solaris Energy & Networks East Africa',
    capabilities: ['solar pv', 'solar water pumping', 'battery storage', 'inverters', 'network switches', 'structured cabling'],
    targetIndustries: ['parastatal', 'county', 'university'],
    targetCounties: ['Nairobi', 'Kiambu', 'Makueni', 'National'],
    minBudget: 2000000,
    maxBudget: 50000000,
    agpoStatus: 'None'
  }
];

export const HISTORICAL_AWARDS: HistoricalAward[] = [
  {
    id: 'aw-1',
    organizationName: 'Alliance High School',
    category: 'ICT & Software',
    supplierName: 'Sysnet Solutions Kenya Ltd',
    amountKes: 4200000,
    awardDate: '2025-09-15',
    nextPredictedCycle: 'August / September 2026'
  },
  {
    id: 'aw-2',
    organizationName: 'Kenyatta University',
    category: 'Networking & Telecommunications',
    supplierName: 'Dimension Data East Africa',
    amountKes: 16500000,
    awardDate: '2025-08-20',
    nextPredictedCycle: 'August / September 2026'
  },
  {
    id: 'aw-3',
    organizationName: 'Kenya Power & Lighting Company (KPLC)',
    category: 'Solar & Electrical',
    supplierName: 'Solarise Africa Kenya Ltd',
    amountKes: 38000000,
    awardDate: '2024-09-12',
    nextPredictedCycle: 'August / September 2025'
  }
];

export const MARKET_CATEGORY_SPEND: MarketCategorySpend[] = [
  { category: 'Solar & Electrical', totalMarketValue: 45000000, activeTenderCount: 1, avgContractValue: 45000000 },
  { category: 'Solar & Water Engineering', totalMarketValue: 22000000, activeTenderCount: 1, avgContractValue: 22000000 },
  { category: 'Networking & Telecommunications', totalMarketValue: 18000000, activeTenderCount: 1, avgContractValue: 18000000 },
  { category: 'Software & Healthcare IT', totalMarketValue: 14000000, activeTenderCount: 1, avgContractValue: 14000000 },
  { category: 'Software Development', totalMarketValue: 8000000, activeTenderCount: 1, avgContractValue: 8000000 },
  { category: 'ICT & Software', totalMarketValue: 7500000, activeTenderCount: 1, avgContractValue: 7500000 }
];
