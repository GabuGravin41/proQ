/**
 * proQ Kenya - Tender Metadata, AI Search & Disqualification Intelligence
 * High-performance metadata indexing, AI matching, and detailed tender explanation engine.
 */

import { mockTenders, Tender } from './tenderData';
import { enrichTenderWithLiveStatus, LiveTenderStatus } from './dateUtils';

export interface PreBidIntelligence {
  tenderFeeKes: number;
  bidBondAmountKes: number;
  bidBondValidityDays: number;
  siteVisitRequired: boolean;
  siteVisitDate?: string;
  siteVisitLocation?: string;
  ncaCategory?: string;
  ncaClassRequired?: number;
  isAgpoReserved: boolean;
  agpoType: 'Open' | 'Youth' | 'Women' | 'PWD' | 'Youth & Women Eligible';
  mandatoryDocuments: string[];
  keyRisks: string[];
}

export interface TenderAIMetadata {
  id: string;
  referenceNumber: string;
  title: string;
  procuringEntity: string;
  entityType: string;
  county: string;
  category: string;
  subcategories: string[];
  estimatedValue: number | null;
  closingDate: string;
  closingTime: string;
  publishedDate: string;
  status: LiveTenderStatus;
  daysRemaining: number;
  liveCountdown: string;
  submissionVenue: 'e-GP' | 'Physical';
  egpLink?: string;
  documentUrl: string | null;
  intelligence: PreBidIntelligence;
  aiExecutiveSummary: string;
  applicationGuidance: {
    portalName: string;
    portalUrl: string;
    submissionSteps: string[];
    hardDeadline: string;
  };
}

export interface AIMatchOptions {
  userPrompt?: string;
  profile?: {
    capabilities?: string[];
    targetSectors?: string[];
    targetCounties?: string[];
    minBudget?: number;
    maxBudget?: number;
    agpoStatus?: 'Youth' | 'Women' | 'PWD' | 'None';
  };
  limit?: number;
  includeClosed?: boolean;
}

export interface AIMatchResult {
  metadata: TenderAIMetadata;
  matchScore: number;
  matchReasons: string[];
  highlights: string[];
  badge: 'Hot Fit' | 'High Fit' | 'Moderate Fit' | 'Low Fit';
}

/**
 * Extracts deep pre-bid compliance intelligence from a tender
 */
export function extractTenderIntelligence(tender: Tender): PreBidIntelligence {
  const titleAndDesc = `${tender.title} ${tender.description} ${tender.category}`.toLowerCase();
  
  // Bid bond estimation: typically 1% - 2% of estimated value or 0 for AGPO
  const isAgpo = tender.agpoCategory !== 'Open';
  let bidBond = 0;
  if (!isAgpo && tender.estimatedValue) {
    bidBond = Math.round(tender.estimatedValue * 0.015);
  }

  // Site visit detection
  const hasSiteVisit = titleAndDesc.includes('site visit') ||
    titleAndDesc.includes('pre-bid') ||
    titleAndDesc.includes('inspection') ||
    tender.category.includes('Roads') ||
    tender.category.includes('Construction') ||
    tender.category.includes('Water');

  // Mandatory statutory documents under Kenyan PPADA 2015
  const mandatoryDocs = [
    'Valid KRA Tax Compliance Certificate (verifiable online via KRA TCC checker)',
    'Certificate of Incorporation / Registration of Business Name',
    'CR12 Certificate (issued within last 12 months with Directors ID copies)',
    'Single Business Permit from relevant County Government',
  ];

  if (isAgpo) {
    mandatoryDocs.push(`Valid National Treasury AGPO Certificate (${tender.agpoCategory} Category)`);
  } else if (bidBond > 0) {
    mandatoryDocs.push(`Original Tender Security (Bid Bond) of KES ${bidBond.toLocaleString()} valid for 150 days from closing date`);
  }

  if (tender.category.includes('Roads') || tender.category.includes('Construction')) {
    mandatoryDocs.push('Valid National Construction Authority (NCA) Registration Certificate (Roads / Building Class)');
    mandatoryDocs.push('Current Annual NCA Contractor Practicing License');
  }

  if (tender.category.includes('ICT') || tender.category.includes('Software')) {
    mandatoryDocs.push('ICT Authority (ICTA) Accreditation Certificate');
    mandatoryDocs.push('Manufacturer Authorization Form (MAF) from OEM partners');
  }

  if (tender.category.includes('Healthcare') || tender.category.includes('Medical')) {
    mandatoryDocs.push('Pharmacy and Poisons Board (PPB) Premises Registration');
    mandatoryDocs.push('Good Distribution Practices (GDP) Compliance Certificate');
  }

  // Critical Risks & Watch-Outs
  const keyRisks: string[] = [];

  if (!isAgpo && bidBond > 0) {
    keyRisks.push(`STRICT BID BOND VALIDITY: Must be valid for 150 calendar days from the opening date. Bids with 120-day or shorter bonds will be disqualified automatically.`);
  }

  if (hasSiteVisit) {
    keyRisks.push(`MANDATORY SITE INSPECTION: Site visit certificate signed by the Procuring Entity's representative is mandatory. Failure to attend disqualifies your bid before evaluation.`);
  }

  if (tender.submissionVenue === 'e-GP') {
    keyRisks.push(`ELECTRONIC SUBMISSION ONLY: Bids must be uploaded to e-GP Kenya portal before 10:00 AM EAT. Scanned files must not exceed 25MB and must be encrypted via portal key.`);
  } else {
    keyRisks.push(`PHYSICAL TENDER BOX: Delivered in two hard copies (Original + Copy) sealed in separate envelopes and placed in the designated tender box at ${tender.procuringEntity}.`);
  }

  if (isAgpo) {
    keyRisks.push(`AGPO QUOTA ELIGIBILITY: 100% reserved for ${tender.agpoCategory}-owned enterprises. Main company bank statements and ownership structure will be verified against CR12.`);
  }

  return {
    tenderFeeKes: tender.estimatedValue && tender.estimatedValue > 10_000_000 ? 1000 : 0,
    bidBondAmountKes: bidBond,
    bidBondValidityDays: isAgpo ? 0 : 150,
    siteVisitRequired: hasSiteVisit,
    siteVisitDate: hasSiteVisit ? '5 to 7 days before tender closing' : undefined,
    siteVisitLocation: hasSiteVisit ? `${tender.procuringEntity} Regional Works Yard, ${tender.county}` : undefined,
    ncaCategory: tender.category.includes('Roads') ? 'NCA Roads & Civil Works' : undefined,
    isAgpoReserved: isAgpo,
    agpoType: tender.agpoCategory,
    mandatoryDocuments: mandatoryDocs,
    keyRisks,
  };
}

/**
 * Generates an indexable, fast metadata object for a tender
 */
export function buildTenderMetadata(tender: Tender): TenderAIMetadata {
  const enriched = enrichTenderWithLiveStatus(tender);
  const intelligence = extractTenderIntelligence(tender);

  const subcats = [
    tender.category,
    tender.county,
    tender.agpoCategory,
    tender.procuringEntity,
    ...(tender.description.toLowerCase().split(/[\s,.;]+/).filter(w => w.length > 4).slice(0, 10)),
  ];

  const portalName = tender.submissionVenue === 'e-GP' ? 'e-GP Kenya National Portal' : 'Public Procurement Information Portal (PPIP)';
  const portalUrl = tender.egpLink || tender.documentUrl || 'https://tenders.go.ke/tenders';

  const submissionSteps = tender.submissionVenue === 'e-GP' ? [
    `Log in to ${portalName} (${portalUrl})`,
    `Search for Reference Number: ${tender.referenceNumber}`,
    `Download official addenda, clarifications and final Bill of Quantities (BOQ)`,
    `Prepare and sign all mandatory statutory forms (TCC, CR12, AGPO/Bid Bond)`,
    `Complete priced BOQ schedule in KES inclusive of 16% VAT`,
    `Upload all encrypted PDF packages and submit receipt before ${tender.closingTime} on ${enriched.closingDate}`
  ] : [
    `Download tender document from ${portalUrl}`,
    `Attend mandatory site inspection if required (obtain signed Site Visit Certificate)`,
    `Obtain valid KRA TCC, CR12, and sealed Bid Bond`,
    `Bind bid in Two Envelopes: "Technical Proposal" and "Financial Proposal"`,
    `Deliver sealed package to ${tender.procuringEntity} Tender Box before ${tender.closingTime} on ${enriched.closingDate}`
  ];

  return {
    id: tender.id,
    referenceNumber: tender.referenceNumber,
    title: tender.title,
    procuringEntity: tender.procuringEntity,
    entityType: tender.entityType,
    county: tender.county,
    category: tender.category,
    subcategories: Array.from(new Set(subcats)),
    estimatedValue: tender.estimatedValue,
    closingDate: tender.closingDate,
    closingTime: tender.closingTime,
    publishedDate: tender.publishedDate,
    status: enriched.status,
    daysRemaining: enriched.daysRemaining,
    liveCountdown: enriched.liveCountdown,
    submissionVenue: tender.submissionVenue,
    egpLink: tender.egpLink,
    documentUrl: tender.documentUrl,
    intelligence,
    aiExecutiveSummary: `Procurement notice issued by ${tender.procuringEntity} for "${tender.title}". ` +
      `Categorized under ${tender.category} within ${tender.county} County. ` +
      `Estimated budget is ${tender.estimatedValue ? `KES ${(tender.estimatedValue).toLocaleString()}` : 'Undisclosed'}. ` +
      `Eligibility: ${tender.agpoCategory} scheme. Submission mode is ${tender.submissionVenue}.`,
    applicationGuidance: {
      portalName,
      portalUrl,
      submissionSteps,
      hardDeadline: `${tender.closingTime} EAT on ${enriched.closingDate} (${enriched.liveCountdown})`,
    }
  };
}

// Global cached metadata array
let _cachedMetadata: TenderAIMetadata[] | null = null;

export function getAllTendersMetadata(): TenderAIMetadata[] {
  if (!_cachedMetadata) {
    _cachedMetadata = mockTenders.map(t => buildTenderMetadata(t));
  }
  return _cachedMetadata;
}

/**
 * AI Tender Matcher & Recommendation Engine
 * Matches contractor profile + natural language prompt against pre-indexed tender metadata.
 */
export function searchTendersWithAI(options: AIMatchOptions): AIMatchResult[] {
  const allTenders = getAllTendersMetadata();
  const { userPrompt = '', profile, limit = 20, includeClosed = false } = options;

  const promptTokens = userPrompt.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const profileCaps = (profile?.capabilities || []).map(c => c.toLowerCase());
  const profileSectors = (profile?.targetSectors || []).map(s => s.toLowerCase());
  const profileCounties = (profile?.targetCounties || []).map(c => c.toLowerCase());
  const profileAgpo = (profile?.agpoStatus || 'None').toLowerCase();
  const minBudget = profile?.minBudget ?? 0;
  const maxBudget = profile?.maxBudget ?? 1_000_000_000;

  const results: AIMatchResult[] = [];

  for (const item of allTenders) {
    // Filter closed unless requested
    if (!includeClosed && item.status === 'closed') {
      continue;
    }

    let score = 50; // base score
    const reasons: string[] = [];
    const highlights: string[] = [];

    const searchableText = `${item.title} ${item.procuringEntity} ${item.category} ${item.county} ${item.intelligence.agpoType} ${item.subcategories.join(' ')}`.toLowerCase();

    // 1. User Prompt Keywords Match
    if (promptTokens.length > 0) {
      let matchedPrompt = 0;
      promptTokens.forEach(token => {
        if (searchableText.includes(token)) {
          matchedPrompt++;
        }
      });
      const promptRatio = matchedPrompt / promptTokens.length;
      score += Math.round(promptRatio * 30);
      if (promptRatio > 0.3) {
        reasons.push(`Strong keyword match for your prompt`);
      }
    }

    // 2. Capability Alignment
    if (profileCaps.length > 0) {
      const matchedCaps = profileCaps.filter(cap => searchableText.includes(cap));
      if (matchedCaps.length > 0) {
        score += Math.min(20, matchedCaps.length * 7);
        reasons.push(`Matches your core capabilities: ${matchedCaps.slice(0, 2).join(', ')}`);
        highlights.push(`Aligned with ${matchedCaps[0]}`);
      }
    }

    // 3. County Alignment
    if (profileCounties.length > 0) {
      const matchesCounty = profileCounties.includes(item.county.toLowerCase()) || profileCounties.includes('national');
      if (matchesCounty) {
        score += 12;
        reasons.push(`Located in your operational zone (${item.county} County)`);
        highlights.push(`${item.county} County target`);
      }
    }

    // 4. Sector Alignment
    if (profileSectors.length > 0) {
      const matchesSector = profileSectors.some(sec => item.category.toLowerCase().includes(sec) || item.entityType.toLowerCase().includes(sec));
      if (matchesSector) {
        score += 10;
        reasons.push(`Target industry fit: ${item.category}`);
      }
    }

    // 5. AGPO Eligibility Boost
    const tenderAgpoLower = item.intelligence.agpoType.toLowerCase();
    if (profileAgpo !== 'none' && (tenderAgpoLower.includes(profileAgpo) || tenderAgpoLower.includes('youth') || tenderAgpoLower.includes('women'))) {
      score += 15;
      reasons.push(`AGPO Quota Advantage: Reserved for ${item.intelligence.agpoType}`);
      highlights.push(`30% AGPO Reserved (${item.intelligence.agpoType})`);
    } else if (tenderAgpoLower.includes('open')) {
      score += 5;
    }

    // 6. Budget Capacity
    if (item.estimatedValue) {
      if (item.estimatedValue >= minBudget && item.estimatedValue <= maxBudget) {
        score += 10;
        reasons.push(`Within your bidding budget (KES ${(item.estimatedValue / 1_000_000).toFixed(1)}M)`);
      } else if (item.estimatedValue > maxBudget) {
        score -= 5;
      }
    }

    // 7. Timeline bonus
    if (item.daysRemaining >= 5) {
      score += 5;
    } else if (item.daysRemaining <= 2) {
      reasons.push(`Urgent: ${item.liveCountdown}`);
    }

    const finalScore = Math.min(99, Math.max(35, score));

    let badge: AIMatchResult['badge'] = 'Low Fit';
    if (finalScore >= 85) badge = 'Hot Fit';
    else if (finalScore >= 70) badge = 'High Fit';
    else if (finalScore >= 55) badge = 'Moderate Fit';

    results.push({
      metadata: item,
      matchScore: finalScore,
      matchReasons: reasons.length > 0 ? reasons : ['General procurement match'],
      highlights,
      badge,
    });
  }

  // Sort descending by matchScore then daysRemaining
  results.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    return a.metadata.daysRemaining - b.metadata.daysRemaining;
  });

  return results.slice(0, limit);
}

/**
 * Comprehensive Tender Breakdown & Explainer
 */
export function explainTenderWithAI(tenderId: string): TenderAIMetadata | null {
  const allTenders = getAllTendersMetadata();
  const found = allTenders.find(t => t.id.toLowerCase() === tenderId.toLowerCase());
  return found || null;
}
