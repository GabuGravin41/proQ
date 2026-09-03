import { NextResponse } from 'next/server';
import { searchTendersWithAI } from '@/lib/tenderMetadata';
import { DEMO_PROFILES } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('profileId') || 'prof-1';
  const q = searchParams.get('q') || '';
  const county = searchParams.get('county') || '';
  const agpo = searchParams.get('agpo') || '';

  const demoProfile = DEMO_PROFILES.find(p => p.id === profileId) || DEMO_PROFILES[0];

  const profile = {
    capabilities: demoProfile.capabilities,
    targetSectors: demoProfile.targetIndustries,
    targetCounties: county ? [county] : demoProfile.targetCounties,
    minBudget: demoProfile.minBudget,
    maxBudget: demoProfile.maxBudget,
    agpoStatus: (agpo as any) || demoProfile.agpoStatus,
  };

  const matches = searchTendersWithAI({
    userPrompt: q,
    profile,
    limit: 50,
    includeClosed: false,
  });

  const hotCount = matches.filter(m => m.badge === 'Hot Fit').length;
  const highCount = matches.filter(m => m.badge === 'High Fit').length;

  return NextResponse.json({
    profile: demoProfile,
    stats: {
      totalActive: matches.length,
      hotMatches: hotCount,
      highMatches: highCount,
    },
    matches,
  });
}
