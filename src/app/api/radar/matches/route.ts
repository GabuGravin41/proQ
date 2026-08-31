import { NextResponse } from 'next/server';
import { BENCHMARK_TENDERS, DEMO_PROFILES } from '@/lib/data';
import { calculateTenderMatch } from '@/lib/scoring';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('profileId') || 'prof-1';

  const profile = DEMO_PROFILES.find(p => p.id === profileId) || DEMO_PROFILES[0];

  const scoredMatches = BENCHMARK_TENDERS
    .filter(t => t.status === 'Active')
    .map(tender => calculateTenderMatch(profile, tender))
    .sort((a, b) => b.matchScore - a.matchScore);

  const hotCount = scoredMatches.filter(m => m.badge === 'Hot Fit').length;
  const highCount = scoredMatches.filter(m => m.badge === 'High Fit').length;

  return NextResponse.json({
    profile,
    stats: {
      totalActive: scoredMatches.length,
      hotMatches: hotCount,
      highMatches: highCount
    },
    matches: scoredMatches
  });
}
