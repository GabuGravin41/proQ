import fs from 'fs';
import path from 'path';

console.log('=== proQ Kenya: Tender Dataset Deduplication & Stress-Test ===\n');

const filePath = path.resolve('./src/lib/tenderData.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');

const match = fileContent.match(/export const mockTenders: Tender\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('❌ Could not locate mockTenders array in src/lib/tenderData.ts');
  process.exit(1);
}

const tenders = eval(match[1]);

const seenIds = new Set();
const duplicateIds = [];

const seenRefs = new Set();
const duplicateRefs = [];

const missingFieldErrors = [];

let totalValue = 0;
const counties = new Set();
const categories = {};
const agpoCounts = {};

const now = new Date();
let activeCount = 0;
let closingSoonCount = 0;
let closedCount = 0;

tenders.forEach((t, i) => {
  // 1. ID uniqueness
  if (seenIds.has(t.id)) {
    duplicateIds.push(t.id);
  } else {
    seenIds.add(t.id);
  }

  // 2. Reference Number uniqueness
  const ref = (t.referenceNumber || '').trim().toUpperCase();
  if (!ref) {
    missingFieldErrors.push({ id: t.id, error: 'Empty referenceNumber' });
  } else if (seenRefs.has(ref)) {
    duplicateRefs.push(ref);
  } else {
    seenRefs.add(ref);
  }

  // 3. Mandatory fields
  if (!t.title) missingFieldErrors.push({ id: t.id, error: 'Missing title' });
  if (!t.procuringEntity) missingFieldErrors.push({ id: t.id, error: 'Missing procuringEntity' });
  if (!t.county) missingFieldErrors.push({ id: t.id, error: 'Missing county' });
  if (!t.category) missingFieldErrors.push({ id: t.id, error: 'Missing category' });
  if (!t.closingDate) missingFieldErrors.push({ id: t.id, error: 'Missing closingDate' });

  // 4. Closing date calculation
  if (t.closingDate) {
    const closing = new Date(t.closingDate);
    const diffDays = Math.ceil((closing.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) closedCount++;
    else if (diffDays <= 3) closingSoonCount++;
    else activeCount++;
  }

  // 5. Accumulate
  if (t.estimatedValue) totalValue += t.estimatedValue;
  if (t.county) counties.add(t.county);
  categories[t.category] = (categories[t.category] || 0) + 1;
  agpoCounts[t.agpoCategory] = (agpoCounts[t.agpoCategory] || 0) + 1;
});

console.log(`📊 Total Tenders Analyzed: ${tenders.length}`);
console.log(`💰 Total Active Pipeline Value: KES ${(totalValue / 1e9).toFixed(2)} Billion`);
console.log(`🟢 Active Tenders: ${activeCount}`);
console.log(`⚡ Closing Soon (< 3 Days): ${closingSoonCount}`);
console.log(`🔴 Closed Tenders: ${closedCount}`);
console.log(`📍 Distinct Counties Covered: ${counties.size}`);
console.log(`🏷️ AGPO Reserved Tenders: ${tenders.length - (agpoCounts['Open'] || 0)} notices`);
console.log('\n--- DEDUPLICATION & INTEGRITY CHECK ---');
console.log(`• Duplicate IDs: ${duplicateIds.length === 0 ? '✅ 0 (None)' : `❌ ${duplicateIds.length} found: ${duplicateIds.join(', ')}`}`);
console.log(`• Duplicate Reference Numbers: ${duplicateRefs.length === 0 ? '✅ 0 (None)' : `❌ ${duplicateRefs.length} found: ${duplicateRefs.join(', ')}`}`);
console.log(`• Missing Mandatory Field Errors: ${missingFieldErrors.length === 0 ? '✅ 0 (None)' : `❌ ${missingFieldErrors.length} found`}`);

if (duplicateIds.length === 0 && duplicateRefs.length === 0 && missingFieldErrors.length === 0) {
  console.log('\n🏆 RESULT: DATASET IS 100% CLEAN, DEDUPLICATED & READY FOR NEON DB PUSH!\n');
} else {
  console.log('\n⚠️ RESULT: ERRORS FOUND. FIX BEFORE PROCEEDING.\n');
}
