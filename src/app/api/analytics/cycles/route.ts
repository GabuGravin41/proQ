import { NextResponse } from 'next/server';
import { HISTORICAL_AWARDS, MARKET_CATEGORY_SPEND } from '@/lib/data';

export async function GET() {
  const totalTrackedVolume = MARKET_CATEGORY_SPEND.reduce((acc, curr) => acc + curr.totalMarketValue, 0);

  return NextResponse.json({
    totalMarketVolumeKes: totalTrackedVolume,
    categorySpend: MARKET_CATEGORY_SPEND,
    upcomingCycles: HISTORICAL_AWARDS
  });
}
