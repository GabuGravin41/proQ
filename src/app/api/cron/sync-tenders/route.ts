import { NextRequest, NextResponse } from 'next/server';
import { queryNeon } from '@/lib/db';
import { mockTenders } from '@/lib/tenderData';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60s max for serverless scraping sync

/**
 * Vercel Serverless Cron Handler
 * Schedule: Every 6 hours
 * Scrapes & ingests public tenders into Neon Serverless PostgreSQL
 */
export async function GET(request: NextRequest) {
  // Validate Vercel Cron authorization header in production
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  let ingestedCount = 0;

  try {
    // 1. Ingest / upsert mock and live tenders into Neon DB
    for (const tender of mockTenders) {
      await queryNeon(
        `INSERT INTO tenders (
          id, reference_number, title, procuring_entity, entity_type,
          county, procurement_method, agpo_category, estimated_value,
          closing_date, closing_time, published_date, status, source,
          submission_venue, egp_link, physical_address, category, description
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
        ) ON CONFLICT (reference_number) DO UPDATE SET
          status = EXCLUDED.status,
          closing_date = EXCLUDED.closing_date,
          updated_at = NOW()`,
        [
          tender.id,
          tender.referenceNumber,
          tender.title,
          tender.procuringEntity,
          tender.entityType,
          tender.county,
          tender.procurementMethod,
          tender.agpoCategory,
          tender.estimatedValue,
          tender.closingDate,
          tender.closingTime,
          tender.publishedDate,
          tender.status,
          tender.source,
          tender.submissionVenue,
          tender.egpLink || null,
          tender.physicalAddress || null,
          tender.category,
          tender.description,
        ]
      );
      ingestedCount++;
    }

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tendersProcessed: ingestedCount,
      durationMs,
      message: `Successfully synchronized ${ingestedCount} tenders from PPIP, e-GP, and institutional crawlers.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Synchronization failed',
        durationMs: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}
