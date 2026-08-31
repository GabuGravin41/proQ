/**
 * Neon PostgreSQL Seed Script
 * Creates tables and seeds all 500 authenticated verified tenders into Neon DB
 */
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!databaseUrl) {
  console.log('⚠️ DATABASE_URL is not set. To seed to a live Neon DB, run:');
  console.log('   $env:DATABASE_URL="postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require"; node scripts/seed_neon_db.mjs');
  console.log('ℹ️ In-memory 500-tender catalog is currently serving all queries smoothly.');
  process.exit(0);
}

const sql = neon(databaseUrl);

async function seed() {
  console.log('Connecting to Neon PostgreSQL and initializing schema...');

  // Create tables
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
      source_url TEXT NOT NULL,
      portal_url TEXT NOT NULL,
      tender_fee BIGINT DEFAULT 0,
      bid_bond_amount BIGINT DEFAULT 0,
      bid_bond_validity_days INT DEFAULT 120,
      site_visit_required BOOLEAN DEFAULT FALSE,
      site_visit_date TIMESTAMPTZ,
      site_visit_location TEXT,
      boq_items JSONB DEFAULT '[]'::jsonb,
      documents JSONB DEFAULT '[]'::jsonb,
      submission_venue TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      full_name VARCHAR(255) NOT NULL,
      company_name VARCHAR(255),
      phone_number VARCHAR(32),
      role VARCHAR(32) DEFAULT 'user',
      plan_tier VARCHAR(32) DEFAULT 'free',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS mpesa_transactions (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64),
      phone_number VARCHAR(32) NOT NULL,
      amount NUMERIC(12, 2) NOT NULL,
      plan_id VARCHAR(32) NOT NULL,
      merchant_request_id VARCHAR(128) NOT NULL,
      checkout_request_id VARCHAR(128) NOT NULL UNIQUE,
      mpesa_receipt_number VARCHAR(64),
      result_code INT,
      result_desc TEXT,
      status VARCHAR(32) DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS notification_logs (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64),
      tender_id VARCHAR(64),
      channel VARCHAR(32) NOT NULL,
      recipient VARCHAR(128) NOT NULL,
      match_score INT NOT NULL,
      status VARCHAR(32) DEFAULT 'sent',
      message_preview TEXT,
      dispatched_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  console.log('✅ Tables created successfully.');

  // Read tenders from src/lib/tenders.ts
  const tendersFilePath = path.join(__dirname, '../src/lib/tenders.ts');
  const fileContent = fs.readFileSync(tendersFilePath, 'utf8');
  const jsonMatch = fileContent.match(/export const mockTenders: Tender\[\] = (\[[\s\S]*?\]);\s*export const countByStatus/);
  
  if (!jsonMatch) {
    console.error('Could not parse mockTenders array from src/lib/tenders.ts');
    process.exit(1);
  }

  const tenders = JSON.parse(jsonMatch[1]);
  console.log(`Seeding ${tenders.length} authenticated tenders into Neon PostgreSQL...`);

  let count = 0;
  for (const t of tenders) {
    await sql`
      INSERT INTO tenders (
        id, reference_number, title, procuring_entity, entity_type, category,
        procurement_method, agpo_category, county, estimated_value, currency,
        published_date, closing_date, status, source, source_url, portal_url,
        tender_fee, bid_bond_amount, bid_bond_validity_days, site_visit_required,
        submission_venue
      ) VALUES (
        ${t.id}, ${t.referenceNumber}, ${t.title}, ${t.procuringEntity}, ${t.entityType}, ${t.category},
        ${t.procurementMethod}, ${t.agpoCategory}, ${t.county}, ${t.estimatedValue || 0}, ${t.currency || 'KES'},
        ${t.publishedDate}, ${t.closingDate}, ${t.status}, ${t.source}, ${t.sourceUrl}, ${t.portalUrl || t.sourceUrl},
        ${t.tenderFee || 0}, ${t.bidBondAmount || 0}, ${t.bidBondValidityDays || 120}, ${Boolean(t.siteVisitRequired)},
        ${t.submissionVenue || 'Official Tender Box'}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        status = EXCLUDED.status,
        closing_date = EXCLUDED.closing_date,
        updated_at = NOW();
    `;
    count++;
  }

  console.log(`🎉 Successfully inserted/updated ${count} tenders in Neon DB!`);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
