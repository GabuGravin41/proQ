import { NextResponse } from 'next/server';
import { BENCHMARK_TENDERS } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';
  const county = searchParams.get('county') || '';
  const category = searchParams.get('category') || '';
  const agpo = searchParams.get('agpo') || '';
  const status = searchParams.get('status') || 'Active';

  let results = BENCHMARK_TENDERS;

  if (status) {
    results = results.filter(t => t.status.toLowerCase() === status.toLowerCase());
  }

  if (county) {
    results = results.filter(t => t.county.toLowerCase() === county.toLowerCase());
  }

  if (category) {
    results = results.filter(t => t.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (agpo) {
    results = results.filter(t => t.agpoCategory.toLowerCase().includes(agpo.toLowerCase()));
  }

  if (q) {
    results = results.filter(t => 
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.organization.name.toLowerCase().includes(q) ||
      t.tenderNumber.toLowerCase().includes(q) ||
      t.subcategories.some(sc => sc.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({
    total: results.length,
    tenders: results
  });
}
