/**
 * TenderIQ PostgreSQL Database Schema Definition for Neon DB
 */

export const CREATE_TABLES_SQL = `
-- 1. Tenders Table
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

-- 2. Users Table
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

-- 3. Capability Profiles Table
CREATE TABLE IF NOT EXISTS capability_profiles (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_sectors TEXT[] DEFAULT '{}',
  target_counties TEXT[] DEFAULT '{}',
  min_budget BIGINT DEFAULT 0,
  max_budget BIGINT DEFAULT 500000000,
  agpo_status VARCHAR(32) DEFAULT 'None',
  nca_category VARCHAR(64),
  keywords TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. M-Pesa Transactions Table
CREATE TABLE IF NOT EXISTS mpesa_transactions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  phone_number VARCHAR(32) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  plan_id VARCHAR(32) NOT NULL,
  merchant_request_id VARCHAR(128) NOT NULL,
  checkout_request_id VARCHAR(128) NOT NULL UNIQUE,
  mpesa_receipt_number VARCHAR(64),
  result_code INT,
  result_desc TEXT,
  status VARCHAR(32) DEFAULT 'pending', -- pending, completed, failed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Notification Logs Table
CREATE TABLE IF NOT EXISTS notification_logs (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  tender_id VARCHAR(64) REFERENCES tenders(id) ON DELETE CASCADE,
  channel VARCHAR(32) NOT NULL, -- whatsapp, sms, email
  recipient VARCHAR(128) NOT NULL,
  match_score INT NOT NULL,
  status VARCHAR(32) DEFAULT 'sent',
  message_preview TEXT,
  dispatched_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Saved Tenders (Watchlist) Table
CREATE TABLE IF NOT EXISTS saved_tenders (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  tender_id VARCHAR(64) REFERENCES tenders(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tender_id)
);

-- Indices for rapid querying & filter operations
CREATE INDEX IF NOT EXISTS idx_tenders_status ON tenders(status);
CREATE INDEX IF NOT EXISTS idx_tenders_county ON tenders(county);
CREATE INDEX IF NOT EXISTS idx_tenders_category ON tenders(category);
CREATE INDEX IF NOT EXISTS idx_tenders_closing_date ON tenders(closing_date);
CREATE INDEX IF NOT EXISTS idx_mpesa_checkout ON mpesa_transactions(checkout_request_id);
`;
