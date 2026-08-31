import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, isDbConfigured } from '@/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const checkoutRequestId = searchParams.get('checkoutRequestId');

  if (!checkoutRequestId) {
    return NextResponse.json({ success: false, error: 'checkoutRequestId is required' }, { status: 400 });
  }

  if (!isDbConfigured) {
    // In local dev without live DB, simulate instant completion after 2.5s
    return NextResponse.json({
      success: true,
      status: 'completed',
      receipt: `QGH${Math.floor(10000000 + Math.random() * 90000000)}`,
      message: 'Payment completed successfully (Demo Mode)',
    });
  }

  try {
    const records = await executeQuery(
      `SELECT status, mpesa_receipt_number, result_desc FROM mpesa_transactions WHERE checkout_request_id = $1`,
      [checkoutRequestId]
    );

    if (records && records.length > 0) {
      const tx = records[0];
      return NextResponse.json({
        success: true,
        status: tx.status,
        receipt: tx.mpesa_receipt_number,
        message: tx.result_desc || 'Transaction pending',
      });
    }

    return NextResponse.json({
      success: true,
      status: 'pending',
      message: 'Waiting for customer PIN input on mobile device...',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
