import { mockTenders, Tender } from './tenderData';
import { enrichTenderWithLiveStatus } from './dateUtils';

export interface PlatformStats {
  totalTenders: number;
  totalActive: number;
  closingSoon: number;
  totalMarketValueKes: number;
  formattedTotalValue: string;
  countiesCovered: number;
  agpoTendersCount: number;
  parastatalsCount: number;
  avgTenderValueKes: number;
  formattedAvgValue: string;
}

export function calculatePlatformStats(tenders: Tender[] = mockTenders): PlatformStats {
  const enriched = tenders.map(t => enrichTenderWithLiveStatus(t));
  const active = enriched.filter(t => t.status === 'active' || t.status === 'closing-soon');
  const closingSoon = enriched.filter(t => t.daysRemaining <= 3 && t.daysRemaining > 0);
  
  const totalValue = active.reduce((sum, t) => sum + (t.estimatedValue ?? 0), 0);
  const counties = new Set(enriched.map(t => t.county));
  const agpo = active.filter(t => t.agpoCategory !== 'Open');
  const parastatals = active.filter(t => t.entityType === 'Parastatal' || t.entityType === 'Ministry');

  const avgValue = active.length > 0 ? Math.round(totalValue / active.length) : 0;

  const formatValue = (val: number) => {
    if (val >= 1_000_000_000) return `KES ${(val / 1_000_000_000).toFixed(1)}B`;
    if (val >= 1_000_000) return `KES ${(val / 1_000_000).toFixed(0)}M`;
    return `KES ${val.toLocaleString()}`;
  };

  return {
    totalTenders: tenders.length,
    totalActive: active.length,
    closingSoon: closingSoon.length,
    totalMarketValueKes: totalValue,
    formattedTotalValue: formatValue(totalValue),
    countiesCovered: counties.size,
    agpoTendersCount: agpo.length,
    parastatalsCount: parastatals.length,
    avgTenderValueKes: avgValue,
    formattedAvgValue: formatValue(avgValue),
  };
}
