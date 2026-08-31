import { NextRequest, NextResponse } from 'next/server';
import { queryNeon } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Vercel Serverless Lifecycle & Database Maintenance Cron
 * Schedule: "0 21 * * *" (Midnight 00:00 EAT / 21:00 UTC)
 *
 * 1. Transitions expired tenders from 'active' to 'closed'
 * 2. Purges records that have been closed for more than 30 days
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  const today = new Date().toISOString().split('T')[0];

  try {
    // 1. Transition expired tenders from 'active' to 'closed'
    const statusUpdateResult = await queryNeon(
      `UPDATE tenders
       SET status = 'closed', updated_at = NOW()
       WHERE status = 'active' AND closing_date < $1`,
      [today]
    );

    // 2. Permanently delete tenders closed more than 30 days ago (30-day retention policy)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const purgeResult = await queryNeon(
      `DELETE FROM tenders
       WHERE status IN ('closed', 'awarded', 'cancelled')
       AND closing_date < $1`,
      [thirtyDaysAgo]
    );

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tendersMovedToClosed: statusUpdateResult.rowCount,
      tendersPurgedOlderThan30Days: purgeResult.rowCount,
      retentionCutoffDate: thirtyDaysAgo,
      durationMs,
      message: `Lifecycle sync complete: ${statusUpdateResult.rowCount} transitioned to closed, ${purgeResult.rowCount} purged (30-day rule).`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, durationMs: Date.now() - startTime },
      { status: 500 }
    );
  }
}
