import { CompanyProfile, Tender, MatchResult } from './types';

export function calculateTenderMatch(profile: CompanyProfile, tender: Tender): MatchResult {
  const reasons: string[] = [];

  // 1. Capability Score (Weight: 30%)
  const capabilities = profile.capabilities.map(c => c.toLowerCase().trim());
  const tenderFullText = `${tender.title} ${tender.description} ${tender.category} ${tender.subcategories.join(' ')}`.toLowerCase();
  
  const matchedCaps = capabilities.filter(cap => tenderFullText.includes(cap));
  let capabilityScore = 4;
  if (matchedCaps.length >= 3) {
    capabilityScore = 30;
    reasons.push(`Strong capability alignment on: ${matchedCaps.slice(0, 3).join(', ')}`);
  } else if (matchedCaps.length === 2) {
    capabilityScore = 22;
    reasons.push(`Capability match on: ${matchedCaps.join(' and ')}`);
  } else if (matchedCaps.length === 1) {
    capabilityScore = 14;
    reasons.push(`Direct capability match on '${matchedCaps[0]}'`);
  }

  // 2. Industry / Sector Score (Weight: 20%)
  const targetIndustries = profile.targetIndustries.map(i => i.toLowerCase());
  const orgType = tender.organization.type.toLowerCase();
  let industryScore = 6;
  if (targetIndustries.includes(orgType as any)) {
    industryScore = 20;
    reasons.push(`Target sector alignment (${tender.organization.type.toUpperCase()})`);
  }

  // 3. Geography Score (Weight: 15%)
  const targetCounties = profile.targetCounties.map(c => c.toLowerCase());
  const tenderCounty = tender.county.toLowerCase();
  let geoScore = 5;
  if (targetCounties.includes(tenderCounty) || targetCounties.includes('national')) {
    geoScore = 15;
    reasons.push(`Target geographic zone (${tender.county} County)`);
  }

  // 4. Budget Scale Fit (Weight: 15%)
  const estMax = tender.budgetMax;
  let budgetScore = 6;
  if (estMax >= profile.minBudget && estMax <= profile.maxBudget) {
    budgetScore = 15;
    reasons.push(`Contract value inside target threshold (KES ${estMax.toLocaleString()})`);
  } else if (estMax < profile.minBudget) {
    budgetScore = 8;
    reasons.push(`Contract value below preferred threshold (KES ${estMax.toLocaleString()})`);
  } else {
    budgetScore = 7;
    reasons.push(`High-value contract (KES ${estMax.toLocaleString()})`);
  }

  // 5. AGPO / Eligibility Score (Weight: 10%)
  let eligibilityScore = 5;
  const tenderAgpo = tender.agpoCategory.toLowerCase();
  const profileAgpo = profile.agpoStatus.toLowerCase();
  if (tenderAgpo.includes('open')) {
    eligibilityScore = 10;
    reasons.push('Open national eligibility');
  } else if (profileAgpo !== 'none' && (tenderAgpo.includes(profileAgpo) || tenderAgpo.includes('youth') || tenderAgpo.includes('women'))) {
    eligibilityScore = 10;
    reasons.push(`AGPO Advantage: Eligible under ${tender.agpoCategory}`);
  }

  // 6. Timeline Feasibility (Weight: 10%)
  let timelineScore = 6;
  const today = new Date();
  const closing = new Date(tender.closingDate);
  const diffTime = closing.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (daysLeft >= 10) {
    timelineScore = 10;
    reasons.push(`Comfortable preparation window (${daysLeft} days until deadline)`);
  } else if (daysLeft >= 4) {
    timelineScore = 7;
    reasons.push(`Moderate timeline (${daysLeft} days remaining)`);
  } else if (daysLeft >= 1) {
    timelineScore = 4;
    reasons.push(`Urgent deadline (${daysLeft} days remaining)`);
  } else {
    timelineScore = 0;
    reasons.push('Tender closing today or expired');
  }

  const totalScore = Math.min(100, capabilityScore + industryScore + geoScore + budgetScore + eligibilityScore + timelineScore);

  let badge: MatchResult['badge'] = 'Low Fit';
  if (totalScore >= 85) badge = 'Hot Fit';
  else if (totalScore >= 70) badge = 'High Fit';
  else if (totalScore >= 50) badge = 'Moderate Fit';

  return {
    tender,
    matchScore: totalScore,
    capabilityScore,
    industryScore,
    geoScore,
    budgetScore,
    eligibilityScore,
    timelineScore,
    matchReasons: reasons,
    badge
  };
}
