export type OrgType = 'school' | 'university' | 'parastatal' | 'county' | 'ministry' | 'ngo' | 'hospital';

export type AGPOCategory = 'Open' | 'Youth' | 'Women' | 'PWD' | 'Youth & Women Eligible';

export type SubmissionMethod = 'e-GP' | 'Physical Tender Box' | 'Direct Portal';

export type TenderStatus = 'Active' | 'Closing Soon' | 'Closed' | 'Awarded' | 'Cancelled';

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  county: string;
  websiteUrl?: string;
  procurementUrl?: string;
}

export interface Tender {
  id: string;
  ocid?: string;
  tenderNumber: string;
  title: string;
  description: string;
  organization: Organization;
  category: string;
  subcategories: string[];
  procurementMethod: string;
  publicationDate: string;
  closingDate: string;
  budgetMin: number;
  budgetMax: number;
  agpoCategory: AGPOCategory;
  county: string;
  status: TenderStatus;
  submissionMethod: SubmissionMethod;
  egpUrl?: string;
  physicalSubmissionAddress?: string;
  documentUrl?: string;
  mandatoryDocuments: string[];
}

export interface CompanyProfile {
  id: string;
  companyName: string;
  capabilities: string[];
  targetIndustries: OrgType[];
  targetCounties: string[];
  minBudget: number;
  maxBudget: number;
  agpoStatus: 'None' | 'Youth' | 'Women' | 'PWD';
}

export interface MatchResult {
  tender: Tender;
  matchScore: number; // 0 - 100
  capabilityScore: number;
  industryScore: number;
  geoScore: number;
  budgetScore: number;
  eligibilityScore: number;
  timelineScore: number;
  matchReasons: string[];
  badge: 'Hot Fit' | 'High Fit' | 'Moderate Fit' | 'Low Fit';
}

export interface HistoricalAward {
  id: string;
  organizationName: string;
  category: string;
  supplierName: string;
  amountKes: number;
  awardDate: string;
  nextPredictedCycle: string;
}

export interface MarketCategorySpend {
  category: string;
  totalMarketValue: number;
  activeTenderCount: number;
  avgContractValue: number;
}
