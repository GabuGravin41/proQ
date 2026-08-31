import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, isDbConfigured } from '@/db';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const stkCallback = data?.Body?.stkCallback;

    if (!stkCallback) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid payload' }, { status: 400 });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback;

    let mpesaReceiptNumber = null;
    let amount = null;
    let phoneNumber = null;

    if (ResultCode === 0 && CallbackMetadata?.Item) {
      for (const item of CallbackMetadata.Item) {
        if (item.Name === 'MpesaReceiptNumber') mpesaReceiptNumber = item.Value;
        if (item.Name === 'Amount') amount = item.Value;
        if (item.Name === 'PhoneNumber') phoneNumber = item.Value;
      }
    }

    const status = ResultCode === 0 ? 'completed' : 'failed';

    if (isDbConfigured) {
      // Update transaction status
      await executeQuery(
        `UPDATE mpesa_transactions
         SET status = $1, mpesa_receipt_number = $2, result_code = $3, result_desc = $4, updated_at = NOW()
         WHERE checkout_request_id = $5`,
        [status, mpesaReceiptNumber, ResultCode, ResultDesc, CheckoutRequestID]
      ).catch(err => console.error('Error updating mpesa transaction:', err));

      // If successful, upgrade user plan
      if (status === 'completed') {
        const tx = await executeQuery(
          `SELECT user_id, plan_id FROM mpesa_transactions WHERE checkout_request_id = $1`,
          [CheckoutRequestID]
        );
        if (tx && tx.length > 0 && tx[0].user_id) {
          await executeQuery(
            `UPDATE users SET plan_tier = $1, role = 'subscriber', updated_at = NOW() WHERE id = $2`,
            [tx[0].plan_id, tx[0].user_id]
          );
        }
      }
    }

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Callback processed successfully',
    });
  } catch (error: any) {
    console.error('M-Pesa Callback Error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: error.message }, { status: 500 });
  }
}
