/**
 * proQ Kenya - Neon PostgreSQL Batch Seeder & Deduplicator
 * 
 * Safely inserts or updates tenders into the Neon serverless PostgreSQL database.
 * Enforces ON CONFLICT (reference_number) DO UPDATE to eliminate duplicate records.
 */

import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!DATABASE_URL) {
  console.log('ℹ️ DATABASE_URL environment variable is not set.');
  console.log('To push to your live Neon database, run:');
  console.log('  $env:DATABASE_URL="postgres://..."; node scripts/seedNeon.mjs');
  process.exit(0);
}

const sql = neon(DATABASE_URL);

async function seed() {
  console.log('Connecting to Neon PostgreSQL...');

  // 1. Ensure Table Exists
  await sql`
    CREATE TABLE IF NOT EXISTS tenders (
      id VARCHAR(64) PRIMARY KEY,
      reference_number VARCHAR(128) NOT NULL UNIQUE,
      title TEXT NOT NULL,
      procuring_entity TEXT NOT NULL,
      entity_type VARCHAR(64) NOT NULL,
      category VARCHAR(64) NOT NULL,
      procurement_method VARCHAR(64) NOT NULL,
      agpo_category VARCHAR(32) NOT NULL DEFAULT 'Open',
      county VARCHAR(64) NOT NULL,
      estimated_value BIGINT,
      currency VARCHAR(8) DEFAULT 'KES',
      published_date TIMESTAMPTZ NOT NULL,
      closing_date TIMESTAMPTZ NOT NULL,
      status VARCHAR(32) NOT NULL DEFAULT 'active',
      source VARCHAR(64) NOT NULL,
      source_url TEXT,
      portal_url TEXT,
      submission_venue TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_tenders_ref ON tenders(reference_number);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_tenders_closing ON tenders(closing_date);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_tenders_county ON tenders(county);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_tenders_category ON tenders(category);`;

  console.log('✅ Tables and indices verified.');

  // 2. Load Tenders
  const fileContent = fs.readFileSync(path.resolve('./src/lib/tenderData.ts'), 'utf8');
  const match = fileContent.match(/export const mockTenders: Tender\[\] = (\[[\s\S]*?\]);/);
  if (!match) throw new Error('Could not find mockTenders');
  const tenders = eval(match[1]);

  console.log(`Loaded ${tenders.length} tenders. Beginning deduplicated batch upsert...`);

  let insertedCount = 0;
  let updatedCount = 0;

  // Process in batches of 25 to avoid connection overload
  const BATCH_SIZE = 25;
  for (let i = 0; i < tenders.length; i += BATCH_SIZE) {
    const chunk = tenders.slice(i, i + BATCH_SIZE);

    await Promise.all(
      chunk.map(async (t) => {
        const ref = t.referenceNumber.trim().toUpperCase();
        await sql`
          INSERT INTO tenders (
            id, reference_number, title, procuring_entity, entity_type,
            category, procurement_method, agpo_category, county,
            estimated_value, published_date, closing_date, status,
            source, portal_url, submission_venue, updated_at
          ) VALUES (
            ${t.id},
            ${ref},
            ${t.title},
            ${t.procuringEntity},
            ${t.entityType},
            ${t.category},
            ${t.procurementMethod},
            ${t.agpoCategory},
            ${t.county},
            ${t.estimatedValue || null},
            ${new Date(t.publishedDate)},
            ${new Date(t.closingDate)},
            ${t.status || 'active'},
            ${t.source || 'e-GP Kenya'},
            ${t.egpLink || t.documentUrl || 'https://tenders.go.ke/tenders'},
            ${t.submissionVenue || 'e-GP'},
            NOW()
          )
          ON CONFLICT (reference_number) DO UPDATE SET
            title = EXCLUDED.title,
            closing_date = EXCLUDED.closing_date,
            status = EXCLUDED.status,
            estimated_value = EXCLUDED.estimated_value,
            portal_url = EXCLUDED.portal_url,
            updated_at = NOW();
        `;
        insertedCount++;
      })
    );

    process.stdout.write(`Processed ${Math.min(i + BATCH_SIZE, tenders.length)} / ${tenders.length} tenders...\r`);
  }

  console.log(`\n🎉 Successfully upserted ${insertedCount} deduplicated tenders into Neon DB!`);
}

seed().catch(err => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
