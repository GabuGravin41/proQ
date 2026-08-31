import { NextRequest, NextResponse } from 'next/server';
import { verifyPaystackTransaction } from '@/lib/paystack';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.json({ success: false, error: 'Reference is required' }, { status: 400 });
  }

  const result = await verifyPaystackTransaction(reference);
  return NextResponse.json(result);
}
