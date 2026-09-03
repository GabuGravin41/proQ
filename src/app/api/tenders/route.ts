import { NextResponse } from 'next/server';
import { mockTenders } from '@/lib/tenderData';
import { enrichTenderWithLiveStatus } from '@/lib/dateUtils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase().trim() || '';
  const county = searchParams.get('county')?.toLowerCase() || '';
  const category = searchParams.get('category')?.toLowerCase() || '';
  const agpo = searchParams.get('agpo')?.toLowerCase() || '';
  const status = searchParams.get('status')?.toLowerCase() || '';
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  // 1. Enrich all tenders with real-time status and days remaining
  let results = mockTenders.map(t => enrichTenderWithLiveStatus(t));

  // 2. Filter by status if specified
  if (status) {
    if (status === 'active') {
      results = results.filter(t => t.status === 'active' || t.status === 'closing-soon');
    } else {
      results = results.filter(t => t.status === status);
    }
  }

  // 3. Filter by County
  if (county) {
    results = results.filter(t => t.county.toLowerCase() === county || county === 'all');
  }

  // 4. Filter by Category
  if (category) {
    results = results.filter(t => t.category.toLowerCase().includes(category));
  }

  // 5. Filter by AGPO
  if (agpo) {
    results = results.filter(t => t.agpoCategory.toLowerCase().includes(agpo));
  }

  // 6. Free-text search
  if (q) {
    results = results.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.procuringEntity.toLowerCase().includes(q) ||
      t.referenceNumber.toLowerCase().includes(q) ||
      t.county.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }

  const total = results.length;
  const paginated = results.slice(offset, offset + limit);

  return NextResponse.json({
    total,
    offset,
    limit,
    tenders: paginated,
  });
}
